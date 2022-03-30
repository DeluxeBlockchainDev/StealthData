/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/clients/clientsActions";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { ClientEditForm } from "./ClientEditForm";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { Alert } from "react-bootstrap";

const initClient = {
  _id: undefined,
  description: "",
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  websiteUrl: "",
  isAdditionalFee : false,
  companyName: "",
  contactNo: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    zipcode: "",
    state: "",
    country: "",
  }
};

export function ClientEdit({
  history,
  match: {
    params: { id },
  },
}) {
  // Subheader
  const suhbeader = useSubheader();

  // Tabs
  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const { actionsLoading, clientForEdit, error } = useSelector(
    (state) => ({
      actionsLoading: state.clients.actionsLoading,
      clientForEdit: state.clients.clientForEdit,
      error: state.clients.error,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchClient(id));
  }, [id, dispatch]);

  useEffect(() => {
    let _title = id ? "" : "New Client";
    if (clientForEdit && id) {
      _title = `Edit client - ${clientForEdit.name}'`;
    }

    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientForEdit, id]);

  const saveClient = (values) => {
    if (!id) {
      dispatch(actions.createClient(values, ({ success, data }) => { success && backToClientsList() }) );
    } else {
      dispatch(actions.updateClient(values, ({ success, data }) => { success && backToClientsList()}) );
    }
  };

  const backToClientsList = () => {
    history.push(`/admin/clients`);
  };

  const handleOnComplete = (event) => {
    dispatch(actions.updateClientForEdit(event.values));
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-5">
        <button
          type="button"
          onClick={backToClientsList}
          className="btn btn-light"
        >
          <i className="fa fa-arrow-left"></i>
          Back
        </button>
      </div>
      <Card style={{borderTopLeftRadius:0, boxShadow:'none'}}>
        {actionsLoading && <ModalProgressBar />}
        <CardBody className="pt-20">
          {
            error &&
            <div className="">
              <Alert key={'danger'} variant={"danger"} dismissible onClose={() =>  dispatch(actions.clearClientErrors())}>
                {error}
              </Alert>
            </div>
          }
          <div className="mt-5">
              <ClientEditForm
                id="basic"
                actionsLoading={actionsLoading}
                client={clientForEdit || initClient}
                saveClient={saveClient}
                onComplete={handleOnComplete}
              />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
