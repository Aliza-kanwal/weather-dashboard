import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function TemperatureChart({ forecastData, unit = 'C', cityName = '' }) {
  if (!forecastData || forecastData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl text-center text-white/70">
        <p>No forecast data available</p>
      </div>
    );
  }

  const labels = forecastData.map(day => day.day);
  const temperatures = forecastData.map(day => day.temp);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const avgTemp = Math.round(temperatures.reduce((a, b) => a + b, 0) / temperatures.length);

  const data = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatures,
        borderColor: '#ffd700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: temperatures.map(t => 
          t === maxTemp ? '#ff4444' : t === minTemp ? '#4444ff' : '#ffd700'
        ),
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: (context) => `  ${context.raw}°C`,
        },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { 
          color: 'white',
          callback: (value) => `${value}°`,
        },
        min: minTemp - 2,
        max: maxTemp + 2,
      },
      x: {
        grid: { display: false },
        ticks: { color: 'white', font: { weight: 'bold' } },
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>📊</span> Temperature Trend
          {cityName && <span className="text-sm text-blue-200">({cityName})</span>}
        </h3>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1 text-red-400">▲ {maxTemp}°</span>
          <span className="flex items-center gap-1 text-blue-400">▼ {minTemp}°</span>
          <span className="flex items-center gap-1 text-green-400">● {avgTemp}°</span>
        </div>
      </div>
      
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
      
      {/* City comparison note */}
      <div className="mt-4 text-xs text-white/50 text-center">
        {cityName === 'Karachi' ? '🌊 Coastal city with moderate variation' : 
         cityName === 'Tokyo' ? '🗾 Four-season climate with clear variation' :
         cityName === 'London' ? '🌧️ Maritime climate with mild changes' :
         '📍 Check different cities to see climate patterns'}
      </div>
    </div>
  );
}

export default TemperatureChart;