// import ashton from "../../images/ashton.JPG";
import { Box, Button } from "@mui/material";

export default function SplashScreen({setConsent}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box
        component="h1"
        sx={{
          color: 'white',
          mx: 'auto',
          fontWeight: 600,
          fontSize: 35
        }}
      >
        Dude Where's My Car
      </Box>

      <Button
        onClick={()=>setConsent(true)}
        variant="contained"
        size="large"
        sx={{
          m: '1em',
          width: 250,
          height: 65,
          borderRadius: 12,
          fontSize: 20,
          fontWeight: 600
        }}
      >
        ENTER
      </Button>

    </Box>
  )
}