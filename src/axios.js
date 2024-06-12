import axios from "axios";

export const makeRequest = axios.create({
  // baseURL: "https://dtu-social-api.onrender.com/api/",
  baseURL: "https://new-dtu-social-api.onrender.com/api/",
  withCredentials: true,
});
