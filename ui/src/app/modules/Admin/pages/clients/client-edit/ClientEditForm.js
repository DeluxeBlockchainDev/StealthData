// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CustomInput } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useSelector } from "react-redux";
import { ChoosePackage } from "../client-onboarding/ChoosePackage";
import {
  Checkbox
} from "@material-ui/core";

// Validation schema
const ClientEditSchema = ({_id}) => Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Minimum 2 charachters")
    .max(255, "Maximum 255 charachters")
    .required("First Name is required"),
  lastName: Yup.string()
    .min(2, "Minimum 2 charachters")
    .max(255, "Maximum 255 charachters")
    .required("Last Name is required"),
  password: 
  !_id ? Yup.string()
    .min(6, "Minimum 6 charachters")
    .max(36, "Maximum 36 charachters")
    .required("Password is required")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    )
  :
    Yup.string()
      .notRequired()
      .min(6, "Minimum 6 charachters")
      .max(36, "Maximum 36 charachters"),
  email: Yup.string()
    .email("Field should be an email")
    .required("Email is required"),
  companyName: Yup.string()
    .max(255, "Maximum 255 charachters")
    .required("Company name is required")
    .matches(
      /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/,
      "Only accept numbers, letters, spaces and the underscore"
    ),
  websiteUrl: Yup.string()
    .url("Company URL should start with http:// or https:// (e.g. https://xxxxxx.com)")
    .max(255, "Maximum 255 charachters")
    .required("Company URL is required")
    .matches(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/, "Please input correct website url"),
  contactNo: Yup.string()
    .max(255, "Maximum 255 charachters")
    .required("Contact No is required"),
  getResponseApiKey: Yup.string(),
  file: Yup.mixed(),
  address: Yup.object().shape({
    line1: Yup.string()
      .max(255, "Maximum 255 charachters")
      .required("line1 is required"),
    line2: Yup.string()
      .notRequired()
      .max(255, "Maximum 255 charachters"),
    city: Yup.string()
      .required("City is required")
      .max(255, "Maximum 255 charachters"),
    zipcode: Yup.string()
      .required("Zipcode is required")
      .max(255, "Maximum 255 charachters"),
    state: Yup.string()
      .required("State is required")
      .max(255, "Maximum 255 charachters"),
  }),
  isAdditionalFee: Yup.string()
});

/*const getDataUrl = (file) => new Promise((resolve) => {
  let reader = new FileReader();

  reader.onloadend = () => {
    resolve(reader.result);
  };
  reader.readAsDataURL(file);
});*/

export function ClientEditForm({
  client,
  onComplete,
  saveClient,
  id
}) {
 // const [avatarThumbnail, setAvatarThumbnail] = React.useState(null);
  const [showPackage, setShowPackage] = React.useState(false);
  const [activeSubscription, setActiveSubscription] = React.useState({_id: ""});
  const [updatePaymentMethod, setUpdatePaymentMethod] = React.useState(false);
  // const { subscriptions } = useSelector(
  //   (state) => ({ subscriptions: state.subscriptions.entities }),
  //   shallowEqual
  // );
  // const { user } = useSelector(
  //   (state) => ({ user: state.auth.user }),
  //   shallowEqual
  // );

  const { actionsLoading, clientForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.clients.actionsLoading,
      clientForEdit: state.clients.clientForEdit,
      //error: state.clients.error,
    }),
    shallowEqual
  );

