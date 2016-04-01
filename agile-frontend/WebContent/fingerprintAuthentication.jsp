<%@page import="com.agilecrm.util.MathUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="java.util.TimeZone"%>
<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%@page import="java.net.URLDecoder"%>
<%@page import="org.json.JSONObject"%>
<%
/*
we use setAttribute() to store the username and to autofill if he want to resubmit the form after correcting the error occurred. 
*/
//flatfull path
String flatfull_path="/flatfull";
	
// Checks if it is being access directly and not through servlet
/* if(request.getAttribute("javax.servlet.forward.request_uri") == null)
{
  response.sendRedirect("/login");
  return;
} */

String error = request.getParameter("error");
if(error != null)
  System.out.println(error);
else
  error = "";

if("multi-login".equalsIgnoreCase(error)){
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
    agent = user_details.get("OSName") + " - " +user_details.get("browser_name") ;
    error="We had to log you out as you seem to have logged in from some other browser <span style='font-size:12px'>("+ agent+ ")</span>";
}
}

String _AGILE_VERSION = SystemProperty.applicationVersion.get();

String CSS_PATH = "/";
String FLAT_FULL_PATH = "flatfull/";
String CLOUDFRONT_TEMPLATE_LIB_PATH = VersioningUtil.getCloudFrontBaseURL();
System.out.println(CLOUDFRONT_TEMPLATE_LIB_PATH);
  
String CLOUDFRONT_STATIC_FILES_PATH = VersioningUtil.getStaticFilesBaseURL();
CSS_PATH = CLOUDFRONT_STATIC_FILES_PATH;

//Static images s3 path
String S3_STATIC_IMAGE_PATH = CLOUDFRONT_STATIC_FILES_PATH.replace("flatfull/", "");
if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
{
	  CLOUDFRONT_STATIC_FILES_PATH = FLAT_FULL_PATH;
	  CLOUDFRONT_TEMPLATE_LIB_PATH = "";	
	  CSS_PATH = FLAT_FULL_PATH;
	  S3_STATIC_IMAGE_PATH = VersioningUtil.getStaticFilesBaseURL();
}

// Users can show their logo on login page. 
AccountPrefs accountPrefs = AccountPrefsUtil.getAccountPrefs();
String logo_url = accountPrefs.logo;

// Bg Image
int randomBGImageInteger = MathUtil.randomWithInRange(1, 9);

%>
<!DOCTYPE html>

<html lang="en" style="background:transparent;">
<head>
<meta charset="utf-8">
<meta name="globalsign-domain-verification"
	content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<title>Login</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/app.css" />

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>

<style>
body {

  background-image: url('<%=S3_STATIC_IMAGE_PATH%>images/login-<%=randomBGImageInteger%>-low.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
}


.text-white
{
color:#fff!important;
}
input
{
color:#000 !Important;
}
a:hover
{
text-decoration:underline;
}

.error {
	color: white !important;
	background-color: #c74949;
  border-color: #c74949;
}

.close {
	  color: #000 !important;
}
.login-position-fixed{
position: fixed;width: 100%;top: 0px;
}

@media all and (max-width: 767px) {
	#simple-modal {
		display: none;
	}
}
.overlay:before{
  content: "";
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: black;
    opacity: 0.25;
}
.view{
	position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

</style>


<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>

<!--[if lt IE 10]>
<script src="flatfull/lib/ie/placeholders.jquery.min.js"></script>
<![endif]-->

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>	 
	<script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>

<body  class="overlay">
<div id="openid_btns">
					   	
	<div class="" id="app">

		<div ui-view="" class="fade-in-right-big smooth">
  			<div class="container w-xxl w-auto-xs view">
				
					<a href="https://www.agilecrm.com/" class="navbar-brand block m-t text-white">
						<i class="fa fa-cloud m-r-xs"></i>Agile CRM
					</a>
				
				<div>
				
			<!-- 	<div class="clearfix"></div> -->
				<div class="wrapper text-center text-white">
      				<strong>Enter OTP</strong>
   				</div>
   				<form id="fingerprintForm" name="fingerprintForm" method="post" action="/" class="form-horizontal" onsubmit="return isValid();">
					<fieldset>
					<div  class="control-group form-group" style="margin-bottom:0px;">
                         <label class="control-label col-sm-3">Enter OTP<span class="field_req">*</span></label>
                         <div class="controls col-sm-7">
                         <input type="hidden"  name="current_div" id="current_div"/>
                                <input id="otp" placeholder="Enter OTP" type="text" name="otp" class="required form-control" />
                         </div>

           			 </div>
           			 <input type='submit' value="Send" class='btn btn-lg btn-primary btn-block'>

					</fieldset>
				</form>
			
		</div>
		</div>
		</div>
		<% if(!StringUtils.isEmpty(error)){%>
				        <div  class="alert error login-error login-position-fixed text-center m-b-none">
							<a class="close" data-dismiss="alert" href="#" style="position:relative;top:-2px;">&times</a><%=error%> 
						</div>
						<%}%>
	</div>
	
	<!-- JQUery Core and UI CDN -->
	
	<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
	<script type="text/javascript" src="https://cdn.jsdelivr.net/fingerprintjs2/1.1.2/fingerprint2.min.js"></script>
	
	<script type="text/javascript">
		$(document).ready(function()
		{
        var newImg = new Image;
        newImg.onload = function() {
        
        $("body").css("background-image","url('"+this.src+"')");
       
        }


        newImg.src = '<%=S3_STATIC_IMAGE_PATH%>images/login-<%=randomBGImageInteger%>-high.jpg';
       
		$('body').on('click', '.close', function(e){
			 e.preventDefault();
			 $(this).closest('div').fadeOut('slow', function() {
			   });
		});


			
		});
		
		// Validates the form fields
		function isValid()
		{
			// $("#agile").validate();
			// return $("#agile").valid();
		}
		
	</script>
	
</body>
</html>