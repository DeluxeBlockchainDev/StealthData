// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useSelector } from "react-redux";
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

export function CustomPackagesTable() {

  // Getting curret state of clients list from store (Redux)
  const { entities } = useSelector(
    (state) => ({ entities: state.subscriptions.entities.filter((subscription) => subscription.isCustomPackage === true ) }),
    shallowEqual
  );

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
      dataField: "price",
      text: "Price($)",
    },
    {
      dataField: "annualDiscount",
      text: "AnnualDiscount(%)",
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
      dataField: "action",
      text: "Actions",
      formatter: (cellContent, row) => 
        <>        
        <OverlayTrigger
          overlay={<Tooltip id="packages-edit-tooltip">Copy Sign-up link with Custom Package</Tooltip>}          
        >          
          <span className="btn btn-sm btn-primary" onClick={() => {
            var text = window.location.origin + "/sign-up-custom/" + row._id;
            var input = document.createElement('input');
            input.setAttribute('value', text);
            document.body.appendChild(input);
            input.select();
            var result = document.execCommand('copy');
            document.body.removeChild(input);
            return result;
          }}>
            Copy Sign-up Link
          </span>
        </OverlayTrigger>
        <OverlayTrigger
          overlay={<Tooltip id="packages-edit-tooltip">Edit custom package</Tooltip>}
        >        
          <Link
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            to={'/admin/settings/customPackages/edit/'+row._id}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </Link>
        </OverlayTrigger>
        </>
        ,
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];
  return (
    <Card>
      <CardHeader title="Custom Packages list">
        <CardHeaderToolbar>
          <Link
            as="button"
            className="btn btn-primary"
            to={'/admin/settings/customPackages/new'}
          >
            New Custom Package
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
