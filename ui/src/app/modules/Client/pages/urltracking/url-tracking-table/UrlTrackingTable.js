import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Card,  CardBody} from "../../../../../../_metronic/_partials/controls";
import {  filterTrackingUrls } from "../../../_redux/settings/urlSettingsCrud";
import * as actions from "../../../_redux/visitors/visitorsActions";
import { Table } from "react-bootstrap";
import { VisitorsTable } from "./VisitorsTable";
import { VisitorsUIProvider } from "./VisitorsUIContext";
import { getAccountIndex } from "../../../../../utils";
export function UrlTrackingTable({ }) {
  const accountIndex = getAccountIndex();

  const visitorsUIEvents = {

  }
  const [currentSeemore, setCurrentSeemore] = useState(null);
  const [currentSeemoreURL, setCurrentSeemoreURL] = useState(null);
  const [inSeemoreMode, setinSeemoreMode] = useState(false);
  const [ trackingUrls, setTrackingUrls ] = useState([]);

  // Getting curret state of visitors list from store (Redux)
  const { currentState, clientData } = useSelector(
    (state) => ({ 
      currentState: state.visitors, 
      clientData: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData : {},
    }),
    shallowEqual
  );

  useEffect(() => {
    filterTrackingUrls().then((resp)=>{
        let data = resp.data.tabledata;
        
        const flt = {queryParams:{filters:{crmMatchDate: "", endDate: null, leadPriority: "", limit:99999999, searchText: "", startDate: null}}};
        flt.queryParams.limit = 9999999;
        flt.queryParams.page = 1;
        flt.queryParams.sortField = "lastVisitedAt";
        flt.queryParams.sortOrder = "-1";
        
        if (clientData.apps && clientData.apps.length && clientData.apps[0].loginAPIAccessKey) {
          data.map((ele, i) => {
            flt.queryParams.filters.pageUrl = ele.url;
            actions.filterVisitors({ loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey, ...flt.queryParams })
            .then(response => {
              let totalvisits = 0;
              if(response.data.docs.length>0) {
                for(var v in response.data.docs) {
                  totalvisits += response.data.docs[v].pagesVisited.length;
                }
              }
              ele.totalvisits = totalvisits;
              if(i==1)setTrackingUrls(data);
            });
          });
          //setTrackingUrls(data);
        }
    });
  }, []);
  

  const onSeemore = ({id, pageUrl}) => {
    setinSeemoreMode(true);
    setCurrentSeemore(id);
    setCurrentSeemoreURL(pageUrl);
  }
  const cancelSeemore = () => {
    setinSeemoreMode(false);
  }

  return (
    <Card>
      <CardBody>
        <Table responsive="sm" className="table table table-head-custom table-vertical-center overflow-hidden">
          <thead>
          <tr key="theader">
              <th>STATS</th>
              <th>URL</th>
              <th>VIEW</th>
          </tr>
          </thead>
          <tbody>
          {
              trackingUrls.map((ele, i) =>
                (inSeemoreMode && currentSeemore==ele._id)?
                  (<tr key={ele._id}>
                    <td colSpan="3" style={{padding:0}}>
                    <table style={{width:'100%', tableLayout:'fixed'}}>
                      <tbody>
                        <tr key={'t'+ele._id}>
                          <td style={{fontWeight:'bold'}}>{ele.totalvisits} Visits - Total Session Time</td>
                          <td className="text-primary">{ele.url}</td>
                          <td></td>
                        </tr>
                        <tr key={'v'+ele._id}>
                          <td colSpan="3" style={{padding:'1px'}}>
                            <VisitorsUIProvider visitorsUIEvents={visitorsUIEvents}>
                              <VisitorsTable className="card-stretch gutter-b" currentSeemoreURL={currentSeemoreURL} />
                            </VisitorsUIProvider>
                          </td>
                        </tr>
                        <tr key={'close'+ele._id}>
                        <td colSpan="3">
                          <div className="closeBox"><a onClick={() => cancelSeemore()} >CLOSE &nbsp;x</a></div>
                        </td>
                      </tr>
                  </tbody>
                  </table>
                  </td>
                  </tr>)
                  :
                  <tr key={ele._id}>
                      <td style={{fontWeight:'bold'}}>{ele.totalvisits} Visits - Total Session Time</td>
                      <td className="text-primary">{ele.url}</td>
                      <td>
                      {
                        <a className="text-primary" style={{textDecoration:'underline'}} onClick={() => onSeemore({id: ele._id, pageUrl:ele.url})} >
                          see visitors
                        </a>
                      }
                      </td>
                  </tr>
              )
          }       
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}