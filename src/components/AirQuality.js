import React, { useState, useEffect } from 'react';
import { fetchAirQuality, getAQILevel, getAQIDescription } from '../services/airQualityService';

function AirQuality({ lat, lon }) {
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat && lon) {
      loadAirQuality();
    }
  }, [lat, lon]);

  const loadAirQuality = async () => {
    setLoading(true);
    const data = await fetchAirQuality(lat, lon);
    if (data && data.list && data.list[0]) {
      setAirQuality(data.list[0]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-8 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!airQuality) return null;

  const aqi = airQuality.main.aqi;
  const level = getAQILevel(aqi);
  const components = airQuality.components;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span>💨</span> Air Quality Index
      </h3>

      {/* Main AQI Display */}
      <div className={`${level.bg} rounded-xl p-6 text-center mb-6`}>
        <div className="text-6xl mb-2">{level.icon}</div>
        <div className={`text-3xl font-bold ${level.color}`}>
          {level.text}
        </div>
        <div className="text-white/80 text-sm mt-2">
          AQI: {aqi}/5
        </div>
        <p className="text-white/70 text-sm mt-4">
          {getAQIDescription(aqi)}
        </p>
      </div>

      {/* Pollutant Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-white/60">PM2.5</div>
          <div className="text-lg font-semibold text-white">
            {components.pm2_5?.toFixed(1)}
          </div>
          <div className="text-xs text-white/40">μg/m³</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-white/60">PM10</div>
          <div className="text-lg font-semibold text-white">
            {components.pm10?.toFixed(1)}
          </div>
          <div className="text-xs text-white/40">μg/m³</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-white/60">O₃</div>
          <div className="text-lg font-semibold text-white">
            {components.o3?.toFixed(1)}
          </div>
          <div className="text-xs text-white/40">μg/m³</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-white/60">NO₂</div>
          <div className="text-lg font-semibold text-white">
            {components.no2?.toFixed(1)}
          </div>
          <div className="text-xs text-white/40">μg/m³</div>
        </div>
      </div>

      {/* Health Recommendations */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <p className="text-sm text-white/80">
          {aqi <= 2 ? '✅ Good air quality - perfect for outdoor activities' :
           aqi === 3 ? '⚠️ Sensitive groups should limit outdoor activities' :
           '🚫 Limit outdoor activities - wear mask if going out'}
        </p>
      </div>
    </div>
  );
}

export default AirQuality;