import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from "@mui/material";
import { orange, blue } from "@mui/material/colors";
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500]
    },
    secondary: {
      main: orange[500]
    }
  }
});
const root = createRoot(document.getElementById('root'));


root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
  );


