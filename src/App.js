// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import MainComponent from './components/MainComponent';
import MainComponentWITHauth from './components/MainComponentWITHauth';

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* <MainComponent /> */}
        <MainComponentWITHauth />
      </div>
    </Router>
  );
};

export default App;