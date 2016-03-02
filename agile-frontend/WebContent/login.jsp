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
	  S3_STATIC_IMAGE_PATH = VersioningUtil.getBaseServerURL() + "/beta/static/";
}

// Users can show their logo on login page. 
AccountPrefs accountPrefs = AccountPrefsUtil.getAccountPrefs();
String logo_url = accountPrefs.logo;

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
  /* background-image: url('<%=S3_STATIC_IMAGE_PATH%>/images/agile-login-page-low.jpg');
  */background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  background-attachment: fixed;
}


.text-white
{
color:#fff!important;
}
input
{
color:#000!Important;
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

<body>
<div id="openid_btns">
					   	
	<div class="" id="app">

		<div ui-view="" class="fade-in-right-big smooth">
  			<div class="container w-xxl w-auto-xs">
				
					<a href="https://www.agilecrm.com/" class="navbar-brand block m-t text-white">
						<i class="fa fa-cloud m-r-xs"></i>Agile CRM
					</a>
				
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
				<div class="wrapper text-center text-white">
      				<strong>Sign in using your registered account</strong>
   				</div>
				<form name='agile' id="agile" method='post' action="/login" onsubmit="return isValid();">
					
					<!-- <h3><small>Sign in using your registered account</small></h3> -->
					<input type='hidden' name='newui' value="true">
					<input type='hidden' name='type' value='agile'></input>
					<input type='hidden' name='account_timezone' id='account_timezone' value=''></input>
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
							 
						
					
					
				

				
		<div class="text-center text-white m-t m-b">
		<small>Login with</small> 
		<a title="Login with Google" data='google' href='#' class="openid_large_btn google text-white">Google</a>&nbsp|&nbsp
		<a title="Login with Yahoo" data='yahoo' href="#" class="openid_large_btn yahoo text-white">Yahoo</a><br/>	
		<small>Do not have an account?</small> <a href="/register" class="text-white">Sign Up</a><br/>
		<small>Forgot</small> <a href="/forgot-password" class="text-white">Password? </a><a href="/forgot-domain" class="text-white">Domain?</a>
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
        var newImg = new Image;
         //getting the random number in between1 to ten 
        var number = Math.round(Math.random()*10);
        	if(number == 10)
        	number = 1;
        newImg.onload = function() {
        
        $("body").css("background-image","url('"+this.src+"')");
       
        }
        newImg.src = '<%=S3_STATIC_IMAGE_PATH%>/images/login'+number+'.jpg';
        // agile-login-page-high.png

			// Pre load dashlet files when don is active
			preload_dashlet_libs();

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


			// $('input, textarea').placeholder();
			
		});
		
		// Validates the form fields
		function isValid()
		{
			// $("#agile").validate();
			// return $("#agile").valid();
		}

		function preload_dashlet_libs(){ 
			setTimeout(function(){head.load('<%=CLOUDFRONT_STATIC_FILES_PATH %>final-lib/min/lib-all-min.js', '<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min.js', '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>tpl/min/precompiled/<%=FLAT_FULL_PATH%>tpl.js?_=<%=_AGILE_VERSION%>', '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>tpl/min/precompiled/<%=FLAT_FULL_PATH%>portlets.js?_=<%=_AGILE_VERSION%>')}, 5000);
		}
	</script>
	<!-- Clicky code -->
 	<script src="//static.getclicky.com/js" type="text/javascript"></script>
	<script type="text/javascript">try{ clicky.init(100729733); }catch(e){}</script> 
	
	<!-- Google analytics code -->
	<script>
	   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	  ga('create', 'UA-44894190-1', 'auto');
	  ga('send', 'pageview'); 
	

	</script>

	<!-- Surey page code-->
	<script type="text/javascript" src="https://our.agilecrm.com/stats/min/agile-min.js">
   </script>
   <script type="text/javascript" >
     _agile.set_account('jo22gpvhr34r2mccjaekgsm7oh', 'our');
     _agile_set_whitelist('b3Vy');
     _agile.track_page_view();
     _agile_execute_web_rules();
   </script>
	
</body>
</html>