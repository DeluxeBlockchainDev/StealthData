import {createSlice} from "@reduxjs/toolkit";

const initialUrlSettingsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  activeUrlSettings: null,
  urlSettingForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const urlSettingsSlice = createSlice({
  name: "urlSettings",
  initialState: initialUrlSettingsState,
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
    // getUrlSettingsById
    urlSettingFetched: (state, action) => {
      state.actionsLoading = false;
      state.urlSettingsForEdit = action.payload.urlSettingsForEdit;
      state.error = null;
    },
    // findUrlSettingss
    urlSettingsFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    setactiveUrlSettings: (state, action) => {
      const { activeUrlSettings } = action.payload;
      state.activeUrlSettings = {...activeUrlSettings};
    },
    // createClient
    urlSettingsCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.urlSettingsForEdit = null;
      state.entities.push(action.payload.urlSettings);
    },
    // updateClient
    urlSettingsUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.urlSettingsForEdit = null;
      state.entities = state.entities.map(entity => {
        if (entity._id === action.payload.urlSettings._id) {
          return action.payload.urlSettings;
        }
        return entity;
      });
    },
  }
});