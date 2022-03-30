import axios from "axios";

export const ENDPOINT = "payment";

export function makeRecurringPayment(params) {
  return axios.post(ENDPOINT + '/recurring', params);
}

export function makeCheckPayment(params) {
  return axios.post(ENDPOINT + '/check', params);
}

export function makePayment(params) {
  return axios.post(ENDPOINT, params);
}
