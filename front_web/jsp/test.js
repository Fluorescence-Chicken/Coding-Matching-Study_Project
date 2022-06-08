// scope for duck.nifskorea.com
const duck_nifskorea_com = {
    //api_url 추가
    api_url: "http://duck.nifskorea.com:8000/api",
    media_url: "http://duck.nifskorea.com:8000",

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



    
  //  붙여 넣기 : <script>duck_nifskorea_com.notification.getJSON()</script>
  // 제일 안쪽이 1이고, 그 다음이 2인 경우
  // 1.appand(2);
    study_found: {
            // html 215~222 줄
        exam1 : function(){
  
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
            img_study_found.setAttribute("src", "https://holaworld.io/images/info/delete.svg" );
            img_study_found.setAttribute("alt", "deleteButton");
           

            li_study_found.append(img_study_found);
            li_study_found.append(div_study_found);
            ul_study_found.append(li_study_found);
            ul_study_found.append(span_study_found);
        },


          // 코드 229~279줄, html 밑부분 도커 네모난 부분
        exam2 : function(){
            
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

           // span_study_found.setAttribute(document.createTextNode("필터 초기화"));

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

            var div6_study_found=document.createAttribute("div6");
            div6_study_found.setAttribute("class", "studyItem_schedule");
            div6_study_found.setAttribute("name", "studyStartDate");



            // ▲ div 5끝

            var h5_study_found = document.createElement("h5");
            h5_study_found.setAttribute("class", "card-title");
            h5_study_found.setAttribute(document.createTextNode("도커 스터디"));

            var div6_study_found = document.createElement("div6");
            div6_study_found.setAttribute("class", "tudyItem_schedule");
            div6_study_found.setAttribute("name", "studyStartDate" );

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
            // 멘토, 홍길동
            li2_study_found.setAttribute(document.createTextNode("#멘토 : 홍길동"));

            var li3_study_found = document.createAttribute("li3");
            li3_study_found.setAttribute("class", "studyItem_content_img");

            var li4_study_found = (document.createAttribute("li4"));
            li4_study_found.setAttribute("class", "studyItem_content_img");


            // 이미지 1 내용 : 스터디별 이미지를 긁어와야함
            var img1_study_found=(document.createAttribute("img1"));
            img1_study_found.setAttribute("class", "studyItem_content_img");
            img1_study_found.setAttribute("src", "https://holaworld.io/images/languages/docker.svg");
            img1_study_found.setAttribute("alt", "language");

            // 이미지 2 내용 : 스터디별  이미지를 긁어와야함
            var img2_study_found=(document.createAttribute("img2"));
            img2_study_found.setAttribute("class", "studyItem_content_img");
            img2_study_found.setAttribute("src", "https://holaworld.io/images/languages/docker.svg");
            img2_study_found.setAttribute("alt", "language");


      
            //div5 안에 들어가는것들
            p2_study_found.appendChild(div6_study_found);
            p1_study_found.appendChild(div5_study_found);
            div6_study_found.appendChild(div5_study_found);

            // ul1 안에 들어가는 것들
            li1_study_found.appendChild(ul1_study_found);
            li2_study_found.appendChild(ul1_study_found);


            // ul2 안에 들어가는 것들
            img1_study_found.appendChild(li3_study_found);
            img2_study_found.appendChild(li4_study_found);
            li3_study_found.appendChild(ul2_study_found);
            li4_study_found.appendChild(ul2_study_found);


            //div4 안에 들어가는 것들
            div5_study_found.appendChild(div4_study_found);
            h5_study_found.appendChild(div4_study_found);
            div7_study_found.appendChild(div4_study_found);
            ul1_study_found.appendChild(div4_study_found);
            ul2_study_found.appendChild(div4_study_found);

            //div3 안에 들어가는 것들
            div4_study_found.appendChild(div3_study_found);
            a_study_found.appendChild(div3_study_found);

            // 이후
            div3_study_found.appendChild(div2_study_found);
            div2_study_found.appendChild(div1_study_found);


            
        }



        },




    studyadd_board : {

      
       // studyadd_borad.html의 37~87, 게시글 이름~댓글 전까지, </section>까지

        exam1 : function() {

          var section1_studyadd_borad = document.createElement("section");
          
          var div1_studyadd_board=document.createElement("div1");
          div1_studyadd_board.setAttribute("class", "studyContent_title__3680o");
          // ▼ 게시글 이름 부분, DB에서 값 받아와야함.
          div1_studyadd_board.setAttribute(document.createTextNode("게시글 이름"));

          // ▼ div2
          var div2_studyadd_board = document.createElement("div2");
          div2_studyadd_board.setAttribute("class", "studyContent_userAndDate__1iYDv");


          var div3_studyadd_board = document.createElement("div3");
          div3_studyadd_board.setAttribute("class", "studyContent_user__1XYmH");


          var div4_studyadd_board=document.createElement("div4");
          div4_studyadd_board.setAttribute("class", "studyContent_registeredDate__3lybC");
          // ▼ 2022.05.20 부분 날짜 표시로써, DB에서 값을 받아와야함.
          div4_studyadd_board.setAttribute(document.createTextNode("2022.05.20"));

          // 사용자 프로필 부분
          var img1_studyadd_board=document.createElement("img1");
          img1_studyadd_board.setAttribute("class", "studyContent_userImg__3gyI-");
          img1_studyadd_board.setAttribute("src", "https://hola-post-image.s3.ap-northeast-2.amazonaws.com/default.PNG");
          img1_studyadd_board.setAttribute("alt", "userImg");

          var div5_studyadd_board = document.createElement("div5");
          div5_studyadd_board.setAttribute("class", "studyContent_userName__1GBr8");
          // ▼ TestUser 부분, 사용자 이름으로써 DB에서 값 받아와야함. 
          div5_studyadd_board.setAttribute(document.createTextNode("TestUser"));

          // ul1 시작부분 --------------------------------------
          var ul_studyadd_board = document.createElement("ul1");
          ul_studyadd_board.setAttribute("class", "studyInfo_studyGrid__38Lfj" );

          var li1_studyadd_board = document.createElement("li1");
          li1_studyadd_board.setAttribute("class", "studyInfo_contentWrapper__KkSUP");

          var span1_studyadd_board = document.createElement("span1");
          
          var span2_studyadd_board = document.createElement("span2");

          var span3_studyadd_board = document.createElement("span3");

          var div6_studyadd_board=document.createAttribute("div6");

        },

        // studyadd_borad.html의 89번~133의 </section>까지, 댓글 부분
        exam2 : function(){ 

        },


        },





      };
