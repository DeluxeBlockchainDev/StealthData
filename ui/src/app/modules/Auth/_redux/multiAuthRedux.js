import { put, takeLatest } from "redux-saga/effects";
import { getClient, getUserByToken } from "./authCrud";
import * as subscriptionActions from './subscription/subscriptionsActions';

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  SetClient: "[Set Client] Action",
  SetUser: "[Set User] Action",
  SetMultiAuth: "[Set Multi Auth] Action",
};

const initialAuthState = {
  user: undefined,
  clientData: undefined,
  authToken: undefined,
};

export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.Login: {
      const { authToken } = action.payload;

      return { authToken, user: undefined, clientData: undefined };
    }

    case actionTypes.Register: {
      const { authToken } = action.payload;

      return { authToken, user: undefined, clientData: undefined };
    }

    case actionTypes.Logout: {
      // TODO: Change this code. Actions in reducer aren't allowed.
      return initialAuthState;
    }

    case actionTypes.UserLoaded: {
      const { user } = action.payload;
      return { ...state, user };
    }

    case actionTypes.SetUser: {
      const { user } = action.payload;
      return { ...state, user };
    }

    case actionTypes.SetClient: {
      const { clientData } = action.payload;
      return { ...state, clientData };
    }

    case actionTypes.SetMultiAuth: {
      const { multiAuthData } = action.payload;
      
      multiAuthData.authToken = state.authToken
      
      let allAuth = [];
      allAuth.push(multiAuthData)
      console.log('multiAuthData....',allAuth)
      return { multiAuthData: allAuth };
    }

    default:
      return state;
  }
}

export const actions = {
  logout: () => ({ type: actionTypes.Logout }),
    requestUser: (user) => ({
        type: actionTypes.UserRequested,
        payload: { user },
      }),
  SetMultiAuthData: (multiAuthData) => ({ type: actionTypes.SetMultiAuth, payload: { multiAuthData } }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const { data: user } = yield getUserByToken();
    let clientData = {}
    //yield put(subscriptionActions.fetchSubscriptions({}));
    console.log('user....',user)
    if( !user.isAdmin ) {
      const { data: client } = yield getClient(user.id);
      //yield put(actions.setClientData(client));
      //yield put(subscriptionActions.setActiveSubscription(client.activeSubscription));
      console.log('client...',client)
      clientData = client;
    }
    let obj = {authToken: '', user: user, clientData: clientData };
    
    yield put(actions.SetMultiAuthData(obj));
    //yield put(actions.fulfillUser(user));
  });
}
