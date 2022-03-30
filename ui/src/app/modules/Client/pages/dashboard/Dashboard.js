import React from "react";
import { TopVisitors } from "./TopVisitors";
import { VisitorStats } from './VisitorStats';
import { WeeklyEmailStats } from "./WeeklyEmailStats";
import { WeeklyLeadPriority } from "./WeeklyLeadPriority";
import { WeeklyUrl } from "./WeeklyUrl";

import { shallowEqual, useSelector } from "react-redux";
import { getAccountIndex } from '../../../../../app/utils';

export function Dashboard() {  
  console.log('comes on dashboard....')
  const accountIndex = getAccountIndex();
  const { activeSubscription } = useSelector(
      (state) => ({
        activeSubscription: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData.activeSubscription : {},
      }),
      shallowEqual
  );
        console.log("activeSubscription.....",activeSubscription)
  //const { activeSubscription } = useSelector((state) => ({ activeSubscription: state.subscriptions.activeSubscription }), shallowEqual);
  return (
    <>
    {/* begin::Row */}
        <div className="row">
          <div className="col-xl-4">
            <VisitorStats className="gutter-b card-stretch" chartColor="danger" />
          </div>
          <div className="col-xl-4">
            <WeeklyLeadPriority className="gutter-b card-stretch" />
          </div>

          <div className="col-xl-4">
            {activeSubscription && activeSubscription.isEmailCampaignsAllowed && <WeeklyEmailStats className="gutter-b card-stretch" />}
          </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-xl-8">
          <WeeklyUrl className="card-stretch gutter-b" />
        </div>
        <div className="col-xl-4">
          <TopVisitors className="card-stretch gutter-b" />
        </div>
      </div>
      {/* end::Row */}

      {/* end::Dashboard */}
    </>
  );
}
