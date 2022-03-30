// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../../Auth/_redux/subscription/subscriptionsActions";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-twilight";
import { Alert } from "react-bootstrap";

 // Validation schema
 const PackageEditSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Minimum 2 charachters")
    .max(255, "Maximum 255 charachters")
    .required("Name is required"),
  listOrder: Yup.number(),
  additionalFee: Yup.number(),
  uniqueVisitorsMonthlyLimit:  Yup.number()
    .required("Monthly visitor Limit is required"),
  isHotPriorityAllowed: Yup.bool()
    .required("Can access analytics is required"),
  isDashboardAllowed: Yup.bool()
  .required("Can tag HOT leads? is required"),
  isEmailCampaignsAllowed: Yup.bool()
  .required("Email Campaigns Allowed? is required"),
  isCrmMatchingAllowed: Yup.bool()
  .required("Can Match Crm? is required"),
	isVisits:  Yup.bool(),
	isUrlsViewed:  Yup.bool(),
	isLeadPriority: Yup.bool(),
	isCrmMatched: Yup.bool(),
  isDashboardCrmMatched: Yup.bool(),
	isMonthlyLeadPriority: Yup.bool(),
	isMonthlyEmailStats: Yup.bool(),
	isTop5Urls: Yup.bool(),
	isTopVisitors: Yup.bool(),
	isAccessToCorporate: Yup.bool(),
	isAdvancedXLSXExport: Yup.bool(),
	customUrlTracking: Yup.bool(),
	customLeadPriority: Yup.bool(),
  price: Yup.number()
  .required("Subscription Price is required"),
  annualDiscount: Yup.number()
    .notRequired(),
  isActive: Yup.boolean(),
  isCustomPackage: Yup.boolean(),
  html:  Yup.string()
    .notRequired(),
});

const initPackage = {
  _id: undefined,
  name: "",
  price: 0,
  annualDiscount: 0,
  uniqueVisitorsMonthlyLimit: 0,
  isDashboardAllowed: false,
  isEmailCampaignsAllowed: false,
  isHotPriorityAllowed: false,
  isCrmMatchingAllowed: false,
  isVisits: false,
	isUrlsViewed: false,
	isLeadPriority: false,
	isCrmMatched: false,
  isDashboardCrmMatched: false,
	isMonthlyLeadPriority: false,
	isMonthlyEmailStats: false,
	isTop5Urls: false,
	isTopVisitors: false,
	isAccessToCorporate: false,
	isAdvancedXLSXExport: false,
	customUrlTracking: false,
	customLeadPriority: false,
  isActive: true,
  isCustomPackage: false,
  html: "",  
  listOrder: 0,
  additionalFee: 0
};

