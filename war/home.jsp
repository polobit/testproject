<!DOCTYPE html>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.session.UserInfo"%>
<%@page import="com.agilecrm.session.SessionManager"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.StringUtils2"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.user.AgileUser"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%@page import="com.google.appengine.api.users.UserServiceFactory"%>
<%@page import="com.google.appengine.api.users.User"%>
<%@page import="com.google.appengine.api.users.UserService"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>

<html lang="en">
<head>
<meta charset="utf-8">
<title>Agile CRM Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>

<!-- Le styles -->
<%
		
	//Check if it is being access directly and not through servlet
	if(request.getAttribute("javax.servlet.forward.request_uri") == null)
	{
	    response.sendRedirect("/login");
	    return;
	}

	DomainUser domainUser = DomainUserUtil.getDomainCurrentUser();
	System.out.println("Domain user " + domainUser);
	
	ObjectMapper mapper = new ObjectMapper();
	
	// Get current user prefs
	UserPrefs currentUserPrefs = UserPrefsUtil.getCurrentUserPrefs();
	
	// Download the template the user likes
	String template = currentUserPrefs.template;
	if(request.getParameter("t") != null)
		template = request.getParameter("t");
	
	// Check if someone is using old -11 etc templates
	if(StringUtils.isNumeric(template) || template.equalsIgnoreCase("default"))
	    template = "pink";
	
	String width = currentUserPrefs.width;	
	boolean is_fluid = !width.isEmpty();
%>

<% 
String CSS_PATH = "/";
// String CSS_PATH = "//d13pkp0ru5xuwf.cloudfront.net/";
%>
<%
	    String logoutURL = "/login";
	    UserInfo user = SessionManager.get();
	%>
					
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/bootstrap-<%=template%>.min.css" />
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/agilecrm.css" />
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/widget.css" />
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/timeline.css" />
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/jslider.css" />
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/planandupgrade.css" />
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/daterangepicker.css" />

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->
    
	<!--[if lt IE 8]>
    <script src="lib/ie/json.js"></script>
   <![endif]-->	
	

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

</head>

