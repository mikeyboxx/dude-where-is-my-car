import { useEffect, useCallback, useState } from 'react';

const useGps = () => {
  const [position, setPosition] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  
  const getGPSLocation = useCallback(() => {
    navigator.geolocation.watchPosition( 
      newPos => {
        setGpsError(null);
        setPosition(newPos);
      },
      gpsError => {
          console.log(gpsError);
          setGpsError({name: 'getGPSLocation', message: gpsError.message});
      }, {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: Infinity
      }
    );
  },[])
  
  useEffect(()=>{
    getGPSLocation();
  },[getGPSLocation]);
  
  return {position, gpsError};
}

export default useGps;
