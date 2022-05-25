// scope for duck.nifskorea.com
const duck_nifskorea_com = {
  //api_url 추가
  api_url: "http://duck.nifskorea.com:8000/api",
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
    getQuery: function() {
      //localStorage 불러오기
      var userdata_json = JSON.parse(localStorage.getItem("user_data"))
      const user = userdata_json["username"];
      const position = userdata_json["is_mentor"];
      const userPosition = "멘토";
      //멘토, 멘티 판별
        if(position == true) { userPosition = "멘티"; }

      //TODO: 아직 point 구현 안 됌
      //const point = localStorage.getItem(point);
      const userEmail = userdata_json["email"];
      const signUpDate = userdata_json["last_login"];
      
      //텍스트 값 변경
      duck_nifskorea_com.changeInnerText('h4[name="welcomeText"]', user+"님 환영합니다!");
      duck_nifskorea_com.changeInnerText('div[name="userName"]', user);
      duck_nifskorea_com.changeInnerText('p[name="position"]', userPosition);
      duck_nifskorea_com.changeInnerText('td[name="point"]', 100 + "점"); //포인트 변경
      duck_nifskorea_com.changeInnerText('td[name="userEmail"]', userEmail);
      duck_nifskorea_com.changeInnerText('td[name="signUpDate"]', signUpDate);
    },
  },
  study_user_first: {
    getQuery: function() {
      //localStorage 적용
      /*var data_json = JSON.parse(localStorage.getItem("local_storage_data"))
      const studyCount = data_json["study_count"];
      const studyPoint = data_json["study_point"];
      const studyProgress = data_json["study_progress"];
      const studyStartDate = data_json["study_start_date"];
      const studyName = data_json["study_name"];
      const studyDescription = data_json["study_description"];

      duck_nifskorea_com.changeInnerText('div[name="studyCount"]', "n"+"개"); //총 스터디 갯수
      duck_nifskorea_com.changeInnerText('div[name="studyPoint"]', "n"+"점"); //스터디 누적 포인트
      duck_nifskorea_com.changeInnerText('div[name="studyProgress"]', "n"+"%"); //스터디 총 진행률
      duck_nifskorea_com.changeInnerText('div[name="studyStartDate"]', studyStartDate); //스터디 시작 예정일
      duck_nifskorea_com.changeInnerText('h5[name="studyName"]', studyName); //스터디 이름
      duck_nifskorea_com.changeInnerText('div[name="studyDescription"]', studyDescription); //스터디 설명
      */

      duck_nifskorea_com.changeInnerText('div[name="studyCount"]', "n"+"개"); //총 스터디 갯수
      duck_nifskorea_com.changeInnerText('div[name="studyPoint"]', "n"+"점"); //스터디 누적 포인트
      duck_nifskorea_com.changeInnerText('div[name="studyProgress"]', "n"+"%"); //스터디 총 진행률
      duck_nifskorea_com.changeInnerText('div[name="studyStartDate"]', Date()); //스터디 시작 예정일
      duck_nifskorea_com.changeInnerText('h5[name="studyName"]', "(도커 스터디)"); //스터디 이름
      duck_nifskorea_com.changeInnerText('div[name="studyDescription"]', "(Docker에 대해 알아보는 초급 스터디입니다.)"); //스터디 설명
    },
  },
  sutdyDashboard:{
    getQuery: function(){
      //localStorage 적용
      /*var data_json = JSON.parse(localStorage.getItem("local_storage_data"))
      const studyName = data_json["study_name"];
      const studyCount = data_json["study_count"];
      const endLesson = data_json["end_lesson"];
      const allLesson = data_json["all_lesson"];
      const name = data_json["name"];
      const dept = data_json["dept"];
      const carrar = data_json["carrar"];
      const email = data_json["email"];
      const startDate = data_json["start_date"];
      const endDate = data_json["end_date"];
      const bio = data_json["bio"];
      const studyWeekNum = data_json["study_week_num"];
      const studyTitle1 = data_json["study_title1"];
      const studyTitle2 = data_json["study_title2"];
      const studyTitle3 = data_json["study_title3"];
      const studyTime1 = data_json["study_time1"];
      const studyTime2 = data_json["study_time2"];
      const studyTime3 = data_json["study_time3"];

      //스터디 요약 부분 (상단 부분)
      duck_nifskorea_com.changeInnerText('h4[name="studyName"]', studyName); //스터디 명
      duck_nifskorea_com.changeInnerText('div[name="studyCount"]', "총 " + studyCount + "개"); //총 강의 개수
      duck_nifskorea_com.changeInnerText('div[name="endLesson"]', endLesson + "/"); //완료 수업
      duck_nifskorea_com.changeInnerText('div[name="allLesson"]', allLesson); //총 수업

      //프로필 (중간 부분)
      duck_nifskorea_com.changeInnerText('h6[name="name"]', name); //강사 이름

      //약력 (하단1 부분)
      duck_nifskorea_com.changeInnerText('td[name="name"]', name); //교사(강사) 이름
      duck_nifskorea_com.changeInnerText('td[name="dept"]', dept); //담당 전공
      duck_nifskorea_com.changeInnerText('td[name="carrar"]', carrar); //연력 또는 경력
      duck_nifskorea_com.changeInnerText('td[name="email"]', email); //교사(강사) 이름
      duck_nifskorea_com.changeInnerText('div[name="startDate"]', startDate); //스터디 진행 기간(시작)
      duck_nifskorea_com.changeInnerText('div[name="endDate"]', endDate); //스터디 진행 기간(끝)
      duck_nifskorea_com.changeInnerText('td[name="bio"]', bio); //한줄 인사말

      //스터디 목록(하단2 부분)
      duck_nifskorea_com.changeInnerText('h6[name="studyWeekNum"]', studyWeekNum +"주차 스터디"); //n주차 스터디
      duck_nifskorea_com.changeInnerText('td[name="studyTitle1"]', studyTitle1); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTitle2"]', studyTitle2); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTitle3"]', studyTitle3); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTime1"]', studyTime1); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTime2"]', studyTime2); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTime3"]', studyTime3); //스터디 이름
      */

      //스터디 요약 부분 (상단 부분)
      duck_nifskorea_com.changeInnerText('h4[name="studyName"]', "스터디 명"); //스터디 명
      duck_nifskorea_com.changeInnerText('div[name="studyCount"]', "총 " + "n" + "개"); //총 강의 개수
      duck_nifskorea_com.changeInnerText('div[name="endLesson"]', "n" + "/"); //완료 수업
      duck_nifskorea_com.changeInnerText('div[name="allLesson"]', "n"); //총 수업

      //프로필 (중간 부분)
      duck_nifskorea_com.changeInnerText('h6[name="name"]', "이름"); //강사 이름

      //약력 (하단1 부분)
      duck_nifskorea_com.changeInnerText('td[name="name"]', "이름"); //교사(강사) 이름
      duck_nifskorea_com.changeInnerText('td[name="dept"]', "전공 학과"); //담당 전공
      duck_nifskorea_com.changeInnerText('td[name="carrar"]', "경력"); //연력 또는 경력
      duck_nifskorea_com.changeInnerText('td[name="email"]', "thelight0804@gmail.com"); //교사(강사) 이름
      duck_nifskorea_com.changeInnerText('div[name="startDate"]', Date()); //스터디 진행 기간(시작)
      duck_nifskorea_com.changeInnerText('div[name="endDate"]', Date()); //스터디 진행 기간(끝)
      duck_nifskorea_com.changeInnerText('td[name="bio"]', "오늘 한강은 따뜻할까?"); //한줄 인사말

      //스터디 목록(하단2 부분)
      duck_nifskorea_com.changeInnerText('h6[name="studyWeekNum"]', "n" +"주차 스터디"); //n주차 스터디
      duck_nifskorea_com.changeInnerText('td[name="studyTitle1"]', "스터디 명01"); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTitle2"]', "스터디 명02"); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTitle3"]', "스터디 명03"); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTime1"]', "00분"); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTime2"]', "00분"); //스터디 이름
      duck_nifskorea_com.changeInnerText('td[name="studyTime3"]', "00분"); //스터디 이름
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
