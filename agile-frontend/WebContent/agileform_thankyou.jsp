<!DOCTYPE html>
<%@page import="javax.servlet.http.HttpServlet"%>
<%@page import="javax.servlet.http.HttpServletRequest"%>
<%@page import="javax.servlet.http.HttpServletResponse"%>
<%@page import="java.lang.Exception"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<html>
<head>
<title>Thanks for filling out my form | AgileCRM</title>
</head>
<body>
   <% 
      String customeMessage ="";
		
		try{
		customeMessage = request.getParameter("_agile_custome_submit").toString();
		}
	catch (Exception e)
	    {
		   customeMessage="";
	    }
   if(customeMessage != null && customeMessage !=""){
	   %>
	   
	   <h1><%=customeMessage %></h1>  
  <% }
   else {%>
  <h1>Great! Thanks for filling out my form!</h1>
  <%} %>
</body>
</html>