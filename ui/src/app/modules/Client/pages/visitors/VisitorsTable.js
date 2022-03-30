/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import SVG from "react-inlinesvg";
import { useVisitorsUIContext } from "./VisitorsUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/visitors/visitorsActions";
import * as clientActions from "../../../Admin/_redux/clients/clientsActions";
import { VisitorSingleCard } from "./VisitorSingleCard";
import { defaultLeadPriority, getAccountIndex } from "../../../../utils";

import CtmPagination from "../../../../../_metronic/_partials/controls/pagination/CtmPagination";

import {
  sortCaret,
  toAbsoluteUrl,
} from "../../../../../_metronic/_helpers";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

export function VisitorsTable({
  history
}) {
  const dispatch = useDispatch();

  // Visitors UI Context
  var searchText = '';
  const accountIndex = getAccountIndex();
  const { user,activeSubscription, clientData, leadPriorities, currentState } = useSelector(
      (state) => ({
        user: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].user !== null) ? state.multiAuth.multiAuthData[accountIndex].user : {},
        activeSubscription: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData.activeSubscription : {},
        clientData: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData : {},
        leadPriorities: state.clients.leadPriorities, 
        currentState: state.visitors, 
      }),
      shallowEqual
  );
  
  // const { activeSubscription, leadPriorities, user } = useSelector((state) => ({ 
  //   activeSubscription: state.subscriptions.activeSubscription,
  //   leadPriorities: state.clients.leadPriorities, 
  //   user: state.auth.user,
  // }), shallowEqual);
  const visitorsUIContext = useVisitorsUIContext();
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [leadPriority, setLeadPriority] = useState('');

  useEffect(() => {
    let params = { client_id: user.id, page: 1, limit: 1, sortOrder:-1, sortField: 'createdAt' };
    dispatch(clientActions.fetchLeadPriority(params));
}, [user, dispatch]);

