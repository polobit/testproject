<%@page import="java.util.Map"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="com.agilecrm.ipaccess.IpAccessUtil"%>
<%@page import="com.agilecrm.util.RegisterUtil"%>
<%@page import="com.agilecrm.user.RegisterVerificationServlet"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.util.MathUtil"%>
<%@page contentType="text/html; charset=UTF-8" %>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

<%
	
	if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
		response.sendRedirect("/register");
		return;
	}

 	if(RegisterUtil.isWrongURL(request))
	{
	    RegisterUtil.redirectToRegistrationpage(request, response);
	    return;
	}

  String _source = request.getParameter("_source");
  String registered_email = request.getParameter("email");
  
  String shopifyUserEmail = request.getParameter("merchant_email");
  String shopifyUserName = request.getParameter("merchant_name");
  if(StringUtils.isBlank(shopifyUserName))
	  shopifyUserName = "";
  

String _AGILE_VERSION = SystemProperty.applicationVersion.get();

String CSS_PATH = "/";
String FLAT_FULL_PATH = "flatfull/";
String CLOUDFRONT_TEMPLATE_LIB_PATH = VersioningUtil.getCloudFrontBaseURL();
System.out.println(CLOUDFRONT_TEMPLATE_LIB_PATH);
  
String CLOUDFRONT_STATIC_FILES_PATH = VersioningUtil.getStaticFilesBaseURL();
CSS_PATH = CLOUDFRONT_STATIC_FILES_PATH;
//Static images s3 path
String S3_STATIC_IMAGE_PATH = CLOUDFRONT_STATIC_FILES_PATH.replace("flatfull/", "");

// Bg Image
int randomBGImageInteger = MathUtil.randomWithInRange(1, 9);

// Error Message
/*String errorMessage = request.getParameter("error");
if(StringUtils.isBlank(errorMessage))
		errorMessage = "";*/

String errorMessage = "";

if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
{
	  CLOUDFRONT_STATIC_FILES_PATH = FLAT_FULL_PATH;
	  CLOUDFRONT_TEMPLATE_LIB_PATH = "";	
	  CSS_PATH = FLAT_FULL_PATH;
	  S3_STATIC_IMAGE_PATH = VersioningUtil.getStaticFilesBaseURL();
}

  if(registered_email != null)
  {
	  try{
		  
		  String name = request.getParameter("name");
		  String password = request.getParameter("password");
		  if(StringUtils.isNotBlank(name) && StringUtils.isNotBlank(password)) {
			  // Validate Email
			  new RegisterVerificationServlet().validateEmailIdWhileRegister(request, response);
			  request.getRequestDispatcher("/register-new2.jsp").forward(request, response);
			  return; 
		  }
	  }
	  catch(Exception e)
	  {
		  errorMessage = e.getMessage();
		    	
	  }
	
  }
  if(StringUtils.isNotBlank(shopifyUserEmail))
	  registered_email = shopifyUserEmail; 
  
//Get the language and save as cookie
String _LANGUAGE = request.getParameter("lang");
if(StringUtils.isBlank(_LANGUAGE) || !LanguageUtil.isSupportedlanguageFromKey(_LANGUAGE)) {
	_LANGUAGE = LanguageUtil.getSupportedLocale(request);
}
//Locales JSON
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "register");
%>

<!DOCTYPE html>
<html lang="<%=_LANGUAGE %>">
<head>
<meta charset="utf-8">
<meta name="globalsign-domain-verification"
	content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<title><%=LanguageUtil.getLocaleJSONValue(localeJSON, "register")%></title>
<meta name="viewport"
	content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">


<!-- Page CSS -->
<link rel="stylesheet" type="text/css" href="/flatfull/css/register-new.css" />
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH %>css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>
<STYLE>

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
.text-info-color{
    color: #23b7e5
}
.text-alignment{
	text-align: center;
	padding-top: 5px;
}
.font-11{
	font-size: 11px;
}
.font-18{
	font-size: 18px;
}
.login-position-fixed{
position: fixed !important;width: 100% !important;top: 0px !important;
z-index: 3;
}
.error {
	color: white !important;
	background-color: #c74949 !important;
  border-color: #c74949 !important;
}
a:hover {
    text-decoration: underline;
}

.text-top{
	margin-top: 3px;
}

</STYLE>

<script type="text/javascript">
var isSafari = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);
var isWin = (window.navigator.userAgent.indexOf("Windows") != -1);
if(isSafari && isWin) 
	window.location = '/error/not-supported.jsp';
</script>

