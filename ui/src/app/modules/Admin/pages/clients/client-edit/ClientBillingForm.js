// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Formik, Form, 
//  Field 
} from "formik";
import * as Yup from "yup";
import { shallowEqual, useSelector } from "react-redux";
import { ChoosePackage } from "../client-onboarding/ChoosePackage";
import { Modal, 
//  Spinner 
} from "react-bootstrap";
//import { Checkbox } from "@material-ui/core";

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
  isAdditionalFee: Yup.bool()
});

/*const getDataUrl = (file) => new Promise((resolve) => {
  let reader = new FileReader();

  reader.onloadend = () => {
    resolve(reader.result);
  };
  reader.readAsDataURL(file);
});*/

export function ClientBillingForm({
  client,
  updatePackage,
  saveClient,
  id
}) {
  //const [avatarThumbnail, setAvatarThumbnail] = React.useState(null);
  //const [showPackage, setShowPackage] = React.useState(false);
  //const [activeSubscription, setActiveSubscription] = React.useState({_id: ""});
  const [customValues, setCustomValues] = React.useState({
    show: false,
    confirmText: "",    
  });
  
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

  /*React.useEffect(() => {
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
  const handleOnChangePackage = (data) => {
    setCustomValues({
      ...customValues,
      show: true,
      confirmText: "You are on based updated<br/>Thanks",
      selectedPackageInfo: {
        subscriptionId: data.values.subscriptionId,
        upgradeType: data.values.updateType,
        selectedPackage: data.values.selectedSubscription,
        oldPackage: client.activeSubscription,
        clientId: client._id
      }
    })

    
  }
  const onHide = () => {
    setCustomValues({
      ...customValues,
      show: false
    })
  }
  const onUpdatePackage = () => {
    setCustomValues({
      ...customValues,
      show: false
    })
    updatePackage({...client, subscriptionId : customValues.selectedPackageInfo.subscriptionId, updateType: customValues.selectedPackageInfo.upgradeType});
  }
  const getDiffDay = (dateFrom, dateTo) => {
    var Difference_In_Time = dateTo.getTime() - dateFrom.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return parseInt(Difference_In_Days);
  }
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={client}
        validationSchema={ClientEditSchema(client)}
        onSubmit={(values) => {
          
        }}
      >
        {({ handleSubmit, values, handleChange, setFieldValue, errors }) => (
          <>
            <Form className="form form-label-righ mx-auto" style={{width:'100%'}}>
              {client && client._id && <>
              <hr />
                <div className="col-lg-12">
                  <ChoosePackage
                    id="profile"
                    actionsLoading={actionsLoading}
                    client={clientForEdit}
                    onComplete={handleOnChangePackage}
                    fromProfile={true}
                  />
                </div>
              </>}
            </Form>
          </>
        )}
      </Formik>

      <Modal
          show={customValues.show}
          onHide={onHide}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Confirm
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {customValues.selectedPackageInfo && customValues.selectedPackageInfo.upgradeType === "upgrade" && <>
              Upgrade from {customValues.selectedPackageInfo.oldPackage.name} to {customValues.selectedPackageInfo.selectedPackage.name}.<br/>
              You are currently on the {customValues.selectedPackageInfo.oldPackage.name} plan of ${customValues.selectedPackageInfo.oldPackage.price} with {30 - getDiffDay(new Date(client.lastBillingDate), new Date())} more days left on your billing cycle. <br/>
              Upgrading to the {customValues.selectedPackageInfo.selectedPackage.name} will be ${parseFloat(customValues.selectedPackageInfo.selectedPackage.price - (getDiffDay(new Date(client.lastBillingDate), new Date()) * (customValues.selectedPackageInfo.oldPackage.price / 30))).toFixed(2)} <br/>
              Are you sure you want to upgrade?
            </>}
            
            {customValues.selectedPackageInfo && customValues.selectedPackageInfo.upgradeType === "downgrade" && <>
              Your downgrade to {customValues.selectedPackageInfo.selectedPackage.name} package will be take effect next billing cycle.<br/>
              You will not be billed for any identified over your current package.<br/>
              Are you sure you want to downgrade?
            </>}
            
            {customValues.selectedPackageInfo && customValues.selectedPackageInfo.upgradeType === "cancel" && <>
              Are you sure you want to cancel?
            </>}
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              <> </>
              <button
                type="button"
                onClick={onUpdatePackage}
                className="btn btn-success btn-elevate"
              >
                Upgrade
              </button>
            </div>
          </Modal.Footer>
        </Modal>
    </>
  );
}
