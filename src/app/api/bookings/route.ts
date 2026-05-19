import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');   // e.g., "May 18, 2026"
    const monthParam = searchParams.get('month'); // 0-11 (Jan-Dec)
    const yearParam = searchParams.get('year');   // e.g., "2026"

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL

    if (!serviceEmail || !privateKey || !calendarId) {
      return NextResponse.json(
        { success: false, error: 'Internal server configuration missing.' },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: serviceEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    let timeMin: string;
    let timeMax: string;

    // --- MODE A: Fetching availability for a specific day ---
    if (dateParam) {
      timeMin = new Date(`${dateParam} 00:00:00 UTC+8`).toISOString();
      timeMax = new Date(`${dateParam} 23:59:59 UTC+8`).toISOString();
    }
    // --- MODE B: Fetching availability for an entire month ---
    else if (monthParam && yearParam) {
      const year = parseInt(yearParam);
      const month = parseInt(monthParam);

      // First day of the month at midnight PHT
      timeMin = new Date(year, month, 1, 0, 0, 0).toISOString();
      // Last day of the month at 11:59 PM PHT
      timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    } else {
      return NextResponse.json({ error: 'Missing parameters. Provide date OR month and year.' }, { status: 400 });
    }

    // Query Google's FreeBusy API
    const check = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: 'Asia/Manila',
        items: [{ id: calendarId }],
      },
    });

    const busySegments = check.data.calendars?.[calendarId]?.busy || [];

    return NextResponse.json({ success: true, busy: busySegments }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Google Calendar Availability Fetch:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message, dateStr, timeSlot } = body;

    // 1. Properly format the private key to handle local and production platform newlines
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    // 2. Initialize JWT using the clean Options Object configuration syntax
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar'],
      subject: 'csuite@cornerstonemnl.com'
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // 3. Parse strings into a valid date boundaries (Assuming PHT UTC+8)
    const startDateTime = new Date(`${dateStr} ${timeSlot} UTC+8`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // 30 mins allocation

    // 4. Construct the meeting details payload
    const event = {
      summary: `Discovery Call: ${name} (${company || 'No Company'})`,
      description: `Workflow challenges & discussion details:\n\n${message || 'No additional details provided.'}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Manila',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Manila',
      },
      attendees: [
        { email: email, displayName: name },
        { email: 'csuite@cornerstonemnl.com', displayName: 'Cornerstone' }
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`, // Triggers automated Google Meet video room creation
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    // 5. Commit insertion to Google's registry
    const response = await calendar.events.insert({
      calendarId: calendarId,
      conferenceDataVersion: 1, // Required flag for automated video linkage
      sendUpdates: 'all',       // Dispatches dynamic notification invites to all attendees
      requestBody: event
    });

    return NextResponse.json({ success: true, data: response.data }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Google Calendar Error:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}