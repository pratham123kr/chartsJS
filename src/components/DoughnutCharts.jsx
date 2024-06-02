import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Tooltip, Legend, ArcElement);

const DoughnutCharts = () => {
  const [category, setCategory] = useState({
    labels: [],
    datasets: []
  });
  const [severity, setSeverity] = useState({
    labels: [],
    datasets: []
  });
  const [proto, setProto] = useState({
    labels: [],
    datasets: []
  });
  const [event, setEvent] = useState({
    labels: [],
    datasets: []
  });

  const baseOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        font: {
          size: 18
        }
      }
    }
  };

  const options_proto = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      title: {
        ...baseOptions.plugins.title,
        text: 'Protocol Distribution'
      }
    }
  };

  const options_cat = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      title: {
        ...baseOptions.plugins.title,
        text: 'Category Distribution'
      }
    }
  };

  const options_sev = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      title: {
        ...baseOptions.plugins.title,
        text: 'Severity Distribution'
      }
    }
  };

  const options_event = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      title: {
        ...baseOptions.plugins.title,
        text: 'Event Type'
      }
    }
  };

  const fetchData = () => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        let list_proto = [0, 0];
        data.forEach(index => {
          if (index.proto === 'TCP') {
            list_proto[0]++;
          } else {
            list_proto[1]++;
          }
        });
        setProto({
          labels: ['TCP', 'UDP'],
          datasets: [
            {
              label: 'Proto distribution',
              data: list_proto,
              backgroundColor: [
                'rgba(255, 99, 132, 0.9)',
                'rgba(54, 162, 235, 0.9)',
                'rgba(255, 206, 86, 0.9)',
                'rgba(75, 192, 192, 0.9)',
                'rgba(153, 102, 255, 0.9)',
              ],
              hoverOffset: 4,
            },
          ],
        });

        let uno = {};
        data.forEach(index => {
          if (index && index.alert && index.alert.category) {
            if (uno[index.alert.category]) {
              uno[index.alert.category]++;
            } else {
              uno[index.alert.category] = 1;
            }
          }
        });

        const list_cat = [];
        const label_cat = [];

        Object.keys(uno).forEach(key => {
          list_cat.push(uno[key]);
          label_cat.push(key);
        });

        setCategory({
          labels: label_cat,
          datasets: [
            {
              label: 'Category distribution',
              data: list_cat,
              backgroundColor: [
                'rgba(255, 99, 132, 0.9)',
                'rgba(54, 162, 235, 0.9)',
                'rgba(255, 206, 86, 0.9)',
                'rgba(75, 192, 192, 0.9)',
                'rgba(153, 102, 255, 0.9)',
              ],
              hoverOffset: 4,
            },
          ],
        });

        uno = {};

        data.forEach(index => {
          if (index && index.alert && index.alert.severity) {
            if (uno[index.alert.severity]) {
              uno[index.alert.severity]++;
            } else {
              uno[index.alert.severity] = 1;
            }
          }
        });

        const list_sev = [];
        const label_sev = [];

        Object.keys(uno).forEach(key => {
          list_sev.push(uno[key]);
          label_sev.push(key);
        });

        setSeverity({
          labels: label_sev,
          datasets: [
            {
              label: 'Severity distribution',
              data: list_sev,
              backgroundColor: [
                'rgba(255, 99, 132, 0.9)',
                'rgba(54, 162, 235, 0.9)',
                'rgba(255, 206, 86, 0.9)',
                'rgba(75, 192, 192, 0.9)',
                'rgba(153, 102, 255, 0.9)',
              ],
              hoverOffset: 4,
            },
          ],
        });

        uno = {};

        data.forEach(index => {
          if (index && index.event_type) {
            if (uno[index.event_type]) {
              uno[index.event_type]++;
            } else {
              uno[index.event_type] = 1;
            }
          }
        });

        const list_event = [];
        const label_event = [];

        Object.keys(uno).forEach(key => {
          list_event.push(uno[key]);
          label_event.push(key);
        });

        setEvent({
          labels: label_event,
          datasets: [
            {
              label: 'Event types',
              data: list_event,
              backgroundColor: [
                'rgba(255, 99, 132, 0.9)',
                'rgba(54, 162, 235, 0.9)',
                'rgba(255, 206, 86, 0.9)',
                'rgba(75, 192, 192, 0.9)',
                'rgba(153, 102, 255, 0.9)',
              ],
              hoverOffset: 4,
            },
          ],
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="doughnut-container">
      <div className="doughnut-chart">
        <Pie options={options_proto} data={proto} />
      </div>
      <div className="doughnut-chart">
        <Pie options={options_cat} data={category} />
      </div>
      <div className="doughnut-chart">
        <Pie options={options_sev} data={severity} />
      </div>
      <div className="doughnut-chart">
        <Pie options={options_event} data={event} />
      </div>
    </div>
  );
};

export default DoughnutCharts;
