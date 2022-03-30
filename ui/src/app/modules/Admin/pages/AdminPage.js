import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ClientsPage } from "./clients/ClientsPage";
import { ClientEdit } from "./clients/client-edit/ClientEdit";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { SettingsPage } from "./settings/SettingsPage";

export default function AdminPage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from eCommerce root URL to /clients */
          <Redirect
            exact={true}
            from="/admin"
            to="/admin/clients"
          />
        }
				 <ContentRoute
          path="/admin/clients/:id/edit"
          component={ClientEdit}
        />
        <ContentRoute path="/admin/clients/new" component={ClientEdit} />
        <ContentRoute path="/admin/clients" component={ClientsPage} />
        <ContentRoute path="/admin/settings" component={SettingsPage} />
      </Switch>
    </Suspense>
  );
}
