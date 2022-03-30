import * as requestFromServer from "./visitorsCrud";
import {visitorsSlice, callTypes} from "./visitorsSlice";

const {actions} = visitorsSlice;

export const fetchVisitors = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllVisitors(queryParams)
    .then(response => {
      dispatch(actions.visitorsFetched({ entities: response.data.docs, totalCount: response.data.total, currentPage: response.data.page }));
    })
    .catch(error => {
      error.message = "Can't find visitors";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const filterVisitors = queryParams => {
  return requestFromServer.filterAllVisitors(queryParams);
};

export const fetchVisitor = id => dispatch => {
  if (!id) {
    return dispatch(actions.visitorFetched({ visitorForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getVisitorById(id)
    .then(response => {
      let visitor = {...response.data};
      visitor['websiteUrl'] = visitor.apps[0].url;

      dispatch(actions.visitorFetched({ visitorForEdit: visitor }));
    })
    .catch(error => {
      error.message = "Can't find visitor";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};


export const fetchVisitorVisits = params => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAllVisits(params)
    .then(response => {
      const { email } = params;
      let offset = (params && params.offset) ? params.offset : 0;
      const hasNoMoreUrls = offset + response.data.docs.length >= response.data.total ? true : false;
      let next_offset = response.data.offset+response.data.limit;
      dispatch(actions.visitorVisitsFetched({ entities: response.data.docs, email, hasNoMoreUrls, next_offset }));
    })
    .catch(error => {
      error.message = "Can't find visitor";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const visitorVisitsSeeLess = params => dispatch => {
  const { email } = params;
  dispatch(actions.visitorVisitsSeeLess({ email }));
};