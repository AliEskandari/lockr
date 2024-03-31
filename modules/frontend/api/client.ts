import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import _debug from "./debug";
const debug = _debug.extend("client");

class Client {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC__HOSTS__API,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  request<T>(config: AxiosRequestConfig) {
    debug("Making request to backend API with config... %O", config);
    return this.axios.request<T>(config);
  }
}

const client = new Client();
export default client;
