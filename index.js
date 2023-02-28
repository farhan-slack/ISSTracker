const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get('/location', (req, res) => {
  const { lat, lng } = req.query;
  const geoNamesUrl = `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&username=raf`;
  
  request({ url: geoNamesUrl }, (error, response, body) => {
    if (error) {
      res.json({
        error: 'Error making GeoNames request: ' + error
      });
      return;
    }

    if (response.statusCode !== 200) {
      res.json({
        error: `Error getting GeoNames data. Status code: ${response.statusCode}`
      });
      return;
    }

    const data = JSON.parse(body);
    console.log(data)
    if (data.geonames && data.geonames.length > 0) {
      const { name, countryName } = data.geonames[0];
      res.json({
        city: name,
        country: countryName
      });      
    } else {
      res.json({
      });      
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
