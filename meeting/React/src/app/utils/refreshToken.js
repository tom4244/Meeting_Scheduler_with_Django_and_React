import memoize from "memoization";

// import { axiosPublic } from "./axiosPublic";
import axios from "axios";
import Cookies from "js-cookie";
import setAuthorizationToken from './setAuthorizationToken';

/*TRY THIS **********************************
axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const originalRequest = error.config;

      if (error.response.status === 401 && error.response.statusText === "Unauthorized") {
          const refresh_token = localStorage.getItem('refresh_token');

          return axiosInstance
              .post('/token/refresh/', {refresh: refresh_token})
              .then((response) => {

                  localStorage.setItem('access_token', response.data.access);
                  localStorage.setItem('refresh_token', response.data.refresh);
**************************************/

// const refreshTokenFn = async () => {
// async function refreshTokenFn() {
function refreshTokenFn() {

  // const session = JSON.parse(localStorage.getItem("session"));
  // GET the refresh token from the cookie and provide it here;
  // maybe change "session" to "refresh"
  // Change the localStorage methods to cookie methods below.
  let refresh_token = Cookies.get('refresh_token')

//  try {
    // const response = await axiosPublic.post("/user/refresh", {
    // const response = await axios.post("token/refresh/", {
    // const res = await axios.post("token/refresh/", {
    return axios
      .post("token/refresh/", {refresh: refresh_token})
      .then(res => {
      console.log("Refresh token posted. res: ", res)
    // if (res.data.tokens.access) {
      Cookies.set('access_token', res.data.tokens.access);
      Cookies.set('refresh_token', res.data.tokens.refresh);
      setAuthorizationToken(res.data.tokens.access);
      console.log("A new access token cookie was set.")
    })
     .catch((errors) => {
       console.log("There were errors in token/refresh: ", errors)
    })
    // } else {
    //   console.log("I don't have an access token in refreshToken.js.");
    // });

    // localStorage.setItem("session", JSON.stringify(session));
    // return session;
    return;
  
//  } catch (error) {
    // localStorage.removeItem("session");
    // localStorage.removeItem("user");
    // Remove the cookies instead, here
    console.log("Something wrong happened in refreshToken.js. error: ", error)
    // Cookies.remove('access_token');
    // Cookies.remove('refresh_token');
//  }
};

const maxAge = 10000;

export const memoizedRefreshToken = memoize(refreshTokenFn, {
  maxAge,
});

