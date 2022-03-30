/* eslint-disable no-restricted-imports */
import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { exportAllVisitors } from "../../../_redux/visitors/visitorsCrud";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

const startDate = new Date();
const initDate = `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`;
export function VisitorsExportDialog({ show, onHide }) {
  const [isExportProcessing, setIsExportProcessing] = React.useState(false);
  const [filterDates, setFilterDates] = React.useState({
    startDate: initDate,
    endDate: initDate,
  });

  const { clientData } = useSelector(
    (state) => ({ clientData: state.auth.clientData }),
    shallowEqual
  );

  const exportVisitors = () => {
    const date = new Date();
    setIsExportProcessing(true);
    if( clientData.apps && clientData.apps.length && clientData.apps[0].loginAPIAccessKey ) {
      exportAllVisitors({ loginAPIAccessKey: clientData.apps[0].loginAPIAccessKey, filters: {...filterDates} }).then((resp) =>{
        setIsExportProcessing(false);
        const a = document.createElement("a");
        a.href =  process.env.REACT_APP_API_URL + resp.data.fileName.substring(1);
        a.setAttribute("download", `visitors-${date.toLocaleDateString()}.xlsx`);
        a.click();
        onHide();
      }).catch((e) => {
        setIsExportProcessing(false);
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {isExportProcessing && <ModalProgressBar variant="query" />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Export Visitors
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isExportProcessing && (
          <div className="row">
            <div className="col-12">
              <small className="form-text text-muted mb-1">
                Select <b>Date Range</b>:
              </small>
              <DateRangePicker
                initialSettings={{}}
                onApply={
                  (event, picker) =>{
                    setFilterDates(picker)
                    const { startDate, endDate } = picker;
                    setFilterDates({
                      startDate: startDate.format('YYYY/M/D'),
                      endDate: endDate.format('YYYY/M/D'),
                    })
                  }
                }
              >
                <input type="text" className="form-control" />
              </DateRangePicker>
            </div>
          </div>
        )}
        { isExportProcessing && 
          <Spinner animation="border" color="primary" size="lg" variant="light"  />
        }
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={exportVisitors}
            className="btn btn-success btn-elevate"
          >
            Export
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
