import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { DarkModeProvider } from './context/DarkModeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
      <DarkModeProvider>
      <App />
    </DarkModeProvider>
 
);

reportWebVitals();
