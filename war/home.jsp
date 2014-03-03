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
<%@page import="com.agilecrm.account.MenuSetting"%>
<%@page import="com.agilecrm.account.util.MenuSettingUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<html lang="en">
<head>
<meta charset="utf-8">
<title>Agile CRM Dashboard</title>
<meta name="viewport"
	content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<meta name="globalsign-domain-verification"
	content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />

<%
    //Check if it is being access directly and not through servlet
	if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
		response.sendRedirect("/login");
		return;
	}

	DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
	System.out.println("Domain user " + domainUser);

	ObjectMapper mapper = new ObjectMapper();

	// Get current user prefs
	UserPrefs currentUserPrefs = UserPrefsUtil.getCurrentUserPrefs();

	// Download the template the user likes
	String template = currentUserPrefs.template;
	if (request.getParameter("t") != null)
		template = request.getParameter("t");

	// Check if someone is using old -11 etc templates
	if (StringUtils.isNumeric(template)
			|| template.equalsIgnoreCase("default"))
		template = "pink";

	String width = currentUserPrefs.width;
	boolean is_fluid = !width.isEmpty();
%>


<meta name="last-login-time"
	content="<%=domainUser.getInfo(DomainUser.LAST_LOGGED_IN_TIME)%>" />

<%
    String CSS_PATH = "/";
	//String CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";
%>
<%
    String logoutURL = "/login";
	UserInfo user = SessionManager.get();
%>

<link rel="stylesheet" type="text/css"
	href="<%=CSS_PATH%>css/bootstrap-<%=template%>.min.css" />
<link rel="stylesheet" type="text/css"
	href="<%=CSS_PATH%>css/bootstrap-responsive.min.css" />
<link rel="stylesheet" type="text/css"
	href="/css/agilecrm.css" />


<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

<!--[if lt IE 8]>
    <script src="lib/ie/json.js"></script>
   <![endif]-->     
</head>

