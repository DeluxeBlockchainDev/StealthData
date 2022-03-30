/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { getTopVisitors } from "../../_redux/dashboard/dashboardApis";
import { DropdownCustomToggler } from "../../../../../_metronic/_partials/dropdowns";
import { shallowEqual, useSelector } from "react-redux";
import { getAccountIndex } from '../../../../../app/utils';
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function TopVisitors({ className }) {
  const today = new Date();
  const toggleRef = useRef();
  const [activeTab, setActiveTab] = useState(MONTHS[today.getMonth()]);
  const [topVisitors, setTopVisitors] = useState([]);
  const accountIndex = getAccountIndex();
  const { activeSubscription, clientData } = useSelector(
    (state) => ({
      clientData: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData : {},
      activeSubscription: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData.activeSubscription : {},
    }),
    shallowEqual
  );

  // const { activeSubscription } = useSelector((state) => ({ activeSubscription: state.subscriptions.activeSubscription }), shallowEqual);
  // const { clientData } = useSelector(
  //   (state) => ({ clientData: state.auth.clientData }),
  //   shallowEqual
  // );

  useEffect(() => {
    (async () => {
      if (clientData.apps && clientData.apps.length && clientData.apps[0].loginAPIAccessKey) {
        const result = await getTopVisitors({ filters: { month: today.getMonth() }, loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey });
        setTopVisitors(result.data);
      }
    })()
  }, [clientData.apps]);

  const handleClick = async (ev, tab, index) => {
    ev.preventDefault();
    setActiveTab(tab);
    const result = await getTopVisitors({ filters: { month: index }, loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey });
    setTopVisitors(result.data);
    toggleRef.current.click();
  }

  return (
    <>
      {/* begin::Base Table Widget 6 */}
      <div className={`card card-custom ${className}`}>
        {/* begin::Header */}
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              Top Visitors
            </span>
          </h3>
          <div className="card-toolbar">
            <ul className="nav nav-pills nav-pills-sm nav-dark-75">
              <li className="nav-item">
                <Dropdown className="dropdown-inline" alignRight>
                  <Dropdown.Toggle
                    className="btn btn-clean btn-hover-light-primary btn-sm btn-light"
                    variant="transparent"
                    id="dropdown-toggle-top"
                    as={DropdownCustomToggler}
                    ref={toggleRef}
                  >
                    {activeTab}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                    <ul className="navi navi-hover py-5">
                      {
                        MONTHS.map((m, i) =>
                          <li className="navi-item" key={i}>
                            <a href="#" onClick={(e) => handleClick(e, m, i)} className="navi-link">
                              <span className="navi-text">{m}</span>
                            </a>
                          </li>
                        )
                      }
                    </ul>
                  </Dropdown.Menu>
                </Dropdown>
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
                  <th className="p-0" style={{ width: "50px" }} />
                  <th className="p-0" style={{ minWidth: "150px" }} />
                  {activeSubscription && activeSubscription.isVisits && <th className="p-0" style={{ minWidth: "50px" }} />}
                </tr>
              </thead>
              <tbody>
                {
                  topVisitors.map((visitor, i) =>
                    <tr key={i}>
                      {/* <td className="pl-0">
                      <div className="symbol symbol-50 symbol-light mr-2 mt-2">
                        <img src={`/media/users/default.jpg`} alt="" style={{ width: "50px" }} />
                      </div>
                    </td> */}
                      <td className="pl-0">
                        <a
                          href="#"
                          className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg"
                        >
                          {visitor.firstName} {visitor.lastName}
                        </a>
                        <span className="text-muted font-weight-bold d-block">
                          {visitor.email}
                        </span>
                      </td>
                      {activeSubscription && activeSubscription.isVisits && <td className="text-right pr-0">
                        <button className="btn btn-icon btn-light btn-sm">
                          {visitor.monthlyVisitCount}
                        </button>
                      </td>}
                    </tr>)
                }
              </tbody>
            </table>
          </div>
          {/* end::Table */}
        </div>
        {/* end::Body */}
      </div>
      {/* end::Base Table Widget 6 */}
    </>
  );
}
