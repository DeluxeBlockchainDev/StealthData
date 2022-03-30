/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../../../_metronic/layout";
import { getVisitorStats } from "../../_redux/dashboard/dashboardApis";
import { shallowEqual, useSelector } from "react-redux";
import { getAccountIndex } from '../../../../../app/utils';

export function VisitorStats({ className, chartColor = "danger" }) {
  const accountIndex = getAccountIndex();
    const { activeSubscription, clientData } = useSelector(
        (state) => ({
          clientData: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData : {},
          activeSubscription: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData.activeSubscription : {},
        }),
        shallowEqual
    );

  //const { activeSubscription } = useSelector((state) => ({ activeSubscription: state.subscriptions.activeSubscription }), shallowEqual);
  const uiService = useHtmlClassService();
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalVisitorsIdentified: 0,
    totalCrmMatched: 0,
    dailyVisitorData: []
  });
  const today = new Date();
  const startOfWeek = new Date( today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0 );
  const endOfWeek = new Date( today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 0 );

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
      colorsThemeBaseColor: objectPath.get(
        uiService.config,
        `js.colors.theme.base.primary`
      ),
      colorsThemeLightColor: objectPath.get(
        uiService.config,
        `js.colors.theme.light.primary`
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById("kt_tiles_widget_1_chart");

    if (!element) {
      return;
    }

    const dailyVisitorData = stats.dailyVisitorData;
    const options = getChartOption(layoutProps, dailyVisitorData.map((d) => d.count),  dailyVisitorData.map((d) => d.label));
    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, stats]);

  useEffect(() => {
    ( async () => {
      if( clientData.apps && clientData.apps.length && clientData.apps[0].loginAPIAccessKey ) {
        const result = await getVisitorStats({ loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey });
        let newStats = { ...stats };
        if(result.data.totalVisitorsIdentified) newStats['totalVisitorsIdentified'] = result.data.totalVisitorsIdentified;
        if(result.data.totalVisitors) newStats['totalVisitors'] = result.data.totalVisitors;
        if(result.data.dailyVisitorData) newStats['dailyVisitorData'] = result.data.dailyVisitorData;
        if(result.data.totalCrmMatched) newStats['totalCrmMatched'] = result.data.totalCrmMatched;
        setStats(newStats);
      }  
    })()
  }, [clientData.apps, stats]);
  
  return (
    <>
      {/* begin::Tiles Widget 1 */}
      <div className={`card card-custom ${className}`}>
        {/* begin::Header */}
        <div className="card-header border-0 pt-5">
          <div className="card-title">
            <div className="card-label">
              <div className="font-weight-bolder">Monthly Visitor Stats</div>
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
        <div className="card-body d-flex flex-column px-0">
          {/* begin::Chart */}
          <div
            id="kt_tiles_widget_1_chart"
            data-color={chartColor}
            style={{ height: "170px" }}
            className="mb-5"
          />
          {/* end::Chart */}

          {/* begin::Items */}
          <div className="flex-grow-1 card-spacer-x">
            {/* begin::Item */}
            <div className="d-flex align-items-center justify-content-between mb-10">
              <div className="d-flex align-items-center mr-2">
                <div className="symbol symbol-50 symbol-light mr-3 flex-shrink-0">
                  <div className="symbol-label">
                    <span className="svg-icon">
                      <i className="fa fa-users text-primary"></i>
                    </span>
                  </div>
                </div>
                <div>
                  <a
                    href="#"
                    className="font-size-h6 text-dark-75 text-hover-primary font-weight-bolder"
                  >
                    Identified Visitors
                  </a>
                  {/* <div className="font-size-sm text-muted font-weight-bold mt-1">
                    Ricky Hunt, Sandra Trepp
                  </div> */}
                </div>
              </div>
              <div className="label label-light label-inline font-weight-bold text-dark-50 py-4 px-3 font-size-base">
                {stats.totalVisitorsIdentified}
              </div>
            </div>
            {/* end::Item */}

            {/* begin::Item */}
            {/* <div className="d-flex align-items-center justify-content-between mb-10">
              <div className="d-flex align-items-center mr-2">
                <div className="symbol symbol-50 symbol-light mr-3 flex-shrink-0">
                  <div className="symbol-label">
                    <span className="svg-icon">
                      <i className="fa fa-bullseye text-danger"></i>
                    </span>
                  </div>
                </div>
                <div>
                  <a
                    href="#"
                    className="font-size-h6 text-dark-75 text-hover-primary font-weight-bolder"
                  >
                    Total Visitors
                  </a>
                  <div className="font-size-sm text-muted font-weight-bold mt-1">
                    Pitstop Email Marketing
                  </div>
                </div>
              </div>
              <div className="label label-light label-inline font-weight-bold text-dark-50 py-4 px-3 font-size-base">
                {stats.totalVisitors}
              </div>
            </div> */}
            {/* end::Item */}

            {/* begin::Item */}
            {activeSubscription && activeSubscription.isCrmMatched && 
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center mr-2">
                <div className="symbol symbol-50 symbol-light mr-3 flex-shrink-0">
                  <div className="symbol-label">
                    <span className="svg-icon">
                      <i className="fa fa-bullseye text-danger"></i>
                    </span>
                  </div>
                </div>
                <div>
                  <a
                    href="#"
                    className="font-size-h6 text-dark-75 text-hover-primary font-weight-bolder"
                  >
                    CRM Matched
                  </a>
                  {/* <div className="font-size-sm text-muted font-weight-bold mt-1">
                    KT.com solution provider
                  </div> */}
                </div>
              </div>
              <div className="label label-light label-inline font-weight-bold text-dark-50 py-4 px-3 font-size-base">
                {stats.totalCrmMatched}
              </div>
            </div>}
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

function getChartOption(layoutProps, data, categories) {
  const options = {
    series: [
      {
        name: "Daily Visitors",
        data: data,
      },
    ],
    chart: {
      type: "area",
      height: 170,
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
    fill: {
      type: "gradient",
      opacity: 1,
      gradient: {
        type: "vertical",
        shadeIntensity: 0.55,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.2,
        stops: [25, 50, 100],
        colorStops: [],
      },
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [layoutProps.colorsThemeBaseColor],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
    },
    yaxis: {
      min: 0,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
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
          return val;
        },
      },
    },
    colors: [layoutProps.colorsThemeLightColor],
    markers: {
      colors: [layoutProps.colorsThemeLightColor],
      strokeColor: [layoutProps.colorsThemeBaseColor],
      strokeWidth: 3,
    },
    padding: {
      top: 10,
      bottom: 10,
    },
  };
  return options;
}
