import React from 'react';
import { Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

interface HeaderProps {
  session: Session | null;
}

const Header = ({ session }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-card border-b p-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Radio className="h-8 w-8 text-primary" />
          <h1 className="text-lg sm:text-2xl font-bold truncate">
            <span className="hidden sm:inline">STREAMING </span>RADIO ERDE
          </h1>
        </div>
        <div>
          {session ? (
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          ) : (
            <Button onClick={() => navigate('/login')}>Admin Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;