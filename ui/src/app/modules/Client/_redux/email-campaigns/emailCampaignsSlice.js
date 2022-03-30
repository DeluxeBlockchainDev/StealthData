import {createSlice} from "@reduxjs/toolkit";

const initialEmailCampaignsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  campaignTypes: [],
  activeEmailCampaign: null,
  emailCampaignForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const emailCampaignsSlice = createSlice({
  name: "emailCampaigns",
  initialState: initialEmailCampaignsState,
  reducers: {
    // catchError: (state, action) => {
    //   state.error = `${action.type}: ${action.payload.error}`;
    //   if (action.payload.callType === callTypes.list) {
    //     state.listLoading = false;
    //   } else {
    //     state.actionsLoading = false;
    //   }
    // },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    clearError: (state, action) => {
      state.error = '';
    },
    setError: (state, action) => {
      state.error = action.payload.error;
    },
    catchError: (state, action) => {
      state.error = action.payload.error.response && action.payload.error.response.data && action.payload.error.response.data.message ? action.payload.error.response.data.message : action.payload.error.message;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    // getEmailCampaignById
    emailCampaignFetched: (state, action) => {
      state.actionsLoading = false;
      state.emailCampaignForEdit = action.payload.emailCampaignForEdit;
      state.error = null;
    },
    // findEmailCampaigns
    emailCampaignsFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // findEmailCampaigns
    emailCampaignTypesFetched: (state, action) => {
      const { campaignTypes } = action.payload;
      state.campaignTypes = campaignTypes;
    },
    setActiveEmailCampaign: (state, action) => {
      const { activeEmailCampaign } = action.payload;
      state.activeEmailCampaign = {...activeEmailCampaign};
    },
    // createClient
    emailCampaignCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.emailCampaignForEdit = null;
      state.entities.push(action.payload.emailCampaign);
    },
    // updateClient
    emailCampaignUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.emailCampaignForEdit = null;
      state.entities = state.entities.map(entity => {
        if (entity._id === action.payload.emailCampaign._id) {
          return action.payload.emailCampaign;
        }
        return entity;
      });
    },
  }
});