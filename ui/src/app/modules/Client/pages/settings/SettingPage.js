import React from "react";
import { Route, Switch } from "react-router-dom";
import { UrlSettingsTable } from "./url-settings-table/UrlSettingsTable";
import { LeadPrioritySettings } from "./LeadPrioritySettings";

export function SettingPage(props) {
  const { match : { params } } = props;
  return (
    <div className="d-flex flex-row">
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Route
            path="/:u?/:accountIndex?/settings"
            component={UrlSettingsTable}
          />
        </Switch>
        {/* <UrlSettingsTable /> */}
        <LeadPrioritySettings accountIndex={params.accountIndex}/>
      </div>
    </div>

    
  );
}
