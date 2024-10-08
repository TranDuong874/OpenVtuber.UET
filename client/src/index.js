import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ModelProvider from './context/ModelProvider';
import FacialDataProvider from './context/FacialDataProvider';
import LocalVideoProvider from './context/LocalVideoProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LocalVideoProvider>
      <ModelProvider>
        <FacialDataProvider>
          <App />
        </FacialDataProvider>
      </ModelProvider>
    </LocalVideoProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
