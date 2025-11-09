import React, { useState, useRef } from 'react';
import { Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import SettingsSheet, { AppSettings } from './SettingsSheet';
import OnlineCounter from './OnlineCounter';

interface HeaderProps {
  session: Session | null;
  settings: AppSettings;
  onSettingsSave: (settings: AppSettings) => void;
  onlineCount: number;
}

const Header = ({ session, settings, onSettingsSave, onlineCount }: HeaderProps) => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleLogoClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount >= 5) {
      navigate('/login');
      setClickCount(0);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1500); // Reset counter after 1.5 seconds of inactivity
    }
  };

  return (
    <header className="bg-card border-b p-4 sticky top-0 z-10">
      <div className="relative mx-auto flex items-center justify-between">
        <div className="absolute left-0 flex items-center">
          <OnlineCounter count={onlineCount} />
        </div>
        <div
          className="flex items-center gap-3 sm:gap-4 cursor-pointer mx-auto"
          onClick={handleLogoClick}
        >
          <Radio className="h-8 w-8 text-primary" />
          <h1 className="text-lg sm:text-2xl font-bold truncate">
            <span className="hidden sm:inline">STREAMING </span>RADIO ERDE
          </h1>
        </div>
        <div className="absolute right-0 flex items-center gap-2">
          <SettingsSheet settings={settings} onSave={onSettingsSave} isAdmin={!!session} />
          {session ? (
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;