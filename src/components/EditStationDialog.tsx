import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Station {
  id: number;
  name: string;
  url: string;
  city?: string;
  color?: string;
}

interface EditStationDialogProps {
  station: Station | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateStation: (station: Station) => void;
}

const EditStationDialog = ({ station, isOpen, onOpenChange, onUpdateStation }: EditStationDialogProps) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [city, setCity] = useState('');
  const [color, setColor] = useState('#e2e8f0');

  useEffect(() => {
    if (station) {
      setName(station.name);
      setUrl(station.url);
      setCity(station.city || '');
      setColor(station.color || '#e2e8f0');
    }
  }, [station]);

  const handleSubmit = () => {
    if (name && url && station) {
      onUpdateStation({ ...station, name, url, city, color });
      onOpenChange(false);
    }
  };

  if (!station) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Radio Station</DialogTitle>
          <DialogDescription>
            Update the details for "{station.name}".
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
          <Button type="submit" onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStationDialog;