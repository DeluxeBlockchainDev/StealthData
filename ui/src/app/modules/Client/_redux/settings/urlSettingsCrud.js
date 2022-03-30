import axios from "axios";

export const SETTINGS_URL = "setting";

// READ
export function filterTrackingUrls(params) {
  return axios.post(SETTINGS_URL + '/filterTrackingURLs', { params });
}

// READ
export function loadTrackingUrls(params) {
  return axios.post(SETTINGS_URL + '/loadTrackingURLs', { params });
}

// CREATE =>  POST: add a new urlSetting to the server
export function createUrlSetting(urlSetting) {
  return axios.post(SETTINGS_URL, urlSetting);
}

export function getUrlSettingById(urlSettingId) {
  return axios.get(`${SETTINGS_URL}/${urlSettingId}`);
}

// UPDATE => PUT: update the procuct on the server
export function updateUrlSetting(params={}) {
  console.log(params);
  return axios.post(SETTINGS_URL + '/updateUrlSetting', params);
}


export function deleteUrlSetting(params={}) {
  console.log(params);
  return axios.post(SETTINGS_URL + '/deleteUrlSetting', params);
}

export function getUrlSettingsFromFields() {
  return axios.get(`${SETTINGS_URL}/fromFields`);
}

export function addUrlSettingFromFields(body) {
  return axios.post(`${SETTINGS_URL}/fromFields`, body );
}