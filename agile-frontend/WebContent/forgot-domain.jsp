<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.MobileUADetector"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="com.agilecrm.util.CookieUtil"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.AliasDomain"%>
<%@page import="com.agilecrm.user.util.AliasDomainUtil"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

<%

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

//Locales JSON
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "forgot-domain");

String _AGILE_VERSION = SystemProperty.applicationVersion.get();
/*
It checks first if user exists then if user exists,
he is redirected to his own domain else error is shown in the same page.
*/
//flatfull path
String flatfull_path="/flatfull";

String error = "", success = "";
//If Email is present
String email = request.getParameter("email");
if(!StringUtils.isEmpty(email))
{
    email = email.toLowerCase();
    
	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
	if(domainUser == null)
	{
	    error = LanguageUtil.getLocaleJSONValue(localeJSON, "user-not-found");
	}
	else
	{
	   String domain = domainUser.domain;
	   AliasDomain aliasDomain = AliasDomainUtil.getAliasDomain(domain);
	   if(aliasDomain != null)
		   domain = aliasDomain.alias.get(0);
	   success = "Redirecting to " + domain;
	   String url = VersioningUtil.getURL(domain, request);
	   response.sendRedirect(url);
	}
	
	System.out.println(error + " " + success);
}
//Static images s3 path
String S3_STATIC_IMAGE_PATH = VersioningUtil.getStaticFilesBaseURL().replace("flatfull/", "");

%>
<!DOCTYPE html>
<html lang="<%=_LANGUAGE %>">
<head>
<meta charset="utf-8">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>
<title><%=LanguageUtil.getLocaleJSONValue(localeJSON, "forgot-domain")%></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le styles -->

<!-- <link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" rel="stylesheet" href="/css/openid-min.css">
<link type="text/css" rel="stylesheet" href="/css/signin.css"> -->

<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/font.css" />
<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/app.css" />
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>

<style>

body {
<% 
	if(MobileUADetector.isMobile(request.getHeader("user-agent"))) {%>
		background-color: #f0f3f4;
	
	<% } else if(VersioningUtil.isDevelopmentEnv()){  %>
		background-image:url('https://doxhze3l6s7v9.cloudfront.net/app/static/images/buildings-low.jpg');
	
	<%} else {  %>
		background-image:url('<%=S3_STATIC_IMAGE_PATH%>/images/buildings-low.jpg');
	
	<%}%>
	
background-repeat:no-repeat;
background-position:center center;
background-size:100% 100%;
background-attachment:fixed;
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
	color: red !important;
}

.close {
	  color: #000 !important;
}


@media all and (max-width: 767px) {

body {
  background-size: cover;

}
  
}

<!-- @media (min-width: 900px) {
body {
	padding-top: 30px;
	}
	
.navbar-search{
 	padding-left: 10%
}
	
}
.field {
	height: 30px !important;
	margin: 8px 0px !important;
	padding-left: 10px !important;
}

.error {
	color: red;
}

.alert-success {
	  color: #3c763d !important;
} -->

</style> 

 <!-- JQUery Core and UI CDN -->
<!-- <script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<script type="text/javascript" src="/lib/jquery.validate.min.js"></script> -->

<script type='text/javascript' src='<%=flatfull_path%>/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="<%=flatfull_path%>/lib/bootstrap.v3.min.js"></script>
<script src='locales/html5/localize.js?_=<%=_AGILE_VERSION%>'></script>
<!--[if lt IE 10]>
<script src="flatfull/lib/ie/placeholders.jquery.min.js"></script>
<![endif]-->
<!-- <script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;
</script> -->

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>

<body>

	<!-- <div class='navbar navbar-fixed-top'> 
    	<div class='navbar-inner'> 
    		<div class='container'> 
    			<a class='brand' href='#'>Agile CRM</a>
  				<div class="nav-collapse">
					<ul class="nav pull-right">
						<li class="">						
						<a href="http://www.agilecrm.com" class="">
							<i class="icon-chevron-left"></i>
							Back to home-page
						</a>
						</li>
					</ul>
  	    		</div>
			</div>
		</div>
	</div> -->
	<div class="app app-header-fixed app-aside-fixed" id="app">

		<div ui-view="" class="fade-in-right-big smooth">
  			<div class="container w-xxl w-auto-xs">
			
				<a href="https://www.agilecrm.com/" class="navbar-brand block text-white m-t">
						<i class="fa fa-cloud m-r-xs"></i>Agile CRM
					</a>				
				
			<!-- 	<h1>Forgot Domain</h1> -->
				
				<form name='forgot_domain' id="forgot_domain" method='post' onsubmit="return isValid();"> 
				
				 <% if(!StringUtils.isEmpty(error)){%>
				 <div class="alert error alert-danger login-error m-b-none">
					<a class="close m-t-n-sm" data-dismiss="alert" href="#">&times</a><%=error%> 
				</div>
				<%}%>
				
				 <% if(!StringUtils.isEmpty(success)){%>
				<div class="alert alert-success login-success m-b-none">
					<a class="close m-t-n-sm" data-dismiss="alert" href="#">&times</a><%=success%> 
				</div>
				 <%}%>
				
				<div class="wrapper text-center text-white">
      				<strong><%=LanguageUtil.getLocaleJSONValue(localeJSON, "enter-email")%></strong>
   				</div>
				
				<div class="list-group list-group-sm">
					<div class="list-group-item">
						<input class="input-xlarge  required email form-control no-border" name='email' maxlength="50" minlength="6" type="email" oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);" required placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "email")%>' autocapitalize="off">
					</div>
				</div>
					  <input type='submit' value='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "submit")%>' class='btn btn-lg btn-primary btn-block forgot_domain_btn'>
				 
				</form>
				
				
				
				
					
			
			<div class="text-center text-white m-t m-b">
	                <small> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "dont-have-account")%>? </small><a href="/register" class="text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "register")%></a><br/>
	                 <small><%=LanguageUtil.getLocaleJSONValue(localeJSON, "forgot")%> </small><a href="/enter-domain?to=forgot-password" class="text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "password")%>?</a>
               </div>
		</div>
		</div>
		</div>
		<script type='text/javascript' src=''></script>
		<script type="text/javascript">
		var localeJSON = <%=localeJSON%>;

		$(document).ready(function() {			
			var newImg = new Image;
      	newImg.onload = function() {
    	$("body").css("background-image","url('"+this.src+"')");
  		 }
		newImg.src = '<%=S3_STATIC_IMAGE_PATH%>/images/buildings.jpg';
		
		  //form is self submitted
          $("#forgot_domain").validate({
				 submitHandler: function(form) {
					   form.submit();
					 }
					});
		});
		
		//validates the form fields
		function isValid(){
		    $("#forgot_domain").validate();
		    return $("#forgot_domain").valid();
		    }
		</script>
</body>
</html>