import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const RunningInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = dateTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = dateTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const renderContent = () => {
    return (
      <>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="mx-3 text-muted-foreground">|</div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{formattedTime}</span>
        </div>
      </>
    );
  };

  return (
    <div className="bg-card border-t border-b overflow-hidden whitespace-nowrap relative">
      <div className="flex items-center py-2 animate-marquee">
        <div className="flex items-center flex-shrink-0 px-4">
          {renderContent()}
        </div>
        <div className="flex items-center flex-shrink-0 px-4" aria-hidden="true">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RunningInfo;