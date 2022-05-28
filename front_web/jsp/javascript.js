// scope for duck.nifskorea.com
const duck_nifskorea_com = {
  //api_url 추가
  api_url: "http://duck.nifskorea.com:8000/api",
  media_url: "http://duck.nifskorea.com:8000",
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
  signup: {
    // signup webpage javascript scope
    onSignUpButtonClick: function () {
      // This function calls when signup button is clicked
      // use XMLHttpRequest to call ajax request
      // get user input data from form[name="signup_form"]
      // define xhr and headers
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${duck_nifskorea_com.api_url}/signup/`, true);
      xhr.setRequestHeader("Content-Type", "application/json"); //json 보내기
      xhr.setRequestHeader("Accept", "application/json"); //json 받기
      // Get data from form
      const data = {
        username: document.querySelector('input[name="username"]').value,
        email: document.querySelector('input[name="email"]').value,
        password: document.querySelector('input[name="password"]').value,
        first_name: document.querySelector('input[name="first_name"]').value,
        last_name: document.querySelector('input[name="last_name"]').value,
        address: document.querySelector('input[name="address"]').value,
        job: document.querySelector('select[name="job"]').value,
        gender: document.querySelector('select[name="gender"]').value == "남자" ? "Male" : "Female",
      };
      xhr.send(JSON.stringify(data));
      xhr.onload = () => {
        // When the request is successful
        if (xhr.status >= 200 && xhr.status < 300) {
          alert(
            "회원 가입이 성공했습니다! 입력한 아이디와 비밀번호로 로그인 하세요."
          );
          location.href = "/";
        } else if (xhr.status === 400) {
          alert(
            "사용자 닉네임 또는 email에 중복이 있습니다. 기존의 아이디를 확인하거나, 새로운 아이디를 만들어 주세요. "
          );
        }
      };
    },
  },
  myPage: {
    // Default image link when profile image is null
    default_profile_image_url: "/media/profile_image/default_profile.png",
    /**
     * html 요소 가져오기
     */
    // Data structure for user_data
    // { id: int, last_login: datetime, username: string, email: string, profile_image: string, first_name: string, last_name: string, 
    //   address: string, job: string, gender: string, is_active: bool, is_admin: bool, is_mentor: bool }
    getQuery: function() {
      //localStorage 불러오기
      var userdata_json = JSON.parse(localStorage.getItem("user_data"))
      const user = userdata_json["username"];
      const check_user_position = () => {
        if (userdata_json.is_admin) return "관리자";
        else if (userdata_json.is_mentor) return "멘토";
        else return "멘티";
      };
      var userPosition = check_user_position();
       
      //멘토, 멘티 판별

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

      //Change profile image
      const profile_image_element = document.querySelector("img[name='profile_image'");
      // If profile image is null, get default profile image url, else get uploaded image
      profile_image_url = duck_nifskorea_com.media_url + (userdata_json["profile_image"] == null ? this.default_profile_image_url : userdata_json["profile_image"]);
      profile_image_element.setAttribute("src", profile_image_url);
    },
  },
  study_user_first: {
    /**
     * studyCard를 동적으로 생성하는 메서드
     */
  getStudyJson: function () {
      //API
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/board/studyroom/`, true);
      //GET : 데이터 수신 / POST : 데이터 생성
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
      xhr.onload = function(){
        if (xhr.status === 200 || xhr.status === 204){
          const data_json = JSON.parse(xhr.response);
          //스터디 개수
          const Count = Object.keys(data_json).length;

          //data_json의 값 얻기
          for(let i = 0; i<Object.keys(data_json).length; i ++){
            const study_data={
              studyName: data_json[i].name,
              studyDescription: data_json[i].description,
              studyTag: data_json[i].tags,
              mentorNum: data_json[i].mentor,
              users: data_json[i].users,
            };

            //카드 생성
            duck_nifskorea_com.study_user_first.createStudyRoomCard(study_data);
            //동적 출력
            duck_nifskorea_com.study_user_first.getQuery(Count);
          } //for End

          //스터디 개수

        } //if end
      } //xhr.onload = function() End
    },
    /**
     * JSON에서 얻어온 값으로 카드 생성
     * @param {data_json data} study_data 
     */
    createStudyRoomCard: function(study_data){
      const studyName = study_data.studyName;
      const studyDescription = study_data.studyDescription;
      const studyStartDate = Date();
      const studyTag = study_data.studyTag;
      const mentorNum = study_data.mentorNum;
      const users = study_data.users;
      
      
      var studyCardCol_element = document.createElement("col");
      studyCardCol_element.setAttribute("style", "padding: 20px;");

      //StudyCard div 생성
      var studyCard_element = document.createElement("div");
      //div의 속성 설정
      studyCard_element.setAttribute("class", "card " + "shadow " + "mb-1 ");
      studyCard_element.setAttribute("name", "studyCard");

      var cardBody_element = document.createElement("div");
      cardBody_element.setAttribute("class", "card-body");
      cardBody_element.setAttribute("style", "width: 18rem;");

      var studyStartDate_element = document.createElement("div");
      studyStartDate_element.setAttribute("class", "studyItem_schedule");

      studyStartDate_element.appendChild(document.createTextNode("시작 예정일 |"));
      studyStartDate_element.appendChild(document.createTextNode(studyStartDate));
      //studyStartDate를 studyCard에 자식으로 추가
      cardBody_element.appendChild(studyStartDate_element);

      //sutdyName 생성
      var studyName_element = document.createElement("h5");
      studyName_element.appendChild(document.createTextNode(studyName));

      var studyDescription_element = document.createElement("div");
      studyDescription_element.appendChild(document.createTextNode(studyDescription));

      //studyTag
      var studyTagUi_element = document.createElement("ul");
      var studyTagli_element = document.createElement("li");
      studyTagli_element.appendChild(document.createTextNode(studyTag));
      studyTagUi_element.appendChild(studyTagli_element);



      var button_element = document.createElement("a");
      button_element.setAttribute("href", "http://duck.nifskorea.com:8080/project/page/study_dashboard.html");
      button_element.setAttribute("class", "btn " + "btn-primary");
      //button text 지정
      button_element.textContent = "스터디로 이동하기"

      //studyCard에 자식들 추가
      
      studyCard_element.appendChild(cardBody_element);
      cardBody_element.appendChild(studyName_element);
      cardBody_element.appendChild(studyDescription_element);
      cardBody_element.appendChild(studyTagUi_element);
      studyCard_element.appendChild(button_element);
      studyCardCol_element.appendChild(studyCard_element);
      

      //HTML에 추가
      document.getElementById("studyCardCol").appendChild(studyCardCol_element);
    },
    /**
     * study_user_first.html에 여러 동적 값을 넣는 함수
     * @param {study 갯수} Count 
     */
    getQuery: function (Count) {
      duck_nifskorea_com.changeInnerText('div[name="studyCount"]', Count +"개"); //총 스터디 갯수
      duck_nifskorea_com.changeInnerText('div[name="studyPoint"]', "n"+"점"); //스터디 누적 포인트
      duck_nifskorea_com.changeInnerText('div[name="studyProgress"]', "n"+"%"); //스터디 총 진행률
      //duck_nifskorea_com.changeInnerText('div[name="studyStartDate"]', Date()); //스터디 시작 예정일
      //duck_nifskorea_com.changeInnerText('h5[name="studyName"]', "(도커 스터디)"); //스터디 이름
      //duck_nifskorea_com.changeInnerText('div[name="studyDescription"]', "(Docker에 대해 알아보는 초급 스터디입니다.)"); //스터디 설명
    },
  },
  sutdyDashboard:{
    getQuery: function(){
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
  change_profile: {
    default_profile_image_url: "/media/profile_image/default_profile.png",
    load_screen: function () {
      // This function is called when the change_profile.html is loaded
      // Get user data from local storage
      const user_data = JSON.parse(localStorage.getItem("user_data"));

      duck_nifskorea_com.changeInnerText(
        'div[name="username"]',
        user_data.username
      ); //사용자 이름
      profile_image_element = document.querySelector(
        "img[name='profile_image']"
      );
      profile_image_url =
        duck_nifskorea_com.media_url +
        (user_data["profile_image"] == null
          ? this.default_profile_image_url
          : user_data["profile_image"]);
      profile_image_element.setAttribute("src", profile_image_url);
    },
    upload_image: function () {
      // This function is called when the upload image button is clicked.
      // Post profile image to server
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${duck_nifskorea_com.api_url}/profile_image/`, true);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader(
        "Authorization",
        `Token ${localStorage.getItem("token")}`
      );
      // Get image information from input[name="profile_image"] which type is file
      const formData = new FormData();
      formData.append(
        "profile_image",
        document.querySelector('input[name="upload_image"]').files[0]
      );
      xhr.send(formData);
      xhr.onload = () => {
        // When the request is successful
        if (xhr.status >= 200 && xhr.status < 300) {
          alert("프로필 사진이 변경되었습니다.");
          // update localstorage's user_data
          // send xhr request to get user data from server
          const user_xhr = new XMLHttpRequest();
          user_xhr.open("GET", `${duck_nifskorea_com.api_url}/me/`, true);
          user_xhr.setRequestHeader("Accept", "application/json");
          user_xhr.setRequestHeader(
            "Authorization",
            `Token ${localStorage.getItem("token")}`
          );
          user_xhr.send();
          user_xhr.onload = () => {
            // When the request is successful
            if (user_xhr.status >= 200 && user_xhr.status < 300) {
              // update localstorage's user_data
              localStorage.setItem(
                "user_data",
                JSON.stringify(JSON.parse(user_xhr.responseText))
                // refresh current page
              );
              location.reload();
            }
            // When the request is failed
            else {
              alert(
                "유저 정보 호출에 실패했습니다. 반복될 경우 관리자에게 문의하세요."
              );
            }
          };
        }
        // When the request is failed
        else {
          alert(
            "프로필 사진 변경에 실패했습니다. 반복될 경우 관리자에게 문의하세요."
          );
        }
      };
    },
  },
  /**
   * 공지사항 notification.html
   */
  notification:{
    /**
     * 공지사항 JSON 데이터 Get
     */
    getJSON: function(){
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/notify_board/post/`, true);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
      xhr.onload = function(){
        if (xhr.status === 200 || xhr.status === 204){
          const data_json = JSON.parse(xhr.response);

          //data_json의 값 얻기
          for(let i = 0; i<Object.keys(data_json).length; i ++){
            const board_data={
              id: data_json[i].id, //ID
              title: data_json[i].title, //제목
              content: data_json[i].content, //내용
              createdData: data_json[i].created_at, //생성 날짜
              uploadUser: data_json[i].uploaded_by, //업로더
            };
            console.log(board_data);
            //게시글 생성
            duck_nifskorea_com.notification.createBoard(board_data);
          } //for End
        } //if end
      } //xhr.onload = function() End
    }, //getJSON: function() End
    /**
     * 공지사항 게시글 생성
     * @param {JSON data} study_data 
     */
    createBoard: function(study_data){
      const id = study_data.id; //ID
      const title = study_data.title; //제목
      const content = study_data.content; //내용
      const createdData = study_data.createdData; //생성 날짜
      const uploadUser = study_data.uploadUser; //업로더

      //게시글 테이블
      var boardTr = document.createElement("tr");

      //순번
      var boardID = document.createElement("th");
      boardID.setAttribute("scope", "row");
      boardID.appendChild(document.createTextNode(id));

      //게시글 제목
      var boardTitle = document.createElement("td");
      var titleLink = document.createElement("a");
      //하이퍼링크 생성
      duck_nifskorea_com.notification.boardLink(titleLink, title);
      boardTitle.appendChild(titleLink);


      //게시글 내용
      var boardContent = document.createElement("td");
      var contentLink = document.createElement("a");
      duck_nifskorea_com.notification.boardLink(contentLink, content);
      boardContent.appendChild(contentLink);

      //게시글 사용자
      var boardUser = document.createElement("td");
      boardUser.appendChild(document.createTextNode(uploadUser));

      //게시글 생성날짜
      var boardData = document.createElement("td");
      boardData.appendChild(document.createTextNode(createdData));

      //appendChild
      boardTr.appendChild(boardID);
      boardTr.appendChild(boardTitle);
      boardTr.appendChild(boardContent);
      boardTr.appendChild(boardUser);
      boardTr.appendChild(boardData);

      //HTML Link
      document.getElementById("boardTable").appendChild(boardTr);
    }, //createBoard: function End
    /**
     * 게시물 이동하는 하이퍼링크 생성
     * @param {value} link
     * @param {board_data} data 
     */
    boardLink: function(link, data){
      link.setAttribute("href", "http://duck.nifskorea.com:8080/project/page/Read_board.html");
      link.appendChild(document.createTextNode(data));
    } //boardLink: function end
  },
};
