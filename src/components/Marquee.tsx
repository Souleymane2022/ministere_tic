'use client';

import { AlertCircle } from 'lucide-react';

interface MarqueeProps {
  messages: string[];
}

export default function Marquee({ messages }: MarqueeProps) {
  const text = messages.join('   •   ');

  return (
    <div className="bg-jaune text-bleu-dark overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="shrink-0 bg-rouge text-white px-4 py-2.5 flex items-center gap-2 z-10 font-semibold text-sm">
          <AlertCircle size={16} />
          <span className="hidden sm:inline">Flash Info</span>
        </div>
        <div className="overflow-hidden flex-1 py-2.5">
          <div className="animate-marquee whitespace-nowrap inline-block">
            <span className="text-sm font-medium">{text}   •   {text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
