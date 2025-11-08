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
  const [color, setColor] = useState('#e2e8f0');

  useEffect(() => {
    if (station) {
      setName(station.name);
      setUrl(station.url);
      setColor(station.color || '#e2e8f0');
    }
  }, [station]);

  const handleSubmit = () => {
    if (name && url && station) {
      onUpdateStation({ ...station, name, url, color });
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Stream URL
            </Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="col-span-3 h-10" />
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