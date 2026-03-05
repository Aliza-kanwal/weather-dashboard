import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

export const fetchAirQuality = async (lat, lon) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching air quality:', error);
    return null;
  }
};

export const getAQILevel = (aqi) => {
  const levels = {
    1: { text: 'Good', color: 'text-green-400', bg: 'bg-green-400/20', icon: '😊' },
    2: { text: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: '🙂' },
    3: { text: 'Moderate', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: '😐' },
    4: { text: 'Poor', color: 'text-red-400', bg: 'bg-red-400/20', icon: '😷' },
    5: { text: 'Very Poor', color: 'text-purple-400', bg: 'bg-purple-400/20', icon: '⚠️' }
  };
  return levels[aqi] || levels[1];
};

export const getAQIDescription = (aqi) => {
  const descriptions = {
    1: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    2: 'Air quality is acceptable. However, there may be a risk for some people.',
    3: 'Members of sensitive groups may experience health effects.',
    4: 'Everyone may begin to experience health effects.',
    5: 'Health warnings of emergency conditions. The entire population is likely to be affected.'
  };
  return descriptions[aqi] || descriptions[1];
};