import * as requestFromServer from "./subscriptionsCrud";
import {subscriptionsSlice, callTypes} from "./subscriptionsSlice";

const {actions} = subscriptionsSlice;

export const fetchSubscriptions = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getSubscriptions(queryParams)
    .then(response => {
      // const { totalCount, entities } = response.data;
      dispatch(actions.subscriptionsFetched({ entities: response.data }));
    })
    .catch(error => {
      error.subscriptionMessage = "Can't find subscriptions";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const setActiveSubscription = activeSubscription => dispatch => dispatch(actions.setActiveSubscription({ activeSubscription }))

export const fetchSubscription = id => dispatch => {
  if (!id) {
    return dispatch(actions.subscriptionFetched({ subscriptionForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getSubscriptionById(id)
    .then(response => {
      let subscription = {...response.data};
      dispatch(actions.subscriptionFetched({ subscriptionForEdit: subscription }));
    })
    .catch(error => {
      error.subscriptionMessage = "Can't find subscription";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createSubscription = (subscriptionForCreation, cb) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createSubscription(subscriptionForCreation)
    .then(response => {
      const subscription = response.data;
      dispatch(actions.subscriptionCreated({ subscription }));
      if(cb) cb({ success:1, data: response.data });
    })
    .catch(error => {
      error.subscriptionMessage = "Can't create subscription";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      if(cb) cb({ success:0, data: error });
    });
};

export const updateSubscription = (subscription, cb) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateSubscription( subscription._id, subscription)
    .then(() => {
      dispatch(actions.subscriptionUpdated({ subscription }));
      if(cb) cb({ success:1, data: subscription });
    })
    .catch(error => {
      error.subscriptionMessage = "Can't update subscription";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      if(cb) cb({ success:0, data: error });
    });
};

export const clearSubscriptionError = () => dispatch => dispatch(actions.clearError({}));