// scope for duck.nifskorea.com
const duck_nifskorea_com = {
  api_url: "http://duck.nifskorea.com:8000/api/",
  login: {
    _onLoginButton: function () {
      const email = document.querySelector('input[name="input_email"]').value;
      const password = document.querySelector(
        'input[name="input_password"]'
      ).value;
      const data = {
        email: email,
        password: password,
      };
      // define xhr and headers
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${duck_nifskorea_com.api_url}/auth/login/`, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Accept", "application/json");
      // send request
      xhr.send(JSON.stringify(data));
      xhr.onload = function () {
        // When response is 200, Save token to localStorage
        // after request success, get user data and store it to localStorage
        // and redirect to /
        if (xhr.status === 200 || xhr.status === 204) {
          const user_xhr = new XMLHttpRequest();
          localStorage.setItem("token", JSON.parse(xhr.response).token);
          user_xhr.open("GET", `${duck_nifskorea_com.api_url}/me/`, true);
          // Set request headers and default settings
          user_xhr.setRequestHeader("Content-Type", "application/json");
          user_xhr.setRequestHeader("Accept", "application/json");
          user_xhr.setRequestHeader(
            "Authorization",
            `Token ${JSON.parse(xhr.response).token}`
          );
          user_xhr.send();
          user_xhr.onload = function () {
            if (user_xhr.status === 200 || user_xhr.status === 204) {
              const user_data = JSON.parse(user_xhr.response);
              localStorage.setItem("user_data", JSON.stringify(user_data));
              localStorage.setItem("is_login", true);
              location.href = "/";
            } else {
              alert("Error: " + user_xhr.status + ". Please contact to admin.");
            } // If - Else end
          };
        } else {
          alert(
            "Error: " + xhr.status + ". Please check your email and password."
          );
        }
      };
    },
  },
};
