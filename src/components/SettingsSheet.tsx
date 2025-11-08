import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from 'lucide-react';

export interface BackgroundSettings {
  type: 'color' | 'gradient' | 'image';
  color1: string;
  color2: string;
  imageUrl: string;
}

interface SettingsSheetProps {
  settings: BackgroundSettings;
  onSave: (settings: BackgroundSettings) => void;
}

const SettingsSheet = ({ settings, onSave }: SettingsSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<BackgroundSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Display Settings</SheetTitle>
          <SheetDescription>
            Customize the appearance of the application background.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <RadioGroup
            value={localSettings.type}
            onValueChange={(value: 'color' | 'gradient' | 'image') => setLocalSettings({ ...localSettings, type: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="color" id="r-color" />
              <Label htmlFor="r-color">Solid Color</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gradient" id="r-gradient" />
              <Label htmlFor="r-gradient">Gradient</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="image" id="r-image" />
              <Label htmlFor="r-image">Image URL</Label>
            </div>
          </RadioGroup>

          {localSettings.type === 'color' && (
            <div className="space-y-2">
              <Label htmlFor="color1">Background Color</Label>
              <Input
                id="color1"
                type="color"
                value={localSettings.color1}
                onChange={(e) => setLocalSettings({ ...localSettings, color1: e.target.value })}
                className="h-10 w-full"
              />
            </div>
          )}

          {localSettings.type === 'gradient' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color1">Start Color</Label>
                <Input
                  id="color1"
                  type="color"
                  value={localSettings.color1}
                  onChange={(e) => setLocalSettings({ ...localSettings, color1: e.target.value })}
                  className="h-10 w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color2">End Color</Label>
                <Input
                  id="color2"
                  type="color"
                  value={localSettings.color2}
                  onChange={(e) => setLocalSettings({ ...localSettings, color2: e.target.value })}
                  className="h-10 w-full"
                />
              </div>
            </div>
          )}

          {localSettings.type === 'image' && (
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={localSettings.imageUrl}
                onChange={(e) => setLocalSettings({ ...localSettings, imageUrl: e.target.value })}
              />
            </div>
          )}
        </div>
        <SheetFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;