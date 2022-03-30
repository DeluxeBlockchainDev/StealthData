/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useMemo } from "react";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";

const GET_SCRIPT_URL = "ct/gst";

export function ClientScript() {

  const uiService = useHtmlClassService();
  const { clientData } = useSelector((state) => state.auth, shallowEqual);

  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.notifications.layout") ===
        "offcanvas",
    };
  }, [uiService]);

  return (
    <>
      {layoutProps.offcanvas && (
        <div className="topbar-item">
          <div
            className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary"
            id="kt_quick_notifications_toggle"
          >
            <span className="svg-icon svg-icon-xl svg-icon-primary">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Code.svg")} />
            </span>
            <span className="pulse-ring"></span>
          </div>
        </div>
      )}
      {!layoutProps.offcanvas && (
        <Dropdown drop="down" alignRight>
          <Dropdown.Toggle
            as={DropdownTopbarItemToggler}
            id="kt_quick_notifications_toggle"
          >
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="user-notification-tooltip">
                  Add this javascript snippet to your website.
                </Tooltip>
              }
            >
              <div
                className="btn btn-icon btn-hover-transparent-white btn-dropdown btn-lg mr-1 pulse pulse-primary"
                id="kt_quick_notifications_toggle"
              >
                <span className="svg-icon svg-icon-xl">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Code/Code.svg")}
                  />
                </span>
                <span className="pulse-ring" />
              </div>
            </OverlayTrigger>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg">
            <form>
              {/** Head */}
              <div
                className="d-flex flex-column p-4 bgi-size-cover bgi-no-repeat rounded-top"
              >
                {
                  // clientData && clientData.apps && clientData.apps.length && clientData.apps[0]['loginAPIAccessKey'] ?
                  clientData && clientData.customerGUID ?
                  <>
                    <h4 className="d-flex flex-center rounded-top">
                      Add this javascript snippet to your website.
                    </h4>
                    <code className="my-3">
                      {
                        `<script 
                          type="text/javascript"
                          src="${process.env.REACT_APP_API_URL}/${GET_SCRIPT_URL}/${clientData['customerGUID']}"
                          async>
                        </script>`
                      }
                    </code>
                  </>
                  :
                  <h4 className="d-flex flex-center rounded-top">
                      Unable to fetch client script, Contact Administrator.
                  </h4>
                }
                
              </div>
            </form>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}
