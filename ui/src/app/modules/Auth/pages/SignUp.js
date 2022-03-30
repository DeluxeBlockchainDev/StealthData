import React from "react";
// import { Footer } from "../../../../_metronic/layout/components/footer/Footer";
// import { Header } from "../../../../_metronic/layout/components/header/Header";
import { ClientOnboarding } from "../../Admin/pages/clients/client-onboarding/ClientOnboarding";
export function SignUp({
  match: {
    params: { id },
  },
}) {
  return (
    <>
      {/* <Header /> */}
        {/* <div className="m-30"> */}
            <ClientOnboarding packageId = {id}/>
        {/* </div> */}
    {/* <Footer /> */}
   </>
  );
}
