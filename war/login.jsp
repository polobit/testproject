<%@page import="com.agilecrm.session.UserInfo"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="com.agilecrm.util.Util"%>
<%@page import="com.agilecrm.Globals"%>
<%@page import="com.agilecrm.core.DomainUser"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="com.agilecrm.session.SessionManager"%>
<%
		
// Delete Login Session
request.getSession().removeAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);

// Check if the request was posted again to itself 
if(request.getParameter("auth") != null)
{
    	// Get the method type
    	String type = request.getParameter("type");
    	if(type.equalsIgnoreCase("oauth"))
    	{
    	    // Get server type
    	    String server = request.getParameter("server");
    	    
    	    // Get OAuth URL
    	    String url = Util.getOauthURL(server);
    	    
    	    if(url == null)
    	    {
    			out.println("Server not found - try again");
    			return;
    	    }
    	    
    	    // Forward to OpenID Authenticaiton which will set the cookie and then forward it to /
    	    response.sendRedirect("/openid?hd=" + URLEncoder.encode(url));
    	    
    	    return;
    	}
    	else if(type.equalsIgnoreCase("agile"))
    	{
    	    
    	    // Get User Name
    	    String email = request.getParameter("email");
    	    
    	    // Get Password
    	    String password = request.getParameter("password");
    	    
    	    if(email== null || password == null)
    	    {
    			out.println("Email not found - try again");
				return;
    	    }

    	    
    	    // Get Domain User with this name, password - we do not check for domain as validity is verified in AuthFilter
    	    DomainUser domainUser = DomainUser.getDomainUserFromEmail(email);
    	    if(domainUser == null)
    	 	{
				out.println("Email not found - try again");
				return;
	    	}
    	 
    	    // Set Cookie and forward to /home
    	    UserInfo userInfo = new UserInfo("agilecrm.com", email, null, null);
    	    request.getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);
    	    
    	    response.sendRedirect("/home");
    	}	
}

// Check if this subdomain even exists
if(DomainUser.count() == 0)
{
    response.sendRedirect(Globals.CHOOSE_DOMAIN);
    return;
}


%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>
<title>Register</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
	padding-top: 60px;
	//background-color: whitesmoke;
	}
	
.navbar-search{
 	padding-left: 10%
}
	
}
.error{color:red;}
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
	<div class="row">

		<div class="account-container" style='display:block;float:none;margin:30px auto'>
			<div class="content clearfix">
				
				<form name='agile' id="agile" method='post' onsubmit="return isValid();" style="padding: 16px 28px 23px"> 
				 <h1>Sign In</h1>
				 
				 <h3><small>Sign in using your registered account:</small></h3>	
				<div id="openid_btns" style="float: left;padding:5px 0 15px;">
										
					<input type='hidden' name='auth' value='auth'>
					<input type='hidden' name='type' value='agile'>
				
					
					<div class="input-prepend">
                      <span class="add-on"><i class="icon-user"></i></span><input class="required email" name='email' type="text" placeholder="User Name">
                    </div>
                    <br/>
                    <div class="input-prepend">
                      <span class="add-on"><i class="icon-lock"></i></span><input class="required " name='password' type="password" placeholder="Password">
                    </div>
					<br/>
					<label class="checkbox" style="display:inline-block;"><input type="checkbox" name="signin"> Keep me signed in </label>
					<input type='submit' style="float:right;" value="Sign In" class='btn btn-large btn-primary'>
				</div>
				<br />
				</form>
				
				<div class="clearfix"></div>
				
				<form id='oauth'  name='oauth' method='post' style="padding: 16px 28px 23px"> 
				
				<div id="openid_btns" style="float: left;padding:5px 0 15px;border-top: 1px dotted #CCC;border-bottom: 1px dotted #CCC;border-right: none;border-left: none;">
				<h3><small>Login or register using existing accounts</small></h3>	
					<input type='hidden' name='auth' value='auth'></input>
					<input type='hidden' name='type' value='oauth'></input>
					<input type='hidden' name='server' id='oauth-name' value=''></input>
					
					<a title="log in with Google" href='#' style="background: #FFF url(img/openid-providers-en.png); background-position: 0px 0px" class="google openid_large_btn"></a> 
					<a title="log in with Yahoo" href="#" style="background: #FFF url(img/openid-providers-en.png); background-position: -100px 0px" class="yahoo openid_large_btn"></a>
				</div>
				<br />
				</form>
				<div class="clearfix"></div>
				</div>
			</div>
			<div style="text-align: center;line-height: 19px;">
	                 Don't have an account? <a href="/register.jsp">Sign Up</a><br>
	                  Remind <a href="#">Password</a>
               </div>
		</div>
		
		<script type="text/javascript">
		$(document).ready(function() {			
			
			$('.openid_large_btn').click(function(e)
			{
				// Get Data
				var data = $(this).attr('data');
				$('#oauth-name').val(data);
				
				$('#oauth').submit();
				
				e.preventDefault();
				
			});
			
		});
		
		function isValid(){
		    $("#agile").validate();
		    return $("#agile").valid();
		    }
		</script>
</body>
</html>