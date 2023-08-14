import MapContainer from "./components/MapContainer";
import { useState } from 'react';
import { Button } from "@mui/material";

function App() {
  // console.log('App');
  const [consent, setConsent] = useState(false);

  return (
    <>
    {consent === true
      ? <MapContainer/> 
      : <Button onClick={()=>setConsent(true)}>Yoyoyo</Button>}
    </>
    // // <Typography variant="h1" color="primary">
    // //   Hello World
    // // </Typography>
    // <MapContainer/>
  );
}

export default App;
