import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Station {
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

interface PlayerProps {
  station: Station | null;
}

const Player = ({ station }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    if (station && audioRef.current) {
      audioRef.current.src = station.url;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Error playing audio:", e);
        setIsPlaying(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [station]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Now Playing</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        {station ? (
          <>
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: station.color || '#e2e8f0' }}>
              <Radio className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-xl font-semibold">{station.name}</h2>
            <div className="flex items-center gap-4">
              <Button onClick={togglePlayPause} size="icon" disabled={!station}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>
            <audio ref={audioRef} />
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Select a station to start listening.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Player;