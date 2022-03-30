import axios from "axios";

export const DASHBOARD_URL = "dashboard";

// READ
export function getTopVisitors(queryParams = {}) {
  return axios.get(DASHBOARD_URL + '/topVisitors', { params: queryParams });
}

export function getLeadPriority(queryParams = {}) {
  return axios.get(DASHBOARD_URL + '/leadPriority', { params: queryParams });
}

export function getVisitorStats(queryParams = {}) {
  return axios.get(DASHBOARD_URL + '/visitorStats', { params: queryParams });
}

export function getTopUrls(queryParams = {}) {
  return axios.get(DASHBOARD_URL + '/topUrls', { params: queryParams });
}

export function getEmailStats(queryParams = {}) {
  return axios.get(DASHBOARD_URL + '/emailStats', { params: queryParams });
}