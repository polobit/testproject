<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page contentType="text/html; charset=UTF-8" %>

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


<style>
body {
  background-image: url('../flatfull/images/flatfull/agile-registration1.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  background-attachment: fixed;
}
.text-white
{
color:#fff!important;
}


.panel {
  position: fixed!important;
  bottom: 0;
  right: 10px;
  color: #fff;
  border-radius:50%!important;
  background: none!important;

}

.agile-testimonial
{
box-shadow: rgba(0, 0, 0, 0.14902) 0px 1px 3px;
padding: 10px 13px;
box-sizing: border-box;
border-color: rgb(238, 238, 238) rgb(221, 221, 221) rgb(187, 187, 187);
border-width: 1px;
border-style: solid;
border-radius: 4px;
position:relative;
margin: 30px auto;
width: 365px;

}
.agile-testimonial li
{
	margin-bottom:15px;
	list-style:none;
}
.agile-testimonial .tweet-img-pricing
{
width:51px;	
margin-top:12px;
}
.agile-testimonial .tweet-img-pricing img
{
	width:40px;
	height:40px;
}
.agile-testimonial  .tweet-head
{
	margin-bottom:3px;
	margin-top:7px;
}

.agile-testimonial .tweet-txt
{
	width: 125px;


position: relative;

}
/*.agile-testimonial .tweet-arrow
{
	position: absolute;
display: block;
border-top: 6px solid transparent;
border-bottom: 6px solid transparent;
border-right: 6px solid #82949a;
left: -8px;
top: 30%;
}*/
.agile-testimonial .tweet-authname
{
	font-size:13px;
	display:block;
	margin-top:15px;
}
.agile-testimonial .tweet-authdesc
{
font-size: 12px;
margin-top:5px;
display:block;
margin-bottom:7px;
}
.tweet-info
{
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  margin-top: 3px;
  width: 75%;
  margin: 0 auto;
}
.no-margin-L
{
	margin-left:0px;
}

.carousel {
  position: relative;
  margin-bottom: 20px;
  line-height: 1;
}

.carousel-inner {
  position: relative;
  width: 100%;
  overflow: hidden;
  
  
  
}

.carousel-inner > .item {
  position: relative;
  display: none;
  -webkit-transition: 0.6s ease-in-out left;
     -moz-transition: 0.6s ease-in-out left;
       -o-transition: 0.6s ease-in-out left;
          transition: 0.6s ease-in-out left;
}

.carousel-inner > .item > img,
.carousel-inner > .item > a > img {
  display: block;
  line-height: 1;
}

.carousel-inner > .active,
.carousel-inner > .next,
.carousel-inner > .prev {
  display: block;
}

.carousel-inner > .active {
  left: 0;
}

.carousel-inner > .next,
.carousel-inner > .prev {
  position: absolute;
  top: 0;
  width: 100%;
}

.carousel-inner > .next {
  left: 100%;
}

.carousel-inner > .prev {
  left: -100%;
}

.carousel-inner > .next.left,
.carousel-inner > .prev.right {
  left: 0;
}

.carousel-inner > .active.left {
  left: -100%;
}


.carousel-inner > .active.right {
  left: 100%;
}

.carousel-control {
  position: absolute;
  top: 30px!important;
  background-image:none!important;
  width: 40px!important;
  height: 40px!important;
  margin-top: -20px;
  font-size: 60px!important;
  font-weight: 100;
  line-height: 30px;
  color: #000!important;
  text-align: center;
  background: none;
  border:none;
  -webkit-border-radius: 23px;
     -moz-border-radius: 23px;
          border-radius: 23px;
  opacity: 0.5;
  filter: alpha(opacity=50);
  display: none;
  
}
.carousel-control.left
{
 left: -55px;	
}
.carousel-control.right {
  right: -55px!important;
  left: auto;

}

.carousel-control:hover,
.carousel-control:focus {
  color: #999;
  text-decoration: none;
  opacity: 0.9;
  filter: alpha(opacity=90);
}

.carousel-indicators {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 5;
  margin: 0;
  list-style: none;
  display:none;
}

.carousel-indicators li {
  display: block;
  float: left;
  width: 10px;
  height: 10px;
  margin-left: 5px;
  text-indent: -999px;
  background-color: #ccc;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 5px;
}

.carousel-indicators .active {
  background-color: #fff;
}

.carousel-caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 15px;
  background: #333333;
  background: rgba(0, 0, 0, 0.75);
}

.carousel-caption h4,
.carousel-caption p {
  line-height: 20px;
  color: #ffffff;
}

.carousel-caption h4 {
  margin: 0 0 5px;
}

.carousel-caption p {
	
  margin-bottom: 0;
}


  </style>

<link rel="stylesheet" type="text/css" href="/flatfull/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/font.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">



<!-- JQUery Core and UI CDN -->
<script type='text/javascript' src='/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.v3.min.js"></script>
<script type="text/javascript" src="/lib/phonenumber-lib/intlTelInput.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
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
				response.sendRedirect("/error/not-supported.jsp");
			}
%>
<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>
<body>
<div class="app app-header-fixed app-aside-fixed">
<div class="container w-xxl w-auto-xs">
<a href="https://www.agilecrm.com/" class="navbar-brand block m-t text-white">
						<i class="fa fa-cloud m-r-xs"></i>Agile CRM
					</a>
<div class="wrapper text-center text-white">
      				<strong>Register your free Agile CRM account</strong>
   				</div>

<form name='agile' id="agile" method='post'
					onsubmit="return isValid();">

<div id="openid_btns">
<input type='hidden' name='type' value='agile'></input>
<input type='hidden' name='account_timezone' id='account_timezone' value=''></input>

<div class="list-group list-group-sm" style="margin-bottom:4px;">
<div class="list-group-item">
<input class="input-xlarge field required form-control no-border" name='name'
											type="text" required maxlength="50" minlength="3" pattern="^[A-Za-z_]{3,50}$"
											placeholder="Full Name" autocapitalize="off" autofocus>

</div>


<div class="list-group-item">
<input class="input-xlarge field required email form-control no-border"
			id="login_email" name='email' type="email" required maxlength="50"
			minlength="6" value="<%=email%>" placeholder="Email Address (User ID)"
			autocapitalize="off">
</div>


<div class="list-group-item">
<input class="input-xlarge field required form-control no-border"
											maxlength="20" minlength="4" required name='password' type="password"
											placeholder="Password" autocapitalize="off">
</div>

</div>
</div>


<div class="text-white m-b-md text-left text-xs">
     By clicking sign up, I agree to Agile CRM's <a
											href="https://www.agilecrm.com/terms.html" target="_blank"
											style="color:#00B5FF;">Terms of Service</a>
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
  
  <a class="carousel-control left" href="#myCarousel" data-slide="prev">‹</a>
  <a class="carousel-control right" href="#myCarousel" data-slide="next">›</a>
</div>
</div>
</div>
</div>
</div>
	</body>
	</html>