useEffect(() => {
  if(leadPriorities && leadPriorities !== 'undefined' && leadPriorities.length > 0){
    setLeadPriority(leadPriorities[0]);
  }else{
    setLeadPriority(defaultLeadPriority);
  }
}, [leadPriorities]);



  const visitorsUIProps = useMemo(() => {
    return {
      queryParams: visitorsUIContext.queryParams,
      setQueryParams: visitorsUIContext.setQueryParams,
      openVisitorsExportDialog: visitorsUIContext.openVisitorsExportDialog
    };
  }, [visitorsUIContext]);



  const { totalCount,currentPage, entities } = currentState;
  // Visitors Redux state
 
  // useEffect(() => {
  //   // server call by queryParams
  //  console.log('**********',multiAuth)
  // }, [multiAuth]);

  useEffect(() => {
    // server call by queryParams
    if (clientData.apps && clientData.apps.length && clientData.apps[0].loginAPIAccessKey) {
      dispatch(actions.fetchVisitors({ loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey, ...visitorsUIProps.queryParams }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [visitorsUIProps.queryParams,clientData.apps, dispatch]);



  const handleSeeMore = (params) => {
    dispatch(actions.fetchVisitorVisits(params))
  }

  const handleDateRangeApply = (picker) => {
    const { startDate, endDate } = picker;
    picker.element.val(
      picker.startDate.format('MM/DD/YYYY') +
      ' - ' +
      picker.endDate.format('MM/DD/YYYY')
    );
    const dateFilters = {
      startDate: startDate.format('YYYY/M/D'),
      endDate: endDate.format('YYYY/M/D'),
    }
    visitorsUIProps.setQueryParams({
      ...visitorsUIProps.queryParams,
      page: 1,
      filters:
      {
        ...visitorsUIProps.queryParams.filters,
        startDate: dateFilters['startDate'],
        endDate: dateFilters['endDate'],
      }
    })
  }

  const handleDateRangeCancel = (picker) => {
    picker.element.val('');
    visitorsUIProps.setQueryParams({
      ...visitorsUIProps.queryParams,
      page: 1,
      filters:
      {
        ...visitorsUIProps.queryParams.filters,
        startDate: null,
        endDate: null,
      }
    })
  }

  const handleFilterChange = (name, value) => {
    visitorsUIProps.setQueryParams({
      ...visitorsUIProps.queryParams,
      page: 1,
      filters:
      {
        ...visitorsUIProps.queryParams.filters,
        [name]: value
      }
    });
  }

  const onPageChanged = data => {
    const { currentPage, pageLimit } = data;
    if(currentPage > 0){
      visitorsUIProps.setQueryParams({
        ...visitorsUIProps.queryParams,
        page: currentPage,
        limit: pageLimit
      });
    }
    

    // const { allCountries } = this.state;
    // const { currentPage, totalPages, pageLimit } = data;

    // const offset = (currentPage - 1) * pageLimit;
    // const currentCountries = allCountries.slice(offset, offset + pageLimit);

    // this.setState({ currentPage, currentCountries, totalPages });
  };

  const getOrderBy = (field, order='') => {
    let orderBy = '';
    if(field === sortField){
      orderBy = (order === '' || order === 'asc') ? 'desc' : 'asc';
    }else{
      orderBy = 'desc';
    }
    setSortField(field);
    setSortOrder(orderBy);
    visitorsUIProps.setQueryParams({
      ...visitorsUIProps.queryParams,
      sortField: field,
      sortOrder: (orderBy === 'asc') ? 1 : -1
    });

  }
  return (
    <div className={`card card-custom`}>
      {/* begin::Header */}
      <div className="card-header border-0 py-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label font-weight-bolder text-dark">
            Identified Visitors
          </span>
          <span className="text-dark mt-3 font-weight-bold font-size-sm">
            {Array.isArray(entities) ? entities.length : 0} of {totalCount}
          </span>
        </h3>
        {/* {activeSubscription && activeSubscription.isAdvancedXLSXExport &&  */}
        <div className="card-toolbar d-flex flex-nowrap" >
          <button
            className="btn btn-primary font-weight-bolder font-size-sm ml-3"
            style={{ minWidth: '100px' }}
            onClick={() => {
              visitorsUIProps.openVisitorsExportDialog()
            }}
          >
            <span className="svg-icon svg-icon-md svg-icon-white">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Files/Export.svg"
                )}
                className="h-50 align-self-center"
              ></SVG>
            </span>
            Export
          </button>
        </div>
        {/* } */}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className="card-body py-0">
        <div className="mb-4">
          <div className="row">
            <div className="col-12">
              <form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-2">
                    <div className="search-filter">
                      <input
                        type="text"
                        className="form-control"
                        name="searchText"
                        placeholder="Search"
                        onKeyPress={(event) => {
                          if(event.key === 'Enter'){
                            handleFilterChange("searchText", searchText)
                          }
                        }}
                        onChange={(e) => searchText = e.target.value}
                        //onChange={(e) => setKeyword(e.target.value)}
                      />
                      <span className="svg-icon svg-icon-md svg-icon-black search-btn"
                      onClick={() => handleFilterChange("searchText", searchText)}
                      >
                        <img
                          alt="Search"
                          src="../../media/icon/magnifying-glass.png"
                          className="h-50 align-self-center search-btn-img"
                        />
                      </span>
                      
                    </div>
                    
                    <small className="form-text text-muted">
                      <b>Search</b> in all fields
                  </small>
                  </div>
                  {activeSubscription && activeSubscription.isLeadPriority && <div className="col-lg-2">
                    <select
                      className="form-control"
                      name="leadPriority"
                      placeholder="Filter by Lead Priority"
                      onChange={(e) => handleFilterChange("leadPriority", e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="hot">Hot</option>
                      <option value="warm">Warm</option>
                      <option value="mild">Mild</option>
                    </select>
                    <small className="form-text text-muted">
                      <b>Filter</b> by Lead Priority
                  </small>
                  </div>}
                  {activeSubscription && activeSubscription.isCrmMatched && <div className="col-lg-2">
                    <select
                      className="form-control"
                      placeholder="Is CRM Matched?"
                      name="crmMatchDate"
                      onChange={(e) => handleFilterChange("crmMatchDate", e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                    <small className="form-text text-muted">
                      <b>Filter</b> Is CRM Matched?
                  </small>
                  </div>}
                  <div className="col-12 col-sm-3">
                    <DateRangePicker
                      initialSettings={{
                        // singleDatePicker: true,
                        autoUpdateInput: false,
                        locale: {
                          cancelLabel: 'Clear',
                        },
                      }}
                      onApply={
                        (event, picker) => {
                          handleDateRangeApply(picker)
                        }
                      }
                      onCancel={
                        (event, picker) => {
                          handleDateRangeCancel(picker)
                        }
                      }
                    >
                      <input type="text" className="form-control" />
                    </DateRangePicker>
                    <small className="form-text text-muted">
                      <b>Filter</b> By Date Range:
                  </small>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="custom-tbl-wrapper">
          <div className="custom-div-tbl">
            <div className="thead">
              {activeSubscription && activeSubscription.isVisits && <div className="th" onClick={() => getOrderBy('visitCount', sortOrder)}  style={{ maxWidth: '16%', flexBasis: '16%' }}>
                VISITS
                {sortCaret((sortField === 'visitCount') ? sortOrder : '')}
              </div>}
              <div className="th" onClick={() => getOrderBy('lastVisitedAt', sortOrder)} style={{ maxWidth: '16%', flexBasis: '16%' }}>
                DATE
                {sortCaret((sortField === 'lastVisitedAt') ? sortOrder : '')}
            </div>
              <div className="th" style={(activeSubscription && activeSubscription.isLeadPriority) ? { maxWidth: '16%', flexBasis: '16%' } : { maxWidth: '37%', flexBasis: '37%' }}>
                REFERAL
            </div>
              <div className="th" onClick={() => getOrderBy('corpJobCompanyName', sortOrder)}  style={(activeSubscription && activeSubscription.isUrlsViewed) ? { maxWidth: '17%', flexBasis: '17%' } : { maxWidth: '33%', flexBasis: '33%' }}>
                COMPANY INFO
                {sortCaret((sortField === 'corpJobCompanyName') ? sortOrder : '')}
              </div>
              {activeSubscription && activeSubscription.isUrlsViewed && <div className="th" style={{ maxWidth: '16%', flexBasis: '16%' }}>
                URLS VIEWED
              </div>}
              {activeSubscription && activeSubscription.isLeadPriority && <div className="th text-right" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                PRIORITY
              </div>}
            </div>
            <div className="tbody">

              {currentState.entities != null && <VisitorSingleCard handleSeeMore={handleSeeMore} visitorData={currentState} leadPriority={leadPriority}/>}

            </div>

          </div>
        </div>
        <div className="d-flex flex-row py-4 align-items-center">

          <CtmPagination
            totalRecords={totalCount}
            pageLimit={10}
            pageNeighbours={currentPage}
            onPageChanged={onPageChanged}
            isLoading={currentState.listLoading}
          /> 
        </div>
        {(currentState.listLoading || currentState.actionsLoading) && <div className="ctm-spanner">
          <div className="ctm-loader"></div>
        </div>}
        {/* <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => {
            return (
              <Pagination
                isLoading={listLoading}
                paginationProps={paginationProps}
              >
                <BootstrapTable
                  keyField="_id"
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
                    visitorsUIProps.setQueryParams
                  )}
                  {...paginationTableProps}
                >
                  <PleaseWaitMessage entities={entities} />
                  <NoRecordsFoundMessage entities={entities} />
                </BootstrapTable>
              </Pagination>
            );
          }}
        </PaginationProvider> */}



      </div>
      {/* end::Body */}
    </div >
  );
}
