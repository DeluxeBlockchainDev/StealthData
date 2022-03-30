// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/email-campaigns/emailCampaignsActions";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import EmailEditor from 'react-email-editor'
import { Alert } from "react-bootstrap";
import { Snackbar } from '@material-ui/core';
import { getEmailCampaignFromFields } from "../../../_redux/email-campaigns/emailCampaignsCrud";
import { FromFieldEdit } from "../from-fields-form/FromFieldEdit";
import SVG from "react-inlinesvg";
// import renderHTML from 'react-render-html';
// import AceEditor from "react-ace";

// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/theme-twilight";

const templates = [
  {
    name: "Fitness",
    thumbnail: 'https://cdn.templates.unlayer.com/previews/fitness-communication/1609863074940.png',
    preview: 'https://cdn.templates.unlayer.com/previews/fitness-communication/1609863074940.png',
    data: require('../templates/fitness.json')
  },
  {
    name: "Cyber Monday Sale",
    thumbnail: 'https://cdn.templates.unlayer.com/previews/cyber-monday-sale/1602072931527.png',
    preview: 'https://cdn.templates.unlayer.com/previews/cyber-monday-sale/1602072931527.png',
    data: require('../templates/cyber-monday-sale.json')
  },
  {
    name: "Magical Spa",
    thumbnail: 'https://multimedia.getresponse360.com/dreamteammed-B/photos/f932cb91-b7ee-4df7-b0d1-de46fafc5fde.jpg',    
    preview: 'https://multimedia.getresponse360.com/dreamteammed-B/photos/f932cb91-b7ee-4df7-b0d1-de46fafc5fde.jpg',
    data: require('../templates/magical-spa.json')
  },
  {
    name: "business-advisor",
    thumbnail: '',    
    preview: '',
    data: require('../templates/discount.json')
  },
  // {
  //   name: "Fitness",
  //   thumbnail: 'https://cdn.templates.unlayer.com/previews/fitness-communication/1609863074940.png',
  //   data: require('../templates/fitness.json')
  // }
]
// Validation schema
const EmailCampaignEditSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Minimum 2 charachters")
    .max(128, "Maximum 128 charachters")
    .required("Name is required"),
  subject: Yup.string()
    .min(2, "Minimum 2 charachters")
    .max(128, "Maximum 128 charachters")
    .required("Subject is required"),
  fromField: Yup.string()
    .required("From Field is required"),
  replyTo: Yup.string()
    .required("Repy To is required"),
  html: Yup.string()
});

const initEmailCampaign = {
  _id: undefined,
  name: "",
};

