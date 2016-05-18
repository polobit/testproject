<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page contentType="text/html; charset=UTF-8" %>
<%
    //Check if it is being access directly and not through servlet
	if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
		response.sendRedirect("/helpcenter/register");
		return;
	}

	String error = request.getParameter("error");
	if (error != null)
		System.out.println(error);
	else
		error = "";
	
	//flatfull path
	String flatfull_path="/flatfull";			
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


<!-- Le styles -->

<!-- <link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet"> -->


<link rel="stylesheet" type="text/css" href="/css/bootstrap.v3.min.css" />

<!-- <link type="text/css" rel="stylesheet" href="/css/agilecrm.css"/> -->

<link type="text/css" rel="stylesheet" href="/css/openid-min.css" />
<link type="text/css" rel="stylesheet" href="/css/signin.css" />
<link type="text/css" rel="stylesheet" href="/css/phonenumber-lib/intlTelInput.css" />
<link type="text/css" rel="stylesheet" href="/flatfull/css/register.css" />
<link type="text/css" rel="stylesheet" href="/css/signup/bootstrap-select.min.css" />


<style>

	body {
		padding-top: 20px;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	.navbar-search {
		padding-left: 10%
	}


label {
	display: block !important;
}

.error {
	color: #ff604f;
	font-weight: normal;
}

.close {
	color: #000 !important;
	text-decoration: none !important;
}

.login-page .openid_large_btn:hover {
	margin: 4px 0px 0px 4px;
	border: 2px solid #999;
	box-shadow: none;
	-moz-box-shadow: none;
	-webkit-box-shadow: none;
}

/* To move validation slides */
#agile label {
	margin-bottom: 0px;
}

::-moz-placeholder {
	color: #999;
	opacity: 0.5;
}

::-webkit-input-placeholder {
	color: #999;
	opacity: 0.5;
}
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

.regpage-container {
    margin: 80px auto 20px;
}

</style>


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
	
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;

//override jquery validate plugin defaults
$.validator.setDefaults({
    highlight: function(element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});
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

<body class="logpages reg-page-bg">
	<% if(!StringUtils.isEmpty(error)){%>
		<div id="error-area" class="error-top-view" style="display: block;">
			<%=error%>
		</div>
	<%}%>
	<div class="row login-page">
		<div class='regpage-container'>
			<div class="regpage-content clearfix carousel slide">
				<div class="clearfix"></div>
				<form name='agile' id="agile" method='post'
					onsubmit="return isValid();">
					<div align="center">
						<h1 class="regpage-logHead">
							<img src="/img/signin/cloud-logo.png"> Register your free account
						</h1>
					</div>
					<fieldset id="agile-fieldset1">
						<!--  <h3 class="log-subhead"><small>Or Fill out the form below</small></h3>	 -->
						<div id="openid_btns" class="regpage-fieldview">
							<input type="hidden" name="command" value="register"/>
							<div class="form-group">
								<span class="regpage-mail"></span> <input
									class="input-xlarge field required form-control"
									id="login_name" name="name" type="text" maxlength="50"
									minlength="6" value="<%=email%>" placeholder="Name"
									autocapitalize="off">
							</div>
							<div class="form-group login-email">
								<span class="regpage-mail"></span> <input
									class="input-xlarge field required email form-control"
									id="login_email" name='email' type="text" maxlength="50"
									minlength="6" value="<%=email%>" placeholder="Email Address (User ID)"
									autocapitalize="off">
							</div>
							<div class="form-group ">
								<span class="regpage-password"></span> <input
									class="input-xlarge field required form-control"
									maxlength="20" minlength="4" name='password' type="password"
									placeholder="Password" autocapitalize="off">
							</div>
							<div align="center" class="regpage-signup">
								<input type='submit' id="register_account" value="Sign up"
									class='btn btn-large btn-primary  regpage-btn'>
							</div>

							<div class="form-group regpage-options log-terms"
								style="margin-bottom: 0px;">
								By clicking sign up, I agree to AgileCRM <a
									href="https://www.agilecrm.com/terms.html" target="_blank"
									class="log-text-underline">Terms of service</a>
							</div>
						</div>
					</fieldset>
				</form>
				<div class="clearfix"></div>
			</div>
		</div>
	</div>

<script src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js" type="text/javascript"></script>
	<script type="text/javascript">
		
		function isNotValid(subdomain) {
			subdomain = subdomain.toString();
			var sub_domain = ["my", "agile", "googleapps", "sales", "support", "login", "register", "google", "yahoo", "twitter", "facebook", "aol", "hotmail"];
			for(var key in sub_domain){
				if(sub_domain[key] == subdomain.toLowerCase()){
					return false;
				} 
			}
			return true;
        }

		function isAlphaNumeric(subdomain) {
			subdomain = subdomain.toString();
		  
		  var regularExpression  = new RegExp(/^[A-Za-z][a-zA-Z0-9]{3,20}$/);
		  return regularExpression.test(subdomain);
		}
		
		
		//validates the form fields
		function isValid(){
			
			// Return if action is already in process 
			if($("#register_account").attr("disabled") || $("#register_domain").attr("disabled"))
				return;
			 $(".regpage-container").removeClass('regpage-container-fixed-height');
			 
		    $("#agile").validate();
		  //  $("#choose_domain").validate();
		    return  $("#agile").valid();
		}
		
		function submitForm(form)
		{
			// Read domain
			var domain = $("#subdomain").val();
			
			$("#confirm_registration").attr("disabled", "disabled");
			
			$("#confirm_registration").attr("disabled", "disabled");
			
			// Form data is posted to its subdomain 
			$(form).attr('action', "https://" + domain + ".agilecrm.com/register");
			
			//  $(form).attr('action', "http://localhost:8888/register");

			$(form).attr('action', getRegisterURL(domain));
			form.submit();
		}
	</script>
	<!-- Clicky code -->
	<script src="//static.getclicky.com/js" type="text/javascript"></script>
	<script type="text/javascript">try{ clicky.init(100729733); }catch(e){}</script>
</body>
</html>