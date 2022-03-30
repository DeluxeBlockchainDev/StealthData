import axios from "axios";

export const VISITOR_URL = "visitor";
export const VISIT_URL = "visit";
//let source = axios.CancelToken.source();
//let config = { cancelToken: source.token}
let cancelToken
// READ
export function getAllVisitors(queryParams = {}) {
  if (typeof cancelToken != typeof undefined) {
    cancelToken.cancel("Operation canceled due to new request.")
  }
  cancelToken = axios.CancelToken.source()

  return axios.get(VISITOR_URL, {cancelToken: cancelToken.token, params: queryParams });
}

export function filterAllVisitors(queryParams = {}) {
  cancelToken = axios.CancelToken.source();
  return axios.get(VISITOR_URL, {cancelToken: cancelToken.token, params: queryParams });
}

export function getVisitorById(visitorId) {
  return axios.get(`${VISITOR_URL}/${visitorId}`);
}

export function getAllVisits(queryParams = {}) {
  return axios.get(VISIT_URL, { params: queryParams });
}

export function exportAllVisitors(queryParams = {}) {
  return axios.get(VISITOR_URL + '/export', { params: queryParams });
}

export function exportAllHistory(queryParams = {}) {
  console.log(queryParams);
  return axios.get(VISITOR_URL + '/exportCrmMatchingHistory', { params:queryParams });
}

export function uploadFile( data, queryParams = {}, options) {
  return axios.post(VISITOR_URL + '/crmMatching', data,{ params: queryParams, ...options });
}

export function loadCrmMatchingHistory(queryParams = {}) {
  return axios.post(VISITOR_URL + '/crmMatchingHistory', { params: queryParams });
}

export function deleteCrmMatchingFile(queryParams = {}) {
  return axios.get(VISITOR_URL + '/deleteCrmMatchingFile', { params: queryParams });
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findVisitors(queryParams) {
  return axios.post(`${VISITOR_URL}/find`, { queryParams });
}