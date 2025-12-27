// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'highlight.js/styles/atom-one-dark.css';
// 1. 引入 BrowserRouter
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. 包裹 App 组件 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
