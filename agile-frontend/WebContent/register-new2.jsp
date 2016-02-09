<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page contentType="text/html; charset=UTF-8" %>

<%
if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
    response.sendRedirect("/register");
}
String _AGILE_VERSION = SystemProperty.applicationVersion.get();

String CSS_PATH = "/";
String FLAT_FULL_PATH = "flatfull/";
String CLOUDFRONT_TEMPLATE_LIB_PATH = VersioningUtil.getCloudFrontBaseURL();
System.out.println(CLOUDFRONT_TEMPLATE_LIB_PATH);
  
String CLOUDFRONT_STATIC_FILES_PATH = VersioningUtil.getStaticFilesBaseURL();
CSS_PATH = CLOUDFRONT_STATIC_FILES_PATH;
if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
{
	  CLOUDFRONT_STATIC_FILES_PATH = FLAT_FULL_PATH;
	  CLOUDFRONT_TEMPLATE_LIB_PATH = "";	
	  CSS_PATH = FLAT_FULL_PATH;
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

<style>
body {
	background: #7266ba;
}

/*hack for phone number plugin*/

.error-top-view {
  position: fixed;
  background-color: rgb(199, 73, 73);
  width: 100%;
  top: 0;
  height: 50px;
  color: #fff;
  text-align: center;
  padding-top: 15px;
  display: none;
}

.intl-tel-input {

	  width: 100%;
}

.intl-tel-input .selected-flag {

	  height: 31px!important;
}

.custom-error {
	color: rgb(199, 73, 73);
	display: none;
}
.modal-title {
	line-height: 1.42857143;
}
.modal-content{
	border-radius: 0px!important;
}
.modal{
diplay:block!important;
position:fixed!important;
}

.progress-bar.animate {
   width: 100%;
}

.loading-image {
    height: 100%;
    width: 100%;
    background-color: white;
    position: absolute;
    z-index: 9;
    text-align: center;
}

/*Starting of the animation*/
#loading_p1 {
    /* margin-top: 255px; */
    font-size: 15pt;
    line-height: 1.873;
    font-family: "Source Sans Pro","Helvetica Neue","Helvetica,Arial,sans-serif";
    /* display: none; */
    position: relative;
    top: -100px;
    left: -50%;
    /* display: none; */
    
}
.animationload {
    background-color: #fff;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10000;
    
}
.osahanloading {
    animation: 1.5s linear 0s normal none infinite running osahanloading;
    background: #fed37f none repeat scroll 0 0;
    border-radius: 50px;
    height: 50px;
    /* left: 50%; */
    margin-left: -25px;
    margin-top: -25px;
    position: absolute;
    top: -165px;
    width: 50px;
}
.osahanloading::after {
    animation: 1.5s linear 0s normal none infinite running osahanloading_after;
    border-color: #85d6de transparent;
    border-radius: 80px;
    border-style: solid;
    border-width: 10px;
    content: "";
    height: 80px;
    left: -15px;
    position: absolute;
    top: -15px;
    width: 80px;
}
@keyframes osahanloading {
0% {
    transform: rotate(0deg);
}
50% {
    background: #85d6de none repeat scroll 0 0;
    transform: rotate(180deg);
}
100% {
    transform: rotate(360deg);
}
}
.animate {
    top: 50%;
    left: 50%;
    text-align: center;
    margin: 0 auto;
    position: absolute;

}
/*Ending of the animation*/



</style>
 
<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="<%=CSS_PATH %>css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />
<link type="text/css" rel="stylesheet" href="/css/phonenumber-lib/intlTelInput.css" />

<script type="text/javascript">
var isSafari = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);
var isWin = (window.navigator.userAgent.indexOf("Windows") != -1);
if(isSafari && isWin) 
	window.location = '/error/not-supported.jsp';
</script>

</head>
<body>
<div class="loading-image hide">
	<!--starting of animation-->
	<div class="container">
	<div class="row">   
        <div class="animationload">
  		<div class="animate">
            <div class="osahanloading">
 			
        	</div>
        	<p id="loading_p1">
	 			Please wait while we are setting up your account...</p>
    	</div>
  		</div>
	</div>
	</div>
	<!--ending of animation-->
	
</div>

    

	<div id="error-area" class="error-top-view"></div>
	<div class="app-content-body">
		<div class="bg-light lter b-b wrapper-md text-center">
<h1 class="m-n font-thin h3" style="font-weight:400;"> Agile CRM <small></small></h1>
</div>
<div class="wrapper-md">
	<div class="row">
		<div class="col-md-6 col-md-offset-3 col-sm-offset-3 col-sm-6 col-xs-12">
	<form class="form-horizontal" method="post" onsubmit="return isValid(this);">
<div class="panel panel-default">
<div class="panel-heading text-center"> It's time to configure your account </div>
<div class="panel-body">
<div class="form-group m-t m-b-none">
<label class="col-sm-3 control-label">&nbsp;</label>
<div class="col-sm-6">
	<div class="input-prepend input-append input-group">
	<input id='subdomain' type="text" required placeholder="Domain" title="Name should be between 4-20 characters in length. Both letters and numbers are allowed but it should start with a letter."  name="subdomain"  class="required  domainLength commonDomain domainCharacters domain_input_field form-control" autocapitalize="off" minlength="4" maxlength="20" pattern="^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$"> <span class="add-on field_domain_add_on input-group-addon regpage-domain" 
	id="app_address">.agilecrm.com</span>
	</div>
	
</div>
</div>
<div class="form-group" style="margin-bottom:25px;">
<div class="col-sm-offset-3 col-sm-8 m-t-xs">	
This is where you and your users will log in to your account
	</div>
