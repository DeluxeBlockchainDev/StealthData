/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../../../_metronic/layout";
import { getEmailStats } from "../../_redux/dashboard/dashboardApis";

let openedPieChart;
let clickPieChart;
let unsubscribedPieChart;

export function WeeklyEmailStats({ className, chartColor = "warning" }) {
  const uiService = useHtmlClassService();
  const [stats, setStats] = useState({
    opened: 0,
    clicked: 0,
    linksClicked : 0,
    unsubscribed: 0,
    totalUnsubscribed : 0,
    emailsSent: 0,
    emailsOpened : 0,
    emailsDelivered: 0
  });
  const today = new Date();
  const startOfWeek = new Date( today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0 );
  const endOfWeek = new Date( today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 0 );

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
        `js.colors.theme.base.${chartColor}`
      ),
      colorsThemeLightColor: objectPath.get(
        uiService.config,
        `js.colors.theme.light.${chartColor}`
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService, chartColor]);

  useEffect(() => {
    ( async () => {
      const result = await getEmailStats();
      let newStats = { ...result.data };
      setStats(newStats);
    })()
  }, []);


  useEffect(() => {
    const element = document.getElementById("kt_tiles_widget_2_pie_chart");
    if (element){
      const options = getChartOption( stats.opened, 'OPENED', '#feb012', layoutProps);
      openedPieChart = new ApexCharts(element, options);
      openedPieChart.render();
    }

    const element2 = document.getElementById("kt_tiles_widget_3_pie_chart");

    if (element2) {
      const options = getChartOption( stats.clicked, 'CLICKED', '#49cc8a', layoutProps);
      clickPieChart = new ApexCharts(element2, options);
      clickPieChart.render();
    }

    const element3 = document.getElementById("kt_tiles_widget_4_pie_chart");

    if (element3) {
      const options = getChartOption( stats.unsubscribed, 'UNSUBSCRIBED', '#ff6042', layoutProps);
      unsubscribedPieChart = new ApexCharts(element3, options);
      unsubscribedPieChart.render();
    }
  }, [layoutProps, stats.clicked, stats.opened, stats.unsubscribed]);

  useEffect(() => {
    openedPieChart && openedPieChart.updateSeries([
      Number(stats.emailsOpened ? ((stats.emailsOpened * 100)/stats.emailsDelivered).toFixed(2) : 0)
    ])
    clickPieChart && clickPieChart.updateSeries([
      Number(stats.linksClicked ? ((stats.linksClicked * 100)/stats.emailsDelivered).toFixed(2) : 0)
    ])
    unsubscribedPieChart && unsubscribedPieChart.updateSeries([
      Number(stats.totalUnsubscribed ? ((stats.totalUnsubscribed * 100)/stats.emailsDelivered).toFixed(2) : 0)
    ])
  }, [stats]);

  return (
    <>
      {/* begin::Tiles Widget 1 */}
      <div className={`card card-custom ${className}`}>
        {/* begin::Header */}
        <div className="card-header border-0 pt-5">
          <div className="card-title">
            <div className="card-label">
              <div className="font-weight-bolder">Monthly Email Stats</div>
              <div className="font-size-sm text-muted mt-2">{stats.monthlyEmailsSent} Emails Sent</div>
              <div className="font-size-sm text-muted mt-1">{today.toLocaleString('default', { month: 'long' })} {startOfWeek.getDate()}-{endOfWeek.getDate()}, {today.getFullYear()}</div>
            </div>
          </div>
          <div className="card-toolbar">
            {/* <Dropdown className="dropdown-inline" alignRight>
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
            </Dropdown> */}
          </div>
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className="card-body d-flex flex-column px-0">
          {/* begin::Chart */}
          <div
            id="kt_tiles_widget_2_pie_chart"
            // data-color={chartColor}
            style={{ height: "200px" }}
          />
          {/* end::Chart */}

          {/* begin::Chart */}
          <div
            id="kt_tiles_widget_3_pie_chart"
            // data-color={chartColor}
            style={{ height: "200px" }}
          />
          {/* end::Chart */}

          {/* begin::Chart */}
          <div
            id="kt_tiles_widget_4_pie_chart"
            // data-color={chartColor}
            style={{ height: "200px" }}
          />
          {/* end::Chart */}

        </div>
        {/* end::Body */}
      </div>
      {/* end::Tiles Widget 1 */}
    </>
  );
}

function getChartOption( value, label, color, layoutProps ) {
  const options = {
    series: [
      value
    ],
    labels: [label],
    chart: {
      type: "radialBar",
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
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: "70%"
        },
      }
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
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
    },
    colors: [color],
    markers: {
      colors: [layoutProps.colorsThemeLightColor],
      strokeColor: [color],
      strokeWidth: 3,
    },
    padding: {
      top: 0,
      bottom: 0,
    },
  };
  return options;
}
