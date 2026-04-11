const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL;

const signup_api = "http://localhost:5000/signup-post-user";
const user_fetch_api = "http://localhost:5000/api/users/fetch-userid";
const Signin_api = "http://localhost:5000/quickauthapi/signin";
const crete_oganization = "http://localhost:5000/api/v1/organizations";
const send_invite_api = "http://localhost:5000/api/send-invite";
const refresh_token = "http://localhost:5000/refresh-token";
const token = localStorage.getItem("AUTH-X");

export default {
  signup_api,
  user_fetch_api,
  Signin_api,
  crete_oganization,
  send_invite_api,
  token,
  refresh_token,
};
