import React from "react";
// import { Footer } from "../../../../_metronic/layout/components/footer/Footer";
// import { Header } from "../../../../_metronic/layout/components/header/Header";
//import { ClientOnboarding } from "../../Admin/pages/clients/client-onboarding/ClientOnboarding";

export default function Oops({
  details,
  reviewInformation
}) {

  return (
    <>
      <div className="text-center" style={{paddingTop: "30px", paddingBottom:"30px"}}>
        <div style={{fontSize:"72pt", marginBottom: "30px"}}>Oops.</div>
        <div style={{fontSize:"39pt", marginBottom: "50px"}}>There was an error processiong your payment</div>        
        <div style={{fontSize:"19pt", marginBottom: "20px"}}>Customer: {details && details.customer}</div>
        <div style={{fontSize:"19pt", marginBottom: "20px"}}>Monthly Subscription: {details && details.package}</div>
        <div style={{fontSize:"19pt", marginBottom: "40px"}}>Card Number: {details && details.cardNumber}</div>
        <div style={{fontSize:"16pt", marginBottom: "40px"}}>Please return to the checkout page and review your information</div>
        <div className="text-center">
          <a href="#!" onClick={() => {reviewInformation()}} style={{fontSize:"15pt", color: "#459ad7"}}>Review Information</a>
        </div>
      </div>
   </>
  );
}