/*  React.useEffect(() => {
    (async () => {
      if (client.file) {
        setAvatarThumbnail(await getDataUrl(client.file))
      }
      if (client.activeSubscription) {
        setActiveSubscription(client.activeSubscription)
      }
    })()
  }, [client]);

  React.useEffect(() => {
    if ( client.avatar ){
      setAvatarThumbnail(process.env.REACT_APP_API_URL + client.avatar)
    }
  }, [client.avatar]);
*/
  const isEditForm = () => client && client._id;

  const handleChangePackage = () => {
    // setShowPackage(true);
    window.location.href="/packages-and-billing";
  }

  const handleOnChangePackage = (data) => {
    if (data.values.selectedSubscription)
      setActiveSubscription(data.values.selectedSubscription);  
    setShowPackage(false);
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={client}
        validationSchema={ClientEditSchema(client)}
        onSubmit={(values) => {
          values.subscriptionId = activeSubscription._id
          client && client._id ? saveClient(values) : onComplete({ id, values })
        }}
      >
        {({ handleSubmit, values, handleChange, setFieldValue, errors }) => (
          <>
            <Form className="form form-label-righ mx-auto" style={{width:'100%'}}>
              <div className="form-group mb-15">
                <h4>Profile Information:</h4>
              </div>
              {/* <div className="form-group row mt-5">
                <label className="col-xl-3 col-lg-3 col-form-label">Company Logo</label>
                <div className="col-lg-9 col-xl-6">
                  <div
                    className="image-input image-input-outline"
                    id="kt_profile_avatar"
                    style={{
                      backgroundImage: `url(${toAbsoluteUrl(
                        "/media/users/blank.png"
                      )}`,
                    }}
                  >
                    <div
                      className="image-input-wrapper"
                      style={{ backgroundImage: `url(${avatarThumbnail})` }}
                    />
                    <label
                      className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                      data-action="change"
                      data-toggle="tooltip"
                      title=""
                      data-original-title="Change avatar"
                    >
                      <i className="fa fa-pen icon-sm text-muted"></i>
                      <input
                        type="file"
                        name="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={(event) => {
                          setFieldValue("file", event.currentTarget.files[0]);
                          if(event.currentTarget.files[0]) {
                            getDataUrl(event.currentTarget.files[0]).then(setAvatarThumbnail)
                          }
                        }}
                      />
                      <input type="hidden" name="profile_avatar_remove" />
                    </label>
                    <span
                      className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                      data-action="cancel"
                      data-toggle="tooltip"
                      title=""
                      data-original-title="Cancel avatar"
                    >
                      <i className="ki ki-bold-close icon-xs text-muted"></i>
                    </span>
                    <span
                      onClick={removePic}
                      className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                      data-action="remove"
                      data-toggle="tooltip"
                      title=""
                      data-original-title="Remove avatar"
                    >
                      <i className="ki ki-bold-close icon-xs text-muted"></i>
                    </span>
                  </div>
                  <span className="form-text text-muted">
                    Allowed file types: png, jpg, jpeg.
                  </span>
                </div>
              </div> */}
              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>First Name</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="firstName"
                    component={CustomInput}
                    placeholder="First Name"
                    label="First Name"
                 >
                  </Field>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Last Name</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="lastName"
                    component={CustomInput}
                    placeholder="Last Name"
                    label="Last Name"
                 >
                  </Field>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Company Name</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="companyName"
                    component={CustomInput}
                    disabled={isEditForm()}
                    placeholder="Company Name"
                    label="Company Name"
                    helperText="If you want your invoices addressed to a company. Leave blank to use your full name."
                  >
                  </Field>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Contact Phone</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="contactNo"
                    component={CustomInput}
                    placeholder="Contact Phone"
                    label="Contact Phone"
                    prependComponent={<i className="flaticon2-phone" />}
                  >
                  </Field>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Email</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="email"
                    component={CustomInput}
                    placeholder="Email"
                    label="Email"
                    prependComponent={"@"}
                  >
                  </Field>
                </div>
              </div>
              
              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Company URL</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="websiteUrl"
                    component={CustomInput}
                    placeholder="Company URL"
                    label="Company URL"
                    helperText="URL to install Stealth Data tracking pixel."
                  >
                  </Field>
                </div>
              </div>

              {/* <div className="form-group row">
                <div className="col-lg-3">
                  <label>Description</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="description"
                    component={CustomInput}
                    placeholder="Description"
                    label="Description"
                 >
                  </Field>
                </div>
              </div> */}
              
              {/* {
                user && user.isAdmin &&
                <div className="form-group row">
                  <div className="col-lg-3">
                    <label>Get Response Api Key</label>
                  </div>
                  <div className="col-lg-9">
                    <Field
                      name="getResponseApiKey"
                      component={CustomInput}
                      placeholder="Get Response Api Key"
                      label="Get Response Api Key"
                  >
                    </Field>
                  </div>
                </div>
              } */}
              {client && client._id && <>
              <hr />
              <div className="form-group mb-12 mt-12">
                <h4>Packages and Billings:</h4>
              </div>

              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger"></span>Package</label>
                </div>
                <div className="col-lg-9">
                  <div className="d-none">
                  <Field
                    name="activeSubscription._id"
                    component={CustomInput}
                    value={activeSubscription._id}
                  />
                  </div>
                  {activeSubscription && activeSubscription.name}
                  &nbsp;
                  (${activeSubscription && activeSubscription.price} / Month - {activeSubscription.uniqueVisitorsMonthlyLimit} Identified Visitors)
                  &nbsp;&nbsp;<span style={{color:"#1fa8e1", cursor:"pointer"}} onClick={() => handleChangePackage()}>Change Package</span>
                </div>
              </div>
              {showPackage && <div className="form-group row">
                <div className="col-lg-12">
                  <ChoosePackage
                    id="profile"
                    actionsLoading={actionsLoading}
                    client={clientForEdit}
                    onComplete={handleOnChangePackage}
                    fromProfile={true}
                  />
                </div>
              </div>}
              <div className="form-group row">
                <div className="col-lg-3">
                  <label>Current Usage</label>
                </div>
                <div className="col-lg-9">
                  <span>You have identified {client.uniqueVisitorsMonthly} of {activeSubscription.uniqueVisitorsMonthlyLimit}</span>
                  <br/>
                  <span>Additional identified over {activeSubscription.uniqueVisitorsMonthlyLimit} are billed at ${activeSubscription.additionalFee} per</span>
                  <br/>                  
                  <Checkbox
                    checked={values.isAdditionalFee}
                    onChange={handleChange}
                    style={{color: "green"}}
                    name="isAdditionalFee"
                    inputProps={{
                      "aria-label": "primary checkbox"
                    }}
                  />
                  <span style={{color:"green"}}>Yes, please bill me for additional Identified if I go over.</span>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <label>Billing Info</label>
                </div>
                <div className="col-lg-9">
                  Card Number : ************{client && client.cardInfo && client.cardInfo.cardnumber.substr(client.cardInfo.cardnumber.length-4, 4)}
                  &nbsp;&nbsp;<span style={{color:"#1fa8e1", cursor:"pointer"}} onClick={() => {setUpdatePaymentMethod(true)}}>update payment method</span>
                  <br/><br/>
                  
                  <div className={updatePaymentMethod ? "" : "d-none"}>
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
                  </div>
                </div>
              </div>
              </>}
              <hr />
              <div className="form-group mb-12 mt-12">
                <h4>Company Address:</h4>
              </div>

              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Address Line 1</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="address.line1"
                    component={CustomInput}
                    placeholder="Address Line 1"
                    label="Address Line 1"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-3">
                  <label>Address Line 2</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="address.line2"
                    component={CustomInput}
                    placeholder="Address Line 2"
                    label="Address Line 2"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>City</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="address.city"
                    component={CustomInput}
                    placeholder="City"
                    label="City"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>State / Province / Region</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="address.state"
                    component={CustomInput}
                    placeholder="State / Province / Region"
                    label="State / Province / Region"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Zip /  Postal Code</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="address.zipcode"
                    component={CustomInput}
                    placeholder="Zip /  Postal Code"
                    label="Zip /  Postal Code"
                  />
                </div>
              </div>

              <hr className="mt-15" />
              <div className="form-group mb-12 mt-12">
                <h4>Account:</h4>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Username</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="username"
                    component={CustomInput}
                    placeholder="Username"
                    label="Username"
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <label><span className="text-danger">*</span>Password</label>
                </div>
                <div className="col-lg-9">
                  <Field
                    name="password"
                    type="password"
                    component={CustomInput}
                    placeholder="Password"
                    customFeedbackLabel="Password must contain at least 8 characters, one uppercase, one number and one special case character"
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                {
                  client && client._id ?
                  <>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      onSubmit={() => handleSubmit()}
                    >
                      Save
                    </button>
                  </>
                  :
                  <>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      onSubmit={() => handleSubmit()}
                    >
                      Next
                    </button>
                  </>
                }
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
