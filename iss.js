const request = require('request');

function issPosition() {
  return new Promise((resolve, reject) => {
    const issUrl = 'http://api.open-notify.org/iss-now.json';
    request({ url: issUrl }, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }

      if (response.statusCode !== 200) {
        reject(`Error getting ISS data. Status code: ${response.statusCode}`);
        return;
      }

      const issData = JSON.parse(body);
      const issPos = {
        latitude: issData.iss_position.latitude,
        longitude: issData.iss_position.longitude
      };

      if (issPos.latitude && issPos.latitude.trim() !== '') {
        resolve({
          lat: issPos.latitude,
          lng: issPos.longitude
        });
      } else {
        resolve({});
      }
    });
  });
}

module.exports = { issPosition };
