import * as requestFromServer from "./clientsCrud";
import {clientsSlice, callTypes} from "./clientsSlice";
import cloneDeep from "lodash.clonedeep";

const {actions} = clientsSlice;

function buildFormData(formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey, value);
  }
}

export const fetchClients = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllClients(queryParams)
    .then(response => {
      // const { totalCount, entities } = response.data;
      dispatch(actions.clientsFetched({  entities: response.data.docs, totalCount: response.data.total }));
    })
    .catch(error => {
      error.message = "Can't find clients";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchClient = id => dispatch => {
  if (!id) {
    return dispatch(actions.clientFetched({ clientForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getClientById(id)
    .then(response => {
      let client = {...response.data};
      client['websiteUrl'] = client.apps[0].url;

      dispatch(actions.clientFetched({ clientForEdit: client }));
    })
    .catch(error => {
      error.message = "Can't find client";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteClient = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteClient(id)
    .then(response => {
      dispatch(actions.clientDeleted({ id }));
    })
    .catch(error => {
      error.message = "Can't delete client";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createClient = (clientForCreation, cb) => dispatch => {
  let finalValues = {...clientForCreation};
  finalValues['apps'] = [{
    url: finalValues.websiteUrl,
  }]
  delete finalValues.websiteUrl;
  let formData = new FormData();
  buildFormData( formData, finalValues );

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createClient(formData)
    .then(response => {
      const client = response.data;
      dispatch(actions.clientCreated({ client }));
      if(cb) cb({ success: 1, data: client });
    })
    .catch(error => {
      error = error.message || "Can't create client";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      if(cb) cb({ success: 0, data: error });
    });
};

export const updateClient = (client, cb) => dispatch => {
  let finalValues = cloneDeep(client);
  finalValues['apps'][0].url = finalValues.websiteUrl;
  delete finalValues.websiteUrl;
  let formData = new FormData();
  buildFormData( formData, finalValues );
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateClient( client._id, formData)
    .then(() => {
      dispatch(actions.clientUpdated({ client }));
      if(cb) cb({ success: 1, data: client });
    })
    .catch(error => {
      error = error.message || "Can't update client";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      if(cb) cb({ success: 0, data: error });
    });
};

export const updateClientsStatus = (ids, status) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForClients(ids, status)
    .then(() => {
      dispatch(actions.clientsStatusUpdated({ ids, status }));
    })
    .catch(error => {
      error.message = "Can't update clients status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const toggleClient = (id, status) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .toggleClient(id, status)
    .then((response) => {
      dispatch(actions.clientToggled({ id, status: response.data.clientStatus }));
    })
    .catch(error => {
      error.message = "Can't toggle client.";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};


export const deleteClients = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteClients(ids)
    .then(() => {
      dispatch(actions.clientsDeleted({ ids }));
    })
    .catch(error => {
      error.message = "Can't delete clients";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateClientForEdit = (clientForEdit) => dispatch => dispatch(actions.updateClientForEdit({clientForEdit}))

export const setClientErrors = (error) => dispatch => dispatch(actions.setError({ error }));
export const clearClientErrors = () => dispatch => dispatch(actions.clearError({}));


export const fetchLeadPriority = params => dispatch => {
  
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getLeadPriority(params)
    .then(response => {
      let data = {...response.data};

      dispatch(actions.leadPriorityFetched({ data: data }));
    })
    .catch(error => {
      error.message = "Can't find client";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const postLeadPriority = (clientId, params) => dispatch => {
  
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateLeadPriority(clientId, params)
    .then(response => {
      
      let data = {...response};
      
      let params = {client_id: clientId, page:1, limit:10};
      dispatch(fetchLeadPriority(params));
      return data;
    })
    .catch(error => {
      error.message = "Can't find client";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};


export const updateRecorrectVisitCount = (clientId) => dispatch => {
  
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .recorrectVisitCount(clientId)
    .then(response => {
      dispatch(actions.endCall({ callType: callTypes.action }));
      let data = {...response};
      return data;
    })
    .catch(error => {
      error.message = "Can't find client";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};


export const accessClientAccount = (id) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .accessClientAccount(id)
    .then((response) => {
      if(response.data){
        let lsData = localStorage.getItem('persist:v713-demo1-auth')
        let multiAuthData = []
        let clientIndex = 0;
        if(lsData){
          lsData = JSON.parse(lsData)
          if(lsData.multiAuth){
            let array = JSON.parse(lsData.multiAuth);
            multiAuthData = array.multiAuthData;
          }
          let index = multiAuthData.findIndex((value) => {
            return value.user.id == response.data.user.id
          })
          if(index >= 0){
            clientIndex = index;
            multiAuthData[index] = response.data;
          }else{
            multiAuthData.push(response.data)
            clientIndex = multiAuthData.length - 1;
          }
        }
        lsData.multiAuth = JSON.stringify({multiAuthData:multiAuthData})
        localStorage.setItem('persist:v713-demo1-auth',JSON.stringify(lsData))
        return clientIndex;
      }
      
      //dispatch(actions.clientToggled({ id, status: response.data.clientStatus }));
    })
    .catch(error => {
      error.message = "Can't toggle client.";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};