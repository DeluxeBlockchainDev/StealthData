import axios from "axios";

export const EMAIL_CAMPAIGN_URL = "emailCampaign";

// READ
export function getEmailCampaigns(params) {
  return axios.get(EMAIL_CAMPAIGN_URL, { params });
}

// CREATE =>  POST: add a new emailCampaign to the server
export function createEmailCampaign(emailCampaign) {
  return axios.post(EMAIL_CAMPAIGN_URL, emailCampaign);
}

export function getEmailCampaignById(emailCampaignId) {
  return axios.get(`${EMAIL_CAMPAIGN_URL}/${emailCampaignId}`);
}

// UPDATE => PUT: update the procuct on the server
export function updateEmailCampaign( _id, emailCampaign) {
  return axios.put(`${EMAIL_CAMPAIGN_URL}/${_id}`, emailCampaign);
}

export function getEmailCampaignTypes() {
  return axios.get(`${EMAIL_CAMPAIGN_URL}/campaignTypes`);
}

export function getEmailCampaignFromFields() {
  return axios.get(`${EMAIL_CAMPAIGN_URL}/fromFields`);
}

export function addEmailCampaignFromFields(body) {
  return axios.post(`${EMAIL_CAMPAIGN_URL}/fromFields`, body );
}