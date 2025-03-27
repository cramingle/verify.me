import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics 
        debug={process.env.NODE_ENV === 'development'}
        // This enables event tracking
        beforeSend={(event) => {
          // Filter out any PII if needed
          return event;
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
); 