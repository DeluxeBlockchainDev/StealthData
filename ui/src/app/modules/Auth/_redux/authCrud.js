import axios from "axios";

export const LOGIN_URL = "auth/login";
export const REGISTER_URL = "auth/register";
export const REQUEST_PASSWORD_URL = "auth/forgot-password";
export const RESET_PASSWORD_URL = "auth/reset-password";

export const ME_URL = "auth/profile";
export const CLIENT_URL = "client";

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}
export function resetPassword(params) {
  return axios.post(RESET_PASSWORD_URL, params);
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}

export function getClient(id) {
  // Authorization head should be fulfilled in interceptor.
  return axios.get( CLIENT_URL + '/' + id );
}
