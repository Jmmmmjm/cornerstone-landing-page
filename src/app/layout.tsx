import React from "react";

import "./globals.css";

export const metadata = {
  title: "Cornerstone",
  description: "Made with love by the Corners at Stone",
};

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html
      lang="en"
    >
      <body className="bg-transparent text-[#F8F9FA] cursor-none">
        {children}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
 