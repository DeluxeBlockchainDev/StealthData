import React from "react";
// import { Footer } from "../../../../_metronic/layout/components/footer/Footer";
// import { Header } from "../../../../_metronic/layout/components/header/Header";
//import { ClientOnboarding } from "../../Admin/pages/clients/client-onboarding/ClientOnboarding";

export default function ThankYou({
  details
}) {

  return (
    <>
      <div className="text-center" style={{paddingTop: "30px", paddingBottom:"30px"}}>
        <div style={{fontSize:"72pt", marginBottom: "30px"}}>Thank you.</div>
        <div style={{fontSize:"39pt", marginBottom: "50px"}}>Your order was completed successfully.</div>        
        <div style={{fontSize:"19pt", marginBottom: "20px"}}>Customer: {details.customer}</div>
        <div style={{fontSize:"19pt", marginBottom: "20px"}}>Monthly Subscription: {details.package}</div>
        <div style={{fontSize:"19pt", marginBottom: "40px"}}>Card Number: {details.cardNumber}</div>
        <div className="d-flex align-items-center" style={{margin: "auto", width: "915px"}}>
          <img alt="" src="/media/Email-Icon-Thank-you.png" className="mr-4"/>
          <div className="text-left ml-4">
            <div style={{fontSize:"16pt", marginBottom: "20px"}}>An email receipt with the details about your order has be sent to the email address provided.</div>
            <div style={{fontSize:"16pt"}}>&quot;In addition, a welcome email has been sent with instructions how to get started identifying visitors on your website.&quot;</div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <a href="/auth/login" style={{fontSize:"15pt", color: "#459ad7"}}>Login Now</a>
      </div>
   </>
  );
}

