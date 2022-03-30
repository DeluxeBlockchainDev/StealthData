/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { getTopUrls } from "../../_redux/dashboard/dashboardApis";
import { shallowEqual, useSelector } from "react-redux";
import { getAccountIndex } from '../../../../../app/utils';

export function WeeklyUrl({ className }) {
  const tabs = {
    tab1: "month",
    tab2: "week",
    tab3: "day",
  };
  const [activeTab, setActiveTab] = useState(tabs.tab2);
  const [topUrls, setTopUrls] = useState([]);

  const accountIndex = getAccountIndex();
  const { activeSubscription, clientData } = useSelector(
    (state) => ({
      clientData: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData : {},
      activeSubscription: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData.activeSubscription : {},
    }),
    shallowEqual
  );

  // const { clientData } = useSelector(
  //   (state) => ({ clientData: state.auth.clientData }),
  //   shallowEqual
  // );
  
  // const { activeSubscription } = useSelector((state) => ({ activeSubscription: state.subscriptions.activeSubscription }), shallowEqual);

  useEffect(() => {
    
    ( async () => {
      if( clientData.apps && clientData.apps.length && clientData.apps[0].loginAPIAccessKey ) {
        const result = await getTopUrls({ loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey, filters: { type: activeTab }});
        setTopUrls(result.data.map((dat) => ({ ...dat, displayUrl: dat._id.replace(/^http:\/\/www.|https:\/\/www.|https:\/\/|http:\/\//,'') , seeMoreActive: false })));  
      }
    })()
  }, [activeTab, clientData.apps]);
  
  const toggleSeeMore = ( event, index, value) => {
    event.preventDefault();
    const clonedUrls = [...topUrls];
    clonedUrls[index].seeMoreActive = value;
    setTopUrls(clonedUrls)
  };

  return (
    <>
      {/* begin::Base Table Widget 2 */}
      <div className={`card card-custom ${className}`}>
        {/* begin::Header */}
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              Top 5 URLs
            </span>
            {/* <span className="text-muted mt-3 font-weight-bold font-size-sm">
              More than 400+ new members
            </span> */}
          </h3>
          <div className="card-toolbar">
            <ul className="nav nav-pills nav-pills-sm nav-dark-75">
              <li className="nav-item" key="month">
                <a
                  className={`nav-link py-2 px-4 ${activeTab === tabs.tab1 &&
                    "active"}`}
                  data-toggle="tab"
                  href={`#${tabs.tab1}`}
                  onClick={() => setActiveTab(tabs.tab1)}
                >
                  Month
                </a>
              </li>
              <li className="nav-item" key="week">
                <a
                  className={`nav-link py-2 px-4 ${activeTab === tabs.tab2 &&
                    "active"}`}
                  data-toggle="tab"
                  href={`#${tabs.tab2}`}
                  onClick={() => setActiveTab(tabs.tab2)}
                >
                  Week
                </a>
              </li>
              <li className="nav-item" key="day">
                <a
                  className={`nav-link py-2 px-4 ${activeTab === tabs.tab3 &&
                    "active"}`}
                  data-toggle="tab"
                  href={`#${tabs.tab3}`}
                  onClick={() => setActiveTab(tabs.tab3)}
                >
                  Day
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className="card-body pt-2 pb-0">
          {/* begin::Table */}
          <div className="table-responsive">
            <table className="table table-borderless table-vertical-center">
              <thead>
                <tr>
                  <th className="p-0" style={{ width: "50px" }}></th>
                  <th className="p-0" style={{ minWidth: "250px" }}></th>
                  {/* <th className="p-0" style={{ minWidth: "140px" }}></th> */}
                  {activeSubscription && activeSubscription.isUrlsViewed && <th className="p-0" style={{ minWidth: "120px" }}></th>}
                  <th className="p-0" style={{ minWidth: "40px" }}></th>
                </tr>
              </thead>
              <tbody>
                {
                  topUrls && topUrls.map((url,i) => 
                    <tr key={i}>
                      <td className="pl-0 py-5">
                        <div className="symbol symbol-50 symbol-light mr-2">
                          <span className="symbol-label">
                            <i className="fa fa-desktop text-primary"></i>
                          </span>
                        </div>
                      </td>
                      <td className="pl-0" style={{ maxWidth: "500px" }}>
                        <a
                          href={url._id}
                          target="blank"
                          className="text-dark font-weight-bold text-hover-primary mb-1 font-size-lg"
                        >
                          {url.displayUrl.substring( 0, !!url.seeMoreActive ? Infinity : 100 )}{ !url.seeMoreActive && url.displayUrl.length > 100 && '...'}
                        </a>
                        <div className="text-primary font-weight small">
                          {
                            !url.seeMoreActive && url.displayUrl.length > 100 && <a className="" onClick={(e) => toggleSeeMore( e, i, true)}>See More</a>
                          }
                          {
                            !!url.seeMoreActive && <a className="" onClick={(e) => toggleSeeMore( e, i, false)}>See Less</a>
                          }
                        </div>
                        <div className="text-muted font-weight-bold">
                        Last visited by: {url.email}
                        </div>
                      </td>
                      {/* <td className="text-right">
                        <span className="text-muted font-weight-bold">
                          Last visited by: {url.email}
                        </span>
                      </td> */}
                      {activeSubscription && activeSubscription.isUrlsViewed && <td className="text-right">
                        <span className="text-muted font-weight-bold">
                          {url.count} Visits
                        </span>
                      </td>}
                      <td className="text-right pr-0">
                        <a 
                          href={url._id}
                          target="blank"
                          className="btn btn-icon btn-light btn-sm">
                          <span className="svg-icon svg-icon-md svg-icon-success">
                            <SVG
                              src={toAbsoluteUrl(
                                "/media/svg/icons/Navigation/Arrow-right.svg"
                              )}
                            ></SVG>
                          </span>
                        </a>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
          {/* end::Table */}
        </div>
        {/* end::Body */}
      </div>
      {/* end::Base Table Widget 2 */}
    </>
  );
}