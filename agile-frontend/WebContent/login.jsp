<%@page import="com.agilecrm.ipaccess.IpAccessUtil"%>
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
//Gets the Ip 


	
// Checks if it is being access directly and not through servlet
/* if(request.getAttribute("javax.servlet.forward.request_uri") == null)
{
  response.sendRedirect("/login");
  return;
} */

String error = request.getParameter("error");
if(error != null)
  System.out.println(error);
else {
	String sessionError = (String)request.getSession().getAttribute("sso_error");
	if(sessionError != null)
	{
	    error = sessionError; 
		request.getSession().removeAttribute("sso_error");
	} 
	else
		error = "";	 
}

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

// Users can show their company logo on login page. 
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
	
	<% 
	if(MobileUADetector.isMobile(request.getHeader("user-agent"))) {%>

		background-color: #f0f3f4;
	
	<% }else {  %>
background-color: #f0f3f4;
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

.lang-identifier {
	position: absolute; 
	top:30px; 
	left: 30px;
}
.lang-identifier a {
	text-decoration: none;
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
<script type='text/javascript' src='//cdn.jsdelivr.net/fingerprintjs2/1.1.2/fingerprint2.min.js'></script>
<script type='text/javascript' src='flatfull/final-lib/final-lib-1/b-bootstrap.js'></script>

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

	<!-- Language -->
	<div class="lang-identifier">
		<a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			<span id="lang-code-name">English</span> <span class="caret"></span> 
		</a>
	    <ul class="dropdown-menu">
	     	<li><a href="en">English</a></li>
	    	<li><a href="es">Spanish</a></li>
	  	</ul>
	</div>
	<!-- End of Language -->

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
					<% if(!StringUtils.isEmpty(logo_url) && !StringUtils.equalsIgnoreCase("yourlogourl", logo_url))
                       {
                       %>

                     <div style="display:table; margin:0px auto; border:none; padding: 5px;" class="imgholder thumb-wrapper thumb-lg">
                   		<img class="company_logo w-full" style="background-color: white;border-radius: 3px;"src="<%=logo_url%>" ></img>
                   	 </div>
                   <%
                   }
                   %>
                   
                   
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
				<form name='agile' id="agile" method='post' action="/login" onsubmit="return isLoginFormValid();">
					
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
						<input class="hide" id="finger_print" name="finger_print"></input>
						<input class="hide" id="ip_validation" name="ip_validation"></input>
						<input class="hide" id="browser_Name" name="browser_Name"></input>
						<input class="hide" id="browser_version" name="browser_version"></input>
						<input class="hide" id="browser_os" name="browser_os"></input>
						</div>
							<label class="checkbox" style="display:none;">
							    <input type="checkbox" checked="checked" name="signin">Keep me signed in 
							</label>
							<input type='submit' value="Sign In" class='agile-submit btn btn-lg btn-primary btn-block'>
							 
						
					
					
				

		<div 		
		
		<%
  			if(MobileUADetector.isMobile(request.getHeader("user-agent"))) {%>
		id="mobile"
	<% }else {  %> <%}%> >
	<div class="text-center tags-color text-white m-t m-b" >
		<small>Login with</small> 
		<a title="Login with Google" data='google' href='#' class="openid_large_btn google tags-color text-white">Google</a>&nbsp|&nbsp
		<a title="Login with Yahoo" data='yahoo' href="#" class="openid_large_btn yahoo tags-color text-white">Yahoo</a><br/>	
		<small>Do not have an account?</small> <a href="/register" class="tags-color text-white">Sign Up</a><br/>
		<small>Forgot</small> <a href="/forgot-password" class="tags-color text-white">Password? </a><a href="/forgot-domain" class="tags-color text-white">Domain?</a>
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
	
                  
		<script type="text/javascript">
			// localStorage setup
			var _agile_storage = {
				key : "_agile_user_fingerprint",
				get : function(){
					if(!this.is_strorage_supports())
						 return;
					return localStorage.getItem(this.key);
				},
				set :  function(val){
					if(this.is_strorage_supports())
						localStorage.setItem(this.key, val);
				},
				is_strorage_supports : function(){
					return (typeof localStorage ? true : false);
				}
			};		
			
			function _agile_get_fingerprint(callback){
					
					// Get stored value
					var finger_print = _agile_storage.get();
					if(finger_print)
						return callback(finger_print);
	
					// Load js and fetch print
					new Fingerprint2().get(function(result, components){
							return callback(result);
					});
			}
	      	
			function randomString(length) {
				length = length || 32;
				var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			    var result = '';
			    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
			    return result;
			}
			
      		// Get print value to notify user 
			_agile_get_fingerprint(function(result){
				if(!result)
					 return;

				$("#finger_print").val(result);
				// Reset val
				_agile_storage.set(result);
			});
		</script>
		
	<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js" type="text/javascript"></script>
	
	<script type="text/javascript">
		$(document).ready(function()
		{

			// Reset form action param
			if(window.location.href.indexOf("/normal") != -1)
				$("form#agile").attr("action", "/login/normal");
			
			// Sets location hash in hidden fields
			var login_hash = window.location.hash;
			if(login_hash)
				$("#location_hash").val(login_hash);
			
        	// agile-login-page-high.png
        	preload_login_pages();
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
		function isLoginFormValid()
		{
			if( !($('#finger_print').val()) )
			{
				console.log("No value in fingerprint");
				var fingerprint = randomString();
				
				$('#finger_print').val(fingerprint);
				
				_agile_storage.set(fingerprint);
				console.log("Generated fingerprint: " + fingerprint);
			}
			
			return true;
		}

		function preload_dashlet_libs(){ 

			if ($.active > 0) {
				setTimeout(function() {
					preload_dashlet_libs();
				}, 500);
				return;
			}

			head.load('<%=CLOUDFRONT_STATIC_FILES_PATH %>final-lib/min/lib-all-min-1.js?_=<%=_AGILE_VERSION%>', 
					'<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min-1.js?_=<%=_AGILE_VERSION%>', 
					'<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min-2.js?_=<%=_AGILE_VERSION%>', 
					'<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min-3.js?_=<%=_AGILE_VERSION%>', 
					'<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min-4.js?_=<%=_AGILE_VERSION%>', 
					'<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>tpl/min/precompiled/<%=FLAT_FULL_PATH%>tpl.js?_=<%=_AGILE_VERSION%>', 
					'<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>tpl/min/precompiled/<%=FLAT_FULL_PATH%>portlets.js?_=<%=_AGILE_VERSION%>'
							);
		}

		function preload_login_pages(){

			for(var i=1; i < 10; i++){

				$('<img/>', {
				    class: 'hide',
				    src: '<%=S3_STATIC_IMAGE_PATH%>/images/login-' + i + '-high.jpg',
				}).appendTo('body');

				/*$('<img/>', {
				    class: 'hide',
				    src: '<%=S3_STATIC_IMAGE_PATH%>/images/login-' + i + '-low.jpg',
				}).appendTo('body');*/

			}
		}

		// localStorage setup
		var _agile_storage = {
			key : "_agile_user_fingerprint",
			get : function(key){
				if(!key)
					key = this.key;

				if(!this.is_strorage_supports())
					 return;
				return localStorage.getItem(key);
			},
			set :  function(val, key){
				if(!key)
					key = this.key;

				if(this.is_strorage_supports())
					localStorage.setItem(key, val);
			},
			is_strorage_supports : function(){
				return (typeof localStorage ? true : false);
			}
		};		
		function _agile_get_fingerprint(callback){
				
				// Get stored value
				var finger_print = _agile_storage.get();
				if(finger_print)
					return callback(finger_print);

				// Load js and fetch print
				new Fingerprint2().get(function(result, components){
						return callback(result);
				});
		}

		// Language Detection
		

		var BrowserDetect = {
			init : function() {
				this.browser = this.searchString(this.dataBrowser)
						|| "An unknown browser";
				this.version = this.searchVersion(navigator.userAgent)
						|| this.searchVersion(navigator.appVersion)
						|| this.searchMobileVersion(navigator.userAgent)
						|| "An unknown version";
				this.OS = this.searchString(this.dataOS) || "unknown";
			},
			searchString : function(data) {
				for ( var i = 0; i < data.length; i++) {
					var dataString = data[i].string;
					var dataProp = data[i].prop;
					var match = data[i].match;
					this.versionSearchString = data[i].versionSearch
							|| data[i].identity;

					if (match && dataString.match(match))
						return data[i].identity;

					if (dataString) {
						if (dataString.indexOf(data[i].subString) != -1)
							return data[i].identity;
					} else if (dataProp)
						return data[i].identity;
				}
			},
			searchMobileVersion : function(dataString) {

				try {
					match = dataString.match(/Mobile Safari\/([\d.]+)/);
					if (match)
						return parseFloat(match[1]);
				} catch (e) {
				}

			},
			searchVersion : function(dataString) {

				var index = dataString.indexOf(this.versionSearchString);
				if (index == -1)
					return;
				return parseFloat(dataString.substring(index
						+ this.versionSearchString.length + 1));
			},
			dataBrowser : [ {
				string : navigator.userAgent,
				subString : "Chrome",
				identity : "Chrome"
			}, {
				string : navigator.userAgent,
				subString : "OmniWeb",
				versionSearch : "OmniWeb/",
				identity : "OmniWeb"
			}, {
				string : navigator.vendor,
				subString : "Apple",
				identity : "Safari",
				versionSearch : "Version"
			}, {
				prop : window.opera,
				identity : "Opera"
			}, {
				string : navigator.vendor,
				subString : "iCab",
				identity : "iCab"
			}, {
				string : navigator.vendor,
				subString : "KDE",
				identity : "Konqueror"
			}, {
				string : navigator.userAgent,
				subString : "Firefox",
				identity : "Firefox"
			}, {
				string : navigator.vendor,
				subString : "Camino",
				identity : "Camino"
			}, { // for newer Netscapes (6+)
				string : navigator.userAgent,
				subString : "Netscape",
				identity : "Netscape"
			}, {
				// For IE11
				string : navigator.userAgent,
				match : /Trident.*rv[ :]*11\./,
				identity : "Explorer"
			}, {
				string : navigator.userAgent,
				subString : "MSIE",
				identity : "Explorer",
			}, {
				string : navigator.userAgent,
				match : /Mobile Safari\/([\d.]+)/,
				identity : "Mobile Safari",
				versionSearch : "/AppleWebKit\/([\d.]+)/",
			}, {
				string : navigator.userAgent,
				subString : "Gecko",
				identity : "Mozilla",
				versionSearch : "rv"
			}, { // for older Netscapes (4-)
				string : navigator.userAgent,
				subString : "Mozilla",
				identity : "Netscape",
				versionSearch : "Mozilla"
			} ],
			dataOS : [ {
				string : navigator.platform,
				subString : "Win",
				identity : "Windows"
			}, {
				string : navigator.platform,
				subString : "Mac",
				identity : "Mac"
			}, {
				string : navigator.userAgent,
				match : /Android\s([0-9\.]*)/,
				subString : "Android",
				identity : "Android"
			}, {
				string : navigator.userAgent,
				subString : "iPhone",
				identity : "iPhone/iPod"
			}, {
				string : navigator.platform,
				subString : "Linux",
				identity : "Linux"
			}

			]

		};
		BrowserDetect.init();
		$('#browser_os').val(BrowserDetect.OS);
		$('#browser_Name').val(BrowserDetect.browser);
		$('#browser_version').val(BrowserDetect.version);
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