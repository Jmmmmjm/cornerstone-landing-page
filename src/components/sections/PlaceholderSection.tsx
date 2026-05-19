"use client"
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react"

export function PlaceholderSection({ title, number }: { title: string, number: number }) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#0A192F] border-b border-[#8892B0]/10">
      <div className="text-center">
        <span className="text-8xl md:text-[12rem] font-display font-bold text-[#F8F9FA]/5 select-none block leading-none">
          {String(number).padStart(2, '0')}
        </span>
        <div className="relative -mt-12 md:-mt-24">
          <h2 className="text-4xl md:text-6xl font-display font-medium text-[#F8F9FA] tracking-tight">
            {title}
          </h2>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-[#64FFDA]" />
            <p className="text-[#8892B0] font-sans tracking-[0.3em] uppercase text-xs font-bold">
              Placeholder Section
            </p>
            <div className="h-px w-8 bg-[#64FFDA]" />
          </div>
        </div>
      </div>
    </section>
  );
}
