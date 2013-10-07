<%@page import="org.apache.commons.lang.StringUtils"%>
<%
//Check if it is being access directly and not through servlet
if(request.getAttribute("javax.servlet.forward.request_uri") == null)
{
    response.sendRedirect("/register");
    return;
}

String error = request.getParameter("error");
if(error != null)
    System.out.println(error);
else
    error = "";

%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>
<title>Register</title>
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
	padding-top: 20px;
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

.login-page .openid_large_btn:hover {
margin: 4px 0px 0px 4px;
border: 2px solid #999;
box-shadow: none;
-moz-box-shadow: none;
-webkit-box-shadow: none;
}

/* To move validation slides */
#agile label
{
margin-bottom:0px;
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
<%
String ua = request.getHeader( "User-Agent" );
boolean isMSIE = ( ua != null && ua.indexOf( "MSIE" ) != -1 );
%>

<% if( isMSIE ){ 
	response.sendRedirect("/error/ie-upgrade.jsp");
} %>
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
				<form id='oauth' name='oauth' method='post'> 
				 <h1 style="font-size:29px;">Create your First User</h1>
				 <h3><small></small></h3>
				<div id="openid_btns" style="float: left;padding:5px 0 15px;border-top: 1px dotted #CCC;border-bottom: 1px dotted #CCC;border-right: none;border-left: none;">
				        <h3><small>Sign up with one Click</small></h3>
				         <% if(!StringUtils.isEmpty(error)){%>
				        <div class="alert alert-error login-error">
							<a class="close" data-dismiss="alert" href="#">�</a><%=error%> 
						</div>
						<%}%>
						
				  <div style="padding-top:10px;">
					<input type='hidden' name='type' value='oauth'></input>
					<input type='hidden' name='server' id='oauth-name' value=''></input>
					<a title="log in with Google" data='google' href='#' style="background: #FFF url(img/signin/openid-logos-register.png); background-position: -1px -1px" class="google openid_large_btn"></a>
					<a title="log in with Yahoo" data='yahoo' href="#"	style="background: #FFF url(img/signin/openid-logos-register.png); background-position: -1px -63px" class="yahoo openid_large_btn"></a>
				  </div>
				</div>
				
				</form>
				
				<div class="clearfix"></div>
				
				<form name='agile' id="agile" method='post' onsubmit="return isValid();" style="margin:0px;padding-top:10px;"> 
				 <h3><small>Or Fill out the form below</small></h3>	
				<div id="openid_btns" style="padding:5px 0 15px;">
					<input type='hidden' name='type' value='agile'></input>
					
					<input class="input-xlarge field required" name='name' type="text" maxlength="50" minlength="3" placeholder="Full Name" autocapitalize="off">
                    <input class="input-xlarge field required email" name='email' type="text" maxlength="50" minlength="6" placeholder="Email Address (User ID)" autocapitalize="off">
                    <input class="input-xlarge field required" maxlength="20" minlength="4" name='password' type="password" placeholder="Password" autocapitalize="off">
					<div style="margin-top:7px;">
					  <label class="checkbox" style="display:inline-block;">I agree with the <a href="https://www.agilecrm.com/terms.html" target="_blank">Terms and conditions</a><input type="checkbox" checked="checked" name="agree" class="required"></label>
					  <input type='submit' style="float:right;margin-top:7px;" value="Create my account >>" class='btn btn-large btn-primary'>
				  </div>
				</div>
				</form>
				
				<div class="clearfix"></div>
				
				</div>
					
			</div>
			<div style="text-align: center;line-height: 19px;">
	                 Already have an account? <a href="/enter-domain?to=login">Login</a><br/>
	                 Forgot <a href="/enter-domain?to=forgot-password">Password?</a> <a href="/forgot-domain">Domain?</a>
            </div>
		</div>
		
		<script type="text/javascript">
		$(document).ready(function() {			
			
         
			$('.openid_large_btn').click(function(e)
			{
				// Get Data Google/Yahoo and submits to to LoginServlet
				var data = $(this).attr('data');
				$('#oauth-name').val(data);
				
				$('#oauth').submit();
				
				e.preventDefault();
				
			});
			
<%-- 			$(".to").click(function(e) {
				e.preventDefault();
				var data = $(this).closest("a").attr('to');
				    <% String redirect;%>
				if(data == "login")
					<% redirect = "login";%>
				else
					<% redirect = "forgot-password";%>
				<%
				request.setAttribute("to", redirect);
				response.sendRedirect("/enter-domain");
				%>
				
			}); --%>
             
			// Submits the Agile form to to RegisterServlet
			$("#agile").validate({
				 submitHandler: function(form) {
					   form.submit();
					 }
			});
			
		});
		
		//validates the form fields
		function isValid(){
		    $("#agile").validate();
		    return $("#agile").valid();
		    }
		</script>
</body>
</html>