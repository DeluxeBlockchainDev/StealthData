/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/clients/clientsActions";
import { clientsSlice, callTypes } from "../../../_redux/clients/clientsSlice";
import * as subscriptionActions from "../../../../Auth/_redux/subscription/subscriptionsActions";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { ClientEditForm } from "../client-edit/ClientEditForm";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { ChoosePackage } from "./ChoosePackage";
import { ClientBillingEditForm } from "./ClientBillingAddressForm";
import { ClientReviewEditForm } from "./ClientReviewEditForm";
import { makeRecurringPayment, makeCheckPayment } from "../../../_redux/payment/paymentApis";
import { calculateAnnualPrice } from "../../../../../utils";
import { checkClientExists } from "../../../_redux/clients/clientsCrud";
import { Alert } from "react-bootstrap";
import ThankYou from "../../../../Auth/pages/ThankYou";
import Oops from "../../../../Auth/pages/Oops";

const { actions: clientsActions }  = clientsSlice;

const initClient = {
  _id: undefined,
  description: "",
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  websiteUrl: "",
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

export function ClientOnboarding({
  packageId
}) {

  // Tabs
  const [tab, setTab] = useState("basic");
  const [visitedTabs, 
  //  setVisitedTabs
  ] = useState(new Set());
  const dispatch = useDispatch();
  const [isSignupDone, setIsSignupDone] = useState(0);  // 0: default, 1: falied, 2: success
  const [thankyouDetails, setThankYouDetails] = useState(null);

  //const { user } = useSelector((state) => state.auth, shallowEqual);
  const { actionsLoading, clientForEdit, error } = useSelector(
    (state) => ({
      actionsLoading: state.clients.actionsLoading,
      clientForEdit: state.clients.clientForEdit,
      error: state.clients.error,
    }),
    shallowEqual
  );

  React.useEffect(() => {
    dispatch(subscriptionActions.fetchSubscriptions({}));
    dispatch(actions.updateClientForEdit(null));
  }, [dispatch]);

  const saveClient = (values) => {
    setThankYouDetails({
        customer: values.firstName + values.lastName,
        package: values.selectedSubscription.name + " $" + values.selectedSubscription.price,
        cardNumber: "************" + values.cardInfo.cardnumber.substr(values.cardInfo.cardnumber.length-4, 4)
    });
    let paymentData = {
      firstName: values.firstName,
      lastName: values.lastName,
      contactNo: values.contactNo,
      email: values.email,
      billingAddress: { ...values.billingAddress },
      amount: values.subscriptionType === 'a' ? calculateAnnualPrice(values.selectedSubscription.price, values.selectedSubscription.annualDiscount) : values.selectedSubscription.price,
      type: values.subscriptionType,
      subscriptionId: values.selectedSubscription._id
    };
    let paymentPromise;
    if( values.paymentType === 'credit' ) {
      paymentData['token'] = values.paymentToken;
      paymentPromise = makeRecurringPayment(paymentData);
    } else if ( values.paymentType === 'check' ) {
      paymentData['checkDetails'] = values.checkDetails;
      paymentPromise = makeCheckPayment(paymentData);
    } else {
      paymentPromise = new Promise((resolve) => resolve({
        data: {
          success: true,
          invoice: {
            _id: 'dummyInvoiceId'
          }
        }
      }))
    }

    const clientData = { ...values };
    clientData.paymentToken && delete clientData.paymentToken;
    clientData.checkDetails && delete clientData.checkDetails;
    delete clientData.selectedSubscription;
    delete clientData.billingAddress;
    delete clientData.subscriptionType;
    clientData.paymentType && delete clientData.paymentType;

    dispatch(clientsActions.startCall({ callType: callTypes.action }))
    paymentPromise
    .then((response) => {
      if(response.data.success){
        dispatch(actions.createClient({ ...clientData, invoiceId: response.data.invoice._id }, ({ success, data }) => 
        {
          if (success)
            backToClientsList()
          else
            setIsSignupDone(1);    
        } ))
      } else {
        setIsSignupDone(1);
        dispatch(clientsActions.catchError({ error: 'Unable To Process Payment!', callType: callTypes.action }));
      }
    }).catch(() => {
      setIsSignupDone(1);
      dispatch(clientsActions.catchError({ error: 'Unable To Process Payment!', callType: callTypes.action }));
    })
  };

  const backToClientsList = () => {
    // if (!user)
      setIsSignupDone(2);
  };

  const handleOnComplete = async (event) => {
    if( event.id === 'basic' ){
      try {
        const response = await checkClientExists(event.values.email);
        if( !response.data ) {
          setTab('account');
          visitedTabs.add('basic');
          visitedTabs.add('account');
        } else {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
          dispatch(actions.setClientErrors('Email already exists!'));
        }
      } catch(e) {
        dispatch(actions.setClientErrors('Server Error!'));
      }
    } else if( event.id === 'account' ){
      setTab('address');
      visitedTabs.add('address'); 
    } else if( event.id === 'address' ){
      setTab('review')
      visitedTabs.add('review');
    }
    dispatch(actions.updateClientForEdit(event.values));
  }

  const goBack = (event) => {
    if( event.id === 'account' ){
      setTab('basic')
    } else if( event.id === 'address' ){
      setTab('account')
    } else if( event.id === 'review' ){
      setTab('address');
    }
  }

  const navigateToTab = (_tab) => {
    visitedTabs.has(_tab) && setTab(_tab)
  }

  const reviewInformation = () => {
    setIsSignupDone(0);
  }

  return (
    <>
      {!isSignupDone && <ul className="nav nav-tabs nav-tabs-line custom-tabs " role="tablist">
        <li className={`nav-item d-flex align-items-center ${tab === "basic" && "active"}`} onClick={() => navigateToTab("basic")}>
          <div className={`ml-3 py-2 px-4 rounded text-center font-weight-bold ${tab === "basic" ? "bg-primary text-white" : 'bg-light-primary text-primary' }`}>1</div>
          <a
            className={`ml-4 nav-link flex-column align-items-start`}
            data-toggle="tab"
            role="tab"
            aria-selected={(tab === "basic").toString()}
          >
            <h6>Create Your Profile</h6>
            <span>User & Company Information</span>
          </a>
        </li>
        <li className={`nav-item d-flex align-items-center ${tab === "account" && "active"}`} onClick={() => navigateToTab("account")}>
          <div className={`ml-3 py-2 px-4 rounded text-center font-weight-bold ${tab === "account" ? "bg-primary text-white" : 'bg-light-primary text-primary' }`}>2</div>
          <a
            className={`nav-link flex-column align-items-start`}
            data-toggle="tab"
            role="tab"
            aria-selected={(tab === "account").toString()}
          >
            <h6>Choose Your Package</h6>
            <span>Package & Location URL</span>
          </a>
        </li>
        <li className={`nav-item d-flex align-items-center ${tab === "address" && "active"}`} onClick={() => navigateToTab("address")}>
          <div className={`ml-3 py-2 px-4 rounded text-center font-weight-bold ${tab === "address" ? "bg-primary text-white" : 'bg-light-primary text-primary' }`}>3</div>
          
          <a
            className={`nav-link flex-column align-items-start`}
            data-toggle="tab"
            role="tab"
            aria-selected={(tab === "address").toString()}
          >
            <h6>Billing Details</h6>
            <span>Payment Method</span>
          </a>
        </li>
        {
          (!clientForEdit || !clientForEdit._id) &&
          <li className={`nav-item d-flex align-items-center ${tab === "review" && "active"}`} onClick={() => navigateToTab("review")}>
          <div className={`ml-3 py-2 px-4 rounded text-center font-weight-bold ${tab === "review" ? "bg-primary text-white" : 'bg-light-primary text-primary' }`}>4</div>
            
            <a
              className={`mr-4 nav-link flex-column align-items-start`}
              data-toggle="tab"
              role="tab"
              aria-selected={(tab === "review").toString()}
            >
              <h6>Submission</h6>
              <span>Review and Submit</span>
            </a>
          </li>
        }
      </ul>}
      {!isSignupDone && <Card style={{borderTopLeftRadius:0, boxShadow:'none'}}>
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
            {tab === "basic" && (
              <ClientEditForm
                id="basic"
                actionsLoading={actionsLoading}
                client={clientForEdit || initClient}
                saveClient={saveClient}
                onComplete={handleOnComplete}
                goBack={goBack}
              />
            )}
            {tab === "account" && (
              <ChoosePackage
                id="account"
                actionsLoading={actionsLoading}
                client={clientForEdit || initClient}
                onComplete={handleOnComplete}
                saveClient={saveClient}
                goBack={goBack}
                packageId={packageId}
              />
            )}
            {tab === "address" && (
              <ClientBillingEditForm
                id="address"
                actionsLoading={actionsLoading}
                client={clientForEdit || initClient}
                onComplete={handleOnComplete}
                saveClient={saveClient}
                goBack={goBack}
              />
            )}
            {tab === "review" && (
              <ClientReviewEditForm
                id="review"
                actionsLoading={actionsLoading}
                client={clientForEdit || initClient}
                saveClient={saveClient}
                goBack={goBack}
                navigateToTab={navigateToTab}
              />
            )}
          </div>
        </CardBody>
      </Card>}
      {isSignupDone === 2 && <ThankYou details={thankyouDetails}/>}
      {isSignupDone === 1 && <Oops details={thankyouDetails} reviewInformation={reviewInformation} />}
    </>
  );
}
