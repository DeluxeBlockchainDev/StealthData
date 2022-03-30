import * as requestFromServer from "./urlSettingsCrud";
import {urlSettingsSlice, callTypes} from "./urlSettingsSlice";

const {actions} = urlSettingsSlice;

export const fetchUrlSettings = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getUrlSettings(queryParams)
    .then(response => {
      // const { totalCount, entities } = response.data;
      dispatch(actions.urlSettingsFetched({ entities: response.data }));
    })
    .catch(error => {
      error.urlSettingsMessage = "Can't find URL Settings";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const setActiveUrlSetting = activeUrlSetting => dispatch => dispatch(actions.setActiveUrlSetting({ activeUrlSetting }))

export const fetchUrlSetting = id => dispatch => {
  if (!id) {
    return dispatch(actions.urlSettingFetched({ urlSettingForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getUrlSettingById(id)
    .then(response => {
      let urlSetting = {...response.data};
      dispatch(actions.urlSettingFetched({ urlSettingForEdit: urlSetting }));
    })
    .catch(error => {
      error.urlSettingsMessage = "Can't find URL Setting";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createUrlSetting = (urlSettingForCreation, cb) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createUrlSetting(urlSettingForCreation)
    .then(response => {
      const urlSetting = response.data;
      dispatch(actions.urlSettingCreated({ urlSetting }));
      if(cb) cb({ success:1, data: urlSetting });
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      if(cb) cb({ success:0, data: error });
    });
};

export const updateUrlSetting = (urlSetting, cb ) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateUrlSetting( urlSetting._id, urlSetting)
    .then(() => {
      dispatch(actions.urlSettingUpdated({ urlSetting }));
      if(cb) cb({ success:1, data: urlSetting });
    })
    .catch(error => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      if(cb) cb({ success:0, data: error });
    });
};

export const clearUrlSettingError = () => dispatch => dispatch(actions.clearError({}));
export const setUrlSettingError = (error) => dispatch => dispatch(actions.setError({ error }));
