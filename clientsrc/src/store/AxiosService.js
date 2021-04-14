import Axios from "axios";

//Allows axios to work locally or live
let baseUrl = location.host.includes("localhost")
  ? "http://localhost:3000/"
  : "/";

export const api = Axios.create({
  baseURL: baseUrl + "api",
  timeout: 30000,
  withCredentials: true
});

export const payPalApi = Axios.create({
  baseURL: "https://api-m.sandbox.paypal.com/v1",
  timeout: 30000,
  withCredentials: true
})
