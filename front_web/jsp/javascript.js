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
    getQuery: function () {
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
      duck_nifskorea_com.changeInnerText('h4[name="welcomeText"]', user + "님 환영합니다!");
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
      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 204) {
          const data_json = JSON.parse(xhr.response);
          //스터디 개수
          const Count = Object.keys(data_json).length;

          //data_json의 값 얻기
          for (let i = 0; i < Object.keys(data_json).length; i++) {
            const study_data = {
              studyName: data_json[i].name,
              studyDescription: data_json[i].description,
              studyTag: data_json[i].tags,
              mentorNum: data_json[i].mentor,
              users: data_json[i].users,
              id: data_json[i].id,
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
    createStudyRoomCard: function (study_data) {
      const studyName = study_data.studyName;
      const studyDescription = study_data.studyDescription;
      const studyStartDate = Date();
      const studyTag = study_data.studyTag;
      const mentorNum = study_data.mentorNum;
      const users = study_data.users;
      const id = study_data.id;


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
      studyTagUi_element.setAttribute("class", "studyItem_content");
      for (var tag of studyTag) {
        // Send xhr request to get tag name
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${duck_nifskorea_com.api_url}/board/tag/${tag}/`);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.send();
        xhr.onload = function () {
          if (xhr.status === 200 || xhr.status === 204) {
            tag_data = JSON.parse(xhr.response);
            const li = document.createElement("li");
            const img = document.createElement("img");
            li.setAttribute("class", "studyItem_content_img");
            img.setAttribute("class", "studyItem_content_img img-circle");
            img.setAttribute("style", "width: 70px; height: 70px;");
            img.setAttribute("src", tag_data.tag_image);
            img.setAttribute("alt", tag_data.name);
            studyTagUi_element.appendChild(li);
            li.appendChild(img);
          }
        };
      }


      var button_element = document.createElement("a");
      duck_nifskorea_com.study_user_first.studyLink(button_element, id);
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
      duck_nifskorea_com.changeInnerText('div[name="studyCount"]', Count + "개"); //총 스터디 갯수
      duck_nifskorea_com.changeInnerText('div[name="studyPoint"]', "n" + "점"); //스터디 누적 포인트
      duck_nifskorea_com.changeInnerText('div[name="studyProgress"]', "n" + "%"); //스터디 총 진행률
      //duck_nifskorea_com.changeInnerText('div[name="studyStartDate"]', Date()); //스터디 시작 예정일
      //duck_nifskorea_com.changeInnerText('h5[name="studyName"]', "(도커 스터디)"); //스터디 이름
      //duck_nifskorea_com.changeInnerText('div[name="studyDescription"]', "(Docker에 대해 알아보는 초급 스터디입니다.)"); //스터디 설명
    },
    /**
     * 게시물 이동하는 하이퍼링크 생성
    * @param {HTMLAnchorElement} link HTML의 "a" tag에 들어가는 Element
     * @param {number} id API로 받은 게시글 ID
     */
    studyLink: function (link, id) {
      const URL = "http://duck.nifskorea.com:8080/project/page/study_dashboard.html?studyID=" +
        id;
      link.setAttribute("href", URL);
      link.setAttribute("class", "btn " + "btn-primary");
    }
  },
  study_dashboard: {
    /**
     * get study_dashboard JSON data
     * @param {number} id the id to find user
     */
    getMentorJSON: function (id) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/user/${id}/`, false);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();

      xhr.onload = function () {
        //server 오류 예외처리
        if (xhr.status >= 400 && xhr.status <= 550) {
          throw `Server responsed! ${xhr.status}: ${xhr.response}`;
        };
      }; //xhr.onload = function() End

      const data_json = JSON.parse(xhr.response);
      mentorData = {
        userName: data_json.username, //이름
        email: data_json.email,
        firstName: data_json.first_name,
        lastName: data_json.last_name,
        gender: data_json.gender,
        isMentor: data_json.is_mentor,
        profileImage: data_json.profile_image,
      };
      return mentorData;
    },
    /**
     * 
     * @param {number} id the id to find study
     */
    getStudyJSON: function (id) {

      //API
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/board/studyroom/${id}/`, false);
      //GET : 데이터 수신 / POST : 데이터 생성
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
      xhr.onload = function () {
        //server 오류 예외처리
        if (xhr.status >= 400 && xhr.status <= 550) {
          throw `Server responsed! ${xhr.status}: ${xhr.response}`;
        };
      }; //xhr.onload = function() End

      const data_json = JSON.parse(xhr.response);
      studyData = {
        name: data_json.name, //이름
        description: data_json.description, //설명
        startDate: data_json.start_date, //시작 기간
        endDate: data_json.end_date, //끝 기간
        mentorID: data_json.mentor, //mentor ID
      };
      return studyData;
    },
    /**
     * get QnA JSON data
     * @param {number} studyroom_id 스터디 룸 id
     * @returns QnA JSON data
     */
    getQnAJSON: function (studyroom_id) {
      const xhr = new XMLHttpRequest();
      const token = localStorage.getItem("token");
      xhr.open("GET", `${duck_nifskorea_com.api_url}/board/posts/?studyroom=${studyroom_id}`, false);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Authorization", `token ${token}`);
      xhr.send();

      xhr.onload = function () {
        //server 오류 예외처리
        if (xhr.status >= 400 && xhr.status <= 550) {
          throw `Server responsed! ${xhr.status}: ${xhr.response}`;
        };
      }; //xhr.onload = function() End

      const data_json = { posts: JSON.parse(xhr.response) }
      console.log(JSON.stringify(data_json));
      console.log(data_json);
      return data_json;
    },
    // QnA template apply
    init_qna_template: function (board) {
      const template = document.getElementById('qna_template').innerHTML;
      Mustache.parse(template);

      console.log(board);
      let rendered = Mustache.render(template, board);
      document.getElementById('qna_output').innerHTML = rendered;
    },
    /**
     * get Lecture(강의) JSON data
     * @param {number} studyroom_id 현재 대상 스터디룸 id
     * @returns lecture JSON data
     */
    getLectureJSON: function (studyroom_id) {
      const xhr = new XMLHttpRequest();
      const token = localStorage.getItem("token");
      xhr.open("GET", `${duck_nifskorea_com.api_url}/board/schedule/?studyroom=${studyroom_id}`, false);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Authorization", `token ${token}`);
      xhr.send();

      xhr.onload = function () {
        //server 오류 예외처리
        if (xhr.status >= 400 && xhr.status <= 550) {
          throw `Server responsed! ${xhr.status}: ${xhr.response}`;
        };
      }; //xhr.onload = function() End

      const data_json = JSON.parse(xhr.response);
      let lectureData = [];
      for (const data of data_json) {
        name_index = lectureData.findIndex(
          (name_object) => name_object.name === data.name
        );
        // if name is not exist(first input of data), push name object on lectureData first
        if (name_index === -1) {
          lectureData.push({
            name: data.name,
            lectures: [
              {
                id: data.id,
                time: data.time,
                content: data.content,
                title: data.title,
              },
            ],
          });
        }
        // if name is already exist, pust lecture to existing name object
        else {
          lectureData[name_index].lectures.push({
            id: data.id,
            time: data.time,
            content: data.content,
            title: data.title,
          });
        }
      }
      console.log(lectureData)
      // sort array by name, and each name object by study_num
      // lectureData.sort((a, b) => a.name - b.name);
      // for (name in lectureData) {
      //   name.lectures.sort((a, b) => a.time - b.time);
      // }
      return lectureData;
    },
    /**
     * 강의 목록을 template으로 적용
     * @param {var} board JSON으로 얻은 강의 목록 데이터
     */
    init_lecture_template: function (board) {
      const template = document.getElementById('lecture_template').innerHTML;
      Mustache.parse(template);

      var data = board;
      let rendered = Mustache.render(template, data);
      document.getElementById('lecture_output').innerHTML = rendered;
    },
    /**
     * JS를 이용하여 동적으로 페이지를 구성하는 메서드
     */
    getQuery: function () {
      //study ID 판별
      var studyID;
      const query_param = new URLSearchParams(window.location.search);
      if (query_param.has("studyID")) {
        studyID = Number(query_param.get("studyID"));
      }

      //필요한 JSONData 불러오기
      const studyData = duck_nifskorea_com.study_dashboard.getStudyJSON(studyID);
      const mentorData = duck_nifskorea_com.study_dashboard.getMentorJSON(studyData.mentorID);
      console.log(mentorData);
      //스터디 요약 부분 (상단 부분)
      duck_nifskorea_com.changeInnerText('h4[name="studyName"]', "스터디 명"); //스터디 명
      duck_nifskorea_com.changeInnerText('div[name="studyCount"]', "총 " + "n" + "개"); //총 강의 개수

      //약력 (하단1 부분)
      duck_nifskorea_com.changeInnerText('td[name="name"]', mentorData.firstName + mentorData.lastName); //교사(강사) 이름
      duck_nifskorea_com.changeInnerText('td[name="dept"]', "전공 학과"); //담당 전공
      duck_nifskorea_com.changeInnerText('td[name="carrar"]', "경력"); //연력 또는 경력
      duck_nifskorea_com.changeInnerText('td[name="email"]', mentorData.email); //교사(강사) 이름
      duck_nifskorea_com.changeInnerText('div[name="startDate"]', studyData.startDate); //스터디 진행 기간(시작)
      duck_nifskorea_com.changeInnerText('div[name="endDate"]', studyData.endDate); //스터디 진행 기간(끝)
      duck_nifskorea_com.changeInnerText('td[name="bio"]', "오늘 한강은 따뜻할까?"); //한줄 인사말

      //Qna
      var qnaData = duck_nifskorea_com.study_dashboard.getQnAJSON(studyID);
      var lectureData = duck_nifskorea_com.study_dashboard.getLectureJSON(studyID);
      duck_nifskorea_com.study_dashboard.init_qna_template(qnaData);
      duck_nifskorea_com.study_dashboard.init_lecture_template(lectureData);
      //스터디 목록(하단2 부분)
      // duck_nifskorea_com.changeInnerText('h6[name="studyWeekNum"]', "n" + "주차 스터디"); //n주차 스터디
      // duck_nifskorea_com.changeInnerText('td[name="studyTitle1"]', "스터디 명01"); //스터디 이름
      // duck_nifskorea_com.changeInnerText('td[name="studyTitle2"]', "스터디 명02"); //스터디 이름
      // duck_nifskorea_com.changeInnerText('td[name="studyTitle3"]', "스터디 명03"); //스터디 이름
      // duck_nifskorea_com.changeInnerText('td[name="studyTime1"]', "00분"); //스터디 이름
      // duck_nifskorea_com.changeInnerText('td[name="studyTime2"]', "00분"); //스터디 이름
      // duck_nifskorea_com.changeInnerText('td[name="studyTime3"]', "00분"); //스터디 이름
    },

  },
  /**
   * 게시판 글 Read_board.html
   */
  readBoard: {
    /**
     * 
     * @param {number} id 쿼리스트링으로 받은 pageID 값
     * @returns 
     */
    pageJSON: function (id) {
      var boardData;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/notify_board/post/${id}/`, false);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();

      xhr.onload = function () {
        //server 오류 예외처리
        if (xhr.status >= 400 && xhr.status <= 550) {
          throw `Server responsed! ${xhr.status}: ${xhr.response}`;
        };
      }; //xhr.onload = function() End

      const data_json = JSON.parse(xhr.response);
      boardData = {
        id: data_json.id, //ID
        title: data_json.title, //제목
        content: data_json.content, //내용
        createdData: data_json.created_at, //생성 날짜
        uploadUser: data_json.uploaded_by, //업로더
      };
      return boardData;
    },
    init_template: function (board) {
      const template = document.getElementById('post_template').innerHTML;
      Mustache.parse(template);

      var data = board;
      let rendered = Mustache.render(template, data);
      document.getElementById('post_output').innerHTML = rendered;
    },
    /**
     * ReadBoard의 HTML 요소 삽입
     */
    loadPageElement: function () {
      const query_param = new URLSearchParams(window.location.search);
      //쿼리스트링 체크
      if (query_param.has("pageid")) {
        const pageID = Number(query_param.get("pageid"));
        var boardData = duck_nifskorea_com.readBoard.pageJSON(pageID);
        console.log(boardData);
        duck_nifskorea_com.readBoard.init_template(boardData);
      }
      else {
        alert("Page Error!");
        history.back(); //뒤로가기
      }

      // var boardHeader = document.createElement("div");
      // boardHeader.setAttribute("class", "b-divider");
      // boardHeader.appendChild(document.createTextNode(boardName));
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
   */ notification: {
    /**
     * 공지사항 JSON 데이터 Get
     */
    getJSON: function () {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/notify_board/post/`, true);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 204) {
          const data_json = JSON.parse(xhr.response);

          //data_json의 값 얻기
          for (let i = 0; i < Object.keys(data_json).length; i++) {
            const board_data = {
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
      }; //xhr.onload = function() End
    }, //getJSON: function() End
    /**
     * 공지사항 게시글 생성
     * @param {JSON data} board_data
     */
    createBoard: function (board_data) {
      const id = Number(board_data.id); //ID
      const title = board_data.title; //제목
      const content = board_data.content; //내용
      const createdData = board_data.createdData; //생성 날짜
      const uploadUser = duck_nifskorea_com.notification.getUserName(
        board_data.uploadUser
      ); //업로더
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
      duck_nifskorea_com.notification.boardLink(titleLink, title, id);
      boardTitle.appendChild(titleLink);

      //게시글 사용자
      var boardUser = document.createElement("td");
      boardUser.appendChild(document.createTextNode(uploadUser));

      //게시글 생성날짜
      var boardData = document.createElement("td");
      boardData.appendChild(document.createTextNode(createdData));

      //appendChild
      boardTr.appendChild(boardID);
      boardTr.appendChild(boardTitle);
      boardTr.appendChild(boardUser);
      boardTr.appendChild(boardData);

      //HTML Link
      document.getElementById("boardTable").appendChild(boardTr);
    }, //createBoard: function End
    /**
     * 게시물 이동하는 하이퍼링크 생성
     * @param {HTMLAnchorElement} link HTML의 "a" tag에 들어가는 Element
     * @param {String} title API로 받은 게시글 제목
     * @param {number} id API로 받은 게시글 ID
     */
    boardLink: function (link, title, id) {
      //id를 쿼리스트링으로 사용하여 게시글 분류
      const URL = "http://duck.nifskorea.com:8080/project/page/Read_board.html?pageid=" +
        id;
      link.setAttribute("href", URL);
      link.appendChild(document.createTextNode(title));
    }, //boardLink: function end
    /**
     * Get user's name from user id
     * @param {number} id the id to find user
     */
    getUserName: function (id) {
      // initialize xhr
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/user/${id}/`, false);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
      return JSON.parse(xhr.responseText).username;
    },
  },
  //----------------------------------------------------------
  // TODO: url, datastructure, board creation method 수정 필요
  /*Q&A 게시판 가지고오기 JSON처리*/
  qa_board: {
    /**
     * q&a JSON 데이터 Get
     */
    getJSON: function () {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/notify_board/post/`, true);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 204) {
          const data_json = JSON.parse(xhr.response);

          //data_json의 값 얻기
          for (let i = 0; i < Object.keys(data_json).length; i++) {
            const board_data = {
              id: data_json[i].id, //ID
              title: data_json[i].title, //제목
              content: data_json[i].content, //내용
              createdData: data_json[i].created_at, //생성 날짜
              uploadUser: data_json[i].uploaded_by, //업로더
            };
            //게시글 생성
            duck_nifskorea_com.notification.createBoard(board_data);
          } //for End
        } //if end
      }; //xhr.onload = function() End
    }, //getJSON: function() End
    /**
       * QA게시글 작성 
       * @param {JSON data} board_data
       */
    createBoard: function (board_data) {
      const id = Number(board_data.id); //ID
      const title = board_data.title; //제목
      const content = board_data.content; //내용
      const createdData = board_data.createdData; //생성 날짜
      const uploadUser = duck_nifskorea_com.notification.getUserName(
        board_data.uploadUser
      ); //업로더
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
      duck_nifskorea_com.notification.boardLink(titleLink, title, id);
      boardTitle.appendChild(titleLink);

      //게시글 사용자
      var boardUser = document.createElement("td");
      boardUser.appendChild(document.createTextNode(uploadUser));

      //게시글 생성날짜
      var boardData = document.createElement("td");
      boardData.appendChild(document.createTextNode(createdData));

      //appendChild
      boardTr.appendChild(boardID);
      boardTr.appendChild(boardTitle);
      boardTr.appendChild(boardUser);
      boardTr.appendChild(boardData);

      //HTML Link
      document.getElementById("boardTable").appendChild(boardTr);
    }, //createBoard: function End
    /**
     * 게시물 이동하는 하이퍼링크 생성
     * @param {HTMLAnchorElement} link HTML의 "a" tag에 들어가는 Element
     * @param {String} title API로 받은 게시글 제목
     * @param {number} id API로 받은 게시글 ID
     */
    boardLink: function (link, title, id) {
      //id를 쿼리스트링으로 사용하여 게시글 분류
      const URL = "http://duck.nifskorea.com:8080/project/page/Read_board.html?pageid=" +
        id;
      link.setAttribute("href", URL);
      link.appendChild(document.createTextNode(title));
    }, //boardLink: function end
    /**
     * Get user's name from user id
     * @param {number} id the id to find user
     */
    getUserName: function (id) {
      // initialize xhr
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/user/${id}/`, false);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
      return JSON.parse(xhr.responseText).username;
    },
  },
  //----------------------------------------------------------------------
  // TODO: url, datastructure, board creation method 수정 필요
  /*event 게시판 가지고오기 JSON처리*/
  event_board: {
    /**
     * event JSON 데이터 Get
     */
    getJSON: function () {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/notify_board/post/`, true);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 204) {
          const data_json = JSON.parse(xhr.response);

          //data_json의 값 얻기
          for (let i = 0; i < Object.keys(data_json).length; i++) {
            const board_data = {
              id: data_json[i].id, //ID
              title: data_json[i].title, //제목
              content: data_json[i].content, //내용
              createdData: data_json[i].created_at, //생성 날짜
              uploadUser: data_json[i].uploaded_by, //업로더
            };
            //게시글 생성
            duck_nifskorea_com.notification.createBoard(board_data);
          } //for End
        } //if end
      }; //xhr.onload = function() End
    }, //getJSON: function() End
    /**
     * QA게시글 작성 
     * @param {JSON data} board_data
     */
    createBoard: function (board_data) {
      const id = Number(board_data.id); //ID
      const title = board_data.title; //제목
      const content = board_data.content; //내용
      const createdData = board_data.createdData; //생성 날짜
      const uploadUser = duck_nifskorea_com.notification.getUserName(
        board_data.uploadUser
      ); //업로더
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
      duck_nifskorea_com.notification.boardLink(titleLink, title, id);
      boardTitle.appendChild(titleLink);

      //게시글 사용자
      var boardUser = document.createElement("td");
      boardUser.appendChild(document.createTextNode(uploadUser));

      //게시글 생성날짜
      var boardData = document.createElement("td");
      boardData.appendChild(document.createTextNode(createdData));

      //appendChild
      boardTr.appendChild(boardID);
      boardTr.appendChild(boardTitle);
      boardTr.appendChild(boardUser);
      boardTr.appendChild(boardData);

      //HTML Link
      document.getElementById("boardTable").appendChild(boardTr);
    }, //createBoard: function End
    /**
     * 게시물 이동하는 하이퍼링크 생성
     * @param {HTMLAnchorElement} link HTML의 "a" tag에 들어가는 Element
     * @param {String} title API로 받은 게시글 제목
     * @param {number} id API로 받은 게시글 ID
     */
    boardLink: function (link, title, id) {
      //id를 쿼리스트링으로 사용하여 게시글 분류
      const URL = "http://duck.nifskorea.com:8080/project/page/Read_board.html?pageid=" +
        id;
      link.setAttribute("href", URL);
      link.appendChild(document.createTextNode(title));
    }, //boardLink: function end
    /**
     * Get user's name from user id
     * @param {number} id the id to find user
     */
    getUserName: function (id) {
      // initialize xhr
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/user/${id}/`, false);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();
      return JSON.parse(xhr.responseText).username;
    },
  },

  study_found: {
    exam1: function () {

      var ul_study_found = document.createElement("ul");
      ul_study_found.setAttribute("class", "desktopFilter_selectedLanguages__3KowP");

      var span_study_found = document.createElement("span");
      span_study_found.setAttribute("class", "desktopFilter_resetFilter__ybCJD");
      // 필터초기화 부분
      span_study_found.setAttribute(document.createTextNode("필터 초기화"));


      var li_study_found = document.createElement("li");
      li_study_found.setAttribute("class", "desktopFilter_selectedLanguage__30mty");

      var div_study_found = document.createElement("div");
      div_study_found.setAttribute(document.createElement("Docker"));

      var img_study_found = document.createElement("img");
      img_study_found.setAttribute("src", "https://holaworld.io/images/info/delete.svg");
      img_study_found.setAttribute("alt", "deleteButton");


      li_study_found.append(img_study_found);
      li_study_found.append(div_study_found);
      ul_study_found.append(li_study_found);
      ul_study_found.append(span_study_found);
    },
    // 코드 229~279줄, html 밑부분 도커 네모난 부분
    exam2: function () {

      var div1_study_found = document.createElement("div");
      div1_study_found.setAttribute("class", "row row-cols-1 row-cols-md-3 g-4");

      var div2_study_found = document.createComment("div");
      div2_study_found.setAttribute("class", "col");

      var div3_study_found = document.createAttribute("div3");
      div3_study_found.setAttribute("class", "card shadow mb-4");
      div3_study_found.setAttribute("name", "studyCard");

      var a_study_found = document.createAttribute("a");
      a_study_found.setAttribute("href", "http://duck.nifskorea.com:8080/project/page/studyadd_board.html");
      a_study_found.setAttribute("class", "btn btn-primary");
      a_study_found.setAttribute(document.createTextNode("스터디로 이동하기"));

      var div4_study_found = document.createElement("div4");
      div4_study_found.setAttribute("class", "card-body");
      div4_study_found.setAttribute("style", "width: 18rem;");


      // 여기까지가 div 4까지 끝

      var div5_study_found = document.createElement("div");
      div5_study_found.setAttribute("class", "studyItem_schedule");


      // div 5안에 <p>랑 <div>
      var p1_study_found = document.createElement("p1");
      p1_study_found.setAttribute(document.createTextNode("시작 예정일"));


      // 시작일 바꿔야함!!
      // 시작 예정일 동적으로 되게 바꿔야함
      var p2_study_found = document.createElement("p2");
      p2_study_found.setAttribute(document.createTextNode("2022.05.23"));

      var div6_study_found = document.createAttribute("div6");
      div6_study_found.setAttribute("class", "studyItem_schedule");
      div6_study_found.setAttribute("name", "studyStartDate");



      // ▲ div 5끝

      var h5_study_found = document.createElement("h5");
      h5_study_found.setAttribute("class", "card-title");
      h5_study_found.setAttribute(document.createTextNode("도커 스터디"));

      var div6_study_found = document.createElement("div6");
      div6_study_found.setAttribute("class", "tudyItem_schedule");
      div6_study_found.setAttribute("name", "studyStartDate");

      var div7_study_found = document.createElement("div7");
      div7_study_found.setAttribute("name", "studyDescription");
      div7_study_found.setAttribute(document.createTextNode("Docker에 대해 알아보는 초급 스터디입니다."));

      var ul1_study_found = document.createAttribute("ul1");
      ul1_study_found.setAttribute("class", "studyItem_hashtag p-1");

      var ul2_study_found = document.createAttribute("ul2");
      ul2_study_found.setAttribute("class", "studyItem_content");


      // ul1 안에 있는 li 2개, 252~253개
      var li1_study_found = document.createAttribute("li1");
      li1_study_found.setAttribute(document.createTextNode("초급"));

      var li2_study_found = document.createAttribute("li2");
      // ▼ html 파일 252, 253번째 줄이 중복인데
      // 이거 없애야 되나 말아야 되나
      // 고민하다ㄱㅏ 그대로 뒀습니다.
      // 제가 적었는데도 뭐라는지 모르겠네요. 이거 보시면 연락주세요 (성민)
      li2_study_found.setAttribute(document.createTextNode("#멘토 : 홍길동"));

      var li3_study_found = document.createAttribute("li3");
      li3_study_found.setAttribute("class", "studyItem_content_img");

      var li4_study_found = (document.createAttribute("li4"));
      li4_study_found.setAttribute("class", "studyItem_content_img");


      // 이미지 1 내용 : 스터디별 이미지를 긁어와야함
      var img1_study_found = (document.createAttribute("img1"));
      img1_study_found.setAttribute("class", "studyItem_content_img");
      img1_study_found.setAttribute("src", "https://holaworld.io/images/languages/docker.svg");
      img1_study_found.setAttribute("alt", "language");

      // 이미지 2 내용 : 스터디별  이미지를 긁어와야함
      var img2_study_found = (document.createAttribute("img2"));
      img2_study_found.setAttribute("class", "studyItem_content_img");
      img2_study_found.setAttribute("src", "https://holaworld.io/images/languages/docker.svg");
      img2_study_found.setAttribute("alt", "language");



      //div5 안에 들어가는것들
      p2_study_found.appand(div6_study_found);
      p1_study_found.append(div5_study_found);
      div6_study_found.append(div5_study_found);

      // ul1 안에 들어가는 것들
      li1_study_found.append(ul1_study_found);
      li2_study_found.append(ul1_study_found);


      // ul2 안에 들어가는 것들
      img1_study_found.append(li3_study_found);
      img2_study_found.append(li4_study_found);
      li3_study_found.append(ul2_study_found);
      li4_study_found.append(ul2_study_found);


      //div4 안에 들어가는 것들
      div5_study_found.append(div4_study_found);
      h5_study_found.append(div4_study_found);
      div7_study_found.append(div4_study_found);
      ul1_study_found.append(div4_study_found);
      ul2_study_found.append(div4_study_found);

      //div3 안에 들어가는 것들
      div4_study_found.append(div3_study_found);
      a_study_found.append(div3_study_found);

      // 이후 전체
      div3_study_found.appand(div2_study_found);
      div2_study_found.append(div1_study_found);
    },
    /**
   * JS를 이용하여 동적으로 페이지를 구성하는 메서드
   */
    getQuery: function () {
      var studyURL = document.createElement("a");
      var studyData = duck_nifskorea_com.study_found.getstudyCardJSON(studyURL);
    },
    /**
   * get studyCard JSON data
   * @param {HTMLAnchorElement} studyURL 스터디 이동하기 버튼에 해당하는 HTML a 태그
   * @returns studyCard JSON data
   */
    getstudyCardJSON: function (studyURL) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/board/studyroom/`, false);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();

      xhr.onload = function () {
        //server 오류 예외처리
        if (xhr.status >= 400 && xhr.status <= 550) {
          throw `Server responsed! ${xhr.status}: ${xhr.response}`;
        };
      }; //xhr.onload = function() End

      const data_json = JSON.parse(xhr.response);
      for (let i = 0; i < Object.keys(data_json).length; i++) {
        var study_data = {
          studyName: data_json[i].name,
          studyDescription: data_json[i].description,
          studyTag: data_json[i].tags,
          mentorNum: data_json[i].mentor,
          users: data_json[i].users,
          id: data_json[i].id,
          studyStart: data_json[i].start_date,
          studyEnd: data_json[i].end_data,
        };
        //duck_nifskorea_com.study_user_first.studyLink(studyURL, super.id)
        duck_nifskorea_com.study_found.init_study_template(study_data);
      };
    },
    /**
     * 스터디 목록을 template으로 적용
     * @param {var} board JSON으로 얻은 스터디 목록 데이터
     */
    init_study_template: function (board) {
      const template = document.getElementById('studyCard_template').innerHTML;
      Mustache.parse(template);

      var data = board;
      let rendered = Mustache.render(template, data);
      document.getElementById('studyCard_output').innerHTML += rendered;
    },
  },

  index: {
    /**
   * get studyCard JSON data
   * @returns studyCard JSON data
   */
    getStudyJSON: function () {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${duck_nifskorea_com.api_url}/board/studyroom/`, false);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send();

      xhr.onload = function () {
        //server 오류 예외처리
        if (xhr.status >= 400 && xhr.status <= 550) {
          throw `Server responsed! ${xhr.status}: ${xhr.response}`;
        }
      }; //xhr.onload = function() End

      const data_json = JSON.parse(xhr.response);
      return (
        data_json
          // Sort by start_data, descending
          .sort((a, b) => {
            return b.start_date - a.start_date;
          })
          // Cut off the first 3 items
          .slice(0, 3)
          // map mentor(id) to username(string)
          .map((data) => {
            data.mentor_username = duck_nifskorea_com.getUserName(data.mentor);
            return data;
          })
      );
    },
  /**
   * get QnACard JSON data
   * @returns QnACard JSON data
   */
         getQnAJSON: function () {
          const xhr = new XMLHttpRequest();
          // TODO: URL을 QnA로 변경하기
          //xhr.open("GET", `${duck_nifskorea_com.api_url}/notify_board/qna/`, false);
          xhr.open("GET", `${duck_nifskorea_com.api_url}/notify_board/post/`, false);
          xhr.setRequestHeader("Accept", "application/json");
          xhr.send();
          xhr.onload = function () {
            //server 오류 예외처리
            if (xhr.status >= 400 && xhr.status <= 550) {
              throw `Server responsed! ${xhr.status}: ${xhr.response}`;
            }
          }; //xhr.onload = function() End
    
          const data_json = JSON.parse(xhr.response);
          return (
            data_json
              // Sort by start_data, descending
              .sort((a, b) => {
                return b.created_at - a.created_at;
              })
              // Cut off the first 3 items / 갯수를 3개만 제한
              .slice(0, 3)
              // map mentor(id) to username(string)
              .map((data) => {
                data.uploaded_by = duck_nifskorea_com.getUserName(data.uploaded_by);
                return data;
              })
          );
        },
  /**
   * get Notification JSON data
   * @returns Notification JSON data
   */
        getNotificationJSON: function () {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", `${duck_nifskorea_com.api_url}/notify_board/post/`, false);
          xhr.setRequestHeader("Accept", "application/json");
          xhr.send();
          xhr.onload = function () {
            //server 오류 예외처리
            if (xhr.status >= 400 && xhr.status <= 550) {
              throw `Server responsed! ${xhr.status}: ${xhr.response}`;
            }
          }; //xhr.onload = function() End
    
          const data_json = JSON.parse(xhr.response);
          return (
            data_json
              // Sort by start_data, descending
              .sort((a, b) => {
                return b.created_at - a.created_at;
              })
              // Cut off the first 3 items / 갯수를 3개만 제한
              .slice(0, 3)
              // map mentor(id) to username(string)
              .map((data) => {
                data.uploaded_by = duck_nifskorea_com.getUserName(data.uploaded_by);
                return data;
              })
          );
        },
  /**
   * get Event JSON data
   * @returns Event JSON data
   */
        getEventJSON: function () {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", `${duck_nifskorea_com.api_url}/notify_board/post/`, false);
          xhr.setRequestHeader("Accept", "application/json");
          xhr.send();
          xhr.onload = function () {
            //server 오류 예외처리
            if (xhr.status >= 400 && xhr.status <= 550) {
              throw `Server responsed! ${xhr.status}: ${xhr.response}`;
            }
          }; //xhr.onload = function() End
    
          const data_json = JSON.parse(xhr.response);
          return (
            data_json
              // Sort by start_data, descending
              .sort((a, b) => {
                return b.created_at - a.created_at;
              })
              // Cut off the first 3 items / 갯수를 3개만 제한
              .slice(0, 3)
              // map mentor(id) to username(string)
              .map((data) => {
                data.uploaded_by = duck_nifskorea_com.getUserName(data.uploaded_by);
                return data;
              })
          );
        },
      /**
     * 스터디 목록을 template으로 적용
     * @param {string} template_id 템플릿 Element의 ID
     * @param {object} board JSON으로 얻은 데이터
     * @param {string} output_id 렌더링된 HTML Element가 출력될 div Element의 ID
     */
    render_template: function (template_id, board, output_id) {
      const template = document.getElementById(template_id).innerHTML;
      Mustache.parse(template);
      var data = board;
      let rendered = Mustache.render(template, data);
      document.getElementById(output_id).innerHTML += rendered;
    },
    init_template: function () {
      this.render_template(
        "index_study_template", 
        this.getStudyJSON(),
        "index_study_output");
      this.render_template(
        "index_qna_template", 
        this.getQnAJSON(),
        "index_qna_output");
      this.render_template(
        "index_notification_template", 
        this.getNotificationJSON(),
        "index_notification_output");
        this.render_template(
          "index_event_template", 
          this.getEventJSON(),
          "index_event_output");
     },
  },

  getUserName: function (id) {
    // initialize xhr
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${duck_nifskorea_com.api_url}/user/${id}/`, false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
    return JSON.parse(xhr.responseText).username;
  },
};

/* 해당 부분 절대지우지 마세요!!!! 이거없음 페이지 요소 작동 안합니다. */
 /*  스터디 탈퇴 하기 자바 스크립트  */ 
 function studyDel() {
  if(confirm("스터디를 정말 탈퇴하시겠습니까? (탈퇴후 되돌릴수없습니다!)")){
    alert("탈퇴를 진행합니다.");
    location.href='#';
  }else{
    return;
  }
}
 /*  멘토 신고 하기 자바 스크립트  */ 
 function mentoAlert() {
  if(confirm("해당 멘토를 정말 신고하시겠습니까? (신중히 생각해주세요.)")){
    alert("해당 멘토를 신고합니다.");
    var input = prompt("이유를 입력해주세요.");
    if(input){
      alert("신고내용은 아래와 같습니다 "+"\n"+"신고내용 : " +input);
      alert("신고해주셔서 감사합니다.");
      location.href='#';
    }else{
      return;
    }
  }else{
    alert("멘토 신고를 취소합니다.");
    return;
  }
}
 /*  멘티 신고 하기 자바 스크립트  */ 
 function mentyAlert() {
  if(confirm("해당 멘티를 정말 신고하시겠습니까? (신중히 생각해주세요.)")){
    alert("해당 멘티를 신고합니다.");
    var input = prompt("이유를 입력해주세요.");
    if(input){
      alert("신고내용은 아래와 같습니다 "+"\n"+"신고내용 : " +input);
      alert("신고해주셔서 감사합니다.");
      location.href='#';
    }else{
      return;
    }
    
  }else{
    alert("멘티 신고를 취소합니다.");
    return;
  }
}
 /*  스터디 멘토 그만두기  자바 스크립트  */ 
 function studyMentoDel() {
  if(confirm("멘토를 그만두시겠습니까? (신중히 생각해주세요.)")){
    alert("참고 : 스터디 기간 미종료기간에 그만두시면 패널티가 있을수도있습니다.");
    var input = prompt("이유를 입력해주세요.");
    if(input){
      alert("스터디 멘토를 그만두신 이유는 다음과 같습니다. "+"\n"+"내용 : " +input);
      alert("해당 내용이 접수되었습니다 감사합니다.");
      location.href='#';
    }else{
      return;
    }
    
  }else{
    alert("작업을 취소합니다.");
    return;
  }
}
// 구글 리캡챠 검증 자바스크립트 
 /* 서브밋 전에 리캡챠 체크 여부 를 확인합니다. */
 function FormSubmit() {
  if (grecaptcha.getResponse() == "") {
    alert("리캡챠를 체크를 확인해주세요.");
    return false;
  } else {
    return true;
  }
}

