import {createSlice} from "@reduxjs/toolkit";

const initialClientsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  clientForEdit: null,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const clientsSlice = createSlice({
  name: "clients",
  initialState: initialClientsState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.payload.error}`;
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
    endCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    clearError: (state, action) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload.error;
    },
    // getClientById
    clientFetched: (state, action) => {
      state.actionsLoading = false;
      state.clientForEdit = action.payload.clientForEdit;
      state.error = null;
    },
    updateClientForEdit: (state, action) => {
      state.clientForEdit = action.payload.clientForEdit;
    },
    // findClients
    clientsFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createClient
    clientCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.client);
      state.clientForEdit = null;
    },
    // updateClient
    clientUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity._id === action.payload.client._id) {
          return action.payload.client;
        }
        return entity;
      });
      state.clientForEdit = null;
    },
    // deleteClient
    clientDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(el => el._id !== action.payload._id);
    },
    // deleteClients
    clientsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => !action.payload.ids.includes(el._id)
      );
    },
    // clientsUpdateState
    clientsStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map(entity => {
        if (ids.findIndex(id => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    },
    clientToggled: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { id, status } = action.payload;
      state.entities = state.entities.map(entity => {
        if (id === entity._id) {
          entity.status = status;
        }
        return entity;
      });
    },
    leadPriorityFetched: (state, action) => {
      state.listLoading = false;
      state.leadPriorities = action.payload.data.docs;
      state.error = null;
    },
  }
});