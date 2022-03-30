/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import { useVisitorsUIContext } from "./VisitorsUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/visitors/visitorsActions";
import * as clientActions from "../../../../Admin/_redux/clients/clientsActions";
import { VisitorSingleCard } from "./VisitorSingleCard";
import { defaultLeadPriority, getAccountIndex } from "../../../../../utils";

import CtmPagination from "../../../../../../_metronic/_partials/controls/pagination/CtmPagination";

import {
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import 'bootstrap-daterangepicker/daterangepicker.css';

export function VisitorsTable({
  currentSeemoreURL
}) {
  const dispatch = useDispatch();
  
  const accountIndex = getAccountIndex();
  const { user,activeSubscription, clientData, leadPriorities, currentState} = useSelector(
    (state) => ({
      user: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].user !== null) ? state.multiAuth.multiAuthData[accountIndex].user : {},
      activeSubscription: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData.activeSubscription : {},
      clientData: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData : {},
      leadPriorities: state.clients.leadPriorities, 
      currentState: state.visitors
    }),
    shallowEqual
);

  // Visitors UI Context
  const visitorsUIContext = useVisitorsUIContext();
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [leadPriority, setLeadPriority] = useState('');

  useEffect(() => {
    console.log(user)
    if(user.id && user.id !== 'undefined'){
      let params = { client_id: user.id, page: 1, limit: 1, sortOrder:-1, sortField: 'createdAt' };
      dispatch(clientActions.fetchLeadPriority(params));
    }
    
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




  const { totalCount,currentPage } = currentState;

  // Visitors Redux state
 
  useEffect(() => {
    // server call by queryParams
    if (clientData.apps && clientData.apps.length && clientData.apps[0].loginAPIAccessKey) {
      dispatch(actions.fetchVisitors({ loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey, ...visitorsUIProps.queryParams }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [visitorsUIProps.queryParams,clientData.apps, dispatch]);



  const handleSeeMore = (params) => {

    params.pageUrl = currentSeemoreURL;
    console.log(params)

    dispatch(actions.fetchVisitorVisits(params))
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
      
      {/* begin::Body */}
      <div className="card-body py-0">
        
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
              <div className="th" style={{ maxWidth: '17%', flexBasis: '17%' }}>
                REFERAL
            </div>
              <div className="th" onClick={() => getOrderBy('corpJobCompanyName', sortOrder)}  style={{ maxWidth: '17%', flexBasis: '17%' }}>
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

              {currentState.entities != null && <VisitorSingleCard handleSeeMore={handleSeeMore} visitorData={currentState} currentSeemoreURL={currentSeemoreURL} leadPriority={leadPriority}/>}

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
