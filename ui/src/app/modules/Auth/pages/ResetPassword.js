import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { Link, Redirect, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { resetPassword } from "../_redux/authCrud";

const initialValues = {
  password: "",
  token: "",
  confirmPassword: "",
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

function ResetPassword(props) {
  const { intl } = props;
  const query = useQuery();
  const [isRequested, setIsRequested] = useState(false);
  const ResetPasswordSchema = Yup.object().shape({
    token: Yup.string()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    confirmPassword: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };
  const formik = useFormik({

    initialValues,
    validationSchema: ResetPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      resetPassword({ ...values })
        .then(() => {
          setIsRequested(true);
        })
        .catch(() => {
          setIsRequested(false);
          setSubmitting(false);
          setStatus(
            intl.formatMessage(
              { id: "AUTH.VALIDATION.NOT_FOUND" },
              { name: values.email }
            )
          );
        });
    },
  });
  
  React.useEffect(() => {
    formik.setFieldValue('token',  query.get('token'));
  }, [formik, query]);

  

  return (
    <>
      {isRequested && <Redirect to="/auth" />}
      {!isRequested && (

        <div className="login-form login-forgot" style={{ display: "block" }}>
          {
            formik.values.token ?
            <>
              <div className="text-center mb-10 mb-lg-20">
                <h3 className="font-size-h1">Reset Password</h3>
                <div className="text-muted font-weight-bold">
                  Enter your new password!
                </div>
              </div>
              <form
                onSubmit={formik.handleSubmit}
                className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
              >
                {formik.status && (
                  <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                    <div className="alert-text font-weight-bold">
                      {formik.status}
                    </div>
                  </div>
                )}
                <div className="form-group fv-plugins-icon-container">
                  <input
                    type="password"
                    className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                      "password"
                    )}`}
                    name="password"
                    placeholder="Password"
                    {...formik.getFieldProps("password")}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.email}</div>
                    </div>
                  ) : null}
                </div>
                <div className="form-group fv-plugins-icon-container">
                  <input
                    type="password"
                    className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                      "confirmPassword"
                    )}`}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    {...formik.getFieldProps("confirmPassword")}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.email}</div>
                    </div>
                  ) : null}
                </div>
                <div className="form-group d-flex flex-wrap flex-center">
                  <button
                    id="kt_login_forgot_submit"
                    type="submit"
                    className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                    disabled={formik.isSubmitting}
                  >
                    Submit
                  </button>
                  <Link to="/auth">
                    <button
                      type="button"
                      id="kt_login_forgot_cancel"
                      className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                    >
                      Cancel
                    </button>
                  </Link>
                </div>
              </form>
            </>
            :
            <div className="text-center mb-10 mb-lg-20">
              <h3 className="font-size-h1">Unauthorised</h3>
              <div className="text-muted font-weight-bold">
                Token not found or invalid token provided!
              </div>
            </div>
          }
          
        </div>
      )}
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(ResetPassword));
