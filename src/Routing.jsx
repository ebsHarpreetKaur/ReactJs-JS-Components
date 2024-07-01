import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HorizontalScrollable from './components/HorizontalScrollable';
import JobRules from './components/JobRules';
import Reports from './components/Reports';

function Routing() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<HorizontalScrollable />} />
          <Route exact path="/jobrules" element={<JobRules />} />
          <Route exact path="/reports" element={<Reports />} />


        </Routes>
      </div>
    </Router>
  );
}

export default Routing;
