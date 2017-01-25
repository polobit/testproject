<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="org.json.JSONObject"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page contentType="text/html; charset=UTF-8" %>
<%@page import="com.agilecrm.ipaccess.IpAccessUtil"%>
<%@page import="com.agilecrm.session.SessionManager"%>
<%@page import="com.agilecrm.session.UserInfo"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

<%


/*if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
    response.sendRedirect("/register");
    return;
}*/
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

//Get the language and save as cookie
String _LANGUAGE = request.getParameter("user_lang");
if(StringUtils.isBlank(_LANGUAGE) || !LanguageUtil.isSupportedlanguageFromKey(_LANGUAGE)) {
	_LANGUAGE = LanguageUtil.getSupportedLocale(request);
}
//Locales JSON
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "register");
String password = request.getParameter("password");
String email = request.getParameter("email");
String name = request.getParameter("name");
UserInfo userInfo = (UserInfo) request.getSession().getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);
if(userInfo != null){
		name = userInfo.getName();
		email = userInfo.getEmail();
		request.getSession().removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);
}


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

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>

<style>
body {
	background: #7266ba;
	background-size: cover;
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

#domain-validation-icon{
	position: absolute;
    font-size: 19px;
    top: 6px;
    right: -30px;
}
.icon-check{
	color: green;
}
.icon-close{
	color: red;
}
#subdomain-div{
	position: relative;
}
/*Ending of the animation*/



</style>

<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js" type="text/javascript"></script>
<script src='locales/html5/localize.js?_=<%=_AGILE_VERSION%>'></script>

<link rel="stylesheet" type="text/css" href="<%=CSS_PATH %>css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />
<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/9.2.4/css/intlTelInput.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css">

<script type="text/javascript">
var localeJSON = <%=localeJSON%>;
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
	 			<%=LanguageUtil.getLocaleJSONValue(localeJSON, "wait-info-while-setting")%></p>
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
		<div class="col-lg-6 col-lg-offset-3 col-sm-offset-1 col-sm-10 col-xs-12">
	<form class="form-horizontal" method="post" onsubmit="return isValid(this);">
<div class="panel panel-default">
<div class="panel-heading text-center text-lg" style="opacity:0.67"> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "time-to-configure")%> </div>
<div class="panel-body">
<div class="form-group m-t m-b-none">
<label class="col-sm-3 control-label">&nbsp;</label>
<div class="col-sm-6">
	<div class="input-prepend input-append input-group subdomain-div">
	<input id='subdomain' type="text" required oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "domain")%>' name="subdomain"  class="required  domainLength commonDomain domainCharacters domain_input_field form-control" autocapitalize="off" minlength="4" maxlength="20" pattern="^[a-zA-Z][a-zA-Z0-9-_]{3,20}$"> <span class="add-on field_domain_add_on input-group-addon regpage-domain" 
	id="app_address">.agilecrm.com</span>
	<i id="domain-validation-icon" class="icon"></i>
	</div>
</div>
</div>
<div class="form-group" style="margin-bottom:25px;">
<div class="col-sm-offset-3 col-sm-8 m-t-xs">	
<%=LanguageUtil.getLocaleJSONValue(localeJSON, "domain-name-helpmsg")%>
	</div>
</div>
<div class="line line-dashed b-b line-lg"></div>
<div class="form-group">
<label class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "choose-plan")%></label>
<div class="col-sm-6">
	<select class="form-control required" required  name="plan_type" data-width="100%" oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);">
											<option value="" selected disabled><%=LanguageUtil.getLocaleJSONValue(localeJSON, "select-plan")%></option>
											<option value="Free">Free</option>
											<option value="Starter">Starter</option>
											<option value="Regular">Regular</option>
											<option value="pro">Enterprise</option>
								 	 </select>
</div>
</div>

<div class="form-group">
<label class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "users")%></label>
<div class="col-sm-6">
<input class="field required form-control number" name="users_count" value="" required oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);" type="number" pattern="\d*" min="1" placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "users")%>' autocapitalize="off">

</div>
</div>


<div class="form-group m-b-none">
<label class="col-sm-3 control-label"> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "role-and-company")%></label>
<div class="col-sm-3 m-b-xs">
<select class="form-control required" required  name="role" oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);">
											<option value="" selected disabled><%=LanguageUtil.getLocaleJSONValue(localeJSON, "role")%></option>
											<option value="CEO"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "ceo")%></option>
											<option value="VP"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "vp")%></option>
											<option value="VP, Sales"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "vp-sales")%></option>
											<option value="VP, Marketing"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "vp-marketing")%></option>
											<option value="Customer Success Manager" title="Customer Success Manager"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "cus-suc-manager")%></option>
											<option value="Sales Manager"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "sales-manager")%></option>
											<option value="Marketing Manager"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "marketing-manager")%></option>
											<option value="Consultant"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "consultant")%></option>
											<option value="Reseller"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "reseller")%></option>
											<option value="Recruiter"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "recruiter")%></option>
											<option value="Developer"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "developer")%></option>
											<option value="Other"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "other")%></option>
								  </select>
</div>
<div class="col-sm-3 m-b-xs">
	<select class="form-control required"  name="company_type" required  data-width="100%" oninvalid="_agile_set_custom_validate(this);" oninput="_agile_reset_custom_validate(this);">
											<option value="" selected disabled><%=LanguageUtil.getLocaleJSONValue(localeJSON, "select-type")%></option>
											<option value="B2B"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "b2b")%></option>
											<option value="SaaS"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "saas")%></option>
											<option value="Ecommerce"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "ecommerce")%></option>
											<option value="Marketing Agency"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "marketing-agency")%></option>
											<option value="Contact Centers"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "contact-centers")%></option>
											<option value="Realty"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "realty")%></option>
											<option value="Media"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "media")%></option>
											<option value="Technology Consulting"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "tech-consulting")%></option>
											<option value="Other"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "other")%></option>
								  </select>
</div>
<div class="form-group m-b">
<div class="col-sm-offset-3 col-sm-9 text-base" style="padding-left:24px;"> <%=LanguageUtil.getLocaleJSONValue(localeJSON, "role-helptext")%> </div>
</div>
</div>

<div class="form-group">
<label class="col-sm-3 control-label"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "phone-number")%></label>
<div class="col-sm-6">
<input
											class="field form-control required tel-number"
											id="login_phone_number" name='phone' required type="password"
											placeholder='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "phone-number")%>' autocapitalize="off" autocomplete="tel">
											<input type="text" name="phone_duplicate" class="hide">
											<div class='custom-error'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "pnone-num-validation")%></div>
</div>
</div>

<input type='hidden' id="login_email" name='email' value="<%=email%>"></input>
<input type='hidden' id="user_name" name='name' value="<%=name%>"></input>
<input type='hidden' name='account_timezone' id='account_timezone' value=''></input>
<input type="password" class="hide" name='password' id="password" value="<%=password%>"></input>

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

<input type='hidden' name='type' value='agile'></input>
<div class="line line-lg b-b" style="margin-top:25px;"></div>

<div class="row">
                    <div class="col-sm-offset-3 col-sm-8">                      
                       <input type='submit' id="confirm_registration" value='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "get-started")%>' 
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
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/9.2.4/js/intlTelInput.min.js"></script>
<script src="/flatfull/registration/register.js?_v=<%=_AGILE_VERSION%>"   type="text/javascript"></script>
<!--[if lt IE 10]>
<script src="flatfull/lib/ie/placeholders.jquery.min.js"></script>
<![endif]-->

<script type="text/javascript">
var version = <%="\"" + VersioningUtil.getAppVersion(request) + "\""%>;
  var applicationId = <%="\"" + SystemProperty.applicationId.get() + "\""%>;
	$("#password").value = "<%=request.getParameter("password")%>"
// Plan type
var selected_plan_type = '<%=request.getParameter("plan_type")%>';
</script>

<script>
var localeJSON = <%=localeJSON%>;
$(document).ready(function(){

	// Set domain name error title
	$("#subdomain").attr("data-title", localeJSON["domain-name-validation"]);
	// Set selected plan name
	 if(selected_plan_type && selected_plan_type !== "null" && selected_plan_type !== "undefined")
	 {
        $("select[name='plan_type']").val(selected_plan_type);
	}

	// Pre load dashlet files when don is active
	$('#account_timezone').val(jstz.determine().name());
	$("#login_phone_number").attr("type", "text");
	
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
	  initialCountry: "auto",
	  autoHideDialCode:false,
	  nationalMode:false,
	  geoIpLookup: function(callback) {
	    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
	      var countryCode = (resp && resp.country) ? resp.country : "";
	      callback(countryCode);
	    });
	  },
	  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/9.2.4/js/utils.js" // just for formatting/placeholders etc
	});

	$("#subdomain").on("blur",function(e){
		if(agile_is_mobile_browser())
			return;
		if (!this.checkValidity()) {
			$("#domain-validation-icon", form).removeClass("icon-check").addClass("icon-close");
            return;
        }
        var form = $(this).closest("form");
   		var email = $("#login_email", form).val();
   		var domain = $(this).val();
   		if(!email)
   			return;
   		isDuplicateAccount("/backend/register-check?email="+email+"&domain="+domain, form, function(data){
   			$("#domain-validation-icon", form).removeClass("icon-close").addClass("icon-check");
   		},function(data){
   			$("#domain-validation-icon", form).removeClass("icon-check").addClass("icon-close");
   		})
	});
	
});

function preload_dashlet_libs(){ 
	
	setTimeout(function(){head.load('<%=CLOUDFRONT_STATIC_FILES_PATH %>final-lib/min/lib-all-min-1.js?_=<%=_AGILE_VERSION%>', 
									'<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min-1.js?_=<%=_AGILE_VERSION%>', 
									'<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min-2.js?_=<%=_AGILE_VERSION%>', 
									'<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min-3.js?_=<%=_AGILE_VERSION%>', 
									'<%=CLOUDFRONT_TEMPLATE_LIB_PATH %>jscore/min/flatfull/js-all-min-4.js?_=<%=_AGILE_VERSION%>', 
									'<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>tpl/min/precompiled/<%=FLAT_FULL_PATH%>tpl.js?_=<%=_AGILE_VERSION%>', 
									'<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>tpl/min/precompiled/<%=FLAT_FULL_PATH%>portlets.js?_=<%=_AGILE_VERSION%>')
						}, 5000);
}

</script>

<!-- Preload JS files in separate iframe. Will throw errors. -->
<iframe height="0" width="0" style="display:none; border: 0px;" src="preloadJSFiles.htm"></iframe>

</body>