<%
    String ua = request.getHeader("User-Agent");
			boolean isMSIE = (ua != null && ua.indexOf("MSIE") != -1);

	// Get the cookie array and find a cross domain cookie from agilecrm site and autofill email in register page
	Cookie[] cookies = request.getCookies();
	String email ="";
	if(cookies != null && cookies.length > 0)
	{
		for(Cookie cookie : cookies)
			if(cookie.getName().equals("registration_email"))
				email = cookie.getValue();
	}
	
	if(StringUtils.isNotBlank(registered_email))
		  email = registered_email;
%>

<%
    if (isMSIE) {
				// response.sendRedirect("/error/not-supported.jsp");
			}
%>
<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>
<body class="overlay">

	<!-- <%if(StringUtils.isNotEmpty(errorMessage)){
		if(StringUtils.equalsIgnoreCase("Sorry, we could not recognized the email ID registered with any of the Google App.",errorMessage)){
		%>
		<div  class="alert error login-position-fixed text-center m-b-none">
    			<a class="close" data-dismiss="alert" href="#" style="position:relative;top:-2px;">&times</a><%=errorMessage%> 
    		</div>
    	<%}else{%>
    	<div id="error-area" class="error-top-view">
             <%=errorMessage%>
          </div>
    	<%}}%> -->

    	 <div id="error-area" class="error-top-view">
		    <%if(StringUtils.isNotEmpty(errorMessage)){
		        out.println(errorMessage);
		    }%>
		 </div>
	
    
 
<div class="app app-header-fixed app-aside-fixed transparant">
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
	
<div class="container w-xxl w-auto-xs">
<a href="https://www.agilecrm.com/" class="navbar-brand block m-t text-white">
						<i class="fa fa-cloud m-r-xs"></i>Agile CRM
					</a>
<div class="wrapper text-center text-white">
      				<strong><%=LanguageUtil.getLocaleJSONValue(localeJSON, "register-with-free")%></strong>
   				</div>



<form name='agile' id="agile" method='post'
					onsubmit="return isValid(this);">

<div id="openid_btns">
<input type='hidden' name='type' value='agile'></input>
<input type='hidden' name='step' id="step" value="1"></input>

<!-- Origin Name -->
<%
  if(request.getParameter("origin_from") != null) {
%>
	<input type='hidden' name='origin_from' id="origin_from" value='<%=request.getParameter("origin_from")%>'></input>
	<input type='hidden' name='domain_channel' id="domain_channel" value='<%=request.getParameter("domain_channel")%>'></input>
<%
  }
%>

<input type='hidden' name='user_lang' id="user_lang" value='<%=_LANGUAGE%>'></input>

<div class="list-group list-group-sm" style="margin-bottom:4px;">
<div class="list-group-item">
<input class="input-xlarge field required form-control no-border" name='name' value="<%=shopifyUserName%>"
											type="text" required maxlength="50" minlength="3" title='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "name-validation")%>' 
                      pattern="[a-zA-Z0-9\s]+"
											oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "full-name")%>' autocapitalize="off" autofocus>

</div>


<div class="list-group-item">
<input class="input-xlarge field required email form-control no-border"
			id="login_email" name='email' type="email" required maxlength="50"
			minlength="6" value="<%=email%>"  oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "email-address")%>'
			autocapitalize="off">
</div>


<div class="list-group-item">
<input class="input-xlarge field required form-control no-border"
											maxlength="20" minlength="4" required name='password' type="password"
											oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "password")%>' autocapitalize="off" autocomplete="off">
</div>

</div>
</div>


<div class="text-white m-b-md text-left text-xs">
     <%=LanguageUtil.getLocaleJSONValue(localeJSON, "click-signing-info")%> <a
											href="https://www.agilecrm.com/terms.html" class="terms-field" target="_blank"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "terms-of-service")%></a>
									</div> 		

<input type='submit' id="register_account" value='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "sign-up")%>' class='btn btn-lg btn-primary btn-block'>

</form>


<form id='oauth' name='oauth' method='post' class="text-alignment m-t" action="/register">
			<div id="openid_btns" class="login-social-btns">
					<input type='hidden' name='type' value='oauth'></input>
					<input type='hidden' name='server' id='oauth-name' value=''></input>
					<small class="text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "signup-Using")%> <small>
					<a title="Sign up using Google Apps" data='google' href='#'  class="openid_large_btn google tags-color text-white"><i class="fa fa-google"></i><small>Google Apps</small></a>
					
			</div>
