import axios from 'axios'
import { ipKey, weatherKey } from './.secret/secret';
import './App.css'
import React from 'react'

function App() {
  // Function Constants
  const [locationData, setLocationData] = React.useState();
  const [weatherData, setWeatherData] = React.useState();
  const [loading, setLoading] = React.useState(true);

  // Helper Functions
  async function setData() {
    let ipResData = await axios.get('https://api.ipify.org?format=json');
    if (ipResData) {
      let ipRequestURL = `https://www.ipinfo.io/${ipResData.data.ip}`;
      let locationResData = await axios.get(ipRequestURL, {params: {token: ipKey}});
      await setLocationData(locationResData.data);
      console.log(locationResData.data);

      if (locationResData) {
        let coords = locationResData.data.loc.split(',');
        let weatherResData = await axios.get('https://api.openweathermap.org/data/2.5/weather', 
          {params:
            {
              lat: parseFloat(coords[0]).toFixed(2),
              lon: parseFloat(coords[1]).toFixed(2),
              appid: weatherKey,
              units: 'imperial'
            }})
          .catch((error) => {
            if (error.response) {
              console.log(error.response.request)
              console.log(error.response.data);
            }
          });

          console.log(weatherResData.data);
          await setWeatherData(weatherResData.data);
      }
    }


    setLoading(false);
  }

  React.useEffect(() => {
    setData();
  }, []);
  
  // Rendering
  if (loading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div>
      <h1>Your ip is {locationData.ip}</h1>
      <h1>Your city/state is {locationData.city}, {locationData.region}</h1>
      <h1>Main weather: {weatherData.weather[0].main}</h1>
    </div>
  );
}

export default App;
