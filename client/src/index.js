import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ModelProvider from './context/ModelProvider';
import FacialDataProvider from './context/FacialDataProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ModelProvider>
      <FacialDataProvider>
        <App />
      </FacialDataProvider>
    </ModelProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
