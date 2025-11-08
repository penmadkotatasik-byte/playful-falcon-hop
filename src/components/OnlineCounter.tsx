import React from 'react';
import { Users } from 'lucide-react';

interface OnlineCounterProps {
  count: number;
}

const OnlineCounter = ({ count }: OnlineCounterProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" title={`${count} pendengar aktif`}>
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      <span>{count}</span>
    </div>
  );
};

export default OnlineCounter;