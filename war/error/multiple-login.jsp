<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<%@page import="java.net.URLDecoder"%>
<%@page import="org.json.JSONObject"%>
<html>
  <head>
    <title>Agile CRM</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">

  </head>
  
<style>
@media ( min-width : 900px) {
	body {
		padding-top: 20px;
		padding-left:10%;
	}
}
<%
// Get an array of Cookies associated with this domain
Cookie[] cookies = request.getCookies();
String cookieString = null;

// Reads multiple instace cookie which contains user agent info
if( cookies != null ){
   for (Cookie cookie : cookies){
      if(cookie.getName().equals("_multiple_instances"))
      {
		  cookieString = URLDecoder.decode(cookie.getValue());
		  cookie.setMaxAge(-1);
		  response.addCookie(cookie);
		  break;
      }
   }
}

// If json object is not avaiable page is redirected to login page
JSONObject cookieJSON = null;
if(cookieString == null)
{
    response.sendRedirect("/login");
    return;
}

cookieJSON = new JSONObject(cookieString);

// Reads user agent info from cookie
String agent = "unknown";
if(cookieJSON.has("userAgent"))
{
    JSONObject user_details = cookieJSON.getJSONObject("userAgent");
    cookieJSON.put("user_details", user_details);
    agent = user_details.get("browser_name") + "(" + user_details.get("full_version") +") / " + user_details.get("OSName");
}


%>
</style>

  <body>
   
	<div class="container">
			<div class="error-container">
					We detected a login into your account from a new device ("<%= agent %>"). You have been logged out now. <br/> <br/>
					<a href="/login">Click here</a> to login
			</div>
	</div>
	<script src="//static.getclicky.com/js" type='text/javascript'>
	try
	{
		clicky.init();
	}
	catch (e)
	{
	}
	</script> 
  </body>
</html>
