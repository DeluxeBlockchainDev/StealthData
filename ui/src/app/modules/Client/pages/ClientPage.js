import React, { Suspense } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { CrmPage } from "./crm-matching/CrmPage";
import { Dashboard } from "./dashboard/Dashboard";
import { EmailCampaignPage } from "./email-campaign/EmailCampaignPage";
import { InvoicePage } from "./invoices/InvoicePage";
import { SettingPage } from "./settings/SettingPage";
import { InvoiceView } from "./invoices/InvoiceView";
import { BillingProfile } from "./profile/BillingProfile";
import { Profile } from "./profile/Profile";
import { VisitorsPage } from "./visitors/VisitorsPage";
import { UrlTrackingPage } from "./urltracking/UrlTrackingPage";
import { getAccountIndex } from '../../../utils';

export default function ClientPage() {
  const accountIndex = getAccountIndex();
  const { activeSubscription } = useSelector(
      (state) => ({
        activeSubscription: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData.activeSubscription : {},
      }),
      shallowEqual
  );
  //const { activeSubscription } = useSelector((state) => ({ activeSubscription: state.subscriptions.activeSubscription }), shallowEqual);

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from eCommerce root URL to /clients */
          <Redirect
            exact={true}
            from="/"
            to={ activeSubscription && activeSubscription.isDashboardAllowed ? "/:u?/:accountIndex?/dashboard" : '/:u?/:accountIndex?/visitors' }
          />
        }
        <ContentRoute path="/:u?/:accountIndex?/visitors" component={VisitorsPage} />
        {
          activeSubscription && activeSubscription.isDashboardAllowed &&
          <ContentRoute path="/:u?/:accountIndex?/dashboard" component={Dashboard} />
        }
        {
          activeSubscription && activeSubscription.isEmailCampaignsAllowed &&
          <ContentRoute path="/:u?/:accountIndex?/emails" component={EmailCampaignPage} />
        }
        <ContentRoute path="/:u?/:accountIndex?/crm-matching" component={CrmPage} />

        <ContentRoute path="/:u?/:accountIndex?/user-profile" component={Profile} />
        <ContentRoute path="/:u?/:accountIndex?/packages-and-billing" component={BillingProfile} />
        <ContentRoute path="/:u?/:accountIndex?/invoices/:id" component={InvoiceView} />
        <ContentRoute path="/:u?/:accountIndex?/invoices" component={InvoicePage} />
        <ContentRoute path="/:u?/:accountIndex?/settings" component={SettingPage} />
        <ContentRoute path="/:u?/:accountIndex?/urltracking" component={UrlTrackingPage} />
      </Switch>
    </Suspense>
  );
}
