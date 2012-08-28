<%@ page import="com.google.appengine.api.users.UserServiceFactory"%>
<%@ page import="com.google.appengine.api.users.UserService"%>
<%@ page import="com.google.appengine.api.users.User"%>
<%@ page import="com.agilecrm.core.DomainUser"%>
<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>

<% DomainUser domainUser = DomainUser.getDomainUserFromEmail(UserServiceFactory.getUserService().getCurrentUser().getEmail()); %>
<% String href = UserServiceFactory.getUserService().createLogoutURL("register.jsp"); %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>wrong-user</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<link rel="stylesheet" type="text/css" href="css/bootstrap-11.min.css" />
    <link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.min.css" />
    <link rel="stylesheet" type="text/css" href="css/bootstrap-error.css" />
    <link href="./css/font-awesome.css" rel="stylesheet">
	
  </head>
  
  <body>
    <div class='navbar navbar-fixed-top'> 
    	<div class='navbar-inner'> 
    		<div class='container'> 
    			<a class='btn btn-navbar' data-toggle='collapse' data-target='.nav-collapse'> </a> 
    			<a class='brand' href='#dashboard'>Agile CRM</a>
	    		<div class="nav-collapse"> 
					<ul class="nav pull-right" style="padding-top:10px;">
						<li class="" style="border-top:10px">
							<a href=<%= href %>>		
								<i class="icon-chevron-left"></i>Back
							</a>
						</li>
					</ul>
				</div>			
			</div> 
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="error-container">
				<h1>Oops!</h1> 
				<h2>Error Title</h2>
				
				
				<div class="error-details">
					Error - message - Sorry. You have registered another account on Agile CRM with the same userid. La la.					
				</div>
							
				<div class="error-actions">
					<span class="btn btn-large btn-primary" onClick="history.go(-1);">
						<i class="icon-chevron-left"></i>
						&nbsp;
						Continue						
					</span>					
				</div> <!-- /error-actions -->			
			</div>
		</div>
	</div>
  </body>
</html>
