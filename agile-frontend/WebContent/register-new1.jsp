<%@page import="com.agilecrm.util.RegisterUtil"%>
<%@page import="com.agilecrm.user.RegisterVerificationServlet"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page contentType="text/html; charset=UTF-8" %>
<%

	  /*if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
		response.sendRedirect("/register");
		return;
	} 

   if(RegisterUtil.isWrongURL(request))
	{
	    RegisterUtil.redirectToRegistrationpage(request, response);
	    return;
	}*/
 
  String _source = request.getParameter("_source");
  String registered_email = request.getParameter("email");

String _AGILE_VERSION = SystemProperty.applicationVersion.get();

String CSS_PATH = "/";
String FLAT_FULL_PATH = "flatfull/";
String CLOUDFRONT_TEMPLATE_LIB_PATH = VersioningUtil.getCloudFrontBaseURL();
System.out.println(CLOUDFRONT_TEMPLATE_LIB_PATH);
  
String CLOUDFRONT_STATIC_FILES_PATH = VersioningUtil.getStaticFilesBaseURL();
CSS_PATH = CLOUDFRONT_STATIC_FILES_PATH;
//Static images s3 path
String S3_STATIC_IMAGE_PATH = CLOUDFRONT_STATIC_FILES_PATH.replace("flatfull/", "");

// Error Message
String errorMessage = "";
if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
{
	  CLOUDFRONT_STATIC_FILES_PATH = FLAT_FULL_PATH;
	  CLOUDFRONT_TEMPLATE_LIB_PATH = "";	
	  CSS_PATH = FLAT_FULL_PATH;
	  S3_STATIC_IMAGE_PATH = VersioningUtil.getBaseServerURL() + "/beta/static/";
}

  if(registered_email != null)
  {
	  try{
		  // Validate Email
		  new RegisterVerificationServlet().validateEmailIdWhileRegister(request, response);
		  request.getRequestDispatcher("/register-new2.jsp").forward(request, response);
		  return;
		    
	  }
	  catch(Exception e)
	  {
		  errorMessage = e.getMessage();
		    	
	  }
	
  }

%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="globalsign-domain-verification"
	content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<title>Register</title>
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
<body>
  <div id="error-area" class="error-top-view">
    <%if(StringUtils.isNotEmpty(errorMessage)){
        out.println(errorMessage);
    }%>
  </div>
<div class="app app-header-fixed app-aside-fixed">
<div class="container w-xxl w-auto-xs">
<a href="https://www.agilecrm.com/" class="navbar-brand block m-t text-white">
						<i class="fa fa-cloud m-r-xs"></i>Agile CRM
					</a>
<div class="wrapper text-center text-white">
      				<strong>Register your FREE account</strong>
   				</div>

<form name='agile' id="agile" method='post'
					onsubmit="return isValid(this);">

<div id="openid_btns">
<input type='hidden' name='type' value='agile'></input>
<input type='hidden' name='step' id="step" value="1"></input>

<div class="list-group list-group-sm" style="margin-bottom:4px;">
<div class="list-group-item">
<input class="input-xlarge field required form-control no-border" name='name'
											type="text" required maxlength="50" minlength="3" title="Name should be at least 3 characters" 
                      pattern="[a-zA-Z0-9\s]+"
											placeholder="Full Name" autocapitalize="off" autofocus>

</div>


<div class="list-group-item">
<input class="input-xlarge field required email form-control no-border"
			id="login_email" name='email' type="email" required maxlength="50"
			minlength="6" value="<%=email%>"  placeholder="Email Address (User ID)"
			autocapitalize="off" autocomplete="off">
</div>


<div class="list-group-item">
<input class="input-xlarge field required form-control no-border"
											maxlength="20" minlength="4" required name='password' type="password"
											placeholder="Password" autocapitalize="off" autocomplete="off">
</div>

</div>
</div>


<div class="text-white m-b-md text-left text-xs">
     By clicking sign up, I agree to Agile CRM's <a
											href="https://www.agilecrm.com/terms.html" class="terms-field" target="_blank">Terms of Service</a>
									</div> 		

<input type='submit' id="register_account" value="Sign Up" class='btn btn-lg btn-primary btn-block'>
</form>
					
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
<script src="/flatfull/registration/register.js" type="text/javascript"></script>
<!--[if lt IE 10]>
<script src="flatfull/lib/ie/placeholders.jquery.min.js"></script>
<![endif]-->

  <script type="text/javascript">
  var version = <%="\"" + VersioningUtil.getAppVersion(request) + "\""%>;
  var applicationId = <%="\"" + SystemProperty.applicationId.get() + "\""%>;
$(document).ready(function() {
	
  	var newImg = new Image;
    newImg.onload = function() {
    $("body").css("background-image","url('"+this.src+"')");
     }
    newImg.src = '<%=S3_STATIC_IMAGE_PATH%>/images/agile-registration-page-high.png';

    if($("#error-area").text().trim())
    	$("#error-area").slideDown("slow");


});
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
