<%
    request.setCharacterEncoding("utf-8"); //Post방식 인코딩 설정
    String id = request.getParameter("id");
    String pw = request.getParameter("pw");
    String email = request.getParameter("email");
    String nickName = request.getParameter("nickName");
%>

<%
    out.println("id : " + id + "<br>");
    out.println("pw : " + pw + "<br>");
    out.println("email : " + email + "<br>");
    out.println("nickName : " + nickName + "<br>");
%>
