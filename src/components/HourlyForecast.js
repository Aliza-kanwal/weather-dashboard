import React from 'react';

function HourlyForecast({ hourlyData, unit = 'C' }) {
  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span>🕒</span> Next 12 Hours Forecast
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {hourlyData.map((hour, index) => (
          <div 
            key={index}
            className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
          >
            <p className="text-lg font-semibold text-white mb-2">{hour.time}</p>
            
            <div className="text-5xl mb-2 animate-pulse">
              {hour.icon}
            </div>
            
            <p className="text-2xl font-bold text-white mb-1">
              {hour.temp}°{unit}
            </p>
            
            <p className="text-sm text-blue-200 mb-2 capitalize">
              {hour.description}
            </p>
            
            {/* Precipitation chance */}
            {hour.pop > 0 && (
              <div className="flex items-center justify-center gap-1 text-sm text-blue-300">
                <span>🌧️</span>
                <span>{hour.pop}%</span>
              </div>
            )}
            
            {/* Time indicator */}
            <div className="mt-2 text-xs text-white/50">
              {index === 0 ? 'Now' : `+${index * 3}h`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;