import React from 'react';
import { Radio } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-card border-b p-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Radio className="h-8 w-8 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold">STREAMING RADIO ERDE</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;