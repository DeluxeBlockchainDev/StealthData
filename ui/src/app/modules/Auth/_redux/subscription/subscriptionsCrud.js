import axios from "axios";

export const SUBSCRIPTION_URL = "subscription";

// READ
export function getSubscriptions(params) {
  return axios.get(SUBSCRIPTION_URL, { params });
}

// CREATE =>  POST: add a new subscription to the server
export function createSubscription(subscription) {
  return axios.post(SUBSCRIPTION_URL, subscription);
}

export function getSubscriptionById(subscriptionId) {
  return axios.get(`${SUBSCRIPTION_URL}/${subscriptionId}`);
}

// UPDATE => PUT: update the procuct on the server
export function updateSubscription( _id, subscription) {
  return axios.put(`${SUBSCRIPTION_URL}/${_id}`, subscription);
}