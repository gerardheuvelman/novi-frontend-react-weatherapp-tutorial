import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import axios from "axios";
import SearchBar from './components/searchBar/SearchBar';
import TabBarMenu from './components/tabBarMenu/TabBarMenu';
import MetricSlider from './components/metricSlider/MetricSlider';
import './App.css';

import ForecastTab from "./pages/forecastTab/ForecastTab";
import TodayTab from "./pages/todayTab/TodayTab";
import kelvinToCelsius from "./helpers/kelvinToCelsius";

const apiKey = "15a9c6d1c16f33b78405bab2e9ed7cc2";

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [location, setLocation] = useState('');
  const [error, toggleError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      toggleError(false); /* MOET DIT OOK HIER IN APP.JS OF ALLEEN IN FORCASTTAB??? */

      try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location},nl&appid=${apiKey}&lang=nl`);
        console.log(result.data);
        setWeatherData(result.data);
      } catch (e) {
        console.error(e);
        toggleError(true);
      }
    }
    if (location) {
      fetchData();
    }
  }, [location]);

  return (
    <>
      <div className="weather-container">
        {/*HEADER -------------------- */}
        <div className="weather-header">
          <SearchBar setLocationHandler={setLocation} />
          {error &&
              <span className="wrong-location-error">
    	        Oeps! Deze locatie bestaat niet
              </span>
          }

          <span className="location-details">

            {Object.keys(weatherData).length > 0 &&
                <>
                    <h2>{weatherData.weather[0].description}</h2>
                    <h3>{weatherData.name}</h3>
                    <h1>{kelvinToCelsius(weatherData.main.temp)}</h1>
                </>
            }
          </span>
        </div>

        {/*CONTENT ------------------ */}
          <Router>
              <div className="weather-content">
                  <TabBarMenu/>

                  <Switch>
                      <div className="tab-wrapper">
                          <Route path="/komende-week">
                              <ForecastTab coordinates={weatherData.coord}/>
                          </Route>
                          <Route path="/" exact>
                              <TodayTab coordinates={weatherData.coord}/>
                          </Route>
                      </div>
                  </Switch>
              </div>
          </Router>

        <MetricSlider/>
      </div>
    </>
  );
}

export default App;
