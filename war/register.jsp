<%
			Map<String, String> openIdProviders;
		        openIdProviders = new HashMap<String, String>();
		        openIdProviders.put("Google", "www.google.com/accounts/o8/id");
		        openIdProviders.put("Yahoo", "yahoo.com");
		        openIdProviders.put("MySpace", "myspace.com");
		        openIdProviders.put("AOL", "aol.com");
		        openIdProviders.put("MyOpenId.com", "stats.agilecrm.com");
		 
		 	   Set<String> attributes = new HashSet();
		 	   UserService userService = UserServiceFactory.getUserService();
		 	   User user = userService.getCurrentUser(); // or req.getUserPrincipal()
		       if(user != null)
		       {
		    	   response.sendRedirect("/home");
		    	   return;
		       }
%>

<!DOCTYPE html>
<%@page import="com.google.appengine.api.users.User"%>
<%@page import="com.google.appengine.api.users.UserServiceFactory"%>
<%@page import="com.google.appengine.api.users.UserService"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<html lang="en">
<head>
<meta charset="utf-8">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>
<title>Register</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le styles -->

<link href="/css/bootstrap-11.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" rel="stylesheet" href="/css/openid-min.css">


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
	<br/><br/><br/>
	<div class="row">

		<div class='span5 offset4'>
			<div class="well">
				 <h2>Sign In <br/><small>
				 
				Login or register using existing accounts</small></h2>	
				<div id="openid_btns" style="float: left;padding: 10px 0 15px;border-top: 1px dotted #CCC;border-right: none;border-left: none;">
					
					
					<br/>
					<a title="log in with Google" href='#' style="background: #FFF url(img/openid-providers-en.png); background-position: 0px 0px" class="google openid_large_btn"></a> 
					<a title="log in with Yahoo" href="#" style="background: #FFF url(img/openid-providers-en.png); background-position: -100px 0px" class="yahoo openid_large_btn"></a> 
					<a title="log in with AOL" href="#" style="background: #FFF url(img/openid-providers-en.png); background-position: -200px 0px" class="aol openid_large_btn"></a> 
					<a title="log in with MyOpenID" href="#" style="background: #FFF url(img/openid-providers-en.png); background-position: -300px 0px" class="myopenid openid_large_btn"></a> 
					<a title="log in with MySpace" href="#" style="background: #FFF url(img/logo_myspace_s.gif); background-repeat:no-repeat; background-size: 100px, 60px; background-position: 0px 20px" class="myspace openid_large_btn"></a>
				</div>
				<br />

				<div class="clearfix"></div>

				</div>
			</div>
		</div>
		
		<script type="text/javascript">
		$(document).ready(function() {
			
			
			$('.openid_large_btn').click(
				function(e)
				{
					if($(this).hasClass("google"))
						{						
						 <%String providerUrl = openIdProviders.get("Google");
					      String loginUrl = userService.createLoginURL(request.getRequestURI(), null, providerUrl, attributes);%>	
						
							window.location = "<%=loginUrl%>";
						}
				
					if($(this).hasClass("yahoo"))
						{
						
						<%providerUrl = openIdProviders.get("Yahoo");
					      loginUrl = userService.createLoginURL(request.getRequestURI(), null, providerUrl, attributes);%>	
					      alert("<%=providerUrl%>");
					      window.location = "<%=loginUrl%>";
					 	}
					 	
					 	if($(this).hasClass("aol"))
						{
						
						<%providerUrl = openIdProviders.get("AOL");
					      loginUrl = userService.createLoginURL(request.getRequestURI(), null, providerUrl, attributes);%>	
					 	window.location = "<%=loginUrl%>";
					 	}
					 	
					 	if($(this).hasClass("myopenid"))
						{
						
					 		
						<%providerUrl = openIdProviders.get("MyOpenId.com");
					      loginUrl = userService.createLoginURL(request.getRequestURI(), null, providerUrl, attributes);%>	
					 	
					      alert("<%=providerUrl%>");
					      
					      alert("<%=loginUrl%>");
					      
					      window.location = "<%=loginUrl%>";
					 	}
					 	
					 	if($(this).hasClass("myspace"))
						{
						
						<%providerUrl = openIdProviders.get("MySpace");
					      loginUrl = userService.createLoginURL(request.getRequestURI(), null, providerUrl, attributes);%>	
					 	window.location = "<%=loginUrl%>";
						}
					e.preventDefault();
				}
				);
		});
		</script>
</body>
</html>