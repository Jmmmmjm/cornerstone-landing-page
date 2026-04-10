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
    <div className="w-full max-w-md bg-slate-50 dark:bg-[#112240] rounded-none border border-slate-300 dark:border-[#8892B0]/20 p-6 flex flex-col gap-4 h-[300px] overflow-hidden">
      {MESSAGES.slice(0, visibleMessages).map((msg, i) => (
        <div key={i} className={`flex ${msg.sender === 'us' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
          <div className={`max-w-[80%] p-3 rounded-none text-sm ${
            msg.sender === 'us' 
              ? 'bg-teal-500 dark:bg-[#64FFDA]/10 text-teal-600 dark:text-[#64FFDA] border border-teal-500 dark:border-[#64FFDA]/20' 
              : 'bg-white dark:bg-[#0A192F] text-[#0A192F]/70 dark:text-[#8892B0] border border-slate-300 dark:border-[#8892B0]/20'
          }`}>
            {msg.text}
          </div>
        </div>
      ))}
      {visibleMessages < MESSAGES.length && (
        <div className="flex justify-start animate-pulse">
          <div className="bg-white dark:bg-[#0A192F] border border-slate-300 dark:border-[#8892B0]/20 p-3 rounded-none flex gap-1">
            <div className="w-1.5 h-1.5 bg-[#8892B0] rounded-none"></div>
            <div className="w-1.5 h-1.5 bg-[#8892B0] rounded-none"></div>
            <div className="w-1.5 h-1.5 bg-[#8892B0] rounded-none"></div>
          </div>
        </div>
      )}
    </div>
  );
}
