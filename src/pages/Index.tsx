import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Player from '@/components/Player';
import StationList from '@/components/StationList';
import AddStationDialog from '@/components/AddStationDialog';
import { MadeWithDyad } from "@/components/made-with-dyad";

const initialStations = [
  { id: 1, name: 'Lofi Hip Hop Radio', url: 'https://stream.lofi.co/lofi', color: '#ef4444' },
  { id: 2, name: 'Chillhop Radio', url: 'http://stream.zeno.fm/fyn8eh3h5f8uv', color: '#3b82f6' },
  { id: 3, name: 'Smooth Jazz', url: 'https://s2.radio.co/s2b2b68544/listen', color: '#eab308' },
];

interface Station {
  id: number;
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

const Index = () => {
  const [stations, setStations] = useState(initialStations);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleAddStation = (newStation: Omit<Station, 'id'>) => {
    setStations(prevStations => [
      ...prevStations,
      { ...newStation, id: Date.now() }
    ]);
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
          <div className="mb-6 flex justify-end">
            <AddStationDialog onAddStation={handleAddStation} />
          </div>
          <StationList 
            stations={stations} 
            currentStationId={currentStation?.id || null}
            isPlaying={isPlaying}
            onPlay={handlePlayStation} 
          />
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;