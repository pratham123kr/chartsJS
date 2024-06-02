import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale 
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const LineGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const fetchData = (unit) => {
    fetch('/data.json')  
      .then(response => response.json())
      .then(data => {
        const alertCounts = {};

        data.forEach(record => {
          const date = new Date(record.timestamp);
          const roundedDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            Math.floor(date.getMinutes() / unit) * unit
          ).toISOString();

          if (!alertCounts[roundedDate]) {
            alertCounts[roundedDate] = 0;
          }
          alertCounts[roundedDate]++;
        });

        const labels = Object.keys(alertCounts).sort();
        const values = labels.map(label => alertCounts[label]);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Alerts',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false
            }
          ]
        });
      });
  };

  useEffect(() => {
    fetchData(5); // Fetch data initially for 5-minute interval
  }, []);

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          stepSize: 5,
          tooltipFormat: 'yyyy-MM-dd HH:mm',
          displayFormats: {
            minute: 'yyyy-MM-dd HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 18
          }
        },
        ticks: {
          font: {
            size: 14
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Alerts Count',
          font: {
            size: 18
          }
        },
        ticks: {
          font: {
            size: 14
          },
          beginAtZero: true
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="button-group">
        <button className="interval-button" onClick={() => fetchData(1)}>1 min</button>
        <button className="interval-button" onClick={() => fetchData(5)}>5 min</button>
        <button className="interval-button" onClick={() => fetchData(10)}>10 min</button>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;
