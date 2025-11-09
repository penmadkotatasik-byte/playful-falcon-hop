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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BackgroundSettings {
  type: 'color' | 'gradient' | 'image';
  color1: string;
  color2: string;
  imageUrl: string;
}

export interface RunningTextSettings {
  show: boolean;
  speed: number;
  fontFamily: 'sans' | 'serif' | 'mono';
}

export interface AppSettings {
  background: BackgroundSettings;
  runningText: RunningTextSettings;
}

interface SettingsSheetProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  isAdmin: boolean;
}

const SettingsSheet = ({ settings, onSave, isAdmin }: SettingsSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

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
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customize</SheetTitle>
          <SheetDescription>
            Ubah tampilan aplikasi sesuai keinginan Anda.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Latar Belakang</h3>
            <RadioGroup
              value={localSettings.background.type}
              onValueChange={(value: 'color' | 'gradient' | 'image') => setLocalSettings({ ...localSettings, background: { ...localSettings.background, type: value } })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="color" id="r-color" />
                <Label htmlFor="r-color">Warna Solid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gradient" id="r-gradient" />
                <Label htmlFor="r-gradient">Gradasi Warna</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="r-image" />
                <Label htmlFor="r-image">Gambar (URL)</Label>
              </div>
            </RadioGroup>

            {localSettings.background.type === 'color' && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="color1">Warna Latar</Label>
                <Input
                  id="color1"
                  type="color"
                  value={localSettings.background.color1}
                  onChange={(e) => setLocalSettings({ ...localSettings, background: { ...localSettings.background, color1: e.target.value } })}
                  className="h-10 w-full"
                />
              </div>
            )}

            {localSettings.background.type === 'gradient' && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="color1">Warna Awal</Label>
                  <Input
                    id="color1"
                    type="color"
                    value={localSettings.background.color1}
                    onChange={(e) => setLocalSettings({ ...localSettings, background: { ...localSettings.background, color1: e.target.value } })}
                    className="h-10 w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color2">Warna Akhir</Label>
                  <Input
                    id="color2"
                    type="color"
                    value={localSettings.background.color2}
                    onChange={(e) => setLocalSettings({ ...localSettings, background: { ...localSettings.background, color2: e.target.value } })}
                    className="h-10 w-full"
                  />
                </div>
              </div>
            )}

            {localSettings.background.type === 'image' && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="imageUrl">URL Gambar</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={localSettings.background.imageUrl}
                  onChange={(e) => setLocalSettings({ ...localSettings, background: { ...localSettings.background, imageUrl: e.target.value } })}
                />
              </div>
            )}
          </div>

          {isAdmin && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-4">Running Text</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="running-text-toggle" className="font-medium">
                      Tampilkan Running Text
                    </Label>
                    <Switch
                      id="running-text-toggle"
                      checked={localSettings.runningText.show}
                      onCheckedChange={(checked) => setLocalSettings({ ...localSettings, runningText: { ...localSettings.runningText, show: checked } })}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="speed-slider">Kecepatan (lebih rendah lebih cepat)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="speed-slider"
                        min={10}
                        max={60}
                        step={1}
                        value={[localSettings.runningText.speed]}
                        onValueChange={(value) => setLocalSettings({ ...localSettings, runningText: { ...localSettings.runningText, speed: value[0] } })}
                      />
                      <span className="text-sm font-medium w-12 text-center">{localSettings.runningText.speed}s</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-family-select">Jenis Font</Label>
                    <Select
                      value={localSettings.runningText.fontFamily}
                      onValueChange={(value: 'sans' | 'serif' | 'mono') => setLocalSettings({ ...localSettings, runningText: { ...localSettings.runningText, fontFamily: value } })}
                    >
                      <SelectTrigger id="font-family-select">
                        <SelectValue placeholder="Pilih font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans">Sans-serif</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <SheetFooter>
          <Button onClick={handleSave}>Simpan Perubahan</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;