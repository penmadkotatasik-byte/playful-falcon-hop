import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from 'lucide-react';

interface Station {
  name: string;
  url: string;
  city?: string;
  icon?: string;
  color?: string;
}

interface AddStationDialogProps {
  onAddStation: (station: Station) => void;
}

const AddStationDialog = ({ onAddStation }: AddStationDialogProps) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [city, setCity] = useState('');
  const [color, setColor] = useState('#e2e8f0');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (name && url) {
      onAddStation({ name, url, city, color });
      setName('');
      setUrl('');
      setCity('');
      setColor('#e2e8f0');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Station
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Radio Station</DialogTitle>
          <DialogDescription>
            Enter the details for the new radio station.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">
              Stream URL
            </Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">
              Kota
            </Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">
              Color
            </Label>
            <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save station</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStationDialog;