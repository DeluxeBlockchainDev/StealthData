import React from "react";
import { Route, Switch } from "react-router-dom";
import { UrlTrackingTable } from "./url-tracking-table/UrlTrackingTable";

export function UrlTrackingPage({ history }) {

  return (
    <div className="d-flex flex-row">
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Route
            path="/:u?/:accountIndex?/urltracking"
            component={UrlTrackingTable}
          />
        </Switch>
      </div>
    </div>
  );
}