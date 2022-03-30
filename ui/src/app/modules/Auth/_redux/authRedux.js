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

    default:
      return state;
  }
}

export const actions = {
  login: (authToken) => ({ type: actionTypes.Login, payload: { authToken } }),
  register: (authToken) => ({
    type: actionTypes.Register,
    payload: { authToken },
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: (user) => ({
    type: actionTypes.UserRequested,
    payload: { user },
  }),
  fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
  setUser: (user) => ({ type: actionTypes.SetUser, payload: { user } }),
  setClientData: (clientData) => ({ type: actionTypes.SetClient, payload: { clientData } }),
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
    yield put(subscriptionActions.fetchSubscriptions({}));

    if( !user.isAdmin ) {
      const { data: client } = yield getClient(user.id);
      yield put(actions.setClientData(client));
      yield put(subscriptionActions.setActiveSubscription(client.activeSubscription));

    }

    yield put(actions.fulfillUser(user));
  });
}
