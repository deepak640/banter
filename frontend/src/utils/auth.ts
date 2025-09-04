
import Cookies from 'js-cookie';

export const getToken = () => {
  return Cookies.get('auth_token');
};

export const setToken = (token: string) => {
  Cookies.set('auth_token', token, { expires: 7 }); // Expires in 7 days
};

export const removeToken = () => {
  Cookies.remove('auth_token');
};
