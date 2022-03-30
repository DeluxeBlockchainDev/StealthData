// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/settings/urlSettingsActions";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import EmailEditor from 'react-email-editor'
import { Alert } from "react-bootstrap";
import {Snackbar} from '@material-ui/core';
import { getUrlSettingsFromFields } from "../../../_redux/settings/urlSettingsCrud";
import { FromFieldEdit } from "../from-fields-form/FromFieldEdit";
// import renderHTML from 'react-render-html';
// import AceEditor from "react-ace";

// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/theme-twilight";

const templates = [
  {
    name: "Fitness",
    thumbnail: 'https://cdn.templates.unlayer.com/previews/fitness-communication/1609863074940.png',
    data: require('../templates/fitness.json')
  },
  {
    name: "Cyber Monday Sale",
    thumbnail: 'https://cdn.templates.unlayer.com/previews/cyber-monday-sale/1602072931527.png',
    data: require('../templates/cyber-monday-sale.json')
  },
  {
    name: "Magical Spa",
    thumbnail: 'https://multimedia.getresponse360.com/dreamteammed-B/photos/f932cb91-b7ee-4df7-b0d1-de46fafc5fde.jpg',
    data: require('../templates/magical-spa.json')
  },
  // {
  //   name: "Fitness",
  //   thumbnail: 'https://cdn.templates.unlayer.com/previews/fitness-communication/1609863074940.png',
  //   data: require('../templates/fitness.json')
  // }
]
 // Validation schema
 const UrlSettingEditSchema = Yup.object().shape({
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

const initUrlSettings = {
  _id: undefined,
  name: "",
};

export function UrlSettingEdit({
  history,
  match: {
    params: { id },
  },
}) {
  // Subheader
  const suhbeader = useSubheader();
  const [urlSettingsObj, setUrlSettings] = useState({...initUrlSettings});
  const [snack, setSnack] = React.useState({
    open: false,
    variant: 'success',
    message: ''
  });
  const [templateName, setTemplateName] = useState('');
  const [fromFields, setFromFields] = useState([]);
  const [openFormFieldForm, setOpenFormFieldForm] = useState(false);
  let editor = useRef();

  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const { actionsLoading, urlSettingsForEdit, campaignTypes, error, existingCampaignTypes } = useSelector(
    (state) => ({
      actionsLoading: state.urlSettings.actionsLoading,
      urlSettingsForEdit: state.urlSettings.urlSettingsForEdit,
      campaignTypes: state.urlSettings.campaignTypes,
      existingCampaignTypes: state.urlSettings.entities.map((emailCamp) => emailCamp.campaignTypeId),
      error: state.urlSettings.error,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchUrlSetting(id));
  }, [id, dispatch]);

  useEffect(() => {
    let _title = id ? "" : "New Url Setting";
    if (urlSettingsForEdit && id) {
      _title = `Edit Url Setting - ${urlSettingsForEdit.name}'`;
      setUrlSettings(urlSettingsForEdit)
    }

    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadEditor();
  }, [urlSettingsForEdit, id]);

  const loadEditor = () => {
    let template;
    if(urlSettingsForEdit) {
      urlSettingsForEdit.editorDesign && 
      editor.current &&
      editor.current.editor &&
      editor.current.editor.loadDesign(urlSettingsForEdit.editorDesign)
    } else if ( template = templates.find((t) => t.name === templateName ) ) {
      editor.current &&
      editor.current.editor &&
      editor.current.editor.loadDesign(template.data)
    }
  }

  useEffect(() => {
    !!templateName && loadEditor();
  }, [templateName]);

  useEffect(() => {
    campaignTypes.length && dispatch(actions.fetchUrlSettings({}));
  }, [campaignTypes]);
  
  const getHtmlFromTemplateEditor = () => new Promise(resolve =>  editor.current.editor.exportHtml((data) => resolve(data)));

  const save = async (values) => {
    const { design, html } = await getHtmlFromTemplateEditor();
    values.html = html;
    values.editorDesign = design;

    if (!id) {
      dispatch(actions.createUrlSetting(values, ({ success }) => { success && backToList(); }) );
    } else {
      dispatch(actions.updateUrlSetting(values, ({ success }) => { success && backToList(); }) );
    }
  };

  const backToList = ( ) => {
    history.push('/settings');
  }

  return (
    <>
      <Card style={{borderTopLeftRadius:0, boxShadow:'none'}}>
        {actionsLoading && <ModalProgressBar />}
        <CardBody>
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
                  maxWidth:'400px'
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
              initialValues={urlSettingsObj}
              validationSchema={UrlSettingEditSchema}
              onSubmit={(values) => {
                let transformed = {...values};
                save(transformed);
              }}
            >
              {({ handleSubmit, values, handleChange }) => (
                <>
                  <Form className="form form-label-right" >
                    <div className="mx-auto" style={{width:'65%'}}>
                      <div className="form-group mb-7">
                        <h4>Url Setting Details:</h4>
                      </div>
                      {
                        error &&
                        <div className="col-12">
                          <Alert key={'danger'} variant={"danger"} dismissible onClose={() => dispatch(actions.clearUrlSettingError())}>
                            {error}
                          </Alert>
                        </div>
                      }
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
                              />
                            : <div className="d-flex justify-content-start">
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={() => setOpenFormFieldForm(true)}
                                >
                                  Set up Emails?
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

                      { !!id &&
                        <div className="form-group row">
                          <div className="col-lg-12">
                            <div className="row align-items-center">
                              <label className="col-xl-2 col-lg-2 col-form-label text-left">
                                Is Active?
                              </label>
                              <div className="col-lg-8 col-xl-6">
                                <span className="switch switch-sm">
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
                            </div>
                          </div>
                        </div>
                      }
                    </div>

                    {
                      !templateName && !id
                      ?
                        <div className="form-group row">
                          <div className="col-12 col-lg-10 mx-auto">
                            <h5 className="text-center mt-5 mb-13">Select any one of the below Email Templates:</h5>
                            <div className="d-flex justify-content-center">
                              {
                                templates.map((template) =>
                                  <div className="template-card mx-5" >
                                    <div class="image">
                                      <img src={template.thumbnail} />
                                    </div>
                                    <div class="hover">
                                      <h3>{template.name}</h3>
                                      <button onClick={() => setTemplateName(template.name)} className="btn btn-primary font-weight-bold">Use Template</button>
                                    </div>
                                  </div>
                                )
                              }
                            </div>
                            <h5 className="text-center my-5">OR</h5>
                            <div className="d-flex justify-content-center mb-5">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => setTemplateName('custom')}
                              >
                                Create your own Email Template.
                              </button>
                            </div>
                          </div>
                        </div>
                      :
                        <div className="form-group row">
                          <div className="col-12 col-lg-10 mx-auto">
                            <EmailEditor
                              ref={editor}
                              onLoad={loadEditor}
                            />
                          </div>
                        </div>
                    }
                    <div className="mx-auto" style={{width:'65%'}}>
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
                      
                      <div className="d-flex justify-content-center">
                          <button
                            type="submit"
                            className="btn btn-primary px-10"
                            onSubmit={() => handleSubmit()}
                          >
                            Save
                          </button>
                      </div>
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