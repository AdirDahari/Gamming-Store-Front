import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { getToken } from "./service/storeService.js";
import { Provider } from "react-redux";
import store from "./store/bigPie";

const isDemoMode = import.meta.env.VITE_SERVER_MODE == "demo";
const baseUrl = import.meta.env.BASE_URL;

if (!isDemoMode) {
  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
  axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={baseUrl}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