<body>    
	<div id="wrap">	    
		<div class="navbar navbar-fixed-top">
			<div class="navbar-inner">
				<div class="container<%=width%>">
					<a class="btn btn-navbar" data-toggle="collapse"
						data-target=".nav-collapse"> <span class="icon-bar"></span> <span
						class="icon-bar"></span> <span class="icon-bar"></span>
					</a> <a class="brand" href="#dashboard"> Agile CRM</a>

					<div class="nav-collapse">

						<ul class="nav agile-menu">
							<li id="homemenu" class="active"></li>
							<%
							    if ("admin".equals(domainUser.domain)) {
																							out.println("<li><a href='#all-domain-users'><i class='icon-group'></i> All Domain Users</a></li></ul>");
																							out.println("<ul class='nav pull-right' style='float:right!important;'><li><a href="
																									+ logoutURL
																									+ "><i class='icon-off'></i>Logout</a></li>");
																						} else {
							%>


							<%
							    //Styling enable/disable navbar tabs(add display:none to diable)
																							Integer count = 0;
																							MenuSetting navSetting = MenuSettingUtil.getMenuSetting();
																							String style_calendar = "", style_cases = "", style_deals = "", style_campaign = "", style_social = "", style_reports = "", style_documents = "";
																							//style for calendar,cases,deals,campaign resp.

																							if (!navSetting.calendar)
																								style_calendar = " display:none;";
																							else
																								++count;
																							if (!navSetting.cases)
																								style_cases = " display:none;";
																							else
																								++count;
																							if (!navSetting.deals)
																								style_deals = " display:none;";
																							else
																								++count;
																							if (!navSetting.campaign)
																								style_campaign = " display:none;";
																							else
																								++count;
																							if (!navSetting.social)
																								style_social = " display:none;";
																							else
																								++count;
																							if (!navSetting.reports)
																								style_reports = " display:none;";
																							else
																								++count;
																							if (!navSetting.documents)
																								style_documents = " display:none;";
																							else
																								++count;
							%>
							<li id="contactsmenu"><a href="#contacts"><i
									class="icon-user icon-white"></i> Contacts</a></li>

							<%
								if (navSetting.calendar) {
							%>
							<li id="calendarmenu" style="<%=style_calendar%>;"><a
								href="#calendar"><i class="icon-calendar icon-white"></i>
									Calendar</a></li>
							<%
								}
									if (navSetting.campaign) {
							%>
							<li id="workflowsmenu"><a href="#workflows"><i
									class="icon-sitemap icon-white"></i> Campaigns</a></li>
							<%
								}
									if (navSetting.deals) {
							%>
							<li id="dealsmenu"><a href="#deals"><i
									class="icon-money icon-white"></i> Deals</a></li>
							<%
								}
									if (navSetting.social) {
							%>
							<li id="socialsuitemenu"><a href="#social"> <i
									class="icon-comments icon-white"></i> Social
							</a></li>
							<%
								}
									if (navSetting.documents) {
							%>
								<li id="documentsmenu"><a href="#documents"><i
										class="icon-file icon-white"></i> Docs</a></li> 
							<%
								}
									if (navSetting.reports) {
							%>
							<li id="reportsmenu"><a href="#reports"><i
									class="icon-bar-chart icon-white"></i> Reports</a></li>
							<%
								}
									if (navSetting.cases) {
							%>
							<li id="casesmenu"><a href="#cases"><i
									class="icon-folder-close icon-white"></i> Cases</a></li>
							<%
								}
							%>

							<%
								if (count > 3) {
							%>

							<li id="more-menu" class="dropdown"><a
								class="dropdown-toggle" data-toggle="dropdown" href=""> More
									<i class='caret'></i>
							</a>
								<ul class="dropdown-menu drop-drop">
									<%
										if (navSetting.campaign) {
									%>
									<li id="workflowsmenu"><a href="#workflows"><i
											class="icon-sitemap icon-white"></i> Campaigns</a></li>									
									<%
										}
												if (navSetting.deals) {
									%>
									<li id="dealsmenu"><a href="#deals"><i
											class="icon-money icon-white"></i> Deals</a></li>
									<%
										}
												if (navSetting.social) {
									%>
									<li id="socialsuitemenu"><a href="#social"> <i
											class="icon-comments icon-white"></i> Social
									</a></li>
									<%
										}
												if (navSetting.documents) {
									%>
									<li id="documentsmenu"><a href="#documents"><i
											class="icon-file icon-white"></i> Docs</a></li>
									<%
										}
												if (navSetting.reports) {
									%>
									<li id="reportsmenu"><a href="#reports"><i
											class="icon-bar-chart icon-white"></i> Reports</a></li>											
									<%
										}
												if (navSetting.cases) {
									%>
									<li id="casesmenu"><a href="#cases"><i
											class="icon-folder-close icon-white"></i> Cases</a></li>
									<%
										}
									%>
								</ul></li>
							<%
								}
							%>
							<li class="nav-bar-search">
								<form id="searchForm" class=" navbar-search"
									style="margin: 5px;">
									<input id="searchText" type="text" style="line-height: 17px"
										data-provide="typeahead"
										class="typeahead typeahead_contacts search-query"
										placeholder="Search"></input> <input id="search-results"
										type="image" src="img/SearchIcon.png" class="searchbox" />
								</form>
							</li>
						</ul>

						<ul class="nav pull-right">

							<li id="recent-menu" class="dropdown">
								<a class="dropdown-toggle" data-toggle="dropdown" href="" style="padding-left:2px; padding-right:4px;">
									<i class='caret'></i>
								</a>
								<ul class="dropdown-menu" style="width:25em; right:-11px;">
								</ul>
							</li> 

							<li class="dropdown" id="menu1"><a class="dropdown-toggle"
								data-toggle="dropdown" href="">Add New <i class='caret'></i></a>
								<ul class="dropdown-menu">
									<li><a href="#personModal" data-toggle="modal" id="person">
											Contact</a></li>
									<li><a href="#companyModal" data-toggle="modal"
										id="company"> Company</a></li>
									<li><a href="#" id="show-activity"> Activity</a></li>

									<li><a href="#" class="deals-add"> Deal</a></li>
									<li><a href="#" id="show-note"> Note</a></li>
								</ul> <!-- 
							<img style='display:hidden' id='ajax'
								src='img/ajax-loader.gif' />
								--></li>

							<li id="fat-menu" class="dropdown"><a href=""
								class="dropdown-toggle" data-toggle="dropdown"><i
									class="agilecrm-profile-dropdown"></i> </a>
								<ul class="dropdown-menu">
									<li><a href='#user-prefs'
										style="padding-left: 8px !important; padding-right: 8px !important; padding-bottom: 5px !important; margin-bottom: 5px !important; border-bottom: 1px solid #e5e5e5">
											<%
												if (!StringUtils.isEmpty(currentUserPrefs.pic))
														out.println("<img src='"
																+ currentUserPrefs.pic
																+ "'style='height: 26px; width: 26px; margin-right: 3px; display: inline;padding:2px !important' class='thumbnail'></img>");
													else
														out.println("<img src='img/gravatar.png' style='height: 26px; width: 26px; margin-right: 3px; display: inline;padding:2px !important' class='thumbnail'></img>");
											%> <span> <b
												style="font-size: 13px; margin-right: 20px;"><%=user.getEmail()%></b></span>

									</a></li>
									<li><a href="#user-prefs"><i class="icon-cog"></i>
											Preferences</a></li>

									<%
										if (domainUser != null && domainUser.is_admin)
												out.println("<li><a href='#account-prefs'><i class='icon-fire'></i> Admin Settings</a></li><li><a href='#subscribe'><i class='icon-shopping-cart'></i> Plan & Upgrade</a></li>");
									%>
									<li><a href="https://www.agilecrm.com/support.html" target="_blank"><i class="icon-facetime-video"></i>
											Help Videos</a></li>
									<li><a href="#contact-us"><i class="icon-pencil"></i>
											Contact Us</a></li>
									<li><a href="<%=logoutURL%>"><i class="icon-off"></i>
											Logout</a></li>

								</ul></li>
							<%
								}
							%>
						</ul>
					</div>
					<!--/.nav-collapse -->
				</div>
			</div>
		</div>

		<div class="container<%=width%>" id="agilecrm-container">
			<div id="content">
				<img class="init-loading" style="padding-right: 5px"
					src="img/21-0.gif"></img>
			</div>
		</div>
		<div id="push"></div>

		<!--  Notifications -->
		<div class='notifications top-left'></div>
		<div class='notifications top-right'></div>
		<div class='notifications bottom-left'></div>
		<div class='notifications bottom-right'></div>

		<div id='templates'></div>
		<script type="text/javascript">
			var tpl;	
		
			if (window.XMLHttpRequest)tpl=new XMLHttpRequest(); ///for IE 6 & earlier
			else tpl=new ActiveXObject("Microsoft.XMLHTTP");     //for chrome & newer IEs

			tpl.open("GET","tpl/min/tpl.js",false);              //script load from browser
			tpl.send();
			document.getElementById('templates').innerHTML=tpl.responseText;   //insert in dummy div
		</script>

		<!-- Templates 
	Use = [<]%@ include file="tpl/min/tpl.js" %[>]	-->

		<!-- Determine Console.logging - we log in local boxes -->
		<%
			boolean debug = true;
			if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
				debug = false;
		%>

	</div>

	<footer id="footer" class="footer container"
		style="padding: 0px !important; overflow-x: hidden; overflow-y: hidden; margin-top: 15px;">
		<div style="display: inline; float: right;">
			<a
				style="font-weight: bold; cursor: pointer; vertical-align: -17px; margin-right: 30px;"
				id="help-page">Help</a>
		</div>
		<div style="display: inline; float: right;">
			<a
				style="font-weight: bold; cursor: pointer; vertical-align: -17px; margin-right: 30px;"
				id="agile-page-tour">Tour</a>
		</div>

		<div style="width: 290px; display: inline-block; margin-top: 15px;">
			Like AgileCRM?<b> Share it -</b>
			<script src="https://platform.twitter.com/widgets.js"
				type="text/javascript"></script>
			<span style="margin: 0 10px;"><a data="Twitter"
				class="email-share"
				href="https://twitter.com/share?url=https%3A%2F%2Fwww.agilecrm.com&text=Sell%20like%20Fortune%20500%20with%20%23AgileCRM%20-%20"
				target="_blank"><i class="icon-twitter"></i></a></span> <span><a
				data="Facebook" class="email-share"
				href="https://www.shareaholic.com/api/share/?v=1&apitype=1&apikey=8943b7fd64cd8b1770ff5affa9a9437b&service=5&title=Sell%20like%20Fortune%20500%20with%20%23AgileCRM%20-%20&link=https%3A%2F%2Fwww.agilecrm.com&notes=Sell%20like%20Fortune%20500%20with%20%23AgileCRM%20"
				target="_blank"><i class="icon-facebook"></i></a></span> <span
				style="margin-left: 10px;"><a data="Linkedin"
				class="email-share"
				href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.agilecrm.com&title=AgileCRM&summary=Sell%20like%20Fortune%20500%20with%20%23AgileCRM%20-%20&source=https%3A%2F%2Fwww.agilecrm.com"
				target="_blank"><i class="icon-linkedin"></i></a></span> <span
				style="margin: 0 10px;"><a id="share-email" href="#"><i
					class="icon-envelope-alt"></i></a></span>
		</div>

		<!-- <div style="margin-right:5px;display:inline-block;vertical-align:top;">Refer your friends.</div>
     		
     		
     		<div class="fb-like" data-href="https://www.agilecrm.com" data-send="false" data-layout="button_count" data-width="450" data-show-faces="true"
     		      data-font="arial" style="overflow:hidden;display:inline;float:right;"></div>
     		-->
		<!-- <a href="#" id="scroll-top"
			class="btn btn-mini btn-flat btn-primary pull-right">Top &uarr;</a> -->
	</footer>

	<!-- <script src='https://dpm72z3r2fvl4.cloudfront.net/js/lib/headjs-min.js'></script> -->
	<script src='/lib/headjs-min.js'></script>

	<script>
	//var LIB_PATH = "//dpm72z3r2fvl4.cloudfront.net/js/";
	var LIB_PATH = "/";
	
	var IS_CONSOLE_ENABLED = <%=debug%>;
	var LOCAL_SERVER = <%=debug%>;
	
	var IS_FLUID = <%=is_fluid%>;
	
	// Get current user prefs json
	var CURRENT_USER_PREFS = <%=mapper.writeValueAsString(currentUserPrefs)%>;
	
	// Get current domain user json
	var CURRENT_DOMAIN_USER = <%=mapper.writeValueAsString(domainUser)%>;
	
	//var JQUERY_LIB_PATH = "//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js";
	 var JQUERY_LIB_PATH = LIB_PATH + 'lib/jquery.min.js';

	<!-- JQUery Core and UI CDN -->	
	<!-- The same ajax libraries are used by designer - if you are changing the version here, change in designer too -->
	head.js(JQUERY_LIB_PATH, LIB_PATH +  'lib/bootstrap.min.js', LIB_PATH + 'lib/jquery.validate.min.js', LIB_PATH + 'lib/bootstrap-datepicker-min.js',LIB_PATH + 'lib/date-formatter.js',  LIB_PATH + 'lib/bootstrap-timepicker-min.js');
	
	<!-- Backbone -->
	head.js(LIB_PATH + 'lib/underscore-min.js', LIB_PATH + 'lib/backbone-min.js', LIB_PATH + 'lib/infiniscroll.js');
	
	<!-- Handle bars -->
	head.js(LIB_PATH + 'lib/handlebars-1.0.0.beta.6-min.js');
	
	<!-- Country Names from country codes -->
	head.js(LIB_PATH + 'lib/country-from-code.js');
	
	// Fetch/Create contact from our domain
	var Agile_Contact = {};
	
	head.ready(function() {	
		// Remove the loadinng 
		$('body').css('background-image', 'none');
		//$('#content').html('ready');
		$("img.init-loading", $('#content')).attr("src", "/img/ajax-loader-cursor.gif"); 
		
		head.js('jscore/min/js-all-min.js', 'stats/min/agile-min.js', function() {

			// Load User voice then
			setTimeout(function(){head.js('lib/user-voice.js');}, 20000);	
	}); 
		
		
		

	});

	
	</script>

	<link rel="stylesheet" type="text/css"
		href="<%=CSS_PATH%>css/widget.css" />
	<link rel="stylesheet" type="text/css"
		href="<%=CSS_PATH%>css/timeline.css" />
	<link rel="stylesheet" type="text/css"
		href="<%=CSS_PATH%>css/date_range_picker.css"></link>
	<link rel="stylesheet" type="text/css"
		href="<%=CSS_PATH%>css/jslider.css"></link>
	<link rel="stylesheet" type="text/css"
		href="<%=CSS_PATH%>css/plan_and_upgrade.css"></link>
	<link rel="stylesheet" type="text/css"
		href="<%=CSS_PATH%>css/bootstrap_switch.css"></link>
	<link rel="stylesheet" type="text/css"
		href="<%=CSS_PATH%>css/bootstrap-tour.min.css"></link>
	<!-- social suite's css -->
	<link rel="stylesheet" type="text/css"
		href="/css/social_suite.css" />
	
	<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/lib.css"></link>
	

	<!-- Unified CSS for All Lib -->		
</body>
</html>
