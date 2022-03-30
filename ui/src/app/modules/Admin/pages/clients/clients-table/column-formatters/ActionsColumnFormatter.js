/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";

export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { openEditClientPage, openDeleteClientDialog, toggle, accessClientAccount }
) => {

  return (
  <>
  <button
      className="btn btn-primary font-weight-bolder font-size-sm mr-3"
      style={{ minWidth: '70px' }}
      onClick={() => accessClientAccount(row._id)}
  >Dashboard</button>

    <OverlayTrigger
      overlay={<Tooltip id="clients-edit-tooltip">Edit client</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm mr-3"
        onClick={() => openEditClientPage(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
      </a>
    </OverlayTrigger>

    {
      row.status !== 'paused' && row.status !== 'cancelled' &&
      <> 
        {
          row.status === 'live' &&
          <OverlayTrigger
            overlay={<Tooltip id="clients-pause-tooltip">Pause Tracking</Tooltip>}
          >
            <a
              className="btn btn-icon btn-light btn-hover-danger btn-sm mr-3"
              onClick={() => toggle(row._id,0)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Media/Pause.svg")} />
              </span>
            </a>
          </OverlayTrigger>
        }
        {
          row.status === 'paused_backend' &&
          <OverlayTrigger
            overlay={<Tooltip id="clients-resume-tooltip">Resume Tracking</Tooltip>}
          >
            <a
              className="btn btn-icon btn-light btn-hover-success btn-sm mr-3"
              onClick={() => toggle(row._id,1)}
            >
              <span className="svg-icon svg-icon-md svg-icon-success">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Media/Play.svg")} />
              </span>
            </a>
          </OverlayTrigger>
        }
      </>
    }

    <OverlayTrigger
      overlay={<Tooltip id="clients-delete-tooltip">Delete client</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-danger btn-sm"
        onClick={() => openDeleteClientDialog(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
        </span>
      </a>
    </OverlayTrigger>
  </>
  );
}
