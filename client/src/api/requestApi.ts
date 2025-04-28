import axios from "axios";

const API_URL = "http://localhost:5000/api";
export const requestApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
