<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%
//Check if it is being access directly and not through servlet
if(request.getAttribute("javax.servlet.forward.request_uri") == null)
{
    response.sendRedirect("/login");
    return;
}

String error = request.getParameter("error");
if(error != null)
    System.out.println(error);
else
    error = "";

AccountPrefs accountPrefs = AccountPrefs.getAccountPrefs();
String logo_url = accountPrefs.logo;


//Saving cookie
String cookieName = "email";
Cookie cookies [] = request.getCookies ();
Cookie emailCookie = null;
if (cookies != null)
{
    for (int i = 0; i < cookies.length; i++) 
    {
		if (cookies [i].getName().equals (cookieName))
		{
		    emailCookie = cookies[i];
			break;
		}
	}
}

%>
<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="utf-8">
<meta name="globalsign-domain-verification"
	content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<title>Login</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le styles -->

<link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" rel="stylesheet" href="/css/openid-min.css">
<link type="text/css" rel="stylesheet" href="/css/signin.css">


<style>
@media ( min-width : 900px) {
	body {
		padding-top: 30px;
	}
	.navbar-search {
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
<script type='text/javascript'
	src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
	<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<script type="text/javascript">
	jQuery.validator.setDefaults({
		debug : true,
		success : "valid"
	});
	;
</script>
<%
    String ua = request.getHeader("User-Agent");
			boolean isMSIE = (ua != null && ua.indexOf("MSIE") != -1);
%>

<%
    if (isMSIE) {
				response.sendRedirect("/error/ie-upgrade.jsp");
			}
%>
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
						<li class=""><a href="http://www.agilecrm.com" class="">
								<i class="icon-chevron-left"></i> Back to home-page </a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="row login-page">

		<div class="account-container">
			<div class="content clearfix">
			
				<form id='oauth' name='oauth' method='post'>
                   <div><h1>Sign In
                   
                   <% if(!StringUtils.isEmpty(logo_url) && !StringUtils.equalsIgnoreCase("yourlogourl", logo_url))
                       {
                       %>
                   <img class="company_logo" src="<%=logo_url%>" style="float:right;width:50px;height:40px;" ></img>
                   <%
                   }
                   %>
                   
                   </h1></div>
						
					<div id="openid_btns" style="float: left; padding: 5px 0 15px; border-top: 1px dotted #CCC; border-bottom: 1px dotted #CCC; border-right: none; border-left: none;">
					   <% if(!StringUtils.isEmpty(error)){%>
				        <div class="alert alert-error login-error">
							<a class="close" data-dismiss="alert" href="#">�</a><%=error%> 
						</div>
						<%}%>
							
						<h3><small>Login or register using existing accounts</small></h3>
					  <div  style="padding-top:10px;">
						<input type='hidden' name='auth' value='auth'></input>
						<input type='hidden' name='type' value='oauth'></input>
						<input type='hidden' name='server' id='oauth-name' value=''></input>
						<a title="log in with Google" data='google' href='#' style="background: #FFF url(img/signin/openid-logos.png); background-position: -1px -1px" class="google openid_large_btn"></a>
						<a title="log in with Yahoo" data='yahoo' href="#"	style="background: #FFF url(img/signin/openid-logos.png); background-position: -1px -63px" class="yahoo openid_large_btn"></a>
					  </div>
					</div>
					<br />
				</form>
				<div class="clearfix"></div>

				<form name='agile' id="agile" method='post' style="padding-top:5px;" onsubmit="return isValid();">
					
					<h3><small>Sign in using your registered account:</small></h3>
					
					<div id="openid_btns" style="float: left; padding: 5px 0 15px;">
                        <input type='hidden' name='auth' value='auth'></input>
						<input type='hidden' name='type' value='agile'></input>
						<input class="input-xlarge required email field" name='email' type="text" placeholder="User Name"
						<%if (emailCookie != null) {%> value="<%=emailCookie.getValue()%>" <%}%>
						>
					    <input class="input-xlarge required field " maxlength="10" minlength="4" name='password' type="password" placeholder="Password">
						<div style="margin-top: 15px;">
							<label class="checkbox" style="display: inline-block;">
							    <input type="checkbox" name="signin">Keep me signed in 
							</label> 

							<input type='submit' style="float: right;height:39px" value="Sign In" class='btn btn-large btn-primary agile_btn'>

						</div>
					</div>
					<br />
				</form>

				<div class="clearfix"></div>

			</div>
		</div>
		<div style="text-align: center; line-height: 19px;">
			Don't have an account? <a href="/register">Sign Up</a><br>
			Forgot <a href="forgot-password.jsp">Password </a><a href="forgot-domain.jsp">Domain</a>
		</div>
	</div>

	<script type="text/javascript">
		$(document).ready(function()
		{
			console.log("starting of login");
			$('.openid_large_btn').click(function(e)
			{
				console.log("ready to oauth form");
				// Get Data
				var data = $(this).attr('data');
				$('#oauth-name').val(data);
				$('#oauth').submit();

				e.preventDefault();
			});

			$('.agile_btn').click(function(e)
			{
				console.log("ready to agile form");
				$('#agile').submit();
				e.preventDefault();
			});

		});
		
		function isValid()
		{
			$("#agile").validate();
			return $("#agile").valid();
		}
	
	</script>
</body>
</html>