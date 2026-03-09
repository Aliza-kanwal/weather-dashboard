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
// Change from cnt:3 to cnt:40 (5 days * 8 forecasts per day)
export const fetchForecastByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        cnt: 40  // Changed from 3 to 40 to get 5 days of data
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
        cnt: 40  // Changed from 3 to 40
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const processForecastData = (forecastData) => {
  console.log("=== DEBUG: processForecastData ===");
  
  if (!forecastData || !forecastData.list) {
    console.log("❌ No forecast data available");
    return [];
  }
  
  console.log(`📊 Received ${forecastData.list.length} forecast items`);
  
  const dailyForecasts = [];
  const seenDates = new Set();
  
  // Process all items to get 3 unique days
  forecastData.list.forEach(item => {
    const forecastDate = new Date(item.dt * 1000);
    const dateStr = forecastDate.toLocaleDateString();
    
    // Only take up to 3 days
    if (!seenDates.has(dateStr) && dailyForecasts.length < 3) {
      seenDates.add(dateStr);
      
      // Find all items for this day to calculate min/max
      const dayItems = forecastData.list.filter(i => {
        const iDate = new Date(i.dt * 1000);
        return iDate.toLocaleDateString() === dateStr;
      });
      
      const temps = dayItems.map(i => i.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      
      // Use midday forecast (around 12:00) for main display
      const middayItem = dayItems.find(i => {
        const hour = new Date(i.dt * 1000).getHours();
        return hour >= 11 && hour <= 14;
      }) || dayItems[0]; // fallback to first if no midday
      
      dailyForecasts.push({
        day: forecastDate.toLocaleDateString('en-US', { weekday: 'short' }),
        date: forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temp: Math.round(middayItem.main.temp),
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
        icon: getWeatherIcon(middayItem.weather[0].main),
        condition: middayItem.weather[0].main,
        description: middayItem.weather[0].description,
        humidity: middayItem.main.humidity,
        wind: Math.round(middayItem.wind.speed)
      });
    }
  });
  
  console.log("✅ Processed forecast (3 days):", dailyForecasts);
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

// Process hourly forecast (next 24 hours)
export const processHourlyForecast = (forecastData) => {
  if (!forecastData || !forecastData.list) return [];
  
  // Get next 8 items (24 hours, 3-hour intervals)
  const hourlyData = forecastData.list.slice(0, 8).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
      hour: 'numeric',
      hour12: true 
    }),
    temp: Math.round(item.main.temp),
    icon: getWeatherIcon(item.weather[0].main),
    condition: item.weather[0].main,
    description: item.weather[0].description,
    pop: Math.round(item.pop * 100) // probability of precipitation
  }));
  
  return hourlyData;
};
