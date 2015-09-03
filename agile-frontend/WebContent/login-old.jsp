<%@page import="java.util.TimeZone"%>
<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%
/*
we use setAttribute() to store the username and to autofill if he want to resubmit the form after correcting the error occurred. 
*/

// Gets User Name
String email = request.getParameter("email");

if (email != null)
{    
email = email.toLowerCase();

request.setAttribute("agile_email", email);

}
	
// Checks if it is being access directly and not through servlet
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

// Users can show their logo on login page. 
AccountPrefs accountPrefs = AccountPrefsUtil.getAccountPrefs();
String logo_url = accountPrefs.logo;

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
		padding-top: 20px;
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

<script>
var isIE = (window.navigator.userAgent.indexOf("MSIE") != -1); 
var isIENew = (window.navigator.userAgent.indexOf("rv:11") != -1);  
if(isIE || isIENew) 
	window.location = '/error/ie-upgrade.jsp';
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
							<a class="close" data-dismiss="alert" href="#">&times</a><%=error%> 
						</div>
						<%}%>
							
						<h3><small>Login using existing accounts</small></h3>
					  <div  style="padding-top:10px;">
						<input type='hidden' name='type' value='oauth'></input>
						<input type='hidden' name='server' id='oauth-name' value=''></input>
						<a title="log in with Google" data='google' href='#' style="background: #FFF url(img/signin/openid-logos.png); background-position: -1px -1px" class="google openid_large_btn"></a>
						<a title="log in with Yahoo" data='yahoo' href="#"	style="background: #FFF url(img/signin/openid-logos.png); background-position: -1px -63px" class="yahoo openid_large_btn"></a>
					  </div>
					</div>
					<br/>
				</form>
				<div class="clearfix"></div>

				<form name='agile' id="agile" method='post' style="margin:0px;padding-top:5px;" onsubmit="return isValid();">
					
					<h3><small>Sign in using your registered account</small></h3>
					
					<div id="openid_btns" style="padding: 5px 0 15px;">
						<input type='hidden' name='type' value='agile'></input>
						<input type='hidden' name='account_timezone' id='account_timezone' value=''></input>
						<input class="input-xlarge required email field" name='email' type="text" maxlength="50" minlength="6" placeholder="User ID (Your Email Address)" autocapitalize="off" autofocus
						<%if(request.getAttribute("agile_email")  != null) {%> value="<%=request.getAttribute("agile_email") %>" <%}%>>
						
					    <input class="input-xlarge required field " maxlength="20" minlength="4" name='password' type="password" placeholder="Password" autocapitalize="off">
						<div style="margin-top: 15px;">
							<input type='submit' style="float: right;height:39px" value="Sign In" class='btn btn-large btn-primary agile_btn'>
							<label class="checkbox" style="display:none;">
							    <input type="checkbox" checked="checked" name="signin">Keep me signed in 
							</label> 
						</div>
					</div>
					<br/>
				</form>

				<div class="clearfix"></div>

			</div>
		</div>
		<div style="text-align: center; line-height: 19px;">
			Don't have an account? <a href="/register">Sign Up</a><br/>
			Forgot <a href="/forgot-password">Password? </a><a href="/forgot-domain">Domain?</a>
		</div>
	</div>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js" type="text/javascript"></script>
	<script type="text/javascript">
		$(document).ready(function()
		{
			$('#account_timezone').val(jstz.determine().name());
			console.log("starting of login");
			$('.openid_large_btn').click(function(e)
			{
				console.log("ready to oauth form");
				
				// Gets Data Google/Yahoo and submits to LoginServlet
				var data = $(this).attr('data');
				$('#oauth-name').val(data);
				$('#oauth').submit();

				e.preventDefault();
			});
			
			// Submits the Agile form to LoginServlet
			$("#agile").validate({
				 submitHandler: function(form) {
					   form.submit();
					 }
					});

		});
		
		// Validates the form fields
		function isValid()
		{
			$("#agile").validate();
			return $("#agile").valid();
		}
	
	</script>
	<!-- Clicky code -->
 	<script src="//static.getclicky.com/js" type="text/javascript"></script>
	<script type="text/javascript">try{ clicky.init(100729733); }catch(e){}</script>
	
	<!-- Google analytics code -->
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	  ga('create', 'UA-44894190-1', 'auto');
	  ga('send', 'pageview');
	
	</script>
	
</body>
</html>
