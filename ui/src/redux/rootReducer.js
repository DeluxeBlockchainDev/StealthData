import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import * as multiAuth from "../app/modules/Auth/_redux/multiAuthRedux";
import {customersSlice} from "../app/modules/ECommerce/_redux/customers/customersSlice";
import {productsSlice} from "../app/modules/ECommerce/_redux/products/productsSlice";
import {remarksSlice} from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
import {specificationsSlice} from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";
import { clientsSlice } from "../app/modules/Admin/_redux/clients/clientsSlice";
import { visitorsSlice } from "../app/modules/Client/_redux/visitors/visitorsSlice";
import { subscriptionsSlice } from "../app/modules/Auth/_redux/subscription/subscriptionsSlice";
import { emailCampaignsSlice } from "../app/modules/Client/_redux/email-campaigns/emailCampaignsSlice";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  multiAuth: multiAuth.reducer,
  customers: customersSlice.reducer,
  products: productsSlice.reducer,
  clients: clientsSlice.reducer,
  visitors: visitorsSlice.reducer,
  remarks: remarksSlice.reducer,
  emailCampaigns: emailCampaignsSlice.reducer,
  specifications: specificationsSlice.reducer,
  subscriptions: subscriptionsSlice.reducer,
});

export function* rootSaga() {
 // yield all([auth.saga()]);
  yield all([auth.saga(), multiAuth.saga()]);
}
