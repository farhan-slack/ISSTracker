const { issPosition } = require('./iss');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get('/issPosition', (req, res) => {
  issPosition()
    .then((location) => {
      console.log(location);
      const geoNamesUrlFinal = `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${location.lat}&lng=${location.lng}&username=raf`;
      console.log(geoNamesUrlFinal);

      request({ url: geoNamesUrlFinal }, (error, response, body) => {
        if (error) {
          res.json({
            error: 'Error making GeoNames request1: ' + error
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

    })
    .catch((error) => {
      console.error(error);
          res.json({
            error: 'Error making GeoNames request2: ' + error
          });
    });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
