import * as requestFromServer from "./emailCampaignsCrud";
import {emailCampaignsSlice, callTypes} from "./emailCampaignsSlice";

const {actions} = emailCampaignsSlice;

export const fetchEmailCampaigns = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getEmailCampaigns(queryParams)
    .then(response => {
      // const { totalCount, entities } = response.data;
      dispatch(actions.emailCampaignsFetched({ entities: response.data }));
    })
    .catch(error => {
      error.emailCampaignMessage = "Can't find Email Campaigns";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchEmailCampaignTypes = queryParams => dispatch => {
  return requestFromServer
    .getEmailCampaignTypes(queryParams)
    .then(response => {
      dispatch(actions.emailCampaignTypesFetched({ campaignTypes: response.data }));
    })
    .catch(error => {
      error.emailCampaignMessage = "Can't find Email Campaign Types";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const setActiveEmailCampaign = activeEmailCampaign => dispatch => dispatch(actions.setActiveEmailCampaign({ activeEmailCampaign }))

export const fetchEmailCampaign = id => dispatch => {
  if (!id) {
    return dispatch(actions.emailCampaignFetched({ emailCampaignForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getEmailCampaignById(id)
    .then(response => {
      let emailCampaign = {...response.data};
      dispatch(actions.emailCampaignFetched({ emailCampaignForEdit: emailCampaign }));
    })
    .catch(error => {
      error.emailCampaignMessage = "Can't find Email Campaign";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createEmailCampaign = (emailCampaignForCreation, cb) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createEmailCampaign(emailCampaignForCreation)
    .then(response => {
      const emailCampaign = response.data;
      dispatch(actions.emailCampaignCreated({ emailCampaign }));
      if(cb) cb({ success:1, data: emailCampaign });
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      if(cb) cb({ success:0, data: error });
    });
};

export const updateEmailCampaign = (emailCampaign, cb ) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateEmailCampaign( emailCampaign._id, emailCampaign)
    .then(() => {
      dispatch(actions.emailCampaignUpdated({ emailCampaign }));
      if(cb) cb({ success:1, data: emailCampaign });
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      if(cb) cb({ success:0, data: error });
    });
};

export const clearEmailCampaignError = () => dispatch => dispatch(actions.clearError({}));
export const setEmailCampaignError = (error) => dispatch => dispatch(actions.setError({ error }));