export function PackageEdit({
  history,
  match: {
    params: { id },
  },
}) {
  // Subheader
  const suhbeader = useSubheader();
  const [packageObj, setPackage] = useState({...initPackage});

  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const { actionsLoading, subscriptionForEdit, error } = useSelector(
    (state) => ({
      actionsLoading: state.subscriptions.actionsLoading,
      subscriptionForEdit: state.subscriptions.subscriptionForEdit,
      error: state.subscriptions.error,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchSubscription(id));
  }, [id, dispatch]);

  useEffect(() => {
    let _title = id ? "" : "New Package";
    if (subscriptionForEdit && id) {
      _title = `Edit Package - ${subscriptionForEdit.name}'`;
      setPackage(subscriptionForEdit)
    }

    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionForEdit, id]);

  const save = (values) => {
    values.price = Number(parseFloat(values.price).toFixed(2));
    if (!id) {
      dispatch(actions.createSubscription(values, ({ success }) => { success && backToList(); } ));
    } else {
      dispatch(actions.updateSubscription(values, ({ success }) => { success && backToList(); } ));
    }
  };

  const backToList = ( ) => {
    actions.fetchSubscriptions();
    history.push('/admin/settings/packages');
  }

  return (
    <>
      <Card style={{borderTopLeftRadius:0, boxShadow:'none'}}>
        {actionsLoading && <ModalProgressBar />}
        <CardBody>
          <div className="mt-5">
            <Formik
              enableReinitialize={true}
              initialValues={packageObj}
              validationSchema={PackageEditSchema}
              onSubmit={(values) => {
                let transformed = {...values};
                transformed.uniqueVisitorsMonthlyLimit = parseInt(transformed.uniqueVisitorsMonthlyLimit);
                transformed.listOrder = parseInt(transformed.listOrder);
                transformed.additionalFee = parseFloat(transformed.additionalFee);
                transformed.annualDiscount = parseInt(transformed.annualDiscount);
                transformed.isActive = typeof transformed.isActive === 'string' ? transformed.isActive === 'true' : transformed.isActive;
                save(transformed);
              }}
            >
              {({ handleSubmit, values, handleChange, setFieldValue, errors }) => (
                <>
                  <Form className="form form-label-righ mx-auto" style={{width:'65%'}}>
                    <div className="form-group mb-7">
                      <h4>Package Details:</h4>
                    </div>
                    {
                      error &&
                      <div className="col-12">
                        <Alert key={'danger'} variant={"danger"} dismissible onClose={() => dispatch(actions.clearSubscriptionError())}>
                          {error}
                        </Alert>
                      </div>
                    }

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          name="listOrder"
                          component={Input}
                          placeholder="List order number of packages"
                          label="List order number of packages"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          name="name"
                          component={Input}
                          placeholder="Name"
                          label="Name"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          name="uniqueVisitorsMonthlyLimit"
                          component={Input}
                          placeholder="Monthly Unique Visitor Limit"
                          label="Monthly Unique Visitor Limit"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          name="price"
                          component={Input}
                          placeholder="Price($)"
                          label="Price($)"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          name="annualDiscount"
                          component={Input}
                          placeholder="Annual Discount(%)"
                          label="Annual Discount(%)"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          name="additionalFee"
                          component={Input}
                          placeholder="Additional Fee"
                          label="Additional Fee"
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Can access analytics?
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isDashboardAllowed"
                                  checked={values.isDashboardAllowed}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                      
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Can tag <b>HOT</b> leads?
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isHotPriorityAllowed"
                                  checked={values.isHotPriorityAllowed}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Can Match CRM?
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isCrmMatchingAllowed"
                                  checked={values.isCrmMatchingAllowed}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group mb-7">
                      <h4>Visitors page:</h4>
                    </div> */}
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Lead Priority
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isLeadPriority"
                                  checked={values.isLeadPriority}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Visits
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isVisits"
                                  checked={values.isVisits}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            URLs viewed
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isUrlsViewed"
                                  checked={values.isUrlsViewed}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            CRM Matched
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isCrmMatched"
                                  checked={values.isCrmMatched}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Email Campaigns?
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isEmailCampaignsAllowed"
                                  checked={values.isEmailCampaignsAllowed}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="form-group mb-7">
                      <h4>Dashboard:</h4>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            CRM Matched
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isDashboardCrmMatched"
                                  checked={values.isDashboardCrmMatched}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Monthly Lead Priority
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isMonthlyLeadPriority"
                                  checked={values.isMonthlyLeadPriority}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Monthly Email Stats
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isMonthlyEmailStats"
                                  checked={values.isMonthlyEmailStats}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Top 5 URLs
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isTop5Urls"
                                  checked={values.isTop5Urls}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Top Visitors
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="isTopVisitors"
                                  checked={values.isTopVisitors}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group mb-7">
                      <h4>Other Package Control:</h4>
                    </div> */}
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Custom URL Tracking
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="customUrlTracking"
                                  checked={values.customUrlTracking}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-12">
                        <div className="row align-items-center">
                          <label className="col-xl-4 col-lg-4 col-form-label font-weight-bold text-left">
                            Custom Lead Priority
                          </label>
                          <div className="col-lg-8 col-xl-6">
                            <span className="switch switch-sm">
                              <label>
                                <input
                                  type="checkbox"
                                  name="customLeadPriority"
                                  checked={values.customLeadPriority}
                                  onChange={handleChange}
                                />
                                <span></span>
                              </label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <label>Enter Subscription Html</label>
                      </div>
                      <div className="col-lg-12">
                         <AceEditor
                            mode="html"
                            theme="twilight"
                            width="100%"
                            value={values.html}
                            onChange={(value) => setFieldValue('html', value)}
                            name="html"
                            editorProps={{ $blockScrolling: true }}
                          />
                      </div>
                    </div>

                    <Select name="isActive" label="Is Active?">
                        <option key={"true"} value={true}>Active</option>
                        <option key={"false"} value={false}>Inactive</option>
                    </Select>
                    
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onSubmit={() => {
                          console.log('errors', errors)
                          handleSubmit();
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
