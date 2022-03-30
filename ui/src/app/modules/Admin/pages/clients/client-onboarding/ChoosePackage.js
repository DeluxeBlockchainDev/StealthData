// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, {useEffect} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { shallowEqual, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import renderHTML from 'react-render-html';
import clsx from "clsx";
import { isEqual } from "lodash";
import { calculateAnnualPrice } from "../../../../../utils";

// Validation schema
const ClientEditSchema = ({_id}) => Yup.object().shape({
  subscriptionId: Yup.string()
    .required("Package is required"),
});

export function ChoosePackage({
  client,
  onComplete,
  goBack,
  id,
  fromProfile,
  packageId
}) {
  const [ subscriptionType, 
   // setSubscriptionType 
  ] = React.useState('m') // m = monthly / a = annual
  const { subscriptions } = useSelector(
    (state) => ({ subscriptions: state.subscriptions.entities.filter((subscription) => subscription.isCustomPackage !== true ) }),
    shallowEqual
  );

  const { customSubscriptions } = useSelector(
    (state) => ({ customSubscriptions: state.subscriptions.entities.filter((subscription) => subscription.isCustomPackage === true ) }),
    shallowEqual
  );
  
  useEffect(() => {
    if (packageId && client.firstName){
      const customSubscription = customSubscriptions.find((subscription) => subscription._id === packageId);
      onComplete({id, values: {  ...client, selectedSubscription: {...customSubscription}, subscriptionId: customSubscription._id, subscriptionType }})
    }
  }, [packageId, client, customSubscriptions, id, onComplete, subscriptionType ]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={client}
        validationSchema={ClientEditSchema(client)}
        onSubmit={(values) => {
          onComplete({ id, values: { ...values, subscriptionType } })
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <>
            <Form className="form form-label-right mx-auto" style={{width:'100%'}}>
              {/* <div className="d-flex mb-10 justify-content-center">
                <ButtonGroup aria-label="Basic example">
                  <Button size="lg" variant={ subscriptionType === 'm' ? "outline-primary" : "primary" } onClick={() => setSubscriptionType('a')}>Annual</Button>
                  <Button size="lg" variant={ subscriptionType === 'a' ? "outline-primary" : "primary" } onClick={() => setSubscriptionType('m')} >Monthly</Button>
                </ButtonGroup>
              </div> */}
              <div className="my-15 d-flex">
                {
                  subscriptions
                  .filter((subscription) => subscription.isActive === true)
                  .map((subscription) => 
                    <Card style={{width:'300px', height:'500px', transition: 'all 0.5s ease-in', ...( isEqual(subscription._id, values['subscriptionId']) ? { transform: 'scale(1.1)', zIndex: '1' } : {} ) }} className={clsx({ 'bg-primary': isEqual(subscription._id, values['subscriptionId']) })}>
                      <CardHeader className="border-0" /> 
                      <CardBody className="justify-content-around d-flex flex-column"  onClick={() => { if (fromProfile) return; setFieldValue( 'subscriptionId', subscription._id ); setFieldValue('selectedSubscription', {...subscription}); handleSubmit();}} >
                        <h6 className={clsx("text-center mb-auto text-uppercase", { "text-white" : isEqual(subscription._id, values['subscriptionId']) } )}>
                          {subscription.name}
                        </h6>
                        <div className={`h3 py-3 px-4 m-auto rounded text-center font-weight-bold ${isEqual( subscription._id, values['subscriptionId']) ? "bg-white text-primary" : 'bg-light text-dark' }`}>
                          ${ subscriptionType === 'a' ? calculateAnnualPrice(subscription.price, subscription.annualDiscount) : subscription.price}
                          <div className="text-muted mb-0" style={{fontSize:'0.8rem'}}>per { subscriptionType === 'm' ? 'month': 'year' }</div>
                        </div>
                          {
                            subscription.html && 
                            <div className={clsx("m-auto text-center", { "text-white" : isEqual(subscription._id, values['subscriptionId']) } )}>
                              { renderHTML(subscription.html) }
                            </div>
                          }
                        {!fromProfile && <Button
                          variant={ isEqual(subscription._id, values['subscriptionId']) ? "light" : "primary" }
                          block
                          style={{maxWidth:'150px'}}
                          className="m-auto"
                          onClick={() => { setFieldValue('subscriptionId', subscription._id); setFieldValue('selectedSubscription', {...subscription}); handleSubmit(); }}
                        >
                          { isEqual(subscription._id, values['subscriptionId']) ? "Selected" : "Choose" }
                        </Button>}
                      </CardBody>
                    </Card>
                  )
                }
              </div>
              {!fromProfile && 
              <div className="mt-10 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary btn-lg mr-2"
                  onClick={() => goBack({ id })}
                >Back</button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  onSubmit={() => handleSubmit()}
                >
                  Next
                </button>
              </div>}
              
              {fromProfile && 
              <div className="mt-10 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    var selected = subscriptions.find((subscription) => subscription._id === values['subscriptionId'])
                    if (selected) {
                      var upgrade = subscriptions.find((subscription) => subscription.listOrder === (selected.listOrder + 1))
                      if (upgrade) {
                        setFieldValue('subscriptionId', upgrade._id); 
                        setFieldValue('selectedSubscription', {...upgrade});
                        setFieldValue('updateType', "upgrade");
                        handleSubmit();
                      }
                    }
                  }}
                >
                  Upgrade
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-lg ml-5"
                  onClick={() => {
                    var selected = subscriptions.find((subscription) => subscription._id === values['subscriptionId'])
                    if (selected) {
                      var upgrade = subscriptions.find((subscription) => subscription.listOrder === (selected.listOrder - 1))
                      if (upgrade) {
                        setFieldValue('subscriptionId', upgrade._id); 
                        setFieldValue('selectedSubscription', {...upgrade});
                        setFieldValue('updateType', "downgrade");
                        handleSubmit();
                      }
                    }
                  }}
                >
                  Downgrade
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-lg ml-5"
                  onClick={() => {
                    setFieldValue('subscriptionId', null); 
                    setFieldValue('selectedSubscription', null);
                    setFieldValue('updateType', "cancel");
                    handleSubmit();
                  }}
                >
                  Cancel Subscription
                </button>
              </div>}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
