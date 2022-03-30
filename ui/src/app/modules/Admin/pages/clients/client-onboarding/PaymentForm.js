// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { PAYMENT_STYLES } from "../../../../../../_metronic/_helpers/heartlandStyles";

export function PaymentForm({
    amount,
    onSuccess
}) {

    let hps = null;

    //eslint-disable-next-line no-undef
    const setPaymentForm = () => Heartland && new Heartland.HPS({
        publicKey: 'pkapi_cert_BEyAV8H3lsPT9NkkPm',
        type:      'iframe',
        // Configure the iframe fields to tell the library where
        // the iframe should be inserted into the DOM and some
        // basic options
        fields: {
        cardNumber: {
            target:      'iframesCardNumber',
            placeholder: '•••• •••• •••• ••••',
            value: '4012002000060016'
        },
        cardExpiration: {
            target:      'iframesCardExpiration',
            placeholder: 'MM / YYYY',
            value: '12/25'
        },
        cardCvv: {
            target:      'iframesCardCvv',
            placeholder: 'CVV',
            value: '123'
        },
        submit: {
            value: `Pay $${amount}`,
            target:  'iframesSubmit',
            disabled: true,
        }
        },
        // Collection of CSS to inject into the iframes.
        // These properties can match the site's styles
        // to create a seamless experience.
        style: {
            ...PAYMENT_STYLES
        },
        // Callback when a token is received from the service
        onTokenSuccess: function (resp) {
            onSuccess(resp.token_value)
        },
        // Callback when an error is received from the service
        onTokenError: function (resp) {
            console.log('There was an error: ' + resp.error.message);
        },
        // Callback when an event is fired within an iFrame
        onEvent: function (ev) {
            console.log(ev);
        }
    })

    React.useEffect(() => {
        if( amount ) {
            hps = setPaymentForm();
        } 
        return () => {
            hps && hps.dispose(); 
        }
    }, [amount])

    //eslint-disable-next-line no-undef
    if(!Heartland) {
        return <h6 className="mb-10 text-center">Payment Service Unavailable!</h6>
    }

    return (
        <div className="form-wrapper">
        <form id="iframes" action="" method="GET">
        <div id="ss-banner" />

        <div className="form-row">
            <label htmlFor="iframesCardNumber">Card Number:</label>
            <div id="iframesCardNumber" />
        </div>

        <div className="form-row">
            <label htmlFor="iframesCardExpiration">Card Expiration:</label>
            <div id="iframesCardExpiration" />
        </div>

        <div className="form-row">
            <label htmlFor="iframesCardCvv">Card CVV:</label>
            <div id="iframesCardCvv" />
        </div>

        <br />
        <div id="iframesSubmit" />
        </form>
    </div>
    );
}
