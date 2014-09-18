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
				<h1>Wait!</h1> 
				<h2>We had to log you out as you seem to have logged in from some other system/browser (<%= agent %>)</h2>
				<div class="error-details">
					You may <a href="/login">Re-login</a>. This will log your out in the other system/browser."
				</div>
			
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
	<script>
	/**
	 * Used to delete a variable from document.cookie
	 * 
	 * @param name
	 *            name of the variable to be removed from the cookie
	 * @returns cookie without the variable
	 */
	function eraseCookie(name)
	{
		createCookie(name, "", -1);
	}
	
	function createCookie(name, value, days)
	{
		// If days is not equal to null, undefined or ""
		if (days)
		{
			var date = new Date();

			// Set cookie variable's updated expire time in milliseconds
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		}
		else
			// If days is null, undefined or "" set expires as ""
			var expires = "";
		document.cookie = name + "=" + escape(value) + expires + "; path=/";
	}

	</script>
  </body>
</html>