export function EmailCampaignEdit({
  history,
  match: {
    params: { id },
  },
}) {
  // Subheader
  const suhbeader = useSubheader();
  const [emailCampaignObj, setEmailCampaign] = useState({ ...initEmailCampaign });
  const [snack, setSnack] = React.useState({
    open: false,
    variant: 'success',
    message: ''
  });

  const [tab, setTab] = useState("step1");
  const [visitedTabs, setVisitedTabs] = useState(new Set());
  const [templateName, setTemplateName] = useState('');
  const [previewTemplateOpen, setPreviewTemplateOpen] = useState(false);
  const [previewTemplateImage, setPreviewTemplateImage] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [fromFields, setFromFields] = useState([]);
  const [openFormFieldForm, setOpenFormFieldForm] = useState(false);
  let editor = useRef();

  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const { actionsLoading, emailCampaignForEdit, campaignTypes, error, existingCampaignTypes } = useSelector(
    (state) => ({
      actionsLoading: state.emailCampaigns.actionsLoading,
      emailCampaignForEdit: state.emailCampaigns.emailCampaignForEdit,
      campaignTypes: state.emailCampaigns.campaignTypes,
      existingCampaignTypes: state.emailCampaigns.entities.map((emailCamp) => emailCamp.campaignTypeId),
      error: state.emailCampaigns.error,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchEmailCampaign(id));
  }, [id, dispatch]);

  const loadEditor = () => {
    let template;
    var tempDesign = localStorage.getItem("tempDesign");
    if (tempDesign && tempDesign != "") {
      tempDesign = JSON.parse(tempDesign);
      setTab("step3");
    }

    if (editor.current && editor.current.editor) {
      editor.current.editor.addEventListener('design:updated', function (updates) {
        editor.current.editor.exportHtml(function (data) {
          localStorage.setItem("tempDesign", JSON.stringify(data.design));
        })
      })
      editor.current.editor.registerCallback('image', function(file, done) {
        // Do something to upload the image and return the URL of the uploaded image
        
        var myHeaders = new Headers();
        myHeaders.append("X-Auth-Token", "api-key 960ku1p1ve6qa0urexdm66lj86xk26r4");

        var formdata = new FormData();
        formdata.append("file", file['attachments'][0]);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata
        };

        fetch("https://peaceful-waters-76804.herokuapp.com/https://api.getresponse.com/v3/multimedia", requestOptions)
          .then(response => response.text())
          .then(result => JSON.parse(result))
          .then(result => done({url:[result.url]}))
          .catch(error => console.log('error', error));
      });
    }

    if (emailCampaignForEdit) {
      if (emailCampaignForEdit.editorDesign && editor.current && editor.current.editor) {
        if (tempDesign)
          editor.current.editor.loadDesign(tempDesign)
        else
          editor.current.editor.loadDesign(emailCampaignForEdit.editorDesign)
      }
    } else if (template = templates.find((t) => t.name === templateName)) {
      if (editor.current && editor.current.editor) {
        if (tempDesign)
          editor.current.editor.loadDesign(tempDesign)
        else
          editor.current.editor.loadDesign(template.data)
      }
    } else {
      if (editor.current && editor.current.editor) {
        if (tempDesign)
          editor.current.editor.loadDesign(tempDesign)
      }
    }
  }
  
  useEffect(() => {
    let _title = id ? "" : "New Email Campaign";
    if (emailCampaignForEdit && id) {
      _title = `Edit Email Campaign - ${emailCampaignForEdit.name}'`;
      setEmailCampaign(emailCampaignForEdit)
    }

    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadEditor();
  }, [emailCampaignForEdit, id, loadEditor, suhbeader]);

  


  useEffect(() => {
    !!templateName && loadEditor();
  }, [templateName, loadEditor]);

  useEffect(() => {
    dispatch(actions.fetchEmailCampaignTypes({}));
    getEmailCampaignFromFields().then((res) =>
      res && res.data ? setFromFields(res.data) : setFromFields([])
    ).catch(() =>
      setFromFields([])
    );
  }, [dispatch]);

  useEffect(() => {
    campaignTypes.length && dispatch(actions.fetchEmailCampaigns({}));
  }, [campaignTypes, dispatch]);
  
  const getHtmlFromTemplateEditor = () => new Promise(resolve =>  editor.current.editor.exportHtml((data) => resolve(data)));


  const save = async (values) => {
    const { design, html } = await getHtmlFromTemplateEditor();
    values.html = html;
    values.editorDesign = design;

    if (!id) {
      dispatch(actions.createEmailCampaign(values, ({ success }) => { success && backToList(); }));
    } else {
      dispatch(actions.updateEmailCampaign(values, ({ success }) => { success && backToList(); }));
    }
  };

  const backToList = () => {
    history.push('/emails');
  }

  const navigateToTab = (_tab) => {
    // visitedTabs.has(_tab) && setTab(_tab)
    setTab(_tab)
  }

  const handleOnComplete = async (_tab) => {
    if (_tab === 'step1') {
      setTab('step2');
      visitedTabs.add('step1');
      visitedTabs.add('step2');
    } else if (_tab === 'step2') {
      setTab('step3');
      visitedTabs.add('step3');
    } else if (_tab === 'step3') {
      setTab('step4');
      visitedTabs.add('step4');
    }

    localStorage.setItem("tempDesign", "")
  }

  const goBack = (_tab) => {
    if (_tab === 'step2') {
      setTab('step1')
    } else if (_tab === 'step3') {
      setTab('step2')
    } else if (_tab === 'step4') {
      setTab('step3');
    }
    localStorage.setItem("tempDesign", "")
  }
  return (
    <>
      {<ul className="nav nav-tabs nav-tabs-line custom-tabs justify-content-center" role="tablist">
        <li className={`nav-item d-flex align-items-center p-0 m-0 ${tab === "step1" && "active"}`} style={{ width: "100px", height: "fit-content" }} onClick={() => navigateToTab("step1")}>
          <a
            className={`ml-4 nav-link flex-column align-items-center w-100`}
            data-toggle="tab"
            role="tab"
            aria-selected={(tab === "step1").toString()}
          >
            <span className="svg-icon svg-icon-primary">
              <SVG
                src="/media/svg/icons/General/Settings-2.svg"
                style={{ width: "30px", height: "30px" }}
              ></SVG>
            </span>
            <h6 style={{fontSize: "12px", marginTop: "4px"}}>Settings</h6>
          </a>
        </li>
        <li style={{ width: "100px", borderBottom: "3px solid #6993ff", margin: "0px 15px 45px 10px" }} />
        <li className={`nav-item d-flex align-items-center p-0 m-0 ${tab === "step2" && "active"}`} style={{ width: "100px", height: "fit-content" }} onClick={() => navigateToTab("step2")}>
          <a
            className={`ml-4 nav-link flex-column align-items-center w-100`}
            data-toggle="tab"
            role="tab"
            aria-selected={(tab === "step2").toString()}
          >
            <span className="svg-icon svg-icon-primary">
              <SVG
                src="/media/svg/icons/Design/Image.svg"
                style={{ width: "30px", height: "30px" }}
              ></SVG>
            </span>
            <h6 style={{fontSize: "12px", marginTop: "4px"}}>Templates</h6>
          </a>
        </li>
        <li style={{ width: "100px", borderBottom: "3px solid #6993ff", margin: "0px 15px 45px 10px" }} />
        <li className={`nav-item d-flex align-items-center p-0 m-0 ${tab === "step3" && "active"}`} style={{ width: "100px", height: "fit-content" }} onClick={() => navigateToTab("step3")}>
          <a
            className={`ml-4 nav-link flex-column align-items-center w-100`}
            data-toggle="tab"
            role="tab"
            aria-selected={(tab === "step3").toString()}
          >
            <span className="svg-icon svg-icon-primary">
              <SVG
                src="/media/svg/icons/Communication/Write.svg"
                style={{ width: "30px", height: "30px" }}
              ></SVG>
            </span>
            <h6 style={{fontSize: "12px", marginTop: "4px"}}>Create</h6>
          </a>
        </li>
        <li style={{ width: "100px", borderBottom: "3px solid #6993ff", margin: "0px 15px 45px 10px" }} />
        <li className={`nav-item d-flex align-items-center p-0 m-0 ${tab === "step4" && "active"}`} style={{ width: "100px", height: "fit-content" }} onClick={() => navigateToTab("step4")}>
          <a
            className={`ml-4 nav-link flex-column align-items-center w-100`}
            data-toggle="tab"
            role="tab"
            aria-selected={(tab === "step4").toString()}
          >
            <span className="svg-icon svg-icon-primary">
              <SVG
                src="/media/svg/icons/General/Like.svg"
                style={{ width: "30px", height: "30px" }}
              ></SVG>
            </span>
            <h6 style={{fontSize: "12px", marginTop: "4px"}}>Review</h6>
          </a>
        </li>
      </ul>}
      <Card style={{ borderTopLeftRadius: 0, boxShadow: 'none' }}>
        {actionsLoading && <ModalProgressBar />}
        <CardBody style={(tab === "step3" && fullscreen) ? { display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: "0", left: "0", width: "100%", height: "100%", zIndex: "4", padding: "0", margin: "0", background: "white", overflowX: "hidden", overflowY: "auto" } : {}}>
          <div className="mt-5">
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              key={`snack`}
              autoHideDuration={5000}
              open={snack.open}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
            >
              <Alert
                key={`snack-${snack.variant}`}
                variant={snack.variant}
                style={{
                  maxWidth: '400px'
                }}
                dismissible
                maxLength={100}
                onClose={() => setSnack({
                  open: false,
                  message: '',
                  variant: 'success'
                })}
              >
                {snack.message}
              </Alert>
            </Snackbar>
            <Formik
              enableReinitialize={true}
              initialValues={emailCampaignObj}
              validationSchema={EmailCampaignEditSchema}
              onSubmit={(values) => {
                let transformed = { ...values };
                save(transformed);
              }}
            >
              {({ handleSubmit, values, handleChange }) => (
                <>
                  <Form className="form form-label-right">

                    {
                      error &&
                      <div className="col-12">
                        <Alert key={'danger'} variant={"danger"} dismissible onClose={() => dispatch(actions.clearEmailCampaignError())}>
                          {error}
                        </Alert>
                      </div>
                    }
                    <div className="mx-auto" style={{ width: '65%', display: (tab === "step1" ? 'block' : 'none') }}>
                      <div className="form-group mb-7">
                        <h4>Email Campaign Settings</h4>
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
                          <Select name="campaignTypeId" label="Campaign Type" >
                            <option key="" value="">Select</option>
                            {campaignTypes
                              .filter((campaignType) => !existingCampaignTypes.includes(campaignType.campaignId))
                              .map((campaignType, index) => (
                                <option key={campaignType.campaignId} value={campaignType.campaignId}>
                                  {campaignType.displayName}
                                </option>
                              ))}
                          </Select>
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-lg-6">
                          <Select name="fromField" label="From" >
                            <option key="" value="">Select</option>
                            {fromFields.map((fromField, index) => (
                              <option key={fromField.fromFieldId} value={fromField.fromFieldId}>
                                {fromField.name} &lt;{fromField.email}&gt;
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="col-lg-6">
                          <Select name="replyTo" label="Reply To" >
                            <option key="" value="">Select</option>
                            {fromFields.map((fromField, index) => (
                              <option key={fromField.fromFieldId} value={fromField.fromFieldId}>
                                {fromField.name} &lt;{fromField.email}&gt;
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="col-12 mt-8 mb-5">
                          {
                            openFormFieldForm
                              ? <FromFieldEdit
                                setSnack={setSnack}
                                onClose={() => setOpenFormFieldForm(false)}
                                setFromFields={setFromFields}
                              />
                              : <div className="d-flex justify-content-start">
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={() => setOpenFormFieldForm(true)}
                                >
                                  {fromFields.length == 0 ? "Set up Emails?" : "Edit Emails"}
                                </button>
                              </div>
                          }
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-lg-12">
                          <Field
                            name="subject"
                            component={Input}
                            placeholder="Subject"
                            label="Subject"
                          />
                        </div>
                      </div>

                      {!!id && <>
                        <div className="form-group mb-7">
                          <h4>Campaign Status</h4>
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-12">
                            <div className="row align-items-center">
                              <label className="col-xl-2 col-lg-2 col-form-label text-left">
                                Campaign Status
                              </label>
                              <div className="col-lg-1 col-xl-1">
                                <span className="switch switch-sm switch-success">
                                  <label>
                                    <input
                                      type="checkbox"
                                      name="isActive"
                                      checked={values.isActive}
                                      onChange={handleChange}
                                    />
                                    <span></span>
                                  </label>
                                </span>
                              </div>
                              <label className="col-xl-6 col-lg-6 col-form-label text-left">
                                {values.isActive ? <div className="text-success">Campaign is live</div> : <div style={{ color: "grey" }}>Campaign is paused</div>}
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                      }
                    </div>


                    <div className="mx-auto" style={{ width: '65%', display: (tab === "step2" ? 'block' : 'none') }}>
                      {
                        <div className="form-group row">
                          <div className="col-12 col-lg-10 mx-auto">
                            <h5 className="text-center mt-5 mb-13">
                              Choose a teimplate below or design your own. 
                              
                              <button
                                type="button"
                                className="btn btn-success btn-sm ml-10"
                                onClick={() => { setTemplateName('custom'); setTab("step3"); }}
                              >
                                Custom Design
                              </button>
                            </h5>
                            <div className="d-flex justify-content-center">
                              {
                                templates.map((template) =>
                                  <div className="template-card mx-5" >
                                    <div class="image">
                                      <img alt="" src={template.thumbnail} />
                                    </div>
                                    <div class="hover">
                                      <h3>{template.name}</h3>
                                      <a onClick={() => { setTemplateName(template.name); setTab("step3"); }} className="btn btn-primary font-weight-bold">Use Template</a>
                                      <a onClick={() => { setPreviewTemplateOpen(true); setPreviewTemplateImage(template.preview); }} className="btn btn-success font-weight-bold mt-5">Preview Template</a>
                                    </div>
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        </div>
                      }
                    </div>

                    <div className="mx-auto" style={{ width: '100%', display: (tab === "step3" ? 'block' : 'none') }}>
                      {
                        <div className="form-group row">
                          <div className="col-12 col-lg-12 mx-auto" style={{ width: "100vw" }}>
                            <EmailEditor
                              ref={editor}
                              onLoad={loadEditor}
                              minHeight={fullscreen ? "85vh" : "500px"}
                            />
                          </div>
                        </div>
                      }
                    </div>

                    <div className="mx-auto" style={{ width: '100%', display: (tab === "step4" ? 'block' : 'none') }}>
                      <div className="form-group mb-7">
                        <h4 className="mb-5">Review Your Campaign</h4>
                        <h6 className="mb-5">Campaign Name</h6>
                        <div className="ml-4 mb-3">{values.name}</div>
                        <div className="ml-4 mb-3">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setTab("step1")}
                          >
                            Edit Name
                          </button>
                        </div>
                        <h6 className="mb-5">Campaign Type</h6>
                        <div className="ml-4 mb-3">
                          {campaignTypes.find((campaignType) => campaignType.campaignId === values.campaignTypeId) && campaignTypes.find((campaignType) => campaignType.campaignId === values.campaignTypeId).displayName}
                        </div>
                        <div className="ml-4 mb-3">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setTab("step1")}
                          >
                            Edit Campaign
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-3 col-lg-3">
                            <h6 className="mb-5">From Email</h6>
                          </div>
                          <div className="col-3 col-lg-3">
                            <h6 className="mb-5">Reply to Email</h6>
                          </div>
                        </div>
                        <div className="row ml-4 mb-3">
                          <div className="col-3 col-lg-3">
                            {fromFields.find((fromfield) => fromfield.fromFieldId == values.fromField) && fromFields.find((fromfield) => fromfield.fromFieldId == values.fromField).email}
                          </div>
                          <div className="col-3 col-lg-3">
                            {fromFields.find((fromfield) => fromfield.fromFieldId == values.replyTo) && fromFields.find((fromfield) => fromfield.fromFieldId == values.replyTo).email}
                          </div>
                        </div>
                        <div className="ml-5 mb-3">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setTab("step1")}
                          >
                            Edit Emails
                          </button>
                        </div>
                        <h6 className="mb-5">Email Subject</h6>
                        <div className="ml-4 mb-3">
                          {values.subject}
                        </div>
                        <div className="ml-4 mb-3">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setTab("step1")}
                          >
                            Edit Subject
                          </button>
                        </div>
                        <h6 className="mb-5">Email Design</h6>
                        <div className="ml-4 mb-3">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setTab("step3")}
                          >
                            Edit Design
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mx-auto" style={{ width: '65%' }}>
                      {/*   <div className="form-group row">
                        <div className="col-12 col-lg-10 mx-auto">
                          <label>Enter Email Html</label>
                        </div>
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
                        
                      {
                        values.html && 
                        <div className="form-group row">
                          <div className="col-lg-12">
                            <label>Email Preview</label>
                          </div>
                          <div className="col-lg-12">
                            <div className="position-relative">
                              {
                                renderHTML(values.html)
                              }
                            </div>
                          </div>
                        </div>
                      } */}
                      <div className="mt-5">
                        <div className="d-flex justify-content-between">
                          {tab !== "step4" && 
                          <div>
                          <button
                            type="button"
                            className="btn btn-default btn-lg ml-4"
                            onClick={() => goBack(tab)}
                          >
                            Previous step
                          </button>
                          </div>}


                          {tab === "step3" && !fullscreen && <button
                            type="button"
                            className="btn btn-success btn-lg"
                            onClick={() => setFullscreen(true)}
                          >
                            Edit on Fullscreen
                          </button>}


                          {tab === "step3" && fullscreen && <button
                            type="button"
                            className="btn btn-success btn-lg"
                            onClick={() => setFullscreen(false)}
                          >
                            Close Fullscreen
                          </button>}

                          {tab !== "step4" && <button
                            type="button"
                            className="btn btn-primary btn-lg ml-4"
                            onClick={() => handleOnComplete(tab)}
                          >
                            Next step
                          </button>}

                          {tab === "step4" && <button
                            type="button"
                            className="btn btn-danger px-10 ml-4"
                            onClick={() => { history.push('/emails'); }}
                          >
                            Cancel
                          </button>}

                          {tab === "step4" && <button
                            type="submit"
                            className="btn btn-success px-10 ml-4"
                            onSubmit={() => handleSubmit()}
                          >
                            Publish Now
                          </button>}
                        </div>
                      </div>
                      {/* <div className="d-flex justify-content-center">
                          
                      </div> */}
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </CardBody>
      </Card>
      <Modal
        show={previewTemplateOpen}
        onHide={() => {setPreviewTemplateOpen(false)}}
        aria-labelledby="example-modal-sizes-title-lg"
        size="lg"
      >
        <Modal.Body>
          <img src={previewTemplateImage} style={{width: "100%"}}/>
        </Modal.Body>
      </Modal>
    </>
  );
}