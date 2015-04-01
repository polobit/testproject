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
<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.css">
  </head>
  
<style>


@media (min-width:400px)
{
body
{
width:80%;
}
.left-view
{
display:none;
}
}
@media (min-width:1198px)
{
body
{
width:1000px;
}
.error-container
{
font-size:100%;
}
.left-view
{
width:10%;
display:block;
}
.right-view
{
width:90%;
}
.sub-head
{
width:100%;
}
}

	body {
		background: url("../img/multilogin-bg.png") repeat scroll 0 0;
margin: 0 auto;
padding:14px 15px;
		font-family:'PT Sans',"Helvetica Neue",Helvetica,Arial,sans-serif;
	}
	h2,h4
	{
	margin:0px;
	}
	h2
	{
	margin: 6px 0px 2px;
color: #888;
}

.subhead,.error-details
{
margin: 0px 0px 0px;
font-weight: normal;
color: #999;
}
.error-details 
{
font-size:90%;
}
.error-details a
{
color: #468aca;
text-decoration: none;
}
.error-details a:hover
{
text-decoration:underline;
}
.error-container
{
box-shadow: 0 0 7px 0px #ddd;
padding: 10px 23px 15px;
background: #fff;
line-height: 30px;
margin: 10% auto;
border-radius: 4px;
}	
.left-view,.right-view
{
float:left;
}
.left-view i
{
color: #999;
font-size: 98px;
margin-top: 2px;

}
}
</style>
<%
// Get an array of Cookies associated with this domain
Cookie[] cookies = request.getCookies();
String cookieString = null;

// Reads multiple instace cookie which contains user agent info
if( cookies != null ){
   for (Cookie cookie : cookies){
      if(cookie.getName().equals("_multiple_login"))
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


  <body>
   
   <div class="container">
			<div class="error-container">
			<div class="left-view"><i class="fa fa-info-circle"></i></div>
			<div class="right-view">
				<h2>Wait!</h2> 
				<div class="subhead">We had to log you out as you seem to have logged in from some other browser/system  <span style="font-size:12px"><%= agent %> </span></div> 
				<div class="error-details">
					You may <a href="/login">Re-login</a>. This will log you out in the other browser/system.
				</div>
			</div>
			<div style="clear:both;"></div>
			</div>
	</div>
	
	<script src="//static.getclicky.com/js" type='text/javascript'>
	try
	{
		clicky.init(100729733);
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
	
	eraseCookie("_multiple_login");

	</script>
  </body>
</html>
