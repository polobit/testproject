<%@page import="java.util.TimeZone"%>
<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%
/*
we use setAttribute() to store the username and to autofill if he want to resubmit the form after correcting the error occurred. 
*/

//flatfull path
String flatfull_path="/flatfull";

// Gets User Name
String email = request.getParameter("email");

if (email != null)
{    
email = email.toLowerCase();

request.setAttribute("agile_email", email);

}
	
// Checks if it is being access directly and not through servlet
/* if(request.getAttribute("javax.servlet.forward.request_uri") == null)
{
  response.sendRedirect("/login");
  return;
} */

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

<!-- <link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" rel="stylesheet" href="/css/openid-min.css">
<link type="text/css" rel="stylesheet" href="/css/signin.css"> -->

<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/font.css" />
<link rel="stylesheet" type="text/css" href="<%=flatfull_path%>/css/app.css" />
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<style>
body {
   background-image: url('../flatfull/images/flatfull/agile-login-page.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  background-attachment: fixed;
}


.text-white
{
color:#fff!important;
}
input
{
color:#000!Important;
}
a:hover
{
text-decoration:underline;
}

.error {
	color: red !important;
}

.close {
	  color: #000 !important;
}

</style>

<!-- 
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
 -->

<!-- JQUery Core and UI CDN -->
<!-- <script type='text/javascript'
	src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
	<script type="text/javascript" src="/lib/bootstrap.min.js"></script> -->
<script type='text/javascript' src='<%=flatfull_path%>/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="<%=flatfull_path%>/lib/bootstrap.v3.min.js"></script>
<!-- <script type="text/javascript" src="/lib/jquery.validate.min.js"></script> -->
<!-- <script type="text/javascript">
	jQuery.validator.setDefaults({
		debug : true,
		success : "valid"
	});
	;
</script> -->

<script>
var isIE = (window.navigator.userAgent.indexOf("MSIE") != -1); 
var isIENew = (window.navigator.userAgent.indexOf("rv:11") != -1);  
if(isIE || isIENew) 
	window.location = '/error/not-supported.jsp';

var isSafari = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);
var isWin = (window.navigator.userAgent.indexOf("Windows") != -1);
if(isSafari && isWin) 
	window.location = '/error/not-supported.jsp';

</script>

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>

<body>
<!-- 
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
	</div> -->
	
	<div class="app app-header-fixed app-aside-fixed" id="app">

		<div ui-view="" class="fade-in-right-big smooth">
  			<div class="container w-xxl w-auto-xs">
				
					<a href="https://www.agilecrm.com/" class="navbar-brand block m-t text-white">
						<i class="fa fa-cloud m-r-xs"></i>Agile CRM
					</a>
				
				<div class="m-b-lg">
				
				<form id='oauth' name='oauth' method='post'>
              <%--      <div><h3>Sign In
                   
                   <% if(!StringUtils.isEmpty(logo_url) && !StringUtils.equalsIgnoreCase("yourlogourl", logo_url))
                       {
                       %>
                   <img class="company_logo pull-right" src="<%=logo_url%>" style="width:50px;height:40px;" ></img>
                   <%
                   }
                   %>
                   
                   </h3></div> --%>
						
					<div id="openid_btns">
					   <% if(!StringUtils.isEmpty(error)){%>
				        <div class="alert error alert-danger login-error text-center m-b-none">
							<a class="close" data-dismiss="alert" href="#" style="position:relative;top:-2px;">&times</a><%=error%> 
						</div>
						<%}%>
							
				<!-- 		<h3><small>Login using existing accounts</small></h3>
					  <div  style="padding-top:10px;">
						<input type='hidden' name='type' value='oauth'></input>
						<input type='hidden' name='server' id='oauth-name' value=''></input>
						<a title="log in with Google" data='google' href='#' style="background: #FFF url(img/signin/openid-logos.png); background-position: -1px -1px" class="google openid_large_btn"></a>
						<a title="log in with Yahoo" data='yahoo' href="#"	style="background: #FFF url(img/signin/openid-logos.png); background-position: -1px -63px" class="yahoo openid_large_btn"></a>
					  </div> -->
					</div>
					 
					<input type='hidden' name='type' value='oauth'></input>
					<input type='hidden' name='server' id='oauth-name' value=''></input>
				</form>
			<!-- 	<div class="clearfix"></div> -->
				<div class="wrapper text-center text-white">
      				<strong>Sign in using your registered account</strong>
   				</div>
				<form name='agile' id="agile" method='post' action="/login" onsubmit="return isValid();">
					
					<!-- <h3><small>Sign in using your registered account</small></h3> -->
					<input type='hidden' name='newui' value="true">
					<input type='hidden' name='type' value='agile'></input>
					<input type='hidden' name='account_timezone' id='account_timezone' value=''></input>
					<div class="list-group list-group-sm">
						
						<div class="list-group-item">
							<input class="input-xlarge required email field form-control no-border" name='email' type="email" required placeholder="User ID (Your Email Address)" autocapitalize="off" autofocus
						<%if(request.getAttribute("agile_email")  != null) {%> value="<%=request.getAttribute("agile_email") %>" <%}%>>
						</div>
						
						<div class="list-group-item">
					    	<input class="input-xlarge required field form-control no-border" required maxlength="20" minlength="4" name='password' type="password" placeholder="Password" autocapitalize="off">
						</div>
						
						</div>
							<label class="checkbox" style="display:none;">
							    <input type="checkbox" checked="checked" name="signin">Keep me signed in 
							</label>
							<input type='submit' value="Sign In" class='btn btn-lg btn-primary btn-block'>
							 
						
					
					
				

				
		<div class="text-center text-white m-t m-b">
		<small>Login with</small> 
		<a title="Login with Google" data='google' href='#' class="openid_large_btn google text-white">Google</a>&nbsp|&nbsp
		<a title="Login with Yahoo" data='yahoo' href="#" class="openid_large_btn yahoo text-white">Yahoo</a><br/>	
		<small>Do not have an account?</small> <a href="/register" class="text-white">Sign Up</a><br/>
		<small>Forgot</small> <a href="/forgot-password" class="text-white">Password? </a><a href="/forgot-domain" class="text-white">Domain?</a>
		</div>
		
		</form>
		</div>
		</div>
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
