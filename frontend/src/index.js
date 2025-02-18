// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
        </LocalizationProvider>
    </React.StrictMode>
);
