import axios from "axios";
import Cookies from "js-cookie";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("Authorization");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
