import React, {useMemo} from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../_metronic/_partials/controls";
import { ClientsFilter } from "./clients-filter/ClientsFilter";
import { ClientsTable } from "./clients-table/ClientsTable";
import { ClientsGrouping } from "./clients-grouping/ClientsGrouping";
import { useClientsUIContext } from "./ClientsUIContext";

export function ClientsCard() {
  const clientsUIContext = useClientsUIContext();
  const clientsUIProps = useMemo(() => {
    return {
      ids: clientsUIContext.ids,
      queryParams: clientsUIContext.queryParams,
      setQueryParams: clientsUIContext.setQueryParams,
      newClientButtonClick: clientsUIContext.newClientButtonClick,
      openDeleteClientsDialog: clientsUIContext.openDeleteClientsDialog,
      openEditClientPage: clientsUIContext.openEditClientPage,
      openUpdateClientsStatusDialog:
        clientsUIContext.openUpdateClientsStatusDialog,
      openFetchClientsDialog: clientsUIContext.openFetchClientsDialog,
    };
  }, [clientsUIContext]);

  return (
    <Card>
      <CardHeader title="Clients list">
        {/* <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={clientsUIProps.newClientButtonClick}
          >
            New Client
          </button>
        </CardHeaderToolbar> */}
      </CardHeader>
      <CardBody>
        <ClientsFilter />
        {clientsUIProps.ids.length > 0 && (
          <>
            <ClientsGrouping />
          </>
        )}
        <ClientsTable />
      </CardBody>
    </Card>
  );
}
