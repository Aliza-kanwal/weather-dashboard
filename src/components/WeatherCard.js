import React from 'react';

function WeatherCard({ weather, isCurrent = false }) {
  if (!weather) return null;

  // Get weather condition for animations
  const getWeatherAnimation = (condition) => {
    const animations = {
      'Clear': 'animate-pulse',
      'Clouds': 'animate-float',
      'Rain': 'animate-rain',
      'Thunderstorm': 'animate-flash',
      'Snow': 'animate-snow',
      'default': ''
    };
    return animations[condition] || animations.default;
  };

  // Get background gradient based on weather and time
  const getBackgroundStyle = () => {
    const condition = weather.weather?.[0]?.main || weather.condition;
    const isDay = weather.weather?.[0]?.icon?.includes('d');
    
    if (condition === 'Clear') {
      return isDay 
        ? 'from-yellow-400 to-orange-500' 
        : 'from-indigo-900 to-purple-900';
    } else if (condition === 'Clouds') {
      return isDay 
        ? 'from-gray-300 to-gray-500' 
        : 'from-gray-700 to-gray-900';
    } else if (condition === 'Rain') {
      return 'from-blue-600 to-gray-700';
    } else if (condition === 'Snow') {
      return 'from-blue-100 to-gray-200';
    }
    return 'from-blue-500 to-purple-600';
  };

  if (isCurrent) {
    return (
      <div className={`rounded-3xl bg-gradient-to-br ${getBackgroundStyle()} p-8 shadow-2xl text-white relative overflow-hidden`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`absolute ${getWeatherAnimation(weather.weather?.[0]?.main)}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 3 + 2}rem`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              {weather.weather?.[0]?.main === 'Clear' && '☀️'}
              {weather.weather?.[0]?.main === 'Clouds' && '☁️'}
              {weather.weather?.[0]?.main === 'Rain' && '🌧️'}
              {weather.weather?.[0]?.main === 'Snow' && '❄️'}
            </div>
          ))}
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-1">
                {weather.name}
              </h2>
              <p className="text-xl opacity-90">{weather.sys?.country}</p>
              <p className="text-sm opacity-75 mt-2">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-8xl mb-2 animate-bounce">
                {weather.weather?.[0]?.icon 
                  ? <img 
                      src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                      alt={weather.weather[0].description}
                      className="w-24 h-24"
                    />
                  : '☁️'
                }
              </div>
              <p className="text-xl capitalize opacity-90">
                {weather.weather?.[0]?.description}
              </p>
            </div>
          </div>

          {/* Temperature */}
          <div className="text-center mb-8">
            <span className="text-8xl font-bold">
              {Math.round(weather.main?.temp)}°
            </span>
            <span className="text-3xl opacity-75 ml-2">C</span>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">🌡️</div>
              <p className="text-xs opacity-75">Feels Like</p>
              <p className="text-xl font-semibold">{Math.round(weather.main?.feels_like)}°C</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">💧</div>
              <p className="text-xs opacity-75">Humidity</p>
              <p className="text-xl font-semibold">{weather.main?.humidity}%</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">💨</div>
              <p className="text-xs opacity-75">Wind Speed</p>
              <p className="text-xl font-semibold">{weather.wind?.speed} m/s</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">📊</div>
              <p className="text-xs opacity-75">Pressure</p>
              <p className="text-xl font-semibold">{weather.main?.pressure} hPa</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">👁️</div>
              <p className="text-xs opacity-75">Visibility</p>
              <p className="text-xl font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">🌅</div>
              <p className="text-xs opacity-75">Sunrise</p>
              <p className="text-xl font-semibold">
                {new Date(weather.sys?.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">🌇</div>
              <p className="text-xs opacity-75">Sunset</p>
              <p className="text-xl font-semibold">
                {new Date(weather.sys?.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">☁️</div>
              <p className="text-xs opacity-75">Cloudiness</p>
              <p className="text-xl font-semibold">{weather.clouds?.all}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

 // Forecast Card - Enhanced
// Forecast Card - This shows one day of the 3-day forecast
return (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 hover:transform hover:scale-105 transition-all duration-300 text-white">
    <div className="text-center">
      {/* Day name */}
      <p className="text-xl font-semibold mb-2">{weather.day}</p>
      
      {/* Weather icon */}
      <div className="text-5xl mb-3">{weather.icon}</div>
      
      {/* Temperature */}
      <p className="text-3xl font-bold mb-1">{weather.temp}°C</p>
      
      {/* Min/Max temps - FIX THIS */}
      <div className="flex justify-center gap-3 text-sm mb-3">
        <span className="text-green-300">▲ {weather.maxTemp || weather.temp + 2}°</span>
        <span className="text-blue-300">▼ {weather.minTemp || weather.temp - 3}°</span>
      </div>
      
      {/* Condition description */}
      <p className="text-blue-200 text-sm mb-4 capitalize">
        {weather.description || weather.condition || 'Clear sky'}
      </p>
      
      {/* Humidity and Wind - shown on hover */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/20 opacity-70">
        <div className="text-center">
          <div className="text-xs opacity-75">💧 Humidity</div>
          <div className="font-semibold">{weather.humidity || 65}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs opacity-75">💨 Wind</div>
          <div className="font-semibold">{weather.wind || 12} km/h</div>
        </div>
      </div>
      
      {/* Hourly preview - small */}
      <div className="flex justify-between mt-3 text-xs">
        <div>☀️ {weather.temp + 1}°</div>
        <div>☁️ {weather.temp}°</div>
        <div>🌙 {weather.temp - 2}°</div>
      </div>
    </div>
  </div>
);
}

export default WeatherCard;