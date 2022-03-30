import React, { useState, useEffect } from "react";
import SVG from "react-inlinesvg";
import { Card,  CardBody,  CardHeader,  CardHeaderToolbar } from "../../../../../../_metronic/_partials/controls";
import {  loadTrackingUrls, updateUrlSetting, deleteUrlSetting } from "../../../_redux/settings/urlSettingsCrud";
import { Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

export function UrlSettingsTable() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentStatus, setCurrentStatus] = useState(false);
  const [inCreateMode, setInCreateMode] = useState(false);
  const [createInvalid, SetCreateInvalid] = useState(false);
  const [editInvalid, SetEditInvalid] = useState(false);
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowId: null
  });
  const [ trackingUrls, setTrackingUrls ] = useState([]);
  useEffect(() => {
    loadTrackingUrls().then((resp)=>{
        const data = resp.data.tabledata;
        setTrackingUrls(data);
    });
  }, []);
  const fetchUrls = () => {
    loadTrackingUrls().then((resp)=>{
      const data = resp.data.tabledata;
      setTrackingUrls(data);
      setInCreateMode(false);
      SetCreateInvalid(false);
      SetEditInvalid(false);
    });
  }
  const onCreate = () => {
    if(trackingUrls.length<5) setInCreateMode(true);
    else setInCreateMode(false);

    setInEditMode({
      status: false,
      rowId: null
    })
  }
  const onEdit = ({id, currentUrl, currentStatus}) => {
    setInEditMode({
        status: true,
        rowId: id
    })
    setCurrentUrl(currentUrl);
    setCurrentStatus(currentStatus);
    SetEditInvalid(false);
    setInCreateMode(false);
  }
  const onSave = ({id}) => {
    if(currentUrl.trim()=='') {
      if(id==null) {
        SetCreateInvalid(true);
      } else {
        SetEditInvalid(true);
      }
    } else {
      updateUrls({id, currentUrl, currentStatus});
    }
  }
  const onCancel = () => {
    // reset the inEditMode state value
    setInEditMode({
        status: false,
        rowId: null
    })
    // reset the unit price state value
    setCurrentUrl('');
  }
  const onCreateCancel = () => {
    setInCreateMode(false);
    SetCreateInvalid(false);
  }
  const deleteUrl = (urlId) => {
    if(urlId){
      deleteUrlSetting({urlId: urlId }).then((resp) => {
        fetchUrls();
      }).catch((e) => {});
  }
  };
  const updateUrls = ({id, currentUrl, currentStatus}) => {
    //console.log(currentUrl);
    updateUrlSetting({id:id, url:currentUrl, status:currentStatus})
        .then()
        .then(json => {
            onCancel();
            fetchUrls();
        })
  }
  return (
    <Card>
      <CardHeader title="URL Tracking">
        <CardHeaderToolbar>
          <button
             className="btn btn-primary"
              onClick={() => onCreate()}
              disabled = {trackingUrls.length>=5?true:false}
          >
              Create New URL
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table responsive="sm" className="table table table-head-custom table-vertical-center overflow-hidden">
          <thead>
          <tr>
              <th>SR NO</th>
              <th>URL</th>
              <th>CREATED AT</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
          </tr>
          </thead>
          <tbody>
              {
                  trackingUrls.map((ele, i) => 
                      <tr key={ele._id}>
                          <td>{i+1}</td>
                          <td className="text-primary">
                            {
                                inEditMode.status && inEditMode.rowId === ele._id ? (
                                  editInvalid?
                                  <input className={"form-control is-invalid"} value={currentUrl} onChange={(event) => setCurrentUrl(event.target.value)} />
                                  :
                                    <input className={"form-control"} value={currentUrl} onChange={(event) => setCurrentUrl(event.target.value)} />
                                ) : (
                                    ele.url
                                )
                            }
                          </td>
                          <td className="text-primary">{new Date(ele.createdAt).toLocaleDateString()}</td>
                          <td>{
                          inEditMode.status && inEditMode.rowId === ele._id ?
                          (
                            !!ele.status?
                            <span className="switch switch-sm">
                            <label>
                              <input
                                type="checkbox"
                                name="isActive"
                                defaultChecked
                                onChange={(event) => setCurrentStatus(event.target.checked)}
                              />
                              <span></span>
                            </label>
                          </span>
                          :<span className="switch switch-sm">
                          <label>
                            <input
                              type="checkbox"
                              name="isActive"
                              onChange={(event) => setCurrentStatus(event.target.checked)}
                            />
                            <span></span>
                          </label>
                        </span>
                          ) :
                          (
                            !!ele.status ? 
                            <span className="label label-lg label-light-success label-inline font-weight-bold py-4">Active</span>
                          : <span className="label label-lg label-light-danger label-inline font-weight-bold py-4">Inactive</span>
                          )
                          }</td>
                          <td>
                          {
                                inEditMode.status && inEditMode.rowId === ele._id ? (
                                    <React.Fragment>
                                        <button
                                            className={"btn btn-primary btn-sm"}
                                            onClick={() => onSave({id: ele._id})}
                                        >
                                            Save
                                        </button>

                                        <button
                                            className={"btn btn-secondary btn-sm"}
                                            style={{marginLeft: 8}}
                                            onClick={() => onCancel()}
                                        >
                                            Cancel
                                        </button>
                                    </React.Fragment>
                                ) : (
                                  <>
                                <OverlayTrigger overlay={<Tooltip id="url-edit-tooltip">Edit URL</Tooltip>} >
                                  <button className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3" onClick={() => onEdit({id: ele._id, currentUrl: ele.url, currentStatus: ele.status})} >
                                    <span className="svg-icon svg-icon-md svg-icon-primary">
                                      <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")} />
                                    </span>
                                  </button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip id="url-delete-tooltip">Delete URL</Tooltip>} >
                                  <button className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3" onClick={() => deleteUrl(ele._id)} >
                                    <span className="svg-icon svg-icon-md svg-icon-primary">
                                    <i className="text-dark-50 flaticon-delete icon-md mr-5"></i>
                                    </span>
                                  </button>
                                </OverlayTrigger>
                                </>
                                )
                            }
                            </td>
                      </tr>                                
                  )
              }
              {
                inCreateMode &&
                <tr>
                  <td colSpan="4">
                    <input className={createInvalid?"form-control is-invalid":"form-control"} onChange={(event) => setCurrentUrl(event.target.value)} style={{width:'100%'}} />
                    <span className={"form-text text-muted"}>
                      Please enter <b>URL</b> <code>(URL should start with http:// or https:// (e.g. https://xxxxxx.com))</code>
                    </span>  
                  </td>
                  <td>
                  <React.Fragment>
                        <button
                            className={"btn btn-primary btn-sm"}
                            onClick={() => onSave({id: null})}
                        >
                            Save
                        </button>

                        <button
                            className={"btn btn-secondary btn-sm"}
                            style={{marginLeft: 8}}
                            onClick={() => onCreateCancel()}
                        >
                            Cancel
                        </button>
                    </React.Fragment>
                  </td>
                </tr>
              }          
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
