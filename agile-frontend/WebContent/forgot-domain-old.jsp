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
				<h1>Forgot Domain</h1>
				
				<form name='forgot_domain' id="forgot_domain" method='post' onsubmit="return isValid();" style="padding:10px 0 15px;border-top: 1px dotted #CCC;"> 
				
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
					  <input type='submit' style="float:right;height:39px;" value="Submit" class='btn btn-large btn-primary forgot_domain_btn'>
				  </div>
				</div>
				</form>
				
				<div class="clearfix"></div>
				
				</div>
					
			</div>
			<div style="text-align: center;line-height: 19px;">
	                 Do not have an account? <a href="/register">Register</a><br/>
	                 Forgot <a href="/enter-domain?to=forgot-password">Password?</a>
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