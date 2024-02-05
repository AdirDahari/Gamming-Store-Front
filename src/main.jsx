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

axios.defaults.baseURL = "http://localhost:8080/api/v1";
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["bearer"] = token;
  }
  return config;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
