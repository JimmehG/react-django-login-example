// Imports for email login
import { logoutAction } from "../actions/auth/authActions";
import jwtDecode from "jwt-decode";
import { push } from "react-router-redux";

let url = process.env.REACT_APP_DEV_URL;

function refreshAuthToken({ dispatch, getState }) {
  return next => action => {
    if (typeof action === "function") {
      if (localStorage.getItem("ecom_token") && localStorage.length > 0) {
        const tokenExpiration = jwtDecode(localStorage.getItem("ecom_token"))
          .exp;
        const currentTime = Math.round(new Date().getTime() / 1000);
        const timeLeft = tokenExpiration - currentTime;
        console.log("TIME LEFT ->>>>>>>>", timeLeft);
        const loginToken = localStorage.getItem("ecom_token");
        if (tokenExpiration && timeLeft <= 0) {
          dispatch(push("/"));
          return dispatch(logoutAction());
        }
        if (tokenExpiration && timeLeft <= 1800) {
          return fetch(`${url}/auth/jwt/refresh/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: loginToken
            },
            body: JSON.stringify({ token: loginToken })
          })
            .then(response => response.json())
            .then(json => localStorage.setItem("ecom_token", json.token))
            .then(() => next(action));
        }
        return next(action);
      }
      return next(action);
    } else {
      return next(action);
    }
  };
}

export default refreshAuthToken;