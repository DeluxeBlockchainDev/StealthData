import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./ClientsUIHelpers";

const ClientsUIContext = createContext();

export function useClientsUIContext() {
  return useContext(ClientsUIContext);
}

export const ClientsUIConsumer = ClientsUIContext.Consumer;

export function ClientsUIProvider({customersUIEvents, children}) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const setQueryParams = useCallback(nextQueryParams => {
    setQueryParamsBase(prevQueryParams => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const initClient = {
    id: undefined,
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    gender: "Female",
    status: 0,
    dateOfBbirth: "",
    ipAddress: "",
    type: 1
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initClient,
    newClientButtonClick: customersUIEvents.newClientButtonClick,
    openEditClientPage: customersUIEvents.openEditClientPage,
    openDeleteClientDialog: customersUIEvents.openDeleteClientDialog,
    openDeleteClientsDialog: customersUIEvents.openDeleteClientsDialog,
    openFetchClientsDialog: customersUIEvents.openFetchClientsDialog,
    openUpdateClientsStatusDialog: customersUIEvents.openUpdateClientsStatusDialog
  };

  return <ClientsUIContext.Provider value={value}>{children}</ClientsUIContext.Provider>;
}