import React, { useMemo } from "react";
import { useClientsUIContext } from "../ClientsUIContext";

export function ClientsGrouping() {
  // Clients UI Context
  const clientsUIContext = useClientsUIContext();
  const clientsUIProps = useMemo(() => {
    return {
      ids: clientsUIContext.ids,
      setIds: clientsUIContext.setIds,
      openDeleteClientsDialog: clientsUIContext.openDeleteClientsDialog,
      openFetchClientsDialog: clientsUIContext.openFetchClientsDialog,
      openUpdateClientsStatusDialog:
        clientsUIContext.openUpdateClientsStatusDialog,
    };
  }, [clientsUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="-font-bold font-danger-">
                <span>
                  Selected records count: <b>{clientsUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={clientsUIProps.openDeleteClientsDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={clientsUIProps.openFetchClientsDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={clientsUIProps.openUpdateClientsStatusDialog}
              >
                <i className="fa fa-sync-alt"></i> Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
