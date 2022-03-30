import {createSlice} from "@reduxjs/toolkit";

const initialSubscriptionsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  activeSubscription: null,
  subscriptionForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState: initialSubscriptionsState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    clearError: (state, action) => {
      state.error = null;
    },
    // getSubscriptionById
    subscriptionFetched: (state, action) => {
      state.actionsLoading = false;
      state.subscriptionForEdit = action.payload.subscriptionForEdit;
      state.error = null;
    },
    // findSubscriptions
    subscriptionsFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    setActiveSubscription: (state, action) => {
      const { activeSubscription } = action.payload;
      state.activeSubscription = {...activeSubscription};
    },
    // createClient
    subscriptionCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.subscription);
    },
    // updateClient
    subscriptionUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity._id === action.payload.subscription._id) {
          return action.payload.subscription;
        }
        return entity;
      });
    },
  }
});