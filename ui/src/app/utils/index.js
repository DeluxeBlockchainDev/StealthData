export const calculateAnnualPrice = (price, discount= 0) => +parseFloat(((price - (price*discount/100)) * 12).toString()).toFixed(2)

export const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, ' ',match[2], '-', match[3], '-', match[4]].join('')
    }
    return phoneNumberString;
}

export const defaultLeadPriority = () => {
  return {mild:4,warm:9,hot:10}
}

export const getSingleSessionTime = (date) => {
  let time = new Date(date).getTime();
  let session_time = 20;
  session_time = parseInt(time.toString().substr(-2))
  session_time = (session_time > 20) ? session_time : session_time + 20;
  return session_time;
}


export const getRouteUrl = (route) => {
  let pathname = window.location.pathname;
  let path_array = pathname.split('/');
  if(path_array[1] === 'u'){
    if(path_array[2] && path_array[2] !== ''){
      return '/u/'+parseInt(path_array[2])+'/'+route;
    }else{
      return '/'+route;
    }
  }else{
    return '/'+route;
  }
}

export const getAccountIndex = (route) => {
  let pathname = window.location.pathname;
  let path_array = pathname.split('/');
  if(path_array[1] === 'u'){
    if(path_array[2] && path_array[2] !== ''){
      return path_array[2];
    }else{
      return 0;
    }
  }else{
    return 0;
  }
}