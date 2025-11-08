import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';

interface AdminLoginProps {
  isLoggedIn: boolean;
  onLogin: (user: string, pass: string) => boolean;
  onLogout: () => void;
}

const AdminLogin = ({ isLoggedIn, onLogin, onLogout }: AdminLoginProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginAttempt = () => {
    const success = onLogin(username, password);
    if (success) {
      showSuccess('Login successful!');
      setIsOpen(false);
      setUsername('');
      setPassword('');
    } else {
      showError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    onLogout();
    showSuccess('Logged out successfully.');
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium hidden sm:inline">Welcome, Admin</span>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Admin Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>
            Enter your credentials to log in as an administrator.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
              autoComplete="username"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              autoComplete="current-password"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleLoginAttempt}>Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;