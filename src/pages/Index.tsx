import React, { useState } from 'react';
import Header from '@/components/Header';
import Player from '@/components/Player';
import StationList from '@/components/StationList';
import AddStationDialog from '@/components/AddStationDialog';
import { MadeWithDyad } from "@/components/made-with-dyad";

// Dummy data for now
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

  const handlePlayStation = (station: Station) => {
    setCurrentStation(station);
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
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6 flex justify-end">
              <AddStationDialog onAddStation={handleAddStation} />
            </div>
            <StationList stations={stations} onPlay={handlePlayStation} />
          </div>
          <div className="lg:col-span-1">
            <Player station={currentStation} />
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;