// scope for duck.nifskorea.com
const duck_nifskorea_com = {
  //api_url 추가
  api_url: "http://duck.nifskorea.com:8000/api/",
  login: {
    onLoginButton: function () {
      // 값 들고오기
      const email = document.querySelector('input[name="input_email"]').value;
      const password = document.querySelector(
        'input[name="input_password"]'
      ).value;

      //data 클래스에 저장
      const data = {
        email: email,
        password: password,
      };
      // define xhr and headers
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${duck_nifskorea_com.api_url}/auth/login/`, true);
      xhr.setRequestHeader("Content-Type", "application/json"); //json 보내기
      xhr.setRequestHeader("Accept", "application/json"); //json 받기
      // send request
      xhr.send(JSON.stringify(data)); //JSON String으로 data 보내기

      //정상적으로 보내졌을 때
      xhr.onload = function () {
        // When response is 200, Save token to localStorage
        // after request success, get user data and store it to localStorage
        // and redirect to /
        //요청이 정상적으로 받았을 때
        if (xhr.status === 200 || xhr.status === 204) {
          const user_xhr = new XMLHttpRequest();

          //token 비교
          localStorage.setItem("token", JSON.parse(xhr.response).token);
          user_xhr.open("GET", `${duck_nifskorea_com.api_url}/me/`, true);
          // Set request headers and default settings
          user_xhr.setRequestHeader("Content-Type", "application/json");
          user_xhr.setRequestHeader("Accept", "application/json");
          user_xhr.setRequestHeader(
            "Authorization", //검증
            `Token ${JSON.parse(xhr.response).token}`
          );
          user_xhr.send();
          user_xhr.onload = function () {
            if (user_xhr.status === 200 || user_xhr.status === 204) {
              const user_data = JSON.parse(user_xhr.response);

              //localStorage.setItem : localStorage에 데이터를 저장한다
              localStorage.setItem("user_data", JSON.stringify(user_data));
              localStorage.setItem("is_login", true); //login 성공
              //main화면으로 이동
              location.href = "/";
            } else {
              alert("Error: " + user_xhr.status + ". Please contact to admin.");
            } // If - Else end
          };
        } else { //로그인 실패 시
          alert(
            "Error: " + xhr.status + ". Please check your email and password."
          );
        }
      };
    },
  },
  myPage: {
    /**
     * html 요소 가져오기
     */
    getQuery: function () {
      //값 들고오기
      duck_nifskorea_com.changeInnerText('h4[name="welcomeText"]', "[user_홍길동]님 환영합니다!");
      duck_nifskorea_com.changeInnerText('div[name="userName"]', "[userName_홍길동]");
      duck_nifskorea_com.changeInnerText('p[name="position"]', "[직책_팀장]");
      duck_nifskorea_com.changeInnerText('td[name="point"]', 100 + "점"); //포인트 변경
      duck_nifskorea_com.changeInnerText('td[name="studyName"]', "[studyName_Spring]");
      duck_nifskorea_com.changeInnerText('td[name="phone"]', "[010-0000-0000]");
      duck_nifskorea_com.changeInnerText('td[name="userEmail"]', "[asdf@test.com]");
      duck_nifskorea_com.changeInnerText('td[name="signUpDate"]', Date());
    },
  },
  /**
 * Text 변경
 * @param query Text 객체
 * @param string 변경되는 값
 */
  changeInnerText: function (query, string) {
    const element = document.querySelector(query);
    element.innerHTML = string;
  }, //changeInnerText: function() 끝
};