</form>
<div class="text-center text-white m-b">
	<div class="text-top">
		<small><%=LanguageUtil.getLocaleJSONValue(localeJSON, "already-have-account")%>?
		<a href="/enter-domain?to=login&lang=<%=_LANGUAGE%>" class="tags-color text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "sign-In")%></a></small>
	</div>
	<div class="text-top">
		<small><%=LanguageUtil.getLocaleJSONValue(localeJSON, "forgot")%>
		<a href="/forgot-domain?lang=<%=_LANGUAGE%>" class="text-white"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "domain")%>?</a></small> 
	</div>
</div>
					
</div>
<div class="container hide">
	<div class="row">
		<div class="agile-testimonial panel">
 <div id="myCarousel" class="carousel slide">
  <ol class="carousel-indicators">
    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-slide-to="1"></li>
    <li data-target="#myCarousel" data-slide-to="2"></li>
  </ol>
  
  <div class="carousel-inner">
  <div class="active item m-l-none">
  	<div style="margin: 0 auto 10px; width: 200px;">
	<div class="pull-left tweet-img-pricing">
		<img title="Nicolas Woirhaye" src="/img/testimonial-nicolas-reg.png">
	</div>
	<div class="pull-left tweet-txt">
		<span class="tweet-arrow"></span>
	<div class="tweet-head">
		<span class="tweet-authname">Nicolas Woirhaye</span>
		<span class="tweet-authdesc">Co-founder - IKO System</span>
	</div>
	</div>
	<div class="clearfix"></div>
</div>
<div class="clearfix"></div>
<div class="tweet-info">
 I've seen and used dozens of CRMs. This one may change the market upside down. Absolutely great, easy-to-use and powerful. </div>


</div>
  </div>
  
  <a class="carousel-control left" href="#myCarousel" data-slide="prev">�</a>
  <a class="carousel-control right" href="#myCarousel" data-slide="next">�</a>
</div>
</div>
</div>
</div>
</div>
<!-- JQUery Core and UI CDN -->
<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script>
<script type='text/javascript' src='flatfull/final-lib/final-lib-1/b-bootstrap.js'></script>
<script src="/flatfull/registration/register.js" type="text/javascript"></script>
<script src='locales/html5/localize.js?_=<%=_AGILE_VERSION%>'></script>
<!--[if lt IE 10]>
<script src="flatfull/lib/ie/placeholders.jquery.min.js"></script>
<![endif]-->

  <script type="text/javascript">
  var localeJSON = <%=localeJSON%>;
  var version = <%="\"" + VersioningUtil.getAppVersion(request) + "\""%>;
  var applicationId = <%="\"" + SystemProperty.applicationId.get() + "\""%>;
$(document).ready(function() {
  	var newImg = new Image;
    newImg.onload = function() {
    $("body").css("background-image","url('"+this.src+"')");
     }
   newImg.src = '<%=S3_STATIC_IMAGE_PATH%>images/agile-registration-page-high.png';
   
  console.log(newImg.src);
    if($("#error-area").text().trim())
    	$("#error-area").slideDown("slow");
//preload_login_pages();
$('.openid_large_btn').click(function(e)
			{
				
				// Gets Data Google/Yahoo and submits to LoginServlet
				var data = $(this).attr('data');
				$('#oauth-name').val(data);
				$('#oauth').submit();

				e.preventDefault();
			});

});
/*
 function preload_login_pages()
			{

			for(var i=1; i < 10; i++){

			$('<img/>', {
				class: 'hide',
				src: '<%=S3_STATIC_IMAGE_PATH%>/images/signup-' + i + '-high.jpg',
			}).appendTo('body');

			$('<img/>', {
				class: 'hide',
				src: '<%=S3_STATIC_IMAGE_PATH%>/images/signup-' + i + '-low.jpg',
				}).appendTo('body');

			}
		}*/
  </script>

  <!-- Clicky code -->
  <script src="//static.getclicky.com/js" type="text/javascript"></script>
  <script type="text/javascript">try{ clicky.init(100729733); }catch(e){}</script>
<script src="//platform.twitter.com/oct.js" type="text/javascript"></script>
<script type="text/javascript">twttr.conversion.trackPid('nu0pq', { tw_sale_amount: 0, tw_order_quantity: 0 });</script>

<noscript>
<img height="1" width="1" style="display:none;" alt="" src="https://analytics.twitter.com/i/adsct?txn_id=nu0pq&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />
<img height="1" width="1" style="display:none;" alt="" src="//t.co/i/adsct?txn_id=nu0pq&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />

</noscript>
	</body>
	</html>
