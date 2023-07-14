import axios from "axios";

const token = localStorage.getItem("token");
console.log("token from api function: ", token);
const base_url = process.env.REACT_APP_API;

export const privateAPi = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
  withCredentials: false,
});

export const publicApi = axios.create({
  baseURL: base_url,
});
