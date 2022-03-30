// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/clients/clientsActions";
import * as uiHelpers from "../ClientsUIHelpers";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useClientsUIContext } from "../ClientsUIContext";

export function ClientsTable() {
  // Clients UI Context
  const clientsUIContext = useClientsUIContext();
  const clientsUIProps = useMemo(() => {
    return {
      ids: clientsUIContext.ids,
      setIds: clientsUIContext.setIds,
      queryParams: clientsUIContext.queryParams,
      setQueryParams: clientsUIContext.setQueryParams,
      openEditClientPage: clientsUIContext.openEditClientPage,
      openDeleteClientDialog: clientsUIContext.openDeleteClientDialog,
    };
  }, [clientsUIContext]);

  // Getting curret state of clients list from store (Redux)
  const { currentState, subscriptions } = useSelector(
    (state) => ({ currentState: state.clients, subscriptions: state.subscriptions.entities }),
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;
  // Clients Redux state
  const dispatch = useDispatch();
  const toggle = (id, value) => dispatch(actions.toggleClient( id, value ) );
  const accessClientAccount = async (id) => {
    //console.log( id) 
    let clientIndex = await dispatch(actions.accessClientAccount( id ))
    window.open(`/u/${clientIndex}/dashboard`);

  };
  
  useEffect(() => {
    // clear selections list
    clientsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchClients(clientsUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientsUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent, row) => {
        return (
          <>
            <div className="d-flex">
              <div>
                <a
                  href="#!"
                  className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg"
                >
                  {row.firstName} {row.lastName}
                </a>
                <span className="text-muted font-weight-bold d-block">
                  {row.email}
                </span>
              </div>
            </div>
          </>
        );
      }
    },
    {
      dataField: "address",
      text: "LOCATION",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent, row) => {
        return (
          <>
            <div className="text-dark font-weight-bold">
              {row.address ? row.address.state : "-"}
            </div>
            <div className="text-muted">
              {row.address ? row.address.city : "-"}
            </div>
          </>
        )
      },
    },
    {
      dataField: "createdAt",
      text: "SIGNUP DATE",
      formatter: (cellContent, row) => {
        return (
          <>
            <div className="text-primary font-weight-bold">
              {new Date(row.createdAt).toLocaleDateString()}
            </div>
            <div className="text-muted">
              { subscriptions.filter((subscription) => subscription._id === row.subscriptionId ).map((subscription) => subscription.name) }
            </div>
          </>
        )
      },
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "companyName",
      text: "COMPANY NAME",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent, row) => {
        return (
          <div className="text-muted">
            {row.companyName}
          </div>
        )
      },
    },
    {
      dataField: "status",
      text: "STATUS",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent, row) => {
        return (
          row.status === 'live' ? 
            <span className="label label-lg label-light-success label-inline font-weight-bold py-4">Live</span>
          : row.status === 'cancelled' ? 
            <span className="label label-lg label-light-danger label-inline font-weight-bold py-4">Cancelled</span>
          : row.status === 'paused' ? 
            <span className="label label-lg label-light-primary label-inline font-weight-bold py-4">Paused</span>
          : row.status === 'paused_backend' ? 
          <span className="label label-lg label-light-info label-inline font-weight-bold py-4">Paused By Admin</span>
          : null
        )
      },
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        toggle: toggle,
        openEditClientPage: clientsUIProps.openEditClientPage,
        openDeleteClientDialog: clientsUIProps.openDeleteClientDialog,
        accessClientAccount: accessClientAccount,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: clientsUIProps.queryParams.limit,
    page: clientsUIProps.queryParams.page,
    onSizePerPageChange: (size) => clientsUIProps.setQueryParams({ ...clientsUIProps.queryParams, limit: size, page: 1 }),
    onPageChange: (page) => clientsUIProps.setQueryParams({ ...clientsUIProps.queryParams, page }),
  };
  return (
    <>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                remote
                keyField="id"
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  clientsUIProps.setQueryParams
                )}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
