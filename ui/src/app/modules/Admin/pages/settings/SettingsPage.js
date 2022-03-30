import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { CustomPackageEdit } from "./package-edit/CustomPackageEdit";
import { PackageEdit } from "./package-edit/PackageEdit";
import { CustomPackagesTable } from "./packages-table/CustomPackagesTable";
import { PackagesTable } from "./packages-table/PackagesTable";
import { SettingsCard } from "./SettingsCard";

export function SettingsPage({ history }) {

  return (
    <div className="d-flex flex-row">
      <SettingsCard />
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Redirect
            from="/admin/settings"
            exact={true}
            to="/admin/settings/packages"
          />
          <Route
            path="/admin/settings/packages/new"
            component={PackageEdit}
          />
          <Route
            path="/admin/settings/packages/edit/:id"
            component={PackageEdit}
          />
          <Route
            path="/admin/settings/packages"
            component={PackagesTable}
          />
          <Route
            path="/admin/settings/customPackages/new"
            component={CustomPackageEdit}
          />
          <Route
            path="/admin/settings/customPackages/edit/:id"
            component={CustomPackageEdit}
          />
          <Route
            path="/admin/settings/customPackages"
            component={CustomPackagesTable}
          />
        </Switch>
      </div>
    </div>
  );
}
