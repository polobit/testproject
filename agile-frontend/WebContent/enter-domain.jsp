<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.agilecrm.util.MobileUADetector"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.util.CookieUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

<%
//Language
String _LANGUAGE = LanguageUtil.getLanguageKeyFromCookie(request);

//Locales JSON
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "enter-domain");

/*
It checks if any user exists in that domain,
if user exists,it is redirected to login page in the same domain otherwise it is redirected to register page.
*/

//If Email is present

String flatfull_path="/flatfull";
String domain = request.getParameter("subdomain");
String redirectTo = request.getParameter("to");
if(redirectTo  != null)
{
	if(!StringUtils.isEmpty(domain))
	{
		response.sendRedirect("https://" + domain + ".agilecrm.com/" + redirectTo);
		return;
	}
}

%>

<!DOCTYPE html>
<html lang="<%=_LANGUAGE %>">
<head>
<head>
<meta charset="utf-8">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>
<title><%=LanguageUtil.getLocaleJSONValue(localeJSON, "enter-your-domain")%></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le styles -->

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
		background-image:url('..<%=flatfull_path%>/images/flatfull/buildings-low.jpg');
	
	<% } else if(VersioningUtil.isDevelopmentEnv()){  %>
		background-image:url('https://doxhze3l6s7v9.cloudfront.net/app/static/images/buildings-low.jpg');
	
	<%} else {  %>
		background-image:url('..<%=flatfull_path%>/images/flatfull/buildings-low.jpg');
	
	<%}%>
	
  
  background-repeat: no-repeat;
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


/* @media (min-width: 900px) {
body {
	padding-top: 30px;
	}
	
.navbar-search{
 	padding-left: 10%
}
	
}
.field{
height:30px!important;
margin:8px 0px!important;
padding-left:10px!important;
} */
</style>

<!-- Le fav and touch icons -->
<link rel="shortcut icon" href="../assets/ico/favicon.ico">
<link rel="apple-touch-icon-precomposed" sizes="144x144"
	href="../assets/ico/apple-touch-icon-144-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114"
	href="../assets/ico/apple-touch-icon-114-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72"
	href="../assets/ico/apple-touch-icon-72-precomposed.png">
<link rel="apple-touch-icon-precomposed"
	href="../assets/ico/apple-touch-icon-57-precomposed.png">


<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>
	
<body>
	
<div class="app app-header-fixed app-aside-fixed" id="app">
  <div ui-view="" class="fade-in-right-big smooth">
  	<div class="container w-xxl w-auto-xs">
  		<a href="https://www.agilecrm.com/" class="navbar-brand block text-white m-t" style="color: #363f44;">
			<i class="fa fa-cloud m-r-xs"></i>Agile CRM
		</a>
  		<div class="wrapper text-center text-white">
			<strong><%=LanguageUtil.getLocaleJSONValue(localeJSON, "enter-your-domain-at")%> Agile CRM</strong>
		</div>	
		<form name='choose_domain' id="choose_domain" method='post'>
			<div id="domain-error"></div>
			<div class="list-group list-group-sm">
				<div class="list-group-item">
          			<input id='subdomain' type="text" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "Company")%>'
						   	   name="subdomain" class="input-xlarge  required form-control no-border w pull-left" autocapitalize="off"><div class="inline-block m-t-xs">.agilecrm.com</div><div class="clearfix"></div>
				</div>
			</div>
			<input class="btn btn-lg btn-primary btn-block" type="submit" value='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "submit")%>'>
		</form>
	 	<div class="text-center text-white m-t m-b">
	  		<small><%=LanguageUtil.getLocaleJSONValue(localeJSON, "new-user")%>? </small> <a href="/register" class="text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "click-here")%></a><br/>
	  	 <small><%=LanguageUtil.getLocaleJSONValue(localeJSON, "forgot")%> </small><a href="/forgot-domain" class="text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "domain")%>?</a>
		 </div>

	</div>
  </div>
</div>

	<!-- Le javascript
    ================================================== -->
     <!-- JQUery Core and UI CDN -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script type='text/javascript' src='<%=flatfull_path%>/lib/jquery-new/jquery-2.1.1.min.js'></script>
	<script type="text/javascript" src="<%=flatfull_path%>/lib/bootstrap.v3.min.js"></script>
	<script>

	$(document).ready(function(){
   var newImg = new Image;
      	newImg.onload = function() {
    	$("body").css("background-image","url('"+this.src+"')");
  		 }
		newImg.src = 'flatfull/images/flatfull/buildings.jpg';

	});
		//Init
		var error = "";
		$(function() {
			$("#subdomain").focus();
			$(".btn").click(function(e) {
				
				var subdomain = $("#subdomain").val();
				// validates the domain value
				if(subdomain == null || subdomain == "" || subdomain.length < 2 || subdomain.length > 20 
			        || !isAlphaNumeric(subdomain) || !isNotValid(subdomain))
				{
					//shows error message
					if(!error)error = '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "domain-name-length-error")%>';
					$("#domain-error").html('<div class="alert error alert-danger login-error m-b-none">'
							+ '<a class="close m-t-n-sm" data-dismiss="alert" href="#">&times</a>'+ error +'</div>');
					error = "";
					return false;
				}
				$(".domain-error").hide();
				console.log("submited");
				//Form is self submitted
				$('#choose_domain').submit();
				e.preventDefault();
			});

		});
		function isNotValid(subdomain) {
			subdomain = subdomain.toString();
			var sub_domain = ["my", "agile", "googleapps", "sales", "support", "login", "register", "google", "yahoo", "twitter", "facebook", "aol", "hotmail"];
			for(var key in sub_domain){
				if(sub_domain[key] == subdomain.toLowerCase()){
					error = '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "common-domain-issue")%>';
					return false;
				} 
			}
			return true;
        }

		function isAlphaNumeric(subdomain) {
			subdomain = subdomain.toString();
		  
		  var regularExpression  = new RegExp(/^[A-Za-z][a-zA-Z0-9]{1,20}$/);
		  if(!regularExpression.test(subdomain)) {
		        error = '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "enter-domain.domain-name-issue")%>';
				return false;
		    }
		  return true;
		}
	</script>
	
	<!-- Clicky code -->
 	<script src="//static.getclicky.com/js" type="text/javascript"></script>
	<script type="text/javascript">try{ clicky.init(100729733); }catch(e){}</script>
</body>
</html>
