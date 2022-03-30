/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Alert, Spinner, Table } from "react-bootstrap";
import { uploadFile, loadCrmMatchingHistory, exportAllHistory, deleteCrmMatchingFile } from "../../_redux/visitors/visitorsCrud";

import { getAccountIndex } from "../../../../utils";

import { Button } from '@material-ui/core';


export function CrmPage({
    history,
}) {
    const [ file, setFile ] = useState(null);
    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ exportId, setExportId ] = useState(null);
    const [ crmMatchingHistory, setCrmMatchingHistory ] = useState([]);
    const [ successMessage, setSuccessMessage ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState('');
    const [isExportProcessing, setIsExportProcessing]  = useState(false);
    const [showConfirmBox, setShowConfirmBox] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState(null);

    useEffect(() => {
        loadCrmMatchingHistory().then((resp)=>{
            const data = resp.data.tabledata;
            setCrmMatchingHistory(data);
        });
    }, []);

    const accountIndex = getAccountIndex();
    const {clientData} = useSelector(
         (state) => ({ 
           clientData: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData : {}, 
         }),
         shallowEqual
    );
    const setDeleteFlag = (crmMatchId) => {
        setDeleteId(crmMatchId);
        setShowConfirmBox(true);
    };
    const deleteHistory = async() => {
        if(deleteId){
            deleteCrmMatchingFile({crmMatchId: deleteId }).then((resp) => {
                loadCrmMatchingHistory().then((resp)=> {
                    setShowConfirmBox(false);
    
                  const data=resp.data.tabledata;
                  setCrmMatchingHistory(data);
              });
            }).catch((e) => {});
        }

    };
    const exportHistory = (rid) => {
        const date = new Date();
        setIsExportProcessing(true);
        setExportId(rid);
        if( clientData.apps && clientData.apps.length && clientData.apps[0].loginAPIAccessKey ) {
          exportAllHistory({ loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey, filters: {crmMatchId:rid} }).then((resp) =>{
            setIsExportProcessing(false);
            const a = document.createElement("a");
            a.href =  process.env.REACT_APP_API_URL + '/' + resp.data.fileName.substring(2);
            a.setAttribute("download", `${clientData.apps[0].req.customerName}-Stealth-Crm-Match-${date.toLocaleDateString(undefined, {year:'numeric',month:'long',day:'numeric'})}.xlsx`);
            a.click();
         }).catch((e) => {
            setIsExportProcessing(false);
          });
        }
      };
     const upload = async (ev) => {
        if(file) {
            setIsProcessing(true);
            setErrorMessage('');
            setCrmMatchingHistory([]);
            setSuccessMessage('');
            const data = new FormData();
            data.append('file', file);
            try{
                const resp = await uploadFile(data)
                setIsProcessing(false);
                if ( resp.data.status ) {
                    setSuccessMessage('File processed successfully!');
                } else {
                    setErrorMessage('File processed with some errors, add emails properly and try again!')
                }
                resp.data && resp.data.tabledata && setCrmMatchingHistory(resp.data.tabledata);
            } catch (e) {
                setIsProcessing(false);
                setErrorMessage('Unknown Error');
            }
        } else {
            alert('Select File');
        }
    }
  return (
    <>
    <div className={`card card-custom mx-auto`} style={{width:'70%'}}>
      {/* begin::Header */}
      <div className="card-header border-0 py-5 justify-content-center">
        <h2 className="card-title align-items-start flex-column">
          <span className="card-label font-weight-bolder text-dark h3 ">
            CRM Matching
          </span>
        </h2>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="card-body py-0">
        <Alert show={successMessage} variant="success" dismissible onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
        <Alert show={errorMessage} variant="danger" dismissible onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
        <div className="form form-label-righ" >
            <div className="form-group mt-5">
                <div className="d-flex justify-content-center">

                    <label className="col-form-label h5">Upload Excel File</label>
                    <div className="ml-3">
                        <div
                        className=""
                        >
                            <label
                                className="btn btn-sm btn-primary btn-hover-text-light btn-shadow px-5"
                                data-action="change"
                                data-toggle="tooltip"
                                title=""
                                data-original-title="Change avatar"
                            >
                                <span>Browse File</span>
                                <input
                                    type="file"
                                    name="file"
                                    className="d-none"
                                    maxLength="1"
                                    max="1"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    onChange={(event) => {
                                        setFile( event.currentTarget.files[0] );
                                    }}
                                />
                            </label>
                        </div>
                        <span className="form-text text-muted">
                            Allowed file types: xlsx, xls.
                        </span>
                        {
                            file && 
                            <div className="text-dark h6 mt-4">
                                {file.name}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="form-group">
                <div className="d-flex justify-content-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={upload}
                        disabled={isProcessing}
                    >
                        { 
                        !isProcessing ? 
                            'Submit' 
                        : <>
                            <Spinner variant="light" animation="border" size="sm" className="mr-2" />
                            <span className="">Processing</span>
                        </>
                        }
                    </button>
                    <button
                        type="button"
                        className="btn btn-light ml-3"
                        onClick={() => history.goBack()}
                    >
                        Cancel
                    </button>
                    <button target="blank" className="ml-3 btn btn-sm btn-primary" onClick={() => {
                         var link = document.createElement("a");
                         // If you don't know the name or want to use
                         // the webserver default set name = ''
                         link.setAttribute('download', "sample.xlsx");
                         link.href = "sample.xlsx";
                         document.body.appendChild(link);
                         link.click();
                         link.remove();
                    }}><i className="fa fa-file" /> Sample File</button>
                </div>
            </div>
        </div>
      </div>
    {/* end::Body */}
    </div>
    {showConfirmBox && 
        <div className="row justify-content-center d-flex" style={{position:'fixed', zIndex: 999, color:'white'}}>
            <div className="col-lg-6 col-sm-12 col-md-12">
                <Alert variant="filled" severity="warning" color="error" style={{backgroundColor:'#F54E5F'}}>
                    <div className="row">
                        <div className="col-12">
                        WARNING - Deleting this CRM match entry will remove your uploaded CRM file and disable the export from this entry.  You still have the ability to export CRM matches from the visitors page. Are you sure you want to remove this entry?
                        </div>
                    </div>
                    <div className="row mt-2 justify-content-center d-flex">
                        <div className="col-12 d-flex justify-content-end">
                            <Button variant="contained" color="secondary" style={{ marginRight: 10 }}
                            onClick={() => {deleteHistory();}}
                            > Delete
                            </Button>
                            <Button variant="contained" onClick={() => {setShowConfirmBox(false);}} >
                                Close
                            </Button>
                        </div>
                    </div>
                </Alert>
            </div>
        </div>
    }
    {
        !!crmMatchingHistory && !!crmMatchingHistory.length &&
        <div className="card card-custom mx-auto mt-10" style={{width:'70%'}}>
            {/*<div className="card-header border-0 py-5 justify-content-center">
                <h2 className="card-title align-items-start flex-column">
                CRM Matching History
                </h2>
            </div>*/}
            <div className="card-body py-0">
                <Table responsive="sm" className="table table table-head-custom table-vertical-center overflow-hidden">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>FILE NAME</th>
                        <th>UPLOAD DATE</th>
                        <th>TOTAL RECORDS</th>
                        <th>CRM MATCHED</th>
                        <th>DOWNLOADS</th>
                        <th>ACTIONS</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            crmMatchingHistory.map((ele, i) => 
                                <tr key={ele._id} style={{color: ele.isDeleted ? 'lightgrey':'inherit' }}>
                                    <td>{i+1}</td>
                                    <td>{ele.fileName}</td>
                                    <td>{new Date(ele.uploadDate).toLocaleDateString(undefined, {year:'numeric',month:'long',day:'numeric'})}</td>
                                    <td className={ele.isDeleted?'text-default':'text-primary'}>{ele.totalRecords}</td>
                                    <td className={ele.isDeleted?'text-default':'text-primary'}>{ele.crmMatched}</td>
                                    <td>
                                    {
                                        isExportProcessing && exportId==ele._id?
                                        (
                                            <button disabled="disabled" className="btn btn-light-success font-weight-bolder btn-sm spinner spinner-darker-success spinner-left mr-3">Export</button>
                                        )
                                        :(
                                            ele.isDeleted ?
                                            <button disabled="disabled" className="btn btn-default font-weight-bolder btn-sm">DELETED</button>
                                            :
                                            <button onClick={() => exportHistory(ele._id)} className="btn btn-light-success font-weight-bolder btn-sm"> EXPORT </button>                                            
                                        )
                                    }
                                    </td>
                                    <td>
                                    {
                                        ele.isDeleted ? '' : (<a onClick={() => setDeleteFlag(ele._id)} className="btn-sm"><i className="text-dark-50 flaticon-delete icon-md mr-5"></i></a>)
                                    }
                                    </td>
                                </tr>                                
                            )
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    }
    </>
  );
}