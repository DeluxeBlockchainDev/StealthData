import React from "react";
import {FieldFeedbackLabel} from "./FieldFeedbackLabel";

const getFieldCSSClasses = (touched, errors) => {
  const classes = ["form-control"];
  if (touched && errors) {
    classes.push("is-invalid");
  }

  if (touched && !errors) {
    classes.push("is-valid");
  }

  return classes.join(" ");
};

export function CustomInput({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  type = "text",
  helperText = '',
  prependComponent,
  appendComponent,
  withFeedbackLabel = true,
  customFeedbackLabel,
  label,
  ...props
}) {
  const Input  = <input
    type={type}
    className={getFieldCSSClasses(touched[field.name], errors[field.name])}
    {...field}
    {...props}
  />;

  return (
    <>
      
      {
        (prependComponent || appendComponent) ?
          <div className="mb-3 input-group">
            {
              prependComponent &&
              <div className="input-group-prepend">
                <span className="input-group-text">{prependComponent}</span>
              </div>
            }
            {Input}
            {
              appendComponent &&
              <div className="input-group-append">
                <span className="input-group-text">{appendComponent}</span>
              </div>
            }
          </div>
        :
          Input
      }
      {
        helperText && <div className="small text-muted mt-1">{helperText}</div>
      }
      {withFeedbackLabel && (
        <FieldFeedbackLabel
          error={errors[field.name]}
          touched={touched[field.name]}
          label={label}
          type={type}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </>
  );
}