</div>
<div class="line line-dashed b-b line-lg"></div>
<div class="form-group">
<label class="col-sm-3 control-label">Choose Plan</label>
<div class="col-sm-6">
	<select class="form-control required" required  name="plan_type" data-width="100%" >
											<option value="" selected disabled>Choose Plan</option>
											<option value="Free">Free</option>
											<option value="Starter">Starter</option>
											<option value="Regular">Regular</option>
											<option value="pro">Enterprise</option>
								 	 </select>
</div>
</div>

<div class="form-group">
<label class="col-sm-3 control-label">Users</label>
<div class="col-sm-6">
<input class="field required form-control number" name="users_count" required type="number" pattern="\d*" min="1" placeholder="Users" autocapitalize="off">

</div>
</div>

<div class="form-group m-b-xs" style="margin-top: 18px;">
<div class="col-sm-offset-3 col-sm-9 text-base"> We will create unique experience based on your role and company </div>
</div>
<div class="form-group m-b-none">
<label class="col-sm-3 control-label"> Role & Company</label>
<div class="col-sm-3 m-b">
<select class="form-control required" required  name="role">
											<option value="" selected disabled>Role</option>
											<option value="CEO">CEO</option>
											<option value="VP">VP</option>
											<option value="VP, Sales">VP, Sales</option>
											<option value="VP, Marketing">VP, Marketing</option>
											<option value="Customer Success Manager" title="Customer Success Manager">Customer Success Manager</option>
											<option value="Sales Manager">Sales Manager</option>
											<option value="Marketing Manager">Marketing Manager</option>
											<option value="Consultant">Consultant</option>
											<option value="Reseller">Reseller</option>
											<option value="Recruiter">Recruiter</option>
											<option value="Developer">Developer</option>
											<option value="Other">Other</option>
								  </select>
</div>
<div class="col-sm-3 m-b">
	<select class="form-control required"  name="company_type" required  data-width="100%">
											<option value="" selected disabled>Select Type</option>
											<option value="B2B">B2B</option>
											<option value="SaaS">SaaS</option>
											<option value="Ecommerce">Ecommerce</option>
											<option value="Marketing Agency">Marketing Agency</option>
											<option value="Contact Centers">Contact Centers</option>
											<option value="Realty">Realty</option>
											<option value="Media">Media</option>
											<option value="Technology Consulting">Technology Consulting</option>
											<option value="Other">Other</option>
								  </select>
</div>

</div>

<div class="form-group">
<label class="col-sm-3 control-label">Phone Number</label>
<div class="col-sm-6">
<input
											class="field form-control required tel-number"
											id="login_phone_number" required name='phone_number' type="text"
											placeholder="Phone Number" autocapitalize="off">
											<div class='custom-error'>Please enter valid number</div>
</div>
</div>

<input type='hidden' id="login_email" name='email' value=<%=request.getParameter("email")%>></input>
<input type='hidden' id="user_name" name='name' value=<%=request.getParameter("name")%>></input>
<input type='hidden' name='account_timezone' id='account_timezone' value=''></input>
<input type="password" class="hide" name='password' id="password" value="<%=request.getParameter("password")%>"></input>
	<input type='hidden' name='type' value='agile'></input>
<div class="line line-lg b-b" style="margin-top:25px;"></div>

<div class="row">
                    <div class="col-sm-offset-3 col-sm-8">                      
                       <input type='submit' id="confirm_registration" value="Get Started" 
											class='save btn btn-sm btn-primary' style="padding-left:15px;padding-right:15px;">


                        <!--<a href="#settings" class="btn btn-sm btn-default">Cancel</a>-->
                    </div>
                    </div>
</div>
</div>
</form>
</div>
</div>
</div>
</div>





<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script>
<script src="/flatfull/lib/bootstrap.v3.min.js"></script>
<script type="text/javascript" src="/lib/phonenumber-lib/intlTelInput.js"></script>
<script src="/flatfull/registration/register.js?_v=<%=_AGILE_VERSION%>"   type="text/javascript"></script>
<script src="https://jamesallardice.github.io/Placeholders.js/assets/js/placeholders.jquery.min.js"></script>

<script type="text/javascript">
var version = <%="\"" + VersioningUtil.getAppVersion(request) + "\""%>;
  var applicationId = <%="\"" + SystemProperty.applicationId.get() + "\""%>;
	$("#password").value = "<%=request.getParameter("password")%>"
</script>

<script>
$(document).ready(function(){

	
	// Pre load dashlet files when don is active
	preload_dashlet_libs();
	$('#account_timezone').val(jstz.determine().name());
	var telInput = $("#login_phone_number"),
	  errorMsg = $("#error-msg"),
	  validMsg = $("#valid-msg");

	// on blur: validate
	telInput.blur(function() { console.log("blur"); console.log($.trim(telInput.val()) + " : " + telInput.intlTelInput("isValidNumber"));
	  if ($.trim(telInput.val()) && telInput.intlTelInput("isValidNumber")) {
	        $(".custom-error").hide();
	  } else {
	     $(".custom-error").show();
	  
}	});

	$("#login_phone_number").intlTelInput({
				utilsScript: "lib/phonenumber-lib/utils.js",
				responsiveDropdown : true
			});
	
});
function preload_dashlet_libs(){ 
	
	setTimeout(function(){head.load('<%=CLOUDFRONT_STATIC_FILES_PATH %>final-lib/min/lib-all-min.js', '<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min.js', '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>tpl/min/precompiled/<%=FLAT_FULL_PATH%>tpl.js?_=<%=_AGILE_VERSION%>', '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>tpl/min/precompiled/<%=FLAT_FULL_PATH%>portlets.js?_=<%=_AGILE_VERSION%>')}, 5000);
}
</script>

</body>
