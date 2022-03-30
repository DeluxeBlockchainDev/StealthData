import React from "react";
import { Route, Switch } from "react-router-dom";
import { EmailCampaignEdit } from "./email-campaign-edit/EmailCampaignEdit";
import { EmailCampaignsTable } from "./emails-campaign-table/EmailCampaignsTable";

export function EmailCampaignPage({ history }) {

  return (
    <div className="d-flex flex-row">
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Route
            path="/:u?/:accountIndex?/emails/new"
            component={EmailCampaignEdit}
          />
          <Route
            path="/:u?/:accountIndex?/emails/edit/:id"
            component={EmailCampaignEdit}
          />
          <Route
            path="/:u?/:accountIndex?/emails"
            component={EmailCampaignsTable}
          />
        </Switch>
      </div>
    </div>
  );
}
