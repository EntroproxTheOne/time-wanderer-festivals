import { useState, useEffect } from 'react';
import { cities, getNearestCities, type City } from '@/data/cities';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  nearestCity: City | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    nearestCity: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: 'Geolocation is not supported by your browser',
        nearestCity: null,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const [nearest] = getNearestCities(latitude, longitude, 1);
        
        setState({
          loading: false,
          error: null,
          nearestCity: nearest || null,
        });
      },
      (error) => {
        setState({
          loading: false,
          error: error.message,
          nearestCity: null,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return state;
}
