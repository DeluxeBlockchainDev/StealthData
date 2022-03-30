import {createSlice} from "@reduxjs/toolkit";

const initialVisitorsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  visitorForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const visitorsSlice = createSlice({
  name: "visitors",
  initialState: initialVisitorsState,
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
    // getVisitorById
    visitorFetched: (state, action) => {
      state.actionsLoading = false;
      state.visitorForEdit = action.payload.visitorForEdit;
      state.error = null;
    },
    // findVisitors
    visitorsFetched: (state, action) => {
      const { totalCount, entities, currentPage } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.currentPage = currentPage;
    },
    // findVisitors
    visitorVisitsFetched: (state, action) => {
      const { entities, email, hasNoMoreUrls, next_offset } = action.payload;
      state.entities = state.entities.map((v) => v.email === email ? ({
        ...v,
        pagesVisited: (next_offset > 50) ? v.pagesVisited.concat(entities) : entities.concat(),
        hasNoMoreUrls,
        seeMoreActive: true,
        next_offset
      }) : v )
      state.actionsLoading = false;
      state.error = null;
    },
    visitorVisitsSeeLess: (state, action) => {
      const { email } = action.payload;
      state.entities = state.entities.map((v) => v.email === email ? ({
        ...v,
        seeMoreActive: false
      }) : v )
    },
  }
});
