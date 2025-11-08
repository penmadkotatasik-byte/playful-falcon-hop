import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Player from '@/components/Player';
import StationList from '@/components/StationList';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

interface Station {
  id: number;
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

const Index = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching stations:', error);
        showError('Could not fetch radio stations.');
      } else if (data) {
        setStations(data);
      }
    };

    fetchStations();
  }, []);

  const currentStationIndex = useMemo(() => {
    if (!currentStation) return -1;
    return stations.findIndex(s => s.id === currentStation.id);
  }, [currentStation, stations]);

  const handlePlayStation = (station: Station) => {
    if (currentStation?.id === station.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (currentStation) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (stations.length === 0) return;
    const nextIndex = (currentStationIndex + 1) % stations.length;
    setCurrentStation(stations[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (stations.length === 0) return;
    const prevIndex = (currentStationIndex - 1 + stations.length) % stations.length;
    setCurrentStation(stations[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8 space-y-8">
        <Player 
          station={currentStation}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
        
        <div>
          <StationList 
            stations={stations} 
            currentStationId={currentStation?.id || null}
            isPlaying={isPlaying}
            onPlay={handlePlayStation}
            isAdmin={false}
            onDelete={() => {}}
          />
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;