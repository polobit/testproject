<%@page import="com.agilecrm.util.MathUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="java.util.TimeZone"%>
<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%@page import="java.net.URLDecoder"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.MobileUADetector"%>
<%
/*
we use setAttribute() to store the username and to autofill if he want to resubmit the form after correcting the error occurred. 
*/
//flatfull path
String flatfull_path="/flatfull";



// Gets User Name
String email = request.getParameter("email");

if (email != null)
{    
email = email.toLowerCase();

request.setAttribute("agile_email", email);

}
	
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
<%@ include file="/ios-native-app-meta-tags.jsp"%>

<style>
body {
	
	<% 
	if(MobileUADetector.isMobile(request.getHeader("user-agent"))) {%>

		background-color: #f0f3f4;
	
	<% }else {  %>

background-image:url('<%=S3_STATIC_IMAGE_PATH%>images/login-<%=randomBGImageInteger%>-high-prog.jpg');
	
		<%}%>
  

  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
}


.text-white
{
color:#fff !important;
}
input
{
color:#000 !Important;
}
a:hover
{
text-decoration:underline;
}
#mobile .tags-color{
color:#58666e !important;
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
.view{
	position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

</style>

<script>


/*
var isIE = (window.navigator.userAgent.indexOf("MSIE") != -1); 
var isIENew = (window.navigator.userAgent.indexOf("rv:11") != -1);  
if(isIE || isIENew)
 window.location = '/error/not-supported.jsp';
*/

var isSafari = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);
var isWin = (window.navigator.userAgent.indexOf("Windows") != -1);
if(isSafari && isWin) 
 window.location = '/error/not-supported.jsp';

</script>

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
  			<div class="container w-xxl w-auto-xs view"
  			<%
  			if(MobileUADetector.isMobile(request.getHeader("user-agent"))) {%>
		id="mobile"
	<% }else {  %> <%}%>>
	<%
				if(MobileUADetector.isMobile(request.getHeader("user-agent"))) {%>
				<div >
		<img class="block" style="margin:0px auto;" src="<%=S3_STATIC_IMAGE_PATH%>images/agile-crm-logo.png"  ></img></div>
	<% }else {  %> 
					<a href="https://www.agilecrm.com/" class="navbar-brand block m-t tags-color text-white">
						<i class="fa fa-cloud m-r-xs"></i>Agile CRM
					</a>
				<%}%>
				<div>
				
				<form id='oauth' name='oauth' method='post'>
              <%--      <div><h3>Sign In
                   
                   <% if(!StringUtils.isEmpty(logo_url) && !StringUtils.equalsIgnoreCase("yourlogourl", logo_url))
                       {
                       %>
                   <img class="company_logo pull-right" src="<%=logo_url%>" style="width:50px;height:40px;" ></img>
                   <%
                   }
                   %>
                   
                   </h3></div> --%>
						
				<!-- 		<h3><small>Login using existing accounts</small></h3>
					  <div  style="padding-top:10px;">
						<input type='hidden' name='type' value='oauth'></input>
						<input type='hidden' name='server' id='oauth-name' value=''></input>
						<a title="log in with Google" data='google' href='#' style="background: #FFF url(img/signin/openid-logos.png); background-position: -1px -1px" class="google openid_large_btn"></a>
						<a title="log in with Yahoo" data='yahoo' href="#"	style="background: #FFF url(img/signin/openid-logos.png); background-position: -1px -63px" class="yahoo openid_large_btn"></a>
					  </div> -->
					</div>
					 
					<input type='hidden' name='type' value='oauth'></input>
					<input type='hidden' name='server' id='oauth-name' value=''></input>
				</form>
			<!-- 	<div class="clearfix"></div> -->
				<div class="wrapper text-center tags-color text-white tags-color">
      				<strong>Sign in using your registered account</strong>
   				</div>
				<form name='agile' id="agile" method='post' action="/helpcenter/login">
					
					<!-- <h3><small>Sign in using your registered account</small></h3> -->
					<input type='hidden' name='type' value='agile'></input>
					<div class="list-group list-group-sm">
						
						<div class="list-group-item">
							<input class="input-xlarge required email field form-control no-border" name='email' type="email" required placeholder="User ID (Your Email Address)" autocapitalize="off" autofocus
						<%if(request.getAttribute("agile_email")  != null) {%> value="<%=request.getAttribute("agile_email") %>" <%}%>>
						</div>
						
						<div class="list-group-item">
					    	<input class="input-xlarge required field form-control no-border" required maxlength="20" minlength="4" name='password' type="password" placeholder="Password" autocapitalize="off">
						</div>
						<div class="block">
							<input class="hide" id="location_hash" name="location_hash"></input>
						</div>
						
						</div>
						<label class="checkbox" style="display:none;">
						    <input type="checkbox" checked="checked" name="signin">Keep me signed in 
						</label>
						<input type='submit' value="Sign In" class='btn btn-lg btn-primary btn-block'>
					<div 		
		
					<%
			  			if(MobileUADetector.isMobile(request.getHeader("user-agent"))) {%>
					id="mobile"
				<% }else {  %> <%}%> >
				<div class="text-center tags-color text-white m-t m-b" >
					<small>Do not have an account?</small> <a href="/helpcenter/register" class="tags-color text-white">Sign Up</a><br/>
					<small>Forgot</small> <a href="/helpcenter/forgot-password" class="tags-color text-white">Password? </a><a href="/forgot-domain" class="tags-color text-white">Domain?</a>
					</div>
				</div>
					
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
	<script src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js" type="text/javascript"></script>
	
	<script type="text/javascript">
		$(document).ready(function()
		{
			var login_hash = window.location.hash;

			// Sets location hash in hidden fields
			if(login_hash)
				$("#location_hash").val(login_hash);
        
        	preload_login_pages();
			
			$('#account_timezone').val(jstz.determine().name());
			$('.openid_large_btn').click(function(e)
			{
				// Gets Data Google/Yahoo and submits to LoginServlet
				var data = $(this).attr('data');
				$('#oauth-name').val(data);
				$('#oauth').submit();

				e.preventDefault();
			});

			$('body').on('click', '.close', function(e){
				 e.preventDefault();
				 $(this).closest('div').fadeOut('slow', function() {
				   });
				 });
		});
		
		function preload_dashlet_libs(){ 

			if ($.active > 0) {
				setTimeout(function() {
					preload_dashlet_libs();
				}, 500);
				return;
			}

			head.load('<%=CLOUDFRONT_STATIC_FILES_PATH %>final-lib/min/lib-all-min-1.js?_=<%=_AGILE_VERSION%>');
		}

		function preload_login_pages(){

			for(var i=1; i < 10; i++){

				$('<img/>', {
				    class: 'hide',
				    src: '<%=S3_STATIC_IMAGE_PATH%>/images/login-' + i + '-high.jpg',
				}).appendTo('body');
			}
		}
	</script>

   </script>
	
</body>
</html>