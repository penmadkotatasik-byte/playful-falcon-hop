import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

const AdBanner = () => {
  return (
    <Card className="bg-slate-100 dark:bg-slate-800 border-dashed">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-center text-center gap-4">
        <Megaphone className="h-8 w-8 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">
            Advertisement
          </p>
          <div className="text-xs text-muted-foreground">
            {/* 
              PASTE YOUR AD CODE HERE
              For example, from Google AdSense.
              This area is ready for your monetization script.
            */}
            <div className="w-full h-16 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
              <span className="text-xs">Ad Unit Placeholder</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdBanner;