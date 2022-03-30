// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  toAbsoluteUrl,
} from "../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { 
    Card,
    CardBody,
    CardHeader,
} from "../../../../../_metronic/_partials/controls";
import { getClientInvoices } from "../../../Admin/_redux/clients/clientsCrud";

export function InvoicePage() {
  const [entities, setEntities] = React.useState([]);


	React.useEffect(() => {
		(async () => {
			try {
				const response = await getClientInvoices();
				if( response.data ) {
					setEntities(response.data);
				}
			} catch(e) {
				console.log(e)
			}
		})()
	},[])

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
      dataField: "itemName",
      text: "Item",
      sort: true,
      classes: "font-weight-bold",
      sortCaret: sortCaret,
    },
    {
      dataField: "total",
      text: "Total($)",
      classes: "text-primary font-weight-bold",
    },
    // {
    //   dataField: "tax",
    //   text: "Tax Paid($)",
    //   classes: "text-dark font-weight-bold",
    // },
    {
      dataField: "createdAt",
      text: "Created At",
      formatter: (cellContent, row) => {
        return (
          <div className="text-primary font-weight-bold">
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
        <OverlayTrigger
          overlay={<Tooltip id="packages-edit-tooltip">View Invoice</Tooltip>}
        >
          <Link
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            to={'/invoices/'+row._id}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Visible.svg")}
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
      <CardHeader title="Invoices">
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
