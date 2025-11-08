import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin } from 'lucide-react';

const RunningInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLocationName = (lat: number, lon: number) => {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          }
          setLocation({
            city: data.address.city || data.address.town || data.address.village || 'Lokasi tidak diketahui',
            country: data.address.country,
          });
          setError(null);
        })
        .catch(err => {
          console.error("Error fetching location name:", err);
          setError("Tidak dapat mengambil nama lokasi.");
        });
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocationName(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Akses lokasi ditolak. Lokasi tidak dapat ditampilkan.");
      }
    );
  }, []);

  const formattedDate = dateTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = dateTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const renderContent = () => {
    if (error) {
      return <span className="text-red-500">{error}</span>;
    }

    return (
      <>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="mx-3 text-muted-foreground">|</div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{formattedTime}</span>
        </div>
        {location && (
          <>
            <div className="mx-3 text-muted-foreground">|</div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{location.city}, {location.country}</span>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="bg-card border-t border-b overflow-hidden whitespace-nowrap relative">
      <div className="flex items-center py-2 animate-marquee">
        <div className="flex items-center flex-shrink-0 px-4">
          {renderContent()}
        </div>
        <div className="flex items-center flex-shrink-0 px-4" aria-hidden="true">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RunningInfo;