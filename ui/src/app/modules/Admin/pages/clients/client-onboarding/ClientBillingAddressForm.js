// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, ButtonGroup } from "react-bootstrap";
import { PaymentForm } from "./PaymentForm";
import { CustomInput, Select } from "../../../../../../_metronic/_partials/controls";
import { calculateAnnualPrice } from "../../../../../utils";

const checkDetailShape = {
  accountNumber: Yup.number()
    .required(),
  routingNumber: Yup.string()
    .length(9, "Must be 9 characters long")
    .required(),
  checkType: Yup.string()
    .required(),
  accountType: Yup.string()
    .required(),
}
// Validation schema
const ClientEditSchema = ({type}) => Yup
  .object()
  .shape({
    ...( type === 'credit' ?
      {
        paymentToken: Yup.string()
          .required() 
      } 
      : type === 'check' ?
      {
        checkDetails: Yup.object()
        .shape(checkDetailShape)
        .required() 
      } 
      : {}
      ),
    billingAddress: Yup.object()
    .shape({
      line1: Yup.string()
        .max(255, "Maximum 255 charachters")
        .required("line1 is required"),
      line2: Yup.string()
        .notRequired()
        .max(255, "Maximum 255 charachters"),
      city: Yup.string()
        .notRequired()
        .max(255, "Maximum 255 charachters"),
      zipcode: Yup.string()
        .required("Zipcode is required")
        .max(255, "Maximum 255 charachters"),
      state: Yup.string()
      .notRequired()
      .max(255, "Maximum 255 charachters")
    })
  });

export function ClientBillingEditForm({
  client,
  onComplete,
  goBack,
  id
}) {
  // const [ paymentType, setPaymentType ] = React.useState( client.paymentType ? client.paymentType : 'credit'); // removing payment
  const [ paymentType, setPaymentType ] = React.useState( client.paymentType ? client.paymentType : '');
  const [ subscription, setSubscription ] = React.useState(null);
  const [ checkBillingAddress, 
    //setCheckBillingAddress 
  ] = React.useState(false);

  React.useEffect(() => {
    client && client.selectedSubscription && setSubscription(client.selectedSubscription);
  }, [client]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={client}
        validationSchema={ClientEditSchema({ type: paymentType })}
        onSubmit={(values) => onComplete({ 
            id, 
            values: { 
              ...values, 
              paymentType, 
              ...( paymentType === 'check' ? { accountNumber: + values.accountNumber } : {} ) 
            } 
          })
        }
      >
        {({ handleSubmit, setFieldValue, errors }) => (
          <>
            <Form className="form form-label-right mx-auto" style={{width:'65%'}}>
              { !!paymentType && 
                <div className="d-flex mb-10 justify-content-center">
                  <ButtonGroup aria-label="Basic example">
                    <Button size="lg" variant={ paymentType === 'credit' ? "outline-primary" : "primary" } onClick={() => setPaymentType('check')}>Bank ACH</Button>
                    <Button size="lg" variant={ paymentType === 'check' ? "outline-primary" : "primary" } onClick={() => setPaymentType('credit')} >Credit Card</Button>
                  </ButtonGroup>
                </div> 
              }

              <div className="form-group mb-15">
                <h4>Card Details:</h4>
              </div>

              <div className="form-group row">
                <div className="col-lg-6">
                  <label><span className="text-danger">*</span>Card holders name</label>
                  <Field
                    name="cardInfo.name"
                    component={CustomInput}
                    placeholder="Card holders name"
                    label="Card holders name"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-6">
                  <label><span className="text-danger">*</span>Card Number</label>
                  <Field
                    name="cardInfo.cardnumber"
                    component={CustomInput}
                    placeholder="Card Number"
                    label="Card Number"
                  />
                </div>
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>CVV</label>
                  <Field
                    name="cardInfo.cvv"
                    component={CustomInput}
                    placeholder="CVV"
                    label="CVV"
                  />
                </div>
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Expire Date</label>
                  <Field
                    name="cardInfo.expiredate"
                    component={CustomInput}
                    placeholder="Expire Date"
                    label="Expire Date"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-12">
                  <img alt="" src="/media/Auth.net-logo.png" className="mr-4" height="50"/>
                  <img alt="" src="/media/credit-card-icons.png" className="mr-4" height="50"/>
                </div>
              </div>
              <br/><br/><br/><br/>
              <div className="form-group mb-15">
                <h4>Billing Address:</h4>
                <br/><br/>
                <div className="checkbox-inline">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name="checkBillingAddress"
                      value={checkBillingAddress}
                      onChange={(e)=> {
                        if (e.target.checked) {
                          setFieldValue('billingAddress.line1', client.address.line1)
                          setFieldValue('billingAddress.line2', client.address.line2)
                          setFieldValue('billingAddress.city', client.address.city)
                          setFieldValue('billingAddress.state', client.address.state)
                          setFieldValue('billingAddress.zipcode', client.address.zipcode)
                        } else {                      
                          setFieldValue('billingAddress.line1', '')
                          setFieldValue('billingAddress.line2', '')
                          setFieldValue('billingAddress.city', '')
                          setFieldValue('billingAddress.state', '')
                          setFieldValue('billingAddress.zipcode', '')
                        }
                      }}
                    />
                    <span></span>Same as Company Address?
                  </label>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-12">
                  <label><span className="text-danger">*</span>Address Line 1</label>
                  <Field
                    name="billingAddress.line1"
                    component={CustomInput}
                    placeholder="Address Line 1"
                    label="Address Line 1"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-12">
                  <label>Address Line 2</label>
                  <Field
                    name="billingAddress.line2"
                    component={CustomInput}
                    placeholder="Address Line 2"
                    label="Address Line 2"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-4">
                  <label><span className="text-danger">*</span>City</label>
                  <Field
                    name="billingAddress.city"
                    component={CustomInput}
                    placeholder="City"
                    label="City"
                  />
                </div>
                <div className="col-lg-4">
                  <label><span className="text-danger">*</span>State</label>
                  <Field
                    name="billingAddress.state"
                    component={CustomInput}
                    placeholder="State"
                    label="State"
                  />
                </div>
                <div className="col-lg-4">
                  <label><span className="text-danger">*</span>Zipcode</label>
                  <Field
                    name="billingAddress.zipcode"
                    component={CustomInput}
                    placeholder="Zipcode"
                    label="Zipcode"
                  />
                </div>
              </div>

              <hr />
              
              {
                !!paymentType && 
                <>
                  <div className="form-group mt-10">
                    <h4>Billing Information:</h4>
                  </div>
                  {
                    paymentType === 'credit' ?
                      <PaymentForm
                        {
                          ...( subscription && subscription.price && { amount: client.subscriptionType === 'a' ? calculateAnnualPrice(subscription.price, subscription.annualDiscount) : subscription.price } )
                        }
                        onSuccess={(token) => { setFieldValue('paymentToken', token); handleSubmit(); }}
                      />
                    :
                      paymentType === 'check' ?
                      <>
                        <div className="form-group row">
                          <div className="col-12 col-lg-12">
                            <label><span className="text-danger">*</span>Account Number</label>
                            <Field
                              name="checkDetails.accountNumber"
                              component={CustomInput}
                              placeholder="Account Number"
                              label="Account Number"
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-12 col-lg-12">
                            <label><span className="text-danger">*</span>Routing Number</label>
                            <Field
                              name="checkDetails.routingNumber"
                              component={CustomInput}
                              placeholder="Routing Number"
                              label="Routing Number"
                            />
                          </div>
                        </div>

                        <div className="form-group row">

                          <div className="col-12 col-lg-6">
                            <Select name="checkDetails.accountType" label="Account Type">
                                <option key={""} value={""}>Select</option>
                                <option key={"CHECKING"} value={"CHECKING"}>Checking</option>
                                <option key={"SAVINGS"} value={"SAVINGS"}>Saving</option>
                            </Select>
                            
                          </div>

                          <div className="col-12 col-lg-6">
                            <Select name="checkDetails.checkType" label="Check Type">
                                <option key={""} value={""}>Select</option>
                                <option key={"PERSONAL"} value={"PERSONAL"}>Personal</option>
                                <option key={"BUSINESS"} value={"BUSINESS"}>Business</option>
                            </Select>
                          </div>
                        </div>

                      </>
                    : null 
                  }
                </>
              }
              
              <div className="d-flex justify-content-end mt-10">
                <button
                  type="button"
                  className="btn btn-primary btn-lg mr-2"
                  onClick={() => goBack({ id })}
                >
                  Back
                </button>
                {
                  (!paymentType || paymentType === 'check') &&
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    onSubmit={() => handleSubmit()}
                  >
                    Next
                  </button>

                }
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
