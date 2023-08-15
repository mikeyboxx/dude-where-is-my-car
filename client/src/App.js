import { useState } from 'react';
import MapContainer from "./components/MapContainer";
import SplashScreen from "./components/SplashScreen";

function App() {
  // console.log('App');
  const [consent, setConsent] = useState(false);

  return (
    <>
    {consent === true
      ? <MapContainer/> 
      : <SplashScreen setConsent={setConsent} />
    }
    </>
  );
}

export default App;
