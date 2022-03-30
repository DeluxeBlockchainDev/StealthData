import React from "react";
import { Route } from "react-router-dom";
import { ClientsLoadingDialog } from "./clients-loading-dialog/ClientsLoadingDialog";
import { ClientDeleteDialog } from "./client-delete-dialog/ClientDeleteDialog";
// import { ClientsDeleteDialog } from "./customers-delete-dialog/ClientsDeleteDialog";
// import { ClientsFetchDialog } from "./customers-fetch-dialog/ClientsFetchDialog";
// import { ClientsUpdateStateDialog } from "./customers-update-status-dialog/ClientsUpdateStateDialog";
import { ClientsUIProvider } from "./ClientsUIContext";
import { ClientsCard } from "./ClientsCard";

export function ClientsPage({ history }) {
  const customersUIEvents = {
    newClientButtonClick: () => {
      history.push("/admin/clients/new");
    },
    openEditClientPage: (id) => {
      history.push(`/admin/clients/${id}/edit`);
    },
    openDeleteClientDialog: (id) => {
      history.push(`/admin/clients/${id}/delete`);
    },
    openDeleteClientsDialog: () => {
      history.push(`/admin/clients/deleteClients`);
    },
    openFetchClientsDialog: () => {
      history.push(`/admin/clients/fetch`);
    },
    openUpdateClientsStatusDialog: () => {
      history.push("/admin/clients/updateStatus");
    }
  }

  return (
    <ClientsUIProvider customersUIEvents={customersUIEvents}>
      <ClientsLoadingDialog />
      <Route path="/admin/clients/:id/delete">
        {({ history, match }) => (
          <ClientDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/admin/clients");
            }}
          />
        )}
      </Route>
      {/* <Route path="/admin/clients/deleteClients">
        {({ history, match }) => (
          <ClientsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/admin/clients");
            }}
          />
        )}
      </Route>
      <Route path="/admin/clients/fetch">
        {({ history, match }) => (
          <ClientsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/admin/clients");
            }}
          />
        )}
      </Route>
      <Route path="/admin/customers/updateStatus">
        {({ history, match }) => (
          <ClientsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/admin/customers");
            }}
          />
        )}
      </Route> */}
      <ClientsCard />
    </ClientsUIProvider>
  );
}
