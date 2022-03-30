/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../../../_metronic/layout";
import { getLeadPriority } from "../../_redux/dashboard/dashboardApis";
import { shallowEqual, useSelector } from "react-redux";
import { getAccountIndex } from '../../../../../app/utils';

export function WeeklyLeadPriority({ className, chartColor = "danger" }) {
  const uiService = useHtmlClassService();
  const [priorityStats, setPriorityStats] = useState({
    mild: 0,
    warm: 0,
    hot: 0,
  });
  const today = new Date();
  const startOfWeek = new Date( today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0 );
  const endOfWeek = new Date( today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 0 );

  const accountIndex = getAccountIndex();
  const { clientData } = useSelector(
      (state) => ({
        clientData: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData : {},
      }),
      shallowEqual
  );
  
  // const { clientData } = useSelector(
  //   (state) => ({ clientData: state.auth.clientData }),
  //   shallowEqual
  // );

  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray500: objectPath.get(
        uiService.config,
        "js.colors.gray.gray500"
      ),
      colorsGrayGray300: objectPath.get(
        uiService.config,
        "js.colors.gray.gray300"
      ),
      colorsThemeDangerColor: objectPath.get(
        uiService.config,
        `js.colors.theme.base.danger`
      ),
      colorsThemeInfoColor: objectPath.get(
        uiService.config,
        `js.colors.theme.base.info`
      ),
      colorsThemeWarningColor: objectPath.get(
        uiService.config,
        `js.colors.theme.base.warning`
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById("kt_tiles_widget_1_pie_chart");

    if (!element) {
      return;
    }

    const data = [];
    const total = priorityStats.hot + priorityStats.warm + priorityStats.mild
    data.push(priorityStats.hot ? Math.ceil((priorityStats.hot/total) * 100) : 0);
    data.push(priorityStats.warm ? Math.ceil((priorityStats.warm/total) * 100) : 0);
    data.push(priorityStats.mild ? Math.ceil((priorityStats.mild/total) * 100) : 0);
    const options = getChartOption( layoutProps, data );
    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, priorityStats]);

  useEffect(() => {
    ( async () => {
      if( clientData.apps && clientData.apps.length && clientData.apps[0].loginAPIAccessKey ) {

        const result = await getLeadPriority({ loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey });
        let stats = { warm: 0, mild: 0, hot: 0 };
        for(let dat of result.data) stats[dat._id] = dat.count;
        setPriorityStats(stats);
      }
    })()
  }, [clientData.apps]);

  return (
    <>
      {/* begin::Tiles Widget 1 */}
      <div className={`card card-custom ${className}`}>
        {/* begin::Header */}
        <div className="card-header border-0 pt-5">
          <div className="card-title">
            <div className="card-label">
              <div className="font-weight-bolder">Monthly Lead Priority</div>
              <div className="font-size-sm text-muted mt-2">{today.toLocaleString('default', { month: 'long' })} {startOfWeek.getDate()}-{endOfWeek.getDate()}, {today.getFullYear()}</div>
            </div>
          </div>
          {/* <div className="card-toolbar">
            <Dropdown className="dropdown-inline" alignRight>
              <Dropdown.Toggle
                className="btn btn-clean btn-hover-light-primary btn-sm btn-icon"
                variant="transparent"
                id="dropdown-toggle-top"
                as={DropdownCustomToggler}
              >
                <i className="ki ki-bold-more-hor" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                <DropdownMenu4 />
              </Dropdown.Menu>
            </Dropdown>
          </div> */}
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className="card-body d-flex flex-column px-0 pt-2">
          {/* begin::Chart */}
          <div
            id="kt_tiles_widget_1_pie_chart"
            data-color={chartColor}
            style={{ height: "200px" }}
            className="mb-4"
          />
          {/* end::Chart */}

          {/* begin::Items */}
          <div className="flex-grow-1 card-spacer-x">
            {/* begin::Item */}
            <div className="d-flex align-items-center justify-content-between mb-10">
              <div className="d-flex align-items-center mr-2">
                <div className="symbol symbol-50 symbol-light mr-3 flex-shrink-0">
                  <div className="symbol-label rounded-circle ">
                    <div className="rounded-circle p-3 bg-danger" ></div>
                  </div>
                </div>
                <div>
                  <a
                    href="#"
                    className="font-size-h6 text-dark-75 text-hover-primary font-weight-bolder"
                  >
                    Hot Leads
                  </a>
                  {/* <div className="font-size-sm text-muted font-weight-bold mt-1">
                    Authors with the best sales
                  </div> */}
                </div>
              </div>
              <div className="label label-light label-inline font-weight-bold text-dark-50 py-4 px-3 font-size-base">
                {priorityStats.hot}
              </div>
            </div>
            {/* end::Item */}

            {/* begin::Item */}
            <div className="d-flex align-items-center justify-content-between mb-10">
              <div className="d-flex align-items-center mr-2">
                <div className="symbol symbol-50 symbol-light mr-3 flex-shrink-0">
                  <div className="symbol-label rounded-circle">
                    <div className="rounded-circle p-3 bg-warning" ></div>
                  </div>
                </div>
                <div>
                  <a
                    href="#"
                    className="font-size-h6 text-dark-75 text-hover-primary font-weight-bolder"
                  >
                    Warm
                  </a>
                  {/* <div className="font-size-sm text-muted font-weight-bold mt-1">
                    40% increased on week to week
                  </div> */}
                </div>
              </div>
              <div className="label label-light label-inline font-weight-bold text-dark-50 py-4 px-3 font-size-base">
                  {priorityStats.warm}
                </div>
            </div>
            {/* end::Item */}

            {/* begin::Item */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center mr-2">
                <div className="symbol symbol-50 symbol-light mr-3 flex-shrink-0">
                  <div className="symbol-label rounded-circle">
                    <div className="rounded-circle p-3 bg-info" ></div>
                  </div>
                </div>
                <div>
                  <a
                    href="#"
                    className="font-size-h6 text-dark-75 text-hover-primary font-weight-bolder"
                  >
                    Mild
                  </a>
                  {/* <div className="font-size-sm text-muted font-weight-bold mt-1">
                    Pitstop Email Marketing
                  </div> */}
                </div>
              </div>
              <div className="label label-light label-inline font-weight-bold text-dark-50 py-4 px-3 font-size-base">
                  {priorityStats.mild}
                </div>
            </div>
            {/* end::Item */}
          </div>
          {/* end::Items */}
        </div>
        {/* end::Body */}
      </div>
      {/* end::Tiles Widget 1 */}
    </>
  );
}

function getChartOption(layoutProps, data) {
  const options = {
    series: data,
    labels: ['Hot', 'Warm', 'Mild'],
    chart: {
      type: "pie",
      height: 200,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 1,
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily,
      },
      y: {
        formatter: function(val) {
          return val + "%";
        },
      },
    },
    colors: [layoutProps.colorsThemeDangerColor, layoutProps.colorsThemeWarningColor, layoutProps.colorsThemeInfoColor],
    markers: {
      // colors: [layoutProps.colorsThemeLightColor],
      // strokeColor: [layoutProps.colorsThemeBaseColor],
      strokeWidth: 3,
    },
    padding: {
      top: 0,
      bottom: 50,
    },
  };
  return options;
}
