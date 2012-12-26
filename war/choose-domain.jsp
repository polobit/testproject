<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%
/*
It checks if any user exists in that domain,
if user exists,it is redirected to login page in the same domain otherwise it is redirected to register page.
*/
String error = "", success = "";
//If Email is present
String domain = request.getParameter("subdomain");

if(!StringUtils.isEmpty(domain))
{
    System.out.println(DomainUser.count());
	if(DomainUser.count() == 0)
	{
	    success = "Creating " + domain;
		response.sendRedirect("https://" + domain + ".agilecrm.com/register");
		return;
	}
	else
	{
	    error = "Domain already exists.";
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
   			<a class='brand' href='#dashboard'>Agile CRM</a>
 				<div class="nav-collapse">
				<ul class="nav pull-right">
					<li class="">						
					<a href="home" class="">
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
				 <h1>Register (Step 1 of 2)</h1>
				 <form name='choose_domain' id="choose_domain" method='post' style="padding:10px 0 15px;border-top: 1px dotted #CCC;">
						<div class="alert alert-error domain-error" style="display:none;">
							<a class="close" data-dismiss="alert" href="#">×</a>Please enter a valid domain 
						</div>
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
					 <h3><small> Choose your domain at AgileCRM</small></h3>
					 <div style="padding-top:10px;">
          				<input id='subdomain' type="text" placeholder="Enter domain"
						   	   name="subdomain" class="input-medium field required" autocapitalize="off"><b> .agilecrm.com</b>
				   </div>
				</form>
				<div style="margin-left:30%"><input class="btn btn-large btn-primary" type="submit" value="Submit"></div>
				
					<div class="clearfix"></div>
		
		</div>
	</div>
	<div style="text-align: center; line-height: 19px;">
	   Already Signed Up? <a href="/login">Login</a><br/>
	   Forgot <a href="/forgot-password">Password </a><a href="/forgot-domain">Domain</a>
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
		$(function() {

			$(".btn").click(function(e) {
				
				$(".domain-error").hide();		
				var subdomain = $("#subdomain").val();
				
				// validates the domain value
				if(subdomain == null || subdomain == "" || subdomain.length < 4 || subdomain.length > 12 
			        || !isAlphaNumeric(subdomain) || !isNotValid(subdomain))
				{
					console.log("error");
					//shows error message
					$(".domain-error").show();
					return false;
				}
				console.log("submited");
				//Form is self submitted
				$('#choose_domain').submit();
				e.preventDefault();
			});

		});
		function isNotValid(subdomain) {
			subdomain = subdomain.toString();
			var sub_domain = {};
			sub_domain.my = "";
			sub_domain.googleapps = "";
			sub_domain.sales = "";
			sub_domain.support = "";
			sub_domain.login = "";
			sub_domain.register = "";
			for(var key in sub_domain){
				
				if(key == subdomain.toLowerCase()){
					alert("Common domain cannot be created");
					error = "Common domain cannot be created";
					return false;
				} 
			}
			return true;
        }

		function isAlphaNumeric(subdomain) {
			subdomain = subdomain.toString();
		  
		  var regularExpression  = new RegExp(/^[a-zA-Z0-9]{4,12}$/);
		  if(!regularExpression.test(subdomain)) {
		        alert("Domain should not contain special character");
		        error = "Domain should not contain special characters";
		        return false;
		    }
		  return true;
		}
	</script>

</body>
</html>