/**
 * index.tsx
 * 
 * The entry point of the ECMASynth application.
 * This file is responsible for:
 * - Initializing the React application
 * - Setting up StrictMode for development best practices
 * - Configuring performance monitoring
 * - Applying global styles
 * 
 * The application uses React 18's createRoot API for improved
 * rendering performance and concurrent features support.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error(
    'Failed to find the root element. ' +
    'The application requires a DOM element with id "root" to render.'
  );
}

// Create the root using React 18's createRoot API
const root = ReactDOM.createRoot(rootElement);

// Render the application within StrictMode
// StrictMode helps identify potential problems in the application
// by intentionally double-invoking certain lifecycle methods in development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Configure performance monitoring
// This can be customized to send metrics to any analytics service
const reportPerformanceMetrics = (metric: any) => {
  // You can send the metric to an analytics service here
  // For now, we'll just log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
};

// Initialize performance monitoring
reportWebVitals(reportPerformanceMetrics);
