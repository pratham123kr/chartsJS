import React, { useState } from 'react';
import LineGraph from './components/LineGraph';
import DoughnutCharts from './components/DoughnutCharts';
import BarGraph from './components/BarGraph';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <button className="toggle-dark-mode" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      <div className="container">
        <h2>Line Graph</h2>
        <LineGraph />
      </div>
      <div className="container">
        <h2>Pie Charts</h2>
        <DoughnutCharts />
      </div>
      <div className="container">
        <h2>Bar Graphs</h2>
        <BarGraph />
      </div>
    </div>
  );
}

export default App;
