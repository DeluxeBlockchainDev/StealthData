/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../Admin/_redux/clients/clientsActions";
import { ClientEditForm } from "../../../Admin/pages/clients/client-edit/ClientEditForm";
import { useSubheader } from "../../../../../_metronic/layout";
import { Card, CardBody, ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { Alert } from "react-bootstrap";
import { ClientBillingEditForm } from "../../../Admin/pages/clients/client-onboarding/ClientBillingAddressForm";
import { ClientBillingForm } from "../../../Admin/pages/clients/client-edit/ClientBillingForm";


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

export function BillingProfile({
  history,
}) {
  // Subheader
  const suhbeader = useSubheader();

  // Tabs
  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const { actionsLoading, clientForEdit, user, error } = useSelector(
    (state) => ({
      actionsLoading: state.clients.actionsLoading,
      clientForEdit: state.clients.clientForEdit,
      error: state.clients.error,
      user: state.auth.user,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchClient(user.id));
  }, [user, dispatch]);

  useEffect(() => {
    suhbeader.setTitle(`User Profile - ${user.firstName || ''} ${user.lastName || ''}`);
  }, []);

  const saveClient = (values) => {
    dispatch(actions.updateClient(values, ({ success, data }) => { success && back() }) );
  };

  const back = () => {
    history.push(`/dashboard`);
  };

  const updatePackage = (values) => {
    dispatch(actions.updateClient(values, ({ success, data }) => { success && successUpdatePackage(values.updateType)}) );
  }

  const successUpdatePackage = (updateType) => {
    if (updateType == "cancel")
      window.location.href="/logout";
    else
      window.location.href="/user-profile";
  }

  return (
    <Card style={{borderTopLeftRadius:0, boxShadow:'none'}}>
        {actionsLoading && <ModalProgressBar />}
        <CardBody className="pt-20">
        {
          error &&
          <div className="">
            <Alert key={'danger'} variant={"danger"} dismissible onClose={() => dispatch(actions.clearClientErrors())}>
              {error}
            </Alert>
          </div>
        }
        <div className="mt-5">
            <ClientBillingForm
                id="basic"
                actionsLoading={actionsLoading}
                client={clientForEdit || initClient}
                updatePackage={(data) => {updatePackage(data);}}
            />
        </div>
        </CardBody>
    </Card>
  );
}
