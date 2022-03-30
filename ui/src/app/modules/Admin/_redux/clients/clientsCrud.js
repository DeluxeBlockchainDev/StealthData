import axios from "axios";

export const CLIENTS_URL = "client";
export const VISITOR_URL = "visitor";
export const ME_URL = "auth/profile";

// CREATE =>  POST: add a new client to the server
export function createClient(client) {
  return axios.post(CLIENTS_URL, client);
}

// READ
export function getAllClients(params) {
  return axios.get(CLIENTS_URL, { params });
}

export function getClientById(clientId) {
  return axios.get(`${CLIENTS_URL}/${clientId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findClients(queryParams) {
  return axios.post(`${CLIENTS_URL}/find`, { queryParams });
}

// UPDATE => PUT: update the procuct on the server
export function updateClient(_id, client) {
  return axios.put(`${CLIENTS_URL}/${_id}`, client);
}

// UPDATE Status
export function updateStatusForClients(ids, status) {
  return axios.post(`${CLIENTS_URL}/updateStatusForClients`, {
    ids,
    status
  });
}

// DELETE => delete the client from the server
export function deleteClient(clientId) {
  return axios.delete(`${CLIENTS_URL}/${clientId}`);
}

// DELETE Clients by ids
export function deleteClients(ids) {
  return axios.post(`${CLIENTS_URL}/deleteClients`, { ids });
}

export function getClientInvoices(params) {
  return axios.get(`${CLIENTS_URL}/invoices`, { params });
}

export function getClientInvoice(id) {
  return axios.get(`${CLIENTS_URL}/invoices/${id}`);
}

export function checkClientExists(email) {
  return axios.get(`${CLIENTS_URL}/exists/${email}`);
}

export function toggleClient(id, status) {
  return axios.get(`${CLIENTS_URL}/toggle/${id}`, { params: { status } });
}


export function getLeadPriority(params) {
  return axios.get(`${CLIENTS_URL}/leadPriority/${params.client_id}?page=${params.page}&limit=${params.limit}&sortOrder=${params.sortOrder}&sortField=${params.sortField}`);
}

export function updateLeadPriority(clientId, params) {
  return axios.post(`${CLIENTS_URL}/updateLeadPriority/${clientId}`, params, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }

  })
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    })
}

export function recorrectVisitCount(clientId) {
  return axios.get(`${VISITOR_URL}/recorrectVisitCount?id=${clientId}`);
}

export function accessClientAccount(id) {
  return axios.get(`${CLIENTS_URL}/accessClientAccount/${id}`, { params: { } });
}

export function getUserByToken(id) {
  return axios.get(ME_URL);
}