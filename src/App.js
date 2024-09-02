// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainComponent from './components/MainComponent';

const App = () => {
  return (
    <Router>
      <div className="App">
        <MainComponent />
      </div>
    </Router>
  );
};

export default App;