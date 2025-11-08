import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Station {
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

interface PlayerProps {
  station: Station | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Player = ({ station, isPlaying, onPlayPause, onNext, onPrevious }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Effect to control audio playback based on props
  useEffect(() => {
    if (audioRef.current) {
      if (station) {
        if (audioRef.current.src !== station.url) {
          audioRef.current.src = station.url;
        }
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        } else {
          audioRef.current.pause();
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [station, isPlaying]);

  // Effect to control volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Card>
      <CardContent className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 md:gap-2">
        <div className="flex items-center gap-4 w-full md:w-1/3">
          {station ? (
            <>
              <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: station.color || '#e2e8f0' }}>
                <Radio className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Now Playing</p>
                <h3 className="text-lg font-bold truncate">{station.name}</h3>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Select a station</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={onPrevious} size="icon" variant="ghost" disabled={!station}>
            <SkipBack className="h-6 w-6" />
          </Button>
          <Button onClick={onPlayPause} size="icon" disabled={!station} className="w-12 h-12">
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button onClick={onNext} size="icon" variant="ghost" disabled={!station}>
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-1/3 justify-center md:justify-end">
          <Button onClick={toggleMute} size="icon" variant="ghost">
            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.05}
            onValueChange={handleVolumeChange}
            className="w-full max-w-[120px]"
          />
        </div>
        <audio ref={audioRef} />
      </CardContent>
    </Card>
  );
};

export default Player;