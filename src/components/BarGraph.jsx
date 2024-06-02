import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const BarGraph = () => {
  const [eventTypeData, setEventTypeData] = useState({
    labels: [],
    datasets: []
  });

  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: []
  });

  const options = {
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 14
          }
        },
        title: {
          display: true,
          text: 'Destination Port',
          font: {
            size: 18
          }
        }
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            size: 14
          }
        },
        title: {
          display: true,
          text: 'Frequency',
          font: {
            size: 18
          }
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
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }
  };

  const fetchData = () => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const eventTypeProcessedData = processEventTypeData(data);
        setEventTypeData(eventTypeProcessedData);
        const categoryProcessedData = processCategoryData(data);
        setCategoryData(categoryProcessedData);
      });
  };

  const processEventTypeData = (data) => {
    const eventTypes = ['alert', 'ssh', 'dns', 'fileinfo', 'http'];
    const destPortData = {};

    data.forEach(item => {
      const { dest_port, event_type } = item;
      if (!destPortData[dest_port]) {
        destPortData[dest_port] = {};
        eventTypes.forEach(type => {
          destPortData[dest_port][type] = 0;
        });
      }
      destPortData[dest_port][event_type]++;
    });

    const labels = Object.keys(destPortData);
    const datasets = eventTypes.map(type => {
      return {
        label: type,
        data: labels.map(port => destPortData[port][type]),
        backgroundColor: getRandomColor(),
      };
    });

    return {
      labels: labels,
      datasets: datasets
    };
  };

  const processCategoryData = (data) => {
    const categories = ['Potentially Bad Traffic', 'Attempted Information Leak', 'Misc Attack', 'Not Suspicious Traffic'];
    const destPortData = {};

    data.forEach(item => {
      const { dest_port, alert } = item;
      if (alert && alert.category) {
        const category = alert.category;
        if (!destPortData[dest_port]) {
          destPortData[dest_port] = {};
          categories.forEach(cat => {
            destPortData[dest_port][cat] = 0;
          });
        }
        destPortData[dest_port][category]++;
      }
    });

    const labels = Object.keys(destPortData);
    const datasets = categories.map(category => {
      return {
        label: category,
        data: labels.map(port => destPortData[port][category]),
        backgroundColor: getRandomColor(),
      };
    });

    return {
      labels: labels,
      datasets: datasets
    };
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Event Type Distribution by Destination Port</h2>
      <Bar data={eventTypeData} options={options} />
      <h2>Alert Category Distribution by Destination Port</h2>
      <Bar data={categoryData} options={options} />
    </div>
  );
};

export default BarGraph;
