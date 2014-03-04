<!DOCTYPE html>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.StringUtils2"%>
<%@page import="com.agilecrm.user.AgileUser"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>

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

<link rel="stylesheet" type="text/css"
	href="<%=CSS_PATH%>css/bootstrap-<%=template%>.min.css" />
<link rel="stylesheet" type="text/css"
	href="<%=CSS_PATH%>css/bootstrap-responsive.min.css" />
<link rel="stylesheet" type="text/css" href="/css/agilecrm.css" />


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
	
	    <!-- Including header(Navigation Bar) page -->
		<jsp:include page="header.jsp"/>

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
		
			if (window.XMLHttpRequest)tpl=new XMLHttpRequest(); //for IE 6 & earlier
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
	<!-- Including Footer page -->
	<jsp:include page="footer.jsp"/>
	
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
	<link rel="stylesheet" type="text/css" href="/css/social_suite.css" />

	<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/lib.css"></link>


	<!-- Unified CSS for All Lib -->
</body>
</html>