<body>
<div id="wrap">
	<div class="navbar navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container<%=width%>">
				<a class="btn btn-navbar" data-toggle="collapse"
					data-target=".nav-collapse"> <span class="icon-bar"></span> <span
					class="icon-bar"></span> <span class="icon-bar"></span>
				</a> <a class="brand" href="#dashboard"><i class='icon-cloud'></i> Agile CRM</a>

				<div class="nav-collapse">

					<ul class="nav agile-menu">
						<li id="homemenu" class="active"></li>
						<%
					        if("admin".equals(domainUser.domain)){
					           out.println("<li><a href='#all-domain-users'><i class='icon-group'></i> All Domain Users</a></li></ul>");
						       out.println("<ul class='nav pull-right' style='float:right!important;'><li><a href="+ logoutURL +"><i class='icon-off'></i>Logout</a></li>");
					        }
					        else{
						%>

						<li id="contactsmenu"><a href="#contacts"><i
								class="icon-user icon-white"></i> Contacts</a></li>
						<li id="calendarmenu"><a href="#calendar"><i
								class="icon-calendar icon-white"></i> Calendar</a></li>
						<li id="dealsmenu"><a href="#deals"><i
								class="icon-money icon-white"></i> Deals</a></li>
						<li id="workflowsmenu"><a href="#workflows"><i
								class="icon-sitemap icon-white"></i> Campaigns</a></li>
						<li id="reportsmenu"><a href="#reports"><i
								class="icon-share icon-white"></i> Reports</a></li>
								
						<li>
							<form id="searchForm" class=" navbar-search"
									style="display: inline;margin:5px;">
									<input id="searchText" type="text" data-provide="typeahead"
										class="typeahead typeahead_contacts search-query"
										placeholder="Search"></input> <input id="search-results"
										type="image" src="img/SearchIcon.png" class="searchbox" />
							</form>
						</li>
					</ul>
				   
					<ul class="nav pull-right">
						<li class="dropdown" id="menu1"><a class="dropdown-toggle"
							data-toggle="dropdown" href="#menu1">Add New <i class='caret'></i></a>
							<ul class="dropdown-menu">
								<li><a href="#personModal" data-toggle="modal" id="person"><i class="icon-user"></i> Contact</a>
								</li>
								<li><a href="#companyModal" data-toggle="modal"
									id="company"><i class="icon-building"></i> Company</a></li>
								<li><a href="#" id="show-activity"><i class="icon-list-alt"></i> Activity</a></li>

								<li><a href="#deals-add" id="activity"><i class="icon-money"></i> Deal</a></li>
								<li><a href="#" id="show-note"><i class="icon-file-alt"></i> Note</a></li>
							</ul> <!-- 
							<img style='display:hidden' id='ajax'
								src='img/ajax-loader.gif' />
								--></li>
                     
						<li id="fat-menu" class="dropdown"><a href=""
							class="dropdown-toggle" data-toggle="dropdown"><i
								class="agilecrm-profile-dropdown"></i> </a>
							<ul class="dropdown-menu">
								<li><a href='#settings'>
			
								<%
								if(!StringUtils.isEmpty(currentUserPrefs.pic))
								    out.println("<img src='"+currentUserPrefs.pic+"' style='width:25px;height:25px;border-radius:1px;margin-right:2px' class='float-left'></img>");
								else
								    out.println("<img src='img/gravatar.png' style='width:25px;height:25px;border-radius:1px;margin-right:2px' class='float-left'></img>");
								%>	
									<%=user.getEmail()%>			
								</a></li>
								<li class="divider"></li>
								<li><a href="#settings"><i class="icon-cog"></i>
										Preferences</a></li>

								<%
								    if (domainUser != null && domainUser.is_admin)
										out.println("<li><a href='#admin'><i class='icon-fire'></i> Admin Settings</a></li>");
								%>

						<li><a href="#contact-us"><i class="icon-pencil"></i>
								Contact Us</a></li>

						<li><a href="<%=logoutURL%>"><i class="icon-off"></i>
								Logout</a></li>

					</ul>
					</li>
					<%} %>
					</ul>
				</div>
				<!--/.nav-collapse -->
			</div>
		</div>
	</div>

	<div class="container<%=width%>" id="agilecrm-container">
		<div id="content">
			<img class="init-loading" style="padding-right: 5px" src="img/21-0.gif"></img>
		</div>
	</div>
	<div id="push"></div>

	<!--  Notifications -->
	<div class='notifications top-left'></div>
	<div class='notifications top-right'></div>
	<div class='notifications bottom-left'></div>
	<div class='notifications bottom-right'></div>



	<!-- Templates -->
	<%@ include file="tpl/min/tpl.js" %>	
	
	<!-- Determine Console.logging - we log in local boxes -->
	<%
	    boolean debug = true;
	    if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
			debug = false;
	%>
	
	</div>

	<footer id="footer" class="footer container"
		style="padding: 0px !important;overflow-x:hidden;overflow-y:hidden;margin-top:15px;">

	 	<div style="width:290px;display:inline-block;margin-top:15px;">
	 	    Like AgileCRM?<b> Share it -</b>
	 		<script src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
     		<span style="margin:0 10px;"><a data="Twitter" class="email-share" href="https://twitter.com/share?url=https%3A%2F%2Fwww.agilecrm.com&text=Sell%20like%20a%20pro%20with%20%23AgileCRM%20-%20" target="_blank"><i class="icon-twitter"></i></a></span>
	 		<span><a data="Facebook" class="email-share" href="https://www.shareaholic.com/api/share/?v=1&apitype=1&apikey=8943b7fd64cd8b1770ff5affa9a9437b&service=5&title=Sell%20like%20a%20pro%20with%20%23AgileCRM%20-%20&link=https%3A%2F%2Fwww.agilecrm.com&notes=Sell%20like%20a%20pro%20with%20%23AgileCRM%20" target="_blank"><i class="icon-facebook"></i></a></span>
	 		<span style="margin-left:10px;"><a data="Linkedin" class="email-share" href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.agilecrm.com&title=AgileCRM&summary=Sell%20like%20a%20pro%20with%20%23AgileCRM%20-%20&source=https%3A%2F%2Fwww.agilecrm.com" target="_blank"><i class="icon-linkedin"></i></a></span>
	 		<span style="margin:0 10px;"><a id="share-email" href="#"><i class="icon-envelope-alt"></i></a></span>
        </div>
        <div style="display:inline;">
            <a style="font-weight:bold;cursor:pointer;margin-left:10%;" id="help-page">Help</a>
        </div>
     		<!-- <div style="margin-right:5px;display:inline-block;vertical-align:top;">Refer your friends.</div>
     		
     		
     		<div class="fb-like" data-href="https://www.agilecrm.com" data-send="false" data-layout="button_count" data-width="450" data-show-faces="true"
     		      data-font="arial" style="overflow:hidden;display:inline;float:right;"></div>
     		-->
        <a href="#" id="scroll-top" class="btn btn-mini btn-flat btn-primary pull-right">Top &uarr;</a>
	</footer>

<script src='lib/headjs-min.js'></script>
	
	<script>
	var LIB_PATH = "//da4o37ei6ybbh.cloudfront.net/js/";
	// var LIB_PATH = "/";
	
	var IS_CONSOLE_ENABLED = <%=debug%>;
	
	var IS_FLUID = <%=is_fluid%>;
	
	// Get current user prefs json
	var CURRENT_USER_PREFS = <%=mapper.writeValueAsString(currentUserPrefs)%>;
	
	//var JQUERY_LIB_PATH = "//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js";
	 var JQUERY_LIB_PATH = LIB_PATH + 'lib/jquery.min.js';
	
	<!-- JQUery Core and UI CDN -->	
	<!-- The same ajax libraries are used by designer - if you are changing the version here, change in designer too -->
	head.js(JQUERY_LIB_PATH, LIB_PATH +  'lib/bootstrap.min.js', LIB_PATH + 'lib/jquery.validate.min.js', LIB_PATH + 'lib/bootstrap-datepicker-min.js',LIB_PATH + 'lib/date-formatter.js',  LIB_PATH + 'lib/bootstrap-timepicker-min.js');
	
	<!-- Backbone -->
	head.js(LIB_PATH + 'lib/underscore-min.js', LIB_PATH + 'lib/backbone-min.js', LIB_PATH + 'lib/infiniscroll.js');
	
	<!-- Handle bars -->
	head.js(LIB_PATH + 'lib/handlebars-1.0.0.beta.6-min.js');
	
	
	
	head.ready(function() {	
		head.js('jscore/min/js-all-min.js');
		
		// Remove the loading image
		$('body').css('background-image', 'none');
		//$('#content').html('ready');
		$("img.init-loading", $('#content')).attr("src", "/img/ajax-loader-cursor.gif");
	});
	</script>
	
	<!-- Unified CSS for All Lib -->
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/lib.css' />

</body>
</html>