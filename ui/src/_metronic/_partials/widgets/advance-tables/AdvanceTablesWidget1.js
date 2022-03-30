/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_helpers";

export function AdvanceTablesWidget1({ className }) {
  return (
    <div className={`card card-custom ${className}`}>
      {/* begin::Header */}
      <div className="card-header border-0 py-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label font-weight-bolder text-dark">
            Identified Visitors
          </span>
          <span className="text-muted mt-3 font-weight-bold font-size-sm">
            User management made easy
          </span>
        </h3>
        <div className="card-toolbar">
          <a
            href="#"
            className="btn btn-success font-weight-bolder font-size-sm"
          >
            <span className="svg-icon svg-icon-md svg-icon-white">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/Add-user.svg"
                )}
                className="h-50 align-self-center"
              ></SVG>
            </span>
            Add New Member
          </a>
        </div>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className="card-body py-0">
        {/* begin::Table */}
        <div className="table-responsive">
          <table
            className="table table-head-custom table-vertical-center"
            id="kt_advance_table_widget_1"
          >
            <thead>
              <tr className="text-left">
                <th className="pr-0" style={{ }}>
                  <h6>#</h6>
                </th>
                <th className="pr-0" style={{ width: "100px" }}>
                  <h6>Visitors</h6>
                  <div>Customer</div>
                </th>
                <th className="pr-0" style={{ minWidth: "150px" }}>
                  <h6>Address</h6>
                  <div>Country</div>
                </th>
                <th className="pr-0" style={{ minWidth: "150px" }}>
                  <h6>Date Identified</h6>
                  <div>Ship Date</div>
                </th>
                <th className="pr-0" style={{ minWidth: "150px" }}>
                  <h6>URLs Viewed</h6>
                  <div>Company Name</div>
                </th>
                <th className="pr-0" style={{ minWidth: "150px" }}>
                  <h6>Lead Priority</h6>
                  <div>Status</div>
                </th>
                <th className="pr-0 text-right" style={{ minWidth: "150px" }}>
                  action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                [...Array(100).keys()].map((i) => 
                  <tr>
                    <td className="pr-0">
                      <span
                        className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg"
                      >
                        200
                      </span>
                    </td>
                    <td className="pl-0">
                      <div className="d-flex">
                        <div className="symbol symbol-50 symbol-light mt-1 mr-2">
                          <span className="symbol-label">
                            <SVG
                              src={toAbsoluteUrl("/media/svg/avatars/001-boy.svg")}
                              className="h-75 align-self-end"
                            ></SVG>
                          </span>
                        </div>
                        <div className="d-flex flex-column">
                          <a
                            href="#"
                            className="text-dark-75 font-weight-bolder text-hover-primary mb-1 mt-auto font-size-lg"
                          >
                            Eduard Stoeck
                          </a>
                          <span className="text-muted font-weight-bold text-muted d-block mb-auto">
                            estoeck5@gmail.com
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        Phillipines
                      </span>
                      <span className="text-muted font-weight-bold">
                        Code: PH
                      </span>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-blue">
                        3/3/2017
                      </span>
                      <span className="text-muted font-weight-bold">
                        rejected
                      </span>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg ">
                        Botsford and Sons
                      </span>
                    </td>
                    <td>
                    
                    </td>
                    <td className="pr-0 text-right">
                      <a
                        href="#"
                        className="btn btn-icon btn-light btn-hover-primary btn-sm"
                      >
                        <span className="svg-icon svg-icon-md svg-icon-primary">
                          <SVG
                            src={toAbsoluteUrl(
                              "/media/svg/icons/General/Settings-1.svg"
                            )}
                          ></SVG>
                        </span>
                      </a>
                      <a
                        href="#"
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                      >
                        <span className="svg-icon svg-icon-md svg-icon-primary">
                          <SVG
                            src={toAbsoluteUrl(
                              "/media/svg/icons/Communication/Write.svg"
                            )}
                          ></SVG>
                        </span>
                      </a>
                      <a
                        href="#"
                        className="btn btn-icon btn-light btn-hover-primary btn-sm"
                      >
                        <span className="svg-icon svg-icon-md svg-icon-primary">
                          <SVG
                            src={toAbsoluteUrl(
                              "/media/svg/icons/General/Trash.svg"
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
  );
}
