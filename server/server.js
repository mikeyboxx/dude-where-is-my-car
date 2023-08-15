const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
// app.use('/images', express.static(path.join(__dirname, '../client/images')));

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // If it's not https already, redirect the same url on https. header will contain the actual protocol string (eg, 'http' or 'https').
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else
      next();
  });
  app.use(express.static(path.join(__dirname, '../client/build')));
};

app.get('/', (req, res) => {
  console.log('get /');
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


app.listen(PORT, '0.0.0.0', () => {  
  console.log(`API server running on port ${PORT}!`);
});
  