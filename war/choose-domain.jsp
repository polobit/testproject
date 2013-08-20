<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%
/*
It checks if any user exists in that domain,
if user exists,it is redirected to login page in the same domain otherwise it is redirected to register page.
*/
String error = "";
String success = "";
//If Email is present

String domain = request.getParameter("subdomain");
if(!StringUtils.isEmpty(domain))
{
    System.out.println(DomainUserUtil.count());
	if(DomainUserUtil.count(domain.toLowerCase()) == 0)
	{
	    success = "Creating " + domain;
		response.sendRedirect("https://" + domain + ".agilecrm.com/register");
		return;
	}
	else
	{
	    error = "Domain '"+ domain +"' already exists. If you already have an account, you can login <a href='https://" + domain + ".agilecrm.com/login" + "'>here</a>.";
	}
}

%>

<!DOCTYPE html>
<html lang="en">
<head>
<head>
<meta charset="utf-8">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>
<title>Choose Your Domain</title>
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
.field{
height:30px!important;
margin:8px 0px!important;
padding-left:10px!important;
}
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

<div class='navbar navbar-fixed-top'> 
   	<div class='navbar-inner'> 
   		<div class='container'> 
   			<a class='brand' href='http://www.agilecrm.com'>Agile CRM</a>
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

<div class="row">

	<div class="account-container">
		<div class="content clearfix">
				 <h1>Register - Step 1 of 2</h1>
				 <form name='choose_domain' id="choose_domain" method='post' onsubmit="return validateAndSubmit();" style="padding:10px 0 15px;border-top: 1px dotted #CCC;">
						<div id="domain-error"></div>
						<% if(!StringUtils.isEmpty(error)){%>
					 <div class="alert alert-error login-error">
						<a class="close" data-dismiss="alert" href="#">×</a><%=error%> 
					</div>
					<%}%>
					
					 <% if(!StringUtils.isEmpty(success)){%>
					<div class="alert alert-success login-success">
						<a class="close" data-dismiss="alert" href="#">×</a><%=success%> 
					</div>
					 <%}%>
					 <h3><small>Choose your domain at Agile CRM</small></h3>
					 <div style="padding-top:10px;">
          				<input id='subdomain' type="text" placeholder="Type Your Domain"
						   	   name="subdomain" class="input-medium field required" autocapitalize="off"><b> .agilecrm.com</b>
				   </div>
				</form>
				  <div><input class="btn btn-large btn-primary" type="submit" value="Next"></div>
				
				
					<div class="clearfix"></div>
		
		</div>
	</div>
	<div style="text-align: center; line-height: 19px;">
	   Already Signed Up? <a href="/enter-domain?to=login">Login</a><br/>
	   Forgot <a href="/enter-domain?to=forgot-password">Password?</a> <a href="/forgot-domain">Domain?</a>
	</div>
</div>


	<!-- Le javascript
    ================================================== -->
     <!-- JQUery Core and UI CDN -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
	<script type="text/javascript" src="/lib/bootstrap.min.js"></script>
	<script>
		//Init
		var error = "";
		$(function() {
			$("#subdomain").focus();
			$(".btn").click(function(e) {
				$("#choose_domain").submit();
			})
			
		});
		
		/* Validate 'domain' on submit */
		function validateAndSubmit() {
			var subdomain = $("#subdomain").val();
			// validates the domain value
			if(subdomain == null || subdomain == "" || subdomain.length < 4 || subdomain.length > 12 
		        || !isAlphaNumeric(subdomain) || !isNotValid(subdomain))
			{
				//shows error message
				if(!error)error = "Domain should be 4 to 12 characters."
				$("#domain-error").html('<div class="alert alert-error domain-error">'
						+ '<a class="close" data-dismiss="alert" href="#">×</a>'+ error +'</div>');
				error = "";
				return false;
			}
			
			$(".domain-error").hide();
			return true;
			console.log("submited");
			//Form is self submitted
		}
		
		function isNotValid(subdomain) {
			subdomain = subdomain.toString();
			var sub_domain = ["my", "agile", "googleapps", "sales", "support", "login", "register", "google", "yahoo", "twitter", "facebook", "aol", "hotmail"];
			for(var key in sub_domain){
				if(sub_domain[key] == subdomain.toLowerCase()){
					error = "Common domain cannot be created.";
					return false;
				} 
			}
			return true;
        }

		function isAlphaNumeric(subdomain) {
			subdomain = subdomain.toString();
		  
		  var regularExpression  = new RegExp(/^[A-Za-z][a-zA-Z0-9]{3,12}$/);
		  if(!regularExpression.test(subdomain)) {
		        error = "Domain should start with an alphabet and special characters are not allowed.";
				return false;
		    }
		  return true;
		}
	</script>

</body>
</html>