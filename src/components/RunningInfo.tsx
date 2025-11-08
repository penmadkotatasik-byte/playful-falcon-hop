import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Cloud } from 'lucide-react';

const RunningInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!apiKey) {
      setError("Kunci API Cuaca tidak dikonfigurasi. Silakan atur di file .env.");
      return;
    }

    const fetchWeather = (lat: number, lon: number) => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`)
        .then(res => res.json())
        .then(data => {
          if (data.cod !== 200) {
            throw new Error(data.message);
          }
          setWeather({
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
          });
          setLocation({
            city: data.name,
            country: data.sys.country,
          });
          setError(null);
        })
        .catch(err => {
          console.error("Error fetching weather:", err);
          setError("Tidak dapat mengambil data cuaca.");
        });
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Akses lokasi ditolak. Cuaca tidak dapat ditampilkan.");
      }
    );
  }, [apiKey]);

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
        {location && weather && (
          <>
            <div className="mx-3 text-muted-foreground">|</div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{location.city}, {location.country}</span>
            </div>
            <div className="mx-3 text-muted-foreground">|</div>
            <div className="flex items-center gap-2 capitalize">
              <Cloud className="h-4 w-4" />
              <span>{weather.temp}°C, {weather.description}</span>
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