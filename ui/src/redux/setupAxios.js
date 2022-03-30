
export default function setupAxios(axios, store) {
  let accountIndex = getAccountIndex();

  axios.defaults.baseURL = process.env.REACT_APP_API_URL
  axios.interceptors.request.use(
    config => {
      const {
        auth: { authToken },
        multiAuth
      } = store.getState();
      let token = (multiAuth.multiAuthData && multiAuth.multiAuthData[accountIndex]) ? multiAuth.multiAuthData[accountIndex].authToken : authToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    err => Promise.reject(err)
  );
  axios.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      if(err.response && err.response.status === 401 && !window.location.href.includes('/auth/login')){
        window.localStorage.clear();
        window.location.href = '/auth/login';
      }
     return  Promise.reject(err)
    }
  );
}

function getAccountIndex(){
  let pathname = window.location.pathname;
  let path_array = pathname.split('/');
  if(path_array[1] === 'u'){
    if(path_array[2] && path_array[2] !== ''){
      return parseInt(path_array[2]);
    }else{
      return 0;
    }
  }else{
    return 0;
  }
}