<%@page import="com.agilecrm.util.CookieUtil"%>
<%@page import="java.util.Map"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
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
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

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

// Get the language and save as cookie
String reqlanguage = request.getParameter("lang");
String _LANGUAGE = CookieUtil.readCookieValue(request, "user_lang");

if(StringUtils.isNotBlank(reqlanguage) && LanguageUtil.isSupportedlanguageFromKey(reqlanguage)){
	_LANGUAGE = reqlanguage;
	CookieUtil.createCookieWithDomain(null, "user_lang", _LANGUAGE, response);
}

if(StringUtils.isBlank(_LANGUAGE) || !LanguageUtil.isSupportedlanguageFromKey(_LANGUAGE)) {
	_LANGUAGE = LanguageUtil.getSupportedLocale(request);
	CookieUtil.createCookieWithDomain(null, "user_lang", _LANGUAGE, response);
}

// Locales JSON
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "login");

	
// Checks if it is being access directly and not through servlet
if(request.getAttribute("javax.servlet.forward.request_uri") == null)
{
  response.sendRedirect("/login");
  return;
}

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
    error = LanguageUtil.getLocaleJSONValue(localeJSON, "duplicate-login") + " <span style='font-size:12px'>("+ agent+ ")</span>";
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

// Mobile push
String registrationId = request.getParameter("registrationId");
%>
<!DOCTYPE html>

<html lang="<%=_LANGUAGE %>" style="background:transparent;">
<head>
<meta charset="utf-8">
<meta name="globalsign-domain-verification"
	content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<title><%=LanguageUtil.getLocaleJSONValue(localeJSON, "login")%></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<meta name="robots" content="noindex, nofollow">

<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/app.css" />

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>

<style>
body {
	
	<% 
	String userAgent = request.getHeader("user-agent");
	if(MobileUADetector.isMobile(userAgent)) {%>

		background-color: #f0f3f4;
	
	<% }else if(VersioningUtil.isDevelopmentEnv()){  %>
background-image:url('https://doxhze3l6s7v9.cloudfront.net/app/static/images/login-<%=randomBGImageInteger%>-high-prog.jpg');
	
		<%} else {  %>
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
	right: 30px;
	font-size: 12px;
}
.lang-identifier a {
	text-decoration: none; 
	font-size: 12px;
	color: #eee;
}
#myFrame {
	display: none;
}
</style>

<script>


/*
var isIE = (window.navigator.userAgent.indexOf("MSIE") != -1); 
var isIENew = (window.navigator.userAgent.indexOf("rv:11") != -1);  
if(isIE || isIENew)
 window.location = '/error/not-supported.jsp';
*/
var S3_STATIC_IMAGE_PATH = undefined;
var _billing_restriction = undefined;
var CURRENT_DOMAIN_USER = undefined;
var isSafari = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);
var isWin = (window.navigator.userAgent.indexOf("Windows") != -1);
if(isSafari && isWin) 
 window.location = '/error/not-supported.jsp';

</script>

