import { useState, useEffect } from 'react';

const MESSAGES = [
  { sender: 'them', text: "We're currently using 4 different tools just to generate our weekly reports." },
  { sender: 'us', text: "That's common. Where is the data originating?" },
  { sender: 'them', text: "Mostly our legacy ERP, but some teams use spreadsheets." },
  { sender: 'us', text: "We can unify that. We'll build a direct integration to the ERP and automate the spreadsheet ingestion." }
];

export function ConversationUI() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev >= MESSAGES.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md bg-[#112240] rounded-xl border border-[#8892B0]/20 p-6 flex flex-col gap-4 h-[300px] overflow-hidden">
      {MESSAGES.slice(0, visibleMessages).map((msg, i) => (
        <div key={i} className={`flex ${msg.sender === 'us' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
          <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
            msg.sender === 'us' 
              ? 'bg-[#64FFDA]/10 text-[#64FFDA] border border-[#64FFDA]/20 rounded-tr-none' 
              : 'bg-[#0A192F] text-[#8892B0] border border-[#8892B0]/20 rounded-tl-none'
          }`}>
            {msg.text}
          </div>
        </div>
      ))}
      {visibleMessages < MESSAGES.length && (
        <div className="flex justify-start animate-pulse">
          <div className="bg-[#0A192F] border border-[#8892B0]/20 p-3 rounded-lg rounded-tl-none flex gap-1">
            <div className="w-1.5 h-1.5 bg-[#8892B0] rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-[#8892B0] rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-[#8892B0] rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
