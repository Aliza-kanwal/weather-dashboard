import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Fetch current weather by city name
export const fetchWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch 5-day forecast (we'll use 3 days)
export const fetchForecastByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        cnt: 3 // Get only 3 days
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch current weather by coordinates (for location)
export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch forecast by coordinates
export const fetchForecastByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric',
        cnt: 3
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Helper to process forecast data
export const processForecastData = (forecastData) => {
  if (!forecastData || !forecastData.list) return [];
  
  const dailyForecasts = [];
  const seenDates = new Set();
  
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!seenDates.has(date) && dailyForecasts.length < 3) {
      seenDates.add(date);
      
      dailyForecasts.push({
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(item.main.temp),
        maxTemp: Math.round(item.main.temp_max || item.main.temp + 2),
        minTemp: Math.round(item.main.temp_min || item.main.temp - 3),
        icon: getWeatherIcon(item.weather[0].main),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed)
      });
    }
  });
  
  console.log("Processed 3-day forecast:", dailyForecasts); // Check this in console
  return dailyForecasts;
};

// Helper to get weather icon
const getWeatherIcon = (condition) => {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '🌨️',
    'Mist': '🌫️',
    'Fog': '🌫️'
  };
  return icons[condition] || '☁️';
};
// Add this new function to process hourly forecast
export const processHourlyForecast = (forecastData) => {
  if (!forecastData || !forecastData.list) return [];
  
  // Get next 12 hours (each item is 3 hours apart, so take 4 items)
  const hourlyData = forecastData.list.slice(0, 4).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
      hour: 'numeric',
      hour12: true 
    }),
    temp: Math.round(item.main.temp),
    icon: getWeatherIcon(item.weather[0].main),
    condition: item.weather[0].main,
    description: item.weather[0].description,
    pop: Math.round(item.pop * 100) // Probability of precipitation
  }));
  
  return hourlyData;
};