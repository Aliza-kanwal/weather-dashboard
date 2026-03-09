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
// Fix for fetchForecastByCity - REMOVE the cnt parameter completely
export const fetchForecastByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
        // REMOVE cnt parameter - let API return full 5 days (40 items)
      }
    });
    console.log("API Response:", response.data); // Add this to debug
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Same for coordinates
export const fetchForecastByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric'
        // REMOVE cnt parameter
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


// Helper to process forecast data
export const processForecastData = (forecastData) => {
  console.log("Processing forecast. Full data:", forecastData);
  
  if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
    console.log("No forecast data");
    return [];
  }
  
  console.log(`Received ${forecastData.list.length} forecast items`);
  
  // Group by day
  const daysMap = new Map();
  
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = date.toLocaleDateString();
    
    if (!daysMap.has(fullDate)) {
      daysMap.set(fullDate, {
        day: dayKey,
        date: fullDate,
        items: [],
        temps: [],
        icons: [],
        conditions: []
      });
    }
    
    const dayData = daysMap.get(fullDate);
    dayData.items.push(item);
    dayData.temps.push(item.main.temp);
    dayData.icons.push(item.weather[0].icon);
    dayData.conditions.push(item.weather[0].main);
  });
  
  // Convert map to array and take first 3 days
  const dailyForecasts = [];
  let dayCount = 0;
  
  for (const [_, dayData] of daysMap) {
    if (dayCount >= 3) break;
    
    const avgTemp = Math.round(
      dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length
    );
    const minTemp = Math.round(Math.min(...dayData.temps));
    const maxTemp = Math.round(Math.max(...dayData.temps));
    
    // Get most common condition
    const modeCondition = dayData.conditions.sort((a,b) =>
      dayData.conditions.filter(v => v === a).length - dayData.conditions.filter(v => v === b).length
    ).pop();
    
    dailyForecasts.push({
      day: dayData.day,
      date: dayData.date,
      temp: avgTemp,
      minTemp: minTemp,
      maxTemp: maxTemp,
      icon: getWeatherIcon(modeCondition),
      condition: modeCondition,
      description: dayData.items[0].weather[0].description,
      humidity: Math.round(
        dayData.items.reduce((a, b) => a + b.main.humidity, 0) / dayData.items.length
      ),
      wind: Math.round(
        dayData.items.reduce((a, b) => a + b.wind.speed, 0) / dayData.items.length
      )
    });
    
    dayCount++;
  }
  
  console.log("Processed 3-day forecast:", dailyForecasts);
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
  
  console.log("Processing hourly. Total items:", forecastData.list.length);
  
  // Get next 8 items (24 hours, 3-hour intervals)
  const hourlyData = forecastData.list.slice(0, 8).map(item => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        hour12: true 
      }),
      temp: Math.round(item.main.temp),
      icon: getWeatherIcon(item.weather[0].main),
      condition: item.weather[0].main,
      description: item.weather[0].description,
      humidity: item.main.humidity,
      wind: Math.round(item.wind.speed),
      pop: Math.round(item.pop * 100)
    };
  });
  
  console.log("Processed hourly (8 items):", hourlyData);
  return hourlyData;
};
};
