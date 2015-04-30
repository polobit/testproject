<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%
/*
It checks first if user exists then if user exists,
he is redirected to his own domain else error is shown in the same page.
*/

String error = "", success = "";
//If Email is present
String email = request.getParameter("email");
if(!StringUtils.isEmpty(email))
{
    
    email = email.toLowerCase();
    
	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
	if(domainUser == null)
	{
	    error = "We are not able to find any user";
	}
	else
	{
	   success = "Redirecting to " + domainUser.domain;
	   response.sendRedirect("https://" + domainUser.domain + ".agilecrm.com");
	}
	
	System.out.println(error + " " + success);
}

%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>
<title>Forgot Domain</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le styles -->

<!-- <link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" rel="stylesheet" href="/css/openid-min.css">
<link type="text/css" rel="stylesheet" href="/css/signin.css"> -->

<link rel="stylesheet" type="text/css" href="/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/css/font.css" />
<link rel="stylesheet" type="text/css" href="/css/app.css" />

<!-- <style>
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

</style> -->

 <!-- JQUery Core and UI CDN -->
<!-- <script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<script type="text/javascript" src="/lib/jquery.validate.min.js"></script> -->

<script type='text/javascript' src='/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.v3.min.js"></script>

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
    			<a class='brand' href='#dashboard'>Agile CRM</a>
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
			
				<a href="https://www.agilecrm.com/" class="navbar-brand block m-t" style="color: #363f44;">
						<img src="img/signin/cloud-logo.png" style="padding-right:10px;">Agile CRM
					</a>				
				
			<!-- 	<h1>Forgot Domain</h1> -->
				
				<form name='forgot_domain' id="forgot_domain" method='post' onsubmit="return isValid();"> 
				
				 <% if(!StringUtils.isEmpty(error)){%>
				 <div class="alert alert-danger login-error m-b-none">
					<a class="close" data-dismiss="alert" href="#">&times</a><%=error%> 
				</div>
				<%}%>
				
				 <% if(!StringUtils.isEmpty(success)){%>
				<div class="alert alert-success login-success m-b-none">
					<a class="close" data-dismiss="alert" href="#">&times</a><%=success%> 
				</div>
				 <%}%>
				
				<div class="wrapper text-center">
      				<strong>Enter Your Email</strong>
   				</div>
				
				<div class="list-group list-group-sm">
					<div class="list-group-item">
						<input class="input-xlarge field required email form-control no-border" name='email' maxlength="50" minlength="6" type="email" required placeholder="Email" autocapitalize="off">
					</div>
				</div>
					  <input type='submit' value="Submit" class='btn btn-lg btn-primary btn-block forgot_domain_btn'>
				 
				</form>
				
				
				
				
					
			
			<div class="text-center m-t m-b">
	                <small> Do not have an account? </small><a href="/register">Register</a><br/>
	                 <small>Forgot </small><a href="/enter-domain?to=forgot-password">Password?</a>
               </div>
		</div>
		</div>
		</div>
		<script type="text/javascript">
		$(document).ready(function() {			
			
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