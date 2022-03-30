/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import {Layout} from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
//import ThankYou from "./modules/Auth/pages/ThankYou";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
import { SignUp } from "./modules/Auth/pages/SignUp";
import { getAccountIndex, getRouteUrl } from "./utils";
export function Routes() {
    const accountIndex = getAccountIndex();
    /*const {isAuthorized, isAdmin} = useSelector(
        ({auth}) => ({
            isAuthorized: auth.user != null,
            isAdmin: (auth.user) ? auth.user.isAdmin : false
        }),
        shallowEqual
    );*/
    const { isAuthorized, isAdmin } = useSelector(
        (state) => ({
            isAuthorized: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].user !== null) ? true : false,
            isAdmin: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex]  && state.multiAuth.multiAuthData[accountIndex].user !== null) ? state.multiAuth.multiAuthData[accountIndex].user.isAdmin : false//state.auth.clientData
        }),
        shallowEqual
    );


    return (
        <Switch>
            <Route path="/sign-up" component={SignUp}/>
            <Route path="/sign-up-custom/:id" component={SignUp}/>
            {!isAuthorized ? (
                /*Render auth page when user at `/auth` and not authorized.*/
                <Route>
                    <AuthPage />
                </Route>
            ) : (
                /*Otherwise redirect to root page (`/`)*/
                <Redirect from="/auth" to={isAdmin ? '/admin/clients' : getRouteUrl('dashboard')}/>
            )}

            <Route path="/error" component={ErrorsPage}/>
            <Route path="/:u?/:accountIndex?/logout" component={Logout}/>     

            {!isAuthorized ? (
                /*Redirect to `/auth` when user is not authorized*/
                // <Redirect to="/auth/login"/>
                <></>
            ) : (
                <Layout>
                    <BasePage/>
                </Layout>
            )}
        </Switch>
    );
}
