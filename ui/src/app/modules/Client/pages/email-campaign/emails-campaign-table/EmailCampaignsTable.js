// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useReducer, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  toAbsoluteUrl,
} from "../../../../../../_metronic/_helpers";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import * as actions from "../../../_redux/email-campaigns/emailCampaignsActions";
import { getRouteUrl } from '../../../../../utils';
export function EmailCampaignsTable() {
  // Getting curret state of clients list from store (Redux)
  const { entities, campaignTypes } = useSelector(
    (state) => ({ entities: state.emailCampaigns.entities, campaignTypes: state.emailCampaigns.campaignTypes }),
    shallowEqual
  );

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(actions.fetchEmailCampaignTypes({}))
  }, []);

  React.useEffect(() => {
    campaignTypes.length && dispatch(actions.fetchEmailCampaigns({}));
  }, [campaignTypes]);

  // Table columns
  const columns = [
    {
      dataField: "id",
      text: "Sr No",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent, row, rowIndex) => {
        return (
          <div className="text-dark">
            {rowIndex + 1}
          </div>
        );
      }
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "subject",
      text: "Subject",
    },
    {
      dataField: "campaignTypeId",
      text: "Campaign Type",
      formatter: (cellContent, row, rowIndex) => {
        const campaignType = campaignTypes.find((camp) => camp.campaignId === row.campaignTypeId )
        return (
          <div className="text-dark">
            {campaignType && campaignType.displayName || '-'}
          </div>
        );
      }
    },
    {
      dataField: "createdAt",
      text: "Created At",
      formatter: (cellContent, row) => {
        return (
          <div className="text-primary">
            {new Date(row.createdAt).toLocaleDateString()}
          </div>
        )
      },
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "isActive",
      text: "Status",
      headerClasses: "text-center",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent, row) => {
        return (
          !!row.isActive ? 
            <span className="label label-lg label-light-success label-inline font-weight-bold py-4">Active</span>
          : <span className="label label-lg label-light-danger label-inline font-weight-bold py-4">Inactive</span>
        )
      },
      style: {
        minWidth: "150px",
        textAlign: 'center',
      },
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: (cellContent, row) => 
        <OverlayTrigger
          overlay={<Tooltip id="emails-edit-tooltip">Edit Email Campaign</Tooltip>}
        >
          <Link
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            to={getRouteUrl('emails/edit/'+row._id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </Link>
        </OverlayTrigger>,
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];
  return (
    <Card>
      <CardHeader title="Emails list">
        <CardHeaderToolbar>
          <Link
            as="button"
            className="btn btn-primary"
            to={getRouteUrl('emails/new')}
          >
            New Email Campaign
          </Link>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <BootstrapTable
          wrapperClasses="table-responsive"
          classes="table table-head-custom table-vertical-center overflow-hidden"
          bootstrap4
          bordered={false}
          remote
          keyField="id"
          data={entities === null ? [] : entities}
          columns={columns}
          // onTableChange={getHandlerTableChange(
          //   clientsUIProps.setQueryParams
          // )}
        >
          <PleaseWaitMessage entities={entities} />
          <NoRecordsFoundMessage entities={entities} />
        </BootstrapTable>
      </CardBody>
    </Card>
  );
}
