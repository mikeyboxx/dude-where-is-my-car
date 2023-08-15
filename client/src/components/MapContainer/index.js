import { useState, useCallback, useEffect, useMemo } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { CircularProgress, Alert, Fab } from '@mui/material';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import useGps from '../../hooks/useGps'

// Marker object's icon property of the User
const userIcon = { 
  fillColor: '#4285F4',
  fillOpacity: 1,
  scale: 8,
  strokeColor: 'rgb(255,255,255)',
  strokeWeight: 4,
};

// Error Alert styles
const alertStyle ={
  position: 'absolute', 
  top: 0, 
  width: '100%'
}

// default zoom level
const DEFAULT_ZOOM = 18;


export default function MapContainer() {
  console.log("process.env=", process.env)
  const {isLoaded, loadError} = useJsApiLoader({ googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY });
  const {position, gpsError} = useGps();
  const [googleMap, setGoogleMap] = useState(null);
  const [parking, setParking] = useState(null);
  
  // this fixes google chrome mobile issue with page height being > screen height
  const mapStyle = useMemo(() => ({
    height: 
    `${(/mobile/.test(navigator.userAgent.toLowerCase()) && /chrome/.test(navigator.userAgent.toLowerCase()) 
        ? window.screen.height >= window.innerHeight 
          ? window.innerHeight 
          : window.screen.height - (window.innerHeight - window.screen.height) 
        : Math.min(window.screen.height, window.innerHeight))}px`
  }), [])

  // set the initial map options after api map object is loaded
  const onLoad = useCallback(gMap => {
    gMap.setOptions({
      keyboardShortcuts: false,
      zoom: DEFAULT_ZOOM,
      heading: position?.coords.heading,
      center: {lat: position?.coords.latitude, lng: position?.coords.longitude}
    });
    
    setGoogleMap(gMap);
  },[position]);

  const btnHandler = () => {
    if (!parking){
      setParking({
        lat: position?.coords.latitude,
        lng: position?.coords.longitude
      });
    } else 
      setParking(null);
  }


  useEffect(() => {
    // pan the map if gps position changes
    if (position && googleMap){
      googleMap.panTo({lat: position.coords.latitude, lng: position.coords.longitude});

      // change heading only if GPS accuracy is more precise
      position.coords.accuracy < 10 && googleMap.setHeading(position.coords.heading);
    }
  },[position, googleMap]);


  return (
    <>
      {position && isLoaded && !loadError && !gpsError &&
        <GoogleMap    
          mapContainerStyle={mapStyle}
          options={{ 
            disableDefaultUI: true,
            mapId: process.env.REACT_APP_GOOGLE_MAPS_API_MAP_ID
          }}
          onLoad={onLoad}
        >
          <Fab
            variant="extended"
            color={parking ? "error" : "success"}
            onClick={btnHandler}
            sx={{
              boxShadow: 20,
              m: 2
            }}
          >
            <TimeToLeaveIcon sx={{mr: 1}} />
            {parking ? "Cancel Parking" : "Park Car"}
          </Fab>
          <Marker
            position={{
              lat: position.coords.latitude, 
              lng: position.coords.longitude
            }} 
            icon={{
              ...userIcon, 
              path: window.google.maps.SymbolPath.CIRCLE
            }}
          />
        </GoogleMap>}

      {(!isLoaded || !position) && 
        <CircularProgress/>}

      {gpsError && 
        <Alert variant="filled" severity="error" sx={alertStyle}>
            {gpsError.name}: {gpsError.message}
        </Alert>} 

      {loadError && 
      <Alert variant="filled" severity="error" sx={alertStyle}>
          useJsApiLoader: {loadError.message}
      </Alert>} 
    </>
  )
}