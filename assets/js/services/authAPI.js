import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Logout (Deletethe token from localStorage^& Axios)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * HTTP request for authentication, store the token in storage & Axios
 * @param {object} credentials
 * @returns {Promise<boolean >}
 */
function authenticate(credentials) {
    return axios
        .post("http://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            //Store token in localStorage
            window.localStorage.setItem("authToken", token);
            //We warn Axios that we have now a default header on all our future HTTP requests
            //On Postman we can find the header parameter name & its value
            setAxiosToken(token);

            return true;
        });
}

/**
 * post the token JWT on Axios
 * @param {string} token the JWT token
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}


/**
 * check if user is authenticated or not
 * @returns {boolean}
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp: expiration} = jwtDecode(token);
        //Compare expiration date (after multiply it by 1000) with current Date(create new object date & get the current time in milliseconds)
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    isAuthenticated
};