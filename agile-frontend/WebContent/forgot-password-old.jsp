<%@page import="com.agilecrm.util.email.SendMail"%>
<%@page import="com.agilecrm.util.email.AppengineMail"%>
<%@page import="com.agilecrm.util.EncryptDecryptUtil"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%
/*
It checks first if user exists then a mail is sent to that id along with newly generated password 
and success message is shown. Else error is shown in the same page.
*/
String error = "", success = "";
System.out.println(success);
//If Email is present
String email = request.getParameter("email");
String password = request.getParameter("password");
DomainUser domainUser = null;

if (!StringUtils.isEmpty(password)) {
	domainUser = DomainUserUtil.getDomainUserFromEmail(email);

	domainUser.password = EncryptDecryptUtil.decrypt(password);

	AppengineMail.sendMail(email, SendMail.FORGOT_PASSWORD_SUBJECT,
			SendMail.FORGOT_PASSWORD, domainUser);
	
	success = "We have sent you an email";
}
else if(!StringUtils.isEmpty(email) && StringUtils.isEmpty(password))
{
    
    email = email.toLowerCase();
    
    try
    {
		domainUser = DomainUserUtil.generateForgotPassword(email);
		if(domainUser == null)
		{
		    error = "We are not able to find any user";
		}
		else
		{
		   success = "We have sent you an email";
		}
    }
    catch (Exception e)
    {	
		error = "You have signed-up using your Google/Yahoo account. Please sign-in through the same account";
    }
    
	
	System.out.println(error + " " + success);
}

%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>
<title>Forgot Password</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le styles -->

<link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" rel="stylesheet" href="/css/openid-min.css">
<link type="text/css" rel="stylesheet" href="/css/signin.css">

<style>
@media (min-width: 900px) {
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

</style>


 <!-- JQUery Core and UI CDN -->
<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;
</script>

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>

<body>

	<div class='navbar navbar-fixed-top'> 
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
	</div>
	<div class="row login-page">

		<div class='account-container'>
			<div class="content clearfix">
								
				<div class="clearfix"></div>
				<h1>Forgot Password</h1>
				
				<form name='forgot_password' id="forgot_password" method='post' onsubmit="return isValid();" style="padding:10px 0 15px;border-top: 1px dotted #CCC;"> 
				
				 <% if(!StringUtils.isEmpty(error)){%>
				 <div class="alert alert-error login-error">
					<a class="close" data-dismiss="alert" href="#">&times</a><%=error%> 
				</div>
				<%}%>
				
				 <% if(!StringUtils.isEmpty(success)){%>
				<div class="alert alert-success login-success">
					<a class="close" data-dismiss="alert" href="#">&times</a><%=success%> 
				</div>
				 <%}%>
				
				
				 <h3><small>Enter Your Email </small></h3>	
				<div id="openid_btns" style="float: left;padding:5px 0 15px;">
					
                    <input class="input-xlarge field required email" name='email' maxlength="50" minlength="6" type="text" placeholder="Email" autocapitalize="off">
					<div style="margin-top:15px;">
					  <input type='submit' style="float:right;height:39px;" value="Submit" class='btn btn-large btn-primary forgot_password_btn'>
					  	<%
				    if (domainUser != null) {
				%>
				<a href="#" id="resend-password">Resend password</a>
				<%
				    }
				%>
				  </div>
				</div>
				</form>
				
				<div class="clearfix"></div>
				
				</div>
								<form name='resend_password_form' id="resend_password_form"
				class="hide" method='post'">

				<%
				    if (domainUser != null) {
				%>
				<input name="email" value="<%=domainUser.email%>" /> 
				<input name="password" value="<%=EncryptDecryptUtil.encrypt(domainUser.password)%>" />
				<%
				    }
				%>

			</form>
			</div>
			<div style="text-align: center;line-height: 19px;">
	                 Already have an account? <a href="/login">Login</a><br/>
	                 Forgot <a href="/forgot-domain">Domain?</a>
               </div>
		</div>
		
		<script type="text/javascript">
		$(document).ready(function() {			
		  
		  //form is self submitted
          $("#forgot_password").validate({
				 submitHandler: function(form) {
					   form.submit();
					 }
					});
		  
  		$("#resend-password").live('click', function(e) {
			e.preventDefault();
			$("#resend_password_form").submit();
		});
			
		});
		
		//validates the form fields
		function isValid(){
		    $("#forgot_password").validate();
		    return $("#forgot_password").valid();
		    }
		</script>
</body>
</html>