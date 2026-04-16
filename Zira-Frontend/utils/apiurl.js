const BASE_URL = import.meta.env.VITE_API_URL;

const signup_api = `${BASE_URL}/signup-post-user`;
const user_fetch_api = `${BASE_URL}/api/users/fetch-userid`;
const Signin_api = `${BASE_URL}/quickauthapi/signin`;
const crete_oganization = `${BASE_URL}/api/v1/organizations`;
const send_invite_api = `${BASE_URL}/api/send-invite`;
const refresh_token = `${BASE_URL}/refresh-token`;
const logout_user_api = `${BASE_URL}/logout_user`;
const token = localStorage.getItem("AUTH-X");

export default {
  signup_api,
  user_fetch_api,
  Signin_api,
  crete_oganization,
  send_invite_api,
  token,
  refresh_token,
  logout_user_api
};
