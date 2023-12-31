import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { CircularProgress, Alert, Fab, Typography, Box } from '@mui/material';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import useGps from '../../hooks/useGps'
import { QUERY_PARKED_CARS } from '../../utils/queries';
import { ADD_PARKED_CAR, DELETE_PARKED_CAR } from '../../utils/mutations';

// Marker object's icon property of the User
const userIcon = { 
  fillColor: '#4285F4',
  fillOpacity: 1,
  scale: 8,
  strokeColor: 'rgb(255,255,255)',
  strokeWeight: 4,
};

const carIcon = { 
  fillColor: "black",
  fillOpacity: .7,
  scale: 1.5,
  path: "M19,9.5h-.32L17.43,6.38A3,3,0,0,0,14.65,4.5h-6A3,3,0,0,0,5.7,6.91L5.18,9.5H5a3,3,0,0,0-3,3v3a1,1,0,0,0,1,1H4a3,3,0,0,0,6,0h4a3,3,0,0,0,6,0h1a1,1,0,0,0,1-1v-3A3,3,0,0,0,19,9.5Zm-6-3h1.65a1,1,0,0,1,.92.63l.95,2.37H13Zm-5.34.8a1,1,0,0,1,1-.8H11v3H7.22ZM7,17.5a1,1,0,1,1,1-1A1,1,0,0,1,7,17.5Zm10,0a1,1,0,1,1,1-1A1,1,0,0,1,17,17.5Zm3-3h-.78a3,3,0,0,0-4.44,0H9.22a3,3,0,0,0-4.44,0H4v-2a1,1,0,0,1,1-1H19a1,1,0,0,1,1,1Z",
};


// Error Alert styles
const alertStyle = {
  position: 'absolute', 
  top: 0, 
  width: '100%'
}

// Floating button stylea
const btnStyle = {
  boxShadow: 20,
  m: .5
}

// default zoom level
const DEFAULT_ZOOM = 18;


export default function MapContainer() {
  const {isLoaded, loadError} = useJsApiLoader({ googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY });
  const {position, gpsError} = useGps();
  const [googleMap, setGoogleMap] = useState(null);
  const [orientMap, setOrientMap] = useState(true);
  const [loading, setLoading] = useState(false);
  const [parking, setParking] = useState(JSON.parse(localStorage.getItem('parking') || null));
  const [addParkedCar] = useMutation(ADD_PARKED_CAR);
  const [deleteParkedCar] = useMutation(DELETE_PARKED_CAR);
  
  const {data, refetch} = useQuery(
    QUERY_PARKED_CARS, 
    {
      fetchPolicy: 'network-only',
      pollInterval: 5000,
    }
  );

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

  // set the Map Bounds after drag, zoom, or pan as a result of user's positon changing
  const onIdle = useCallback(() => {
    // do not pan map if map is zoomed
    if (googleMap.getZoom() !== DEFAULT_ZOOM){
      setOrientMap(false);
    }
  },[googleMap]);

  // do not pan map if map is dragged
  const onDragEnd = useCallback(() => {
    setOrientMap(false);
  },[])


  const btnParkCarHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!parking){
      let parkedCar;
      try {
        parkedCar = await addParkedCar({
          variables: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }});
        
        await refetch();
        
        setParking({
          lat: position?.coords.latitude,
          lng: position?.coords.longitude,
          id: parkedCar.data.addParkedCar._id
        });
      } 
      catch (error) {
        console.log(error);
      }
    } else {
      try {
        await deleteParkedCar({
          variables: {
            id: parking.id,
          }});
        
        await refetch();
        
        setParking(null);
      } 
      catch (error) {
        console.log(error);
      }
    }
  }

  const btnFindCarHandler = async (e) => {
    e.preventDefault();

    googleMap.panTo({lat: parking.lat, lng: parking.lng});
    googleMap.setZoom(DEFAULT_ZOOM);
    setOrientMap(false);
  }

  const btnFindMeHandler = async (e) => {
    e.preventDefault();

    googleMap.panTo({lat: position.coords.latitude, lng: position.coords.longitude});
    googleMap.setZoom(DEFAULT_ZOOM);
    setOrientMap(true);
  }

  // save to local storage
  useEffect(()=>{
    localStorage.setItem('parking', JSON.stringify(parking));
  },[parking]);

  useEffect(()=>{
    setLoading(false);
  },[data]);

  // change the heading of the map if users gps position changes, and orientMap flag is true
  useEffect(() => {
    if (position && googleMap && orientMap){
      position.coords.accuracy < 10 && googleMap.setHeading(position.coords.heading);
    }
  },[position, googleMap, orientMap]);


  return (
    <>
      {position && isLoaded && !loadError && !gpsError &&
        <GoogleMap    
          mapContainerStyle={mapStyle}
          options={{ 
            disableDefaultUI: true,
          }}
          onLoad={onLoad}
          onIdle={onIdle}
          onDragEnd={onDragEnd}
        >
          <Fab
            variant="extended"
            color="info"
            size="small"
            onClick={btnFindMeHandler}
            sx={btnStyle}
          >
            <LocationOnIcon sx={{mr: 1}} />
            Find Me
          </Fab>
          
          <Fab
            variant="extended"
            color={parking ? "error" : "success"}
            size="small"
            onClick={btnParkCarHandler}
            sx={btnStyle}
          >
            <TimeToLeaveIcon sx={{mr: 1}} />
            {parking ? "Cancel" : "Park Car"}
            {loading && <CircularProgress size={20} sx={{color: "white", m: .5}}/>}
          </Fab>

          {parking &&
            <Fab
              variant="extended"
              color="info"
              size="small"
              onClick={btnFindCarHandler}
              sx={btnStyle}
              >
              <SearchIcon sx={{mr: 1}} />
              Find Car
            </Fab>}

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

          {!loading && data?.parkedCars?.map((car, idx) => 
            <Marker
              key={idx}
              position={{
                lat: car.lat,
                lng: car.lng
              }} 
              icon={carIcon}
            />)}
        </GoogleMap>}

      {(!isLoaded || !position) && 
        <Box sx={{
          my: 2,
          display: 'flex', 
          justifyContent: 'center',}} 
        >
          <Typography variant="h3" color="white">Loading...</Typography>
          <CircularProgress/>
        </Box>}

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