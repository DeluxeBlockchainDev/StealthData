import React from "react";
import { Route } from "react-router-dom";
import { VisitorsExportDialog } from "./visitors-export-dialog/VisitorsExportDialog";
import { VisitorsTable } from "./VisitorsTable";
// import { VisitorsLoadingDialog } from "./visitors-loading-dialog/VisitorsLoadingDialog";
// import { VisitorDeleteDialog } from "./visitor-delete-dialog/VisitorDeleteDialog";
// import { VisitorsDeleteDialog } from "./customers-delete-dialog/VisitorsDeleteDialog";
// import { VisitorsFetchDialog } from "./customers-fetch-dialog/VisitorsFetchDialog";
// import { VisitorsUpdateStateDialog } from "./customers-update-status-dialog/VisitorsUpdateStateDialog";
import { VisitorsUIProvider } from "./VisitorsUIContext";
// import { VisitorsCard } from "./VisitorsCard";

export function VisitorsPage({ history }) {
  const visitorsUIEvents = {
    newVisitorButtonClick: () => {
      history.push("/admin/visitors/new");
    },
    openEditVisitorPage: (id) => {
      history.push(`/admin/visitors/${id}/edit`);
    },
    openDeleteVisitorDialog: (id) => {
      history.push(`/admin/visitors/${id}/delete`);
    },
    openDeleteVisitorsDialog: () => {
      history.push(`/admin/visitors/deleteVisitors`);
    },
    openFetchVisitorsDialog: () => {
      history.push(`/admin/visitors/fetch`);
    },
    openUpdateVisitorsStatusDialog: () => {
      history.push("/admin/visitors/updateStatus");
    },
    openVisitorsExportDialog: () => {
      history.push("/visitors/export");
    }
  }

  return (
    <VisitorsUIProvider visitorsUIEvents={visitorsUIEvents}>
      {/* <VisitorsLoadingDialog /> */}
      <Route path="/visitors/export">
        {({ history, match }) => (
          <VisitorsExportDialog
            show={match != null}
            onHide={() => {
              history.push("/visitors");
            }}
          />
        )}
      </Route>
      {/* <Route path="/admin/visitors/:id/delete">
        {({ history, match }) => (
          <VisitorDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/admin/visitors");
            }}
          />
        )}
      </Route> */}
      {/* <Route path="/admin/visitors/deleteVisitors">
        {({ history, match }) => (
          <VisitorsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/admin/visitors");
            }}
          />
        )}
      </Route>
      <Route path="/admin/visitors/fetch">
        {({ history, match }) => (
          <VisitorsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/admin/visitors");
            }}
          />
        )}
      </Route>
      <Route path="/admin/customers/updateStatus">
        {({ history, match }) => (
          <VisitorsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/admin/customers");
            }}
          />
        )}
      </Route> */}
      {/* <VisitorsCard /> */}
      <VisitorsTable className="card-stretch gutter-b" />
    </VisitorsUIProvider>
  );
}
