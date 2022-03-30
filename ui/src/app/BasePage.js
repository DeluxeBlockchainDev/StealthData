import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import AdminPage from "./modules/Admin/pages/AdminPage";
import ClientPage from "./modules/Client/pages/ClientPage";
import { useSelector, shallowEqual } from "react-redux";
import { getAccountIndex } from "./utils";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

export default function BasePage() {
  const accountIndex = getAccountIndex();

  const { user } = useSelector(
    (state) => ({
      user: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].user !== null) ? state.multiAuth.multiAuthData[accountIndex].user : {}
    }),
    shallowEqual
);

//  const { user } = useSelector((state) => state.auth, shallowEqual);

  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/my-page" component={MyPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/e-commerce" component={ECommercePage} />   
        {
          user.isAdmin &&
          <>
            <Route path="/admin" component={AdminPage} />
          </>

        }
        {
          user.isAdmin &&
          <Redirect from="/" to="/admin"/>
        }
        {
          !user.isAdmin &&
          <Route path="/" component={ClientPage} />
        }
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
