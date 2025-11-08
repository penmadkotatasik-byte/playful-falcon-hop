import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Player from '@/components/Player';
import StationList from '@/components/StationList';
import AddStationDialog from '@/components/AddStationDialog';
import { Footer } from "@/components/Footer";
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import type { Session } from '@supabase/supabase-js';
import type { AppSettings } from '@/components/SettingsSheet';
import RunningInfo from '@/components/RunningInfo';

interface Station {
  id: number;
  name: string;
  url: string;
  city?: string;
  icon?: string;
  color?: string;
  created_at: string;
}

const defaultSettings: AppSettings = {
  background: {
    type: 'color',
    color1: '#f1f5f9',
    color2: '#cbd5e1',
    imageUrl: '',
  },
  runningText: {
    show: true,
    speed: 30,
    fontFamily: 'sans',
  },
};

const Index = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load settings from localStorage on initial render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Deep merge to handle nested settings objects gracefully
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings,
          background: { ...prevSettings.background, ...parsedSettings.background },
          runningText: { ...prevSettings.runningText, ...parsedSettings.runningText },
        }));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const handleSettingsSave = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      showSuccess("Pengaturan berhasil disimpan!");
    } catch (error)      {
      console.error("Failed to save settings to localStorage", error);
      showError("Gagal menyimpan pengaturan.");
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchStations = async () => {
    const { data, error } = await supabase
      .from('stations')
      .select('*')
      .order('city', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching stations:', error);
      showError('Could not fetch radio stations.');
    } else if (data) {
      setStations(data);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
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

  const handleAddStation = async (station: Omit<Station, 'id' | 'created_at'>) => {
    const toastId = showLoading('Adding station...');
    const { error } = await supabase.from('stations').insert([station]);
    dismissToast(toastId);

    if (error) {
      showError(`Failed to add station: ${error.message}`);
    } else {
      showSuccess('Station added successfully!');
      fetchStations(); // Refresh the list
    }
  };

  const handleUpdateStation = async (station: Station) => {
    const toastId = showLoading('Updating station...');
    const { error } = await supabase
      .from('stations')
      .update({ name: station.name, url: station.url, color: station.color, city: station.city })
      .match({ id: station.id });
    dismissToast(toastId);

    if (error) {
      showError(`Failed to update station: ${error.message}`);
    } else {
      showSuccess('Station updated successfully!');
      fetchStations(); // Refresh the list
    }
  };

  const handleDeleteStation = async (stationId: number) => {
    const toastId = showLoading('Deleting station...');
    const { error } = await supabase.from('stations').delete().match({ id: stationId });
    dismissToast(toastId);

    if (error) {
      showError(`Failed to delete station: ${error.message}`);
    } else {
      showSuccess('Station deleted successfully!');
      if (currentStation?.id === stationId) {
        setCurrentStation(null);
        setIsPlaying(false);
      }
      fetchStations(); // Refresh the list
    }
  };

  const handleReorderStations = (reorderedStations: Station[]) => {
    setStations(reorderedStations);
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const sortedStations = [...stations].sort((a, b) => {
      const cityA = a.city || '\uffff'; // Use a high-value character to sort nulls/empty last
      const cityB = b.city || '\uffff';

      let comparison = cityA.localeCompare(cityB);
      
      if (comparison === 0) {
        comparison = a.name.localeCompare(b.name);
      }

      return newOrder === 'asc' ? comparison : -comparison;
    });
    setStations(sortedStations);
    setSortOrder(newOrder);
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    const { type, color1, color2, imageUrl } = settings.background;
    switch (type) {
      case 'color':
        return { backgroundColor: color1 };
      case 'gradient':
        return { backgroundImage: `linear-gradient(to bottom right, ${color1}, ${color2})` };
      case 'image':
        return { 
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      default:
        return { backgroundColor: '#f1f5f9' };
    }
  };

  const isAdmin = !!session;

  return (
    <div className="min-h-screen text-foreground transition-all duration-500" style={getBackgroundStyle()}>
      <Header 
        session={session} 
        settings={settings}
        onSettingsSave={handleSettingsSave}
      />
      <main className="mx-auto p-4 space-y-8">
        <Player 
          station={currentStation}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
        
        <div>
          {isAdmin && (
            <div className="mb-6 flex justify-center">
              <AddStationDialog onAddStation={handleAddStation} />
            </div>
          )}
          {stations.length > 0 && (
            <StationList 
              stations={stations} 
              currentStationId={currentStation?.id || null}
              isPlaying={isPlaying}
              onPlay={handlePlayStation}
              isAdmin={isAdmin}
              onDelete={handleDeleteStation}
              onUpdate={handleUpdateStation}
              onReorder={handleReorderStations}
              sortOrder={sortOrder}
              onSortToggle={handleSortToggle}
            />
          )}
        </div>
      </main>
      {settings.runningText.show && <RunningInfo speed={settings.runningText.speed} fontFamily={settings.runningText.fontFamily} />}
      <Footer />
    </div>
  );
};

export default Index;