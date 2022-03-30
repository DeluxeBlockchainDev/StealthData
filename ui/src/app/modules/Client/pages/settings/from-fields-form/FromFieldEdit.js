// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React from "react";
import { addUrlSettingFromFields } from "../../../_redux/settings/urlSettingsCrud";

// Validation schema
 const FromFieldEditSchema = Yup.object().shape({
  url: Yup.string()
    .min(2, "Minimum 2 charachters")
    .max(128, "Maximum 128 charachters")
    .required("Name is required"),
});

const initFromField = {
  url: "",
};
export function FromFieldEdit({ onClose = () => {}, setSnack = () => {} }) {

  const save = async (values) => {
    addUrlSettingFromFields(values)
    .then((resp) => {
      setSnack({
        open: true,
        message: resp.data.message,
        ...(
          resp && resp.data && resp.data.success
          ? { variant: 'success' }
          : { variant: 'danger' }
        )
      })
      onClose();
    })
    .catch((err) => {
      setSnack({
        open: true,
        message: err.response.data.message || err.message,
        variant: 'danger'
      })
    })
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initFromField}
        validationSchema={FromFieldEditSchema}
        onSubmit={save}
      >
        {({ handleSubmit }) => (
          <>
            <div className="form form-label-right" >
              <div className="mx-auto" style={{width:'65%'}}>
                <div className="form-group mb-7">
                  <h4>From Field Details:</h4>
                </div>
                <div className="form-group row">
                  <div className="col-lg-12">
                    <Field
                      name="url"
                      component={Input}
                      placeholder="URL"
                      label="URL"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-primary mr-2"
                    onClick={() => onClose()}
                    >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => handleSubmit()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}