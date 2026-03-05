import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import TemperatureChart from './components/TemperatureChart';
import HourlyForecast from './components/HourlyForecast';
import AirQuality from './components/AirQuality';
import { processHourlyForecast } from './services/weatherService';
import { 
  fetchWeatherByCity, 
  fetchForecastByCity,
  fetchWeatherByCoords,
  fetchForecastByCoords,
  processForecastData 
} from './services/weatherService';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
const [hourlyForecast, setHourlyForecast] = useState([]);
const [coordinates, setCoordinates] = useState(null);
  // Handle search by city name
 const handleSearch = async (city) => {
  setLoading(true);
  setError('');
  
  try {
    const weatherData = await fetchWeatherByCity(city);
    const forecastData = await fetchForecastByCity(city);
      console.log("Forecast Data:", forecastData);
    
    setWeather(weatherData);
    setForecast(processForecastData(forecastData));
    setHourlyForecast(processHourlyForecast(forecastData));
    setCoordinates({
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon
    });
    setLoading(false);
  } catch (err) {
    setError('City not found. Please try again.');
    setLoading(false);
  }
};

  // Handle current location button
  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Fetch weather by coordinates
            const weatherData = await fetchWeatherByCoords(latitude, longitude);
            const forecastData = await fetchForecastByCoords(latitude, longitude);
            
            setWeather(weatherData);
            setForecast(processForecastData(forecastData));
            setLoading(false);
          } catch (err) {
            setError('Error fetching weather for your location.');
            setLoading(false);
          }
        },
        (error) => {
          setError('Unable to get your location. Please search for a city.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };
 console.log("Forecast data:", forecast);
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-teal-900">
    {/* Decorative weather elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 text-white/10 text-9xl">☁️</div>
      <div className="absolute bottom-20 right-10 text-white/10 text-9xl">🌤️</div>
      <div className="absolute top-40 right-40 text-white/10 text-7xl">⛈️</div>
    </div>

    <div className="relative container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          🌤️ Weather Dashboard
        </h1>
        <p className="text-xl text-blue-200">
          Check current weather and forecast for any city
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <SearchBar onSearch={handleSearch} loading={loading} />
          
          <div className="text-center mt-4">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="text-white hover:text-teal-300 transition-colors disabled:opacity-50 flex items-center justify-center mx-auto gap-2"
            >
              <span className="text-2xl">📍</span>
              Use my current location
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-500 text-white p-4 rounded-xl">
            {error}
          </div>
        </div>
      )}

      {/* Weather Display - COMPLETELY REPLACE THIS SECTION */}
      {weather && (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Current Weather */}
          <WeatherCard weather={weather} isCurrent={true} />
          
          {/* Air Quality (only if coordinates exist) */}
          {coordinates && (
            <AirQuality lat={coordinates.lat} lon={coordinates.lon} />
          )}
          
          {/* Temperature Chart */}
          {forecast && forecast.length > 0 && (
           <TemperatureChart 
  forecastData={forecast} 
  cityName={weather?.name}  // This passes the city name
/>
          )}
          
          {/* Hourly Forecast */}
          {hourlyForecast && hourlyForecast.length > 0 && (
            <HourlyForecast hourlyData={hourlyForecast} />
          )}
          
          {/* 3-Day Forecast */}
          {/* 3-Day Forecast */}
{forecast && forecast.length > 0 && (
  <div>
    <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
      <span>📅</span> 3-Day Forecast
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {forecast.map((day, index) => (
        <WeatherCard key={index} weather={day} />
      ))}
    </div>
  </div>
)}
        </div>
      )}
    </div>
  </div>
);
}

export default App;