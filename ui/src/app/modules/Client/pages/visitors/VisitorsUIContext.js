import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./VisitorsUIHelpers";

const VisitorsUIContext = createContext();

export function useVisitorsUIContext() {
  return useContext(VisitorsUIContext);
}

export const VisitorsUIConsumer = VisitorsUIContext.Consumer;

export function VisitorsUIProvider({visitorsUIEvents, children}) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
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

  const initVisitor = {
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
    setQueryParams,
    initVisitor,
    openVisitorsExportDialog: visitorsUIEvents.openVisitorsExportDialog,
  };

  return <VisitorsUIContext.Provider value={value}>{children}</VisitorsUIContext.Provider>;
}