<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>
<script type='text/javascript' src='//cdn.jsdelivr.net/fingerprintjs2/1.1.2/fingerprint2.min.js'></script>
<script type='text/javascript' src='flatfull/final-lib/final-lib-1/b-bootstrap.js'></script>
<script src='locales/html5/localize.js?_=<%=_AGILE_VERSION%>'></script>

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
			<span id="lang-code-name"><%=LanguageUtil.getSupportedlanguageFromKey(_LANGUAGE)%></span> <span class="caret"></span> 
		</a>
	    <ul class="dropdown-menu pull-right" role="menu" style="min-width: 120px;">
	    	<%
	    	   for (Map.Entry<String, String> entry : LanguageUtil.getSupportedlanguages().entrySet()) {
	    	%>
	    	   <li><a href="?lang=<%=entry.getKey()%>"><%=entry.getValue()%></a></li>
	    	<%
				}
	    	%>
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
      				<strong><%=LanguageUtil.getLocaleJSONValue(localeJSON, "signin-using-registration")%></strong>
   				</div>
				<form name='agile' id="agile" method='post' action="/login" onsubmit="return isLoginFormValid();">
					
					<!-- <h3><small>Sign in using your registered account</small></h3> -->
					<input type='hidden' name='newui' value="true">
					<input type='hidden' name='type' value='agile'></input>
					<input type='hidden' name='account_timezone' id='account_timezone' value=''></input>
					<div class="list-group list-group-sm">
						
						<div class="list-group-item">
							<input class="input-xlarge required email field form-control no-border" name='email' type="email" required oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "user-id-your-email")%>' autocapitalize="off" autofocus
						<%if(request.getAttribute("agile_email")  != null) {%> value="<%=request.getAttribute("agile_email") %>" <%}%>>
						</div>
						
						<div class="list-group-item">
					    	<input class="input-xlarge required field form-control no-border" oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);" required maxlength="20" minlength="4" name='password' type="password" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "password")%>' autocapitalize="off">
						</div>

						 
						<div class="block">
							<input class="hide" id="location_hash" name="location_hash"></input>
						</div>
						<input class="hide" id="finger_print" name="finger_print"></input>
						<input class="hide" id="ip_validation" name="ip_validation"></input>
						<input class="hide" id="browser_Name" name="browser_Name"></input>
						<input class="hide" id="browser_version" name="browser_version"></input>
						<input class="hide" id="browser_os" name="browser_os"></input>
						<%if(StringUtils.isNotBlank(registrationId)) {%>
						 <input class="hide" id="registrationId" name="registrationId" value="<%=registrationId%>"></input>
						<%} %>

						</div>
							<label class="checkbox" style="display:none;">
							    <input type="checkbox" checked="checked" name="signin">Keep me signed in 
							</label>
							<input type='submit' value='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "sign-in")%>' class='agile-submit btn btn-lg btn-primary btn-block'>
							 
						
					
					
				

		<div 		
		
		<%
  			if(MobileUADetector.isMobile(request.getHeader("user-agent"))) {%>
		id="mobile"
	<% }else {  %> <%}%> >
	<%if(!MobileUADetector.isiPhone(userAgent)) {%>
		<div class="text-center tags-color text-white m-t m-b" >
		<small><%=LanguageUtil.getLocaleJSONValue(localeJSON, "signin-using")%></small> 
		<small><a title='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "signin-using-google")%>' data='google' href='#' class="openid_large_btn google tags-color text-white">Google Apps</a></small>&nbsp|&nbsp
		<small><a title='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "signin-using-yahoo")%>' data='yahoo' href="#" class="openid_large_btn yahoo tags-color text-white">Yahoo</a></small><br/>	
		<small><%=LanguageUtil.getLocaleJSONValue(localeJSON, "dont-have-account")%>? <a href="/register" class="tags-color text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "signUp")%></a></small><br/>
		<small><%=LanguageUtil.getLocaleJSONValue(localeJSON, "forgot")%> <a href="/forgot-password" class="tags-color text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "password")%>? </a><a href="/forgot-domain" class="tags-color text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "domain")%>?</a></small>
		</div>
	<%} %>
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
		    // Save mobile device GCM Id
		    var registrationId = '<%=registrationId%>';

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

			var localeJSON = <%=localeJSON%>;

			// Save mobile device Id to localstorage
			if(registrationId)
				 _agile_storage.set(registrationId, "_agile_GCM_Id");
			
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
        	preload_login_bg_images();
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

		function preload_dashlet_libs() { 

			if ($.active > 0) {
				setTimeout(function() {
					preload_dashlet_libs();
				}, 500);
				return;
			}

			// Load iframe
			var framejson = {};
			framejson.src = 'flatfull/preload-js-src-iframe.html';
			framejson.id = 'myFrame',framejson.frameborder = 0;
			framejson.scrolling = 'no';
			$('<iframe>', framejson).appendTo('body');

		}

		function get_cloudfront_path(type){
			if(type == "static")
				return "<%=CLOUDFRONT_STATIC_FILES_PATH%>";
			else if(type == "lib")
				return "<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>";
			else if(type == "version")
				return "<%=_AGILE_VERSION%>";
			else if(type == "language")
				return "<%=_LANGUAGE%>";
		}

		function preload_login_bg_images(){

			for(var i=1; i < 10; i++){

				$('<img/>', {
				    class: 'hide',
				    src: '<%=S3_STATIC_IMAGE_PATH%>/images/login-' + i + '-high.jpg',
				}).appendTo('body');

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
