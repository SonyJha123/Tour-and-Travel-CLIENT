import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';
import CustomThemeProvider from './theme/ThemeProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Provider store={store}>
      <CustomThemeProvider>
        <ToastContainer />
        <App />
      </CustomThemeProvider>
    </Provider>
  </Router>
);
