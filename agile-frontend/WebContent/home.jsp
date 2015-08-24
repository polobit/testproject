<!DOCTYPE html>
<%@page import="com.agilecrm.subscription.SubscriptionUtil"%>
<%@page import="com.agilecrm.subscription.ui.serialize.Plan"%>
<%@page import="com.agilecrm.HomeServlet"%>
<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%@page import="com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil"%>
<%@page import="com.agilecrm.subscription.restrictions.db.BillingRestriction"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.StringUtils2"%>
<%@page import="com.agilecrm.user.AgileUser"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

<html lang="en">
<head>
<meta charset="utf-8">
<title>Agile CRM Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/eofoblinhpjfhkjlfckmeidagfogclib">


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
AccountPrefs accountPrefs = AccountPrefsUtil.getAccountPrefs();

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

BillingRestriction restriction = BillingRestrictionUtil.getBillingRestritionAndSetInCookie(request);

boolean is_free_plan = false;

if(restriction != null && restriction.planDetails != null)
    is_free_plan = restriction.planDetails.isFreePlan();

if(!restriction.planDetails.getACL())
{
    domainUser.resetACLScopesAndSave();
}

Boolean is_first_time_user = HomeServlet.isFirstTimeUser(request);

String _AGILE_VERSION = SystemProperty.applicationVersion.get();

%>


<meta name="last-login-time"
content="<%=domainUser.getInfo(DomainUser.LAST_LOGGED_IN_TIME)%>" />

<%
    String CSS_PATH = "/";
//String CSS_PATH = "//cdnapp.agilecrm.com/";
%>

<link rel="stylesheet" type="text/css"
href="<%=CSS_PATH%>css/bootstrap-<%=template%>.min.css" />
<link rel="stylesheet" type="text/css"
href="<%=CSS_PATH%>css/bootstrap-responsive.min.css" />
<link rel="stylesheet" type="text/css"
href="/css/agilecrm.css?_=<%=_AGILE_VERSION%>" />
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">
<style>
.clickdesk_bubble {
	display: none !important;
}
</style>
 <!-- <script src='http://cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.load.min.js'></script> -->
<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.js'></script>

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
<jsp:include page="header.jsp" />

<div class="container<%=width%>" id="agilecrm-container">
<div id="content">
<img class="init-loading" style="padding-right: 5px"
src="img/21-0.gif"></img>
</div>
</div>
<div id="push"></div>

<!-- Notifications -->
<div class='notifications top-left'></div>
<div class='notifications top-right'></div>
<div class='notifications bottom-left'></div>
<div class='notifications bottom-right'></div>

<div id='templates'></div>
<!-- <script type="text/javascript">
function loadTpl()
{
var tpl;
if (window.XMLHttpRequest)tpl=new XMLHttpRequest(); //for IE 6 & earlier
else tpl=new ActiveXObject("Microsoft.XMLHTTP"); //for chrome & newer IEs
tpl.open("GET","tpl/min/tpl.js",false); //script load from browser
tpl.send();
document.getElementById('templates').innerHTML=tpl.responseText; //insert in dummy div
}
</script>-->

<!-- Templates
Use = [<]%@ include file="tpl/min/tpl.js" %[>] -->
		
	

<!-- Determine Console.logging - we log in local boxes -->
<%
boolean debug = true;
boolean production = false;
boolean HANDLEBARS_PRECOMPILATION = false;
if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
{
    debug = false;
    HANDLEBARS_PRECOMPILATION = true;
    production = true;
   
}

%>

<%@ include file="tpl/min/precompiled/tpl.html" %>

</div>
<!-- Including Footer page -->
<jsp:include page="footer.jsp" />

<!-- <script src='https://dpm72z3r2fvl4.cloudfront.net/js/lib/headjs-min.js'></script> -->
<!-- <script src='/lib/headjs-min.js'></script> -->



<script>
//var LIB_PATH = "//dpm72z3r2fvl4.cloudfront.net/js/";
//var LIB_PATH = "//cdnapp.agilecrm.com/";
var LIB_PATH = "/";

var HANDLEBARS_PRECOMPILATION = false || <%=production%>;

var _AGILE_VERSION = <%="\"" + _AGILE_VERSION + "\""%>;

var CSS_PATH = "/";
//var CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";

var IS_CONSOLE_ENABLED = <%=debug%>;
var LOCAL_SERVER = <%=debug%>;
var _IS_FREE_PLAN = <%=is_free_plan%>;

var IS_NEW_USER = <%=is_first_time_user%>;

var IS_FLUID = <%=is_fluid %>

var CLICKDESK_CODE_LOADED = false;

var _plan_on_signup = "";

// Get current user prefs json
var CURRENT_USER_PREFS = <%=mapper.writeValueAsString(currentUserPrefs)%>;

//Get current user prefs json
var ACCOUNT_PREFS = <%=mapper.writeValueAsString(accountPrefs)%>;

// Get current domain user json
var CURRENT_DOMAIN_USER = <%=mapper.writeValueAsString(domainUser)%>;

//online scheduling url will be filled  only when user goes to calendar route 
var ONLINE_SCHEDULING_URL ="" ;

var HANDLEBARS_LIB = LOCAL_SERVER ? "/lib/handlebars-v1.3.0.js" : "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js";

// Billing Restriction
var _billing_restriction = <%=mapper.writeValueAsString(restriction)%>;

var JQUERY_LIB_PATH = "//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js";

var FLAT_FULL_UI = "";
//var JQUERY_LIB_PATH = LIB_PATH + 'lib/jquery.min.js';

<!-- JQUery Core and UI CDN -->	
<!-- The same ajax libraries are used by designer - if you are changing the version here, change in designer too -->
head.load(JQUERY_LIB_PATH, LIB_PATH + 'lib/bootstrap.2.3.min.js', LIB_PATH + 'lib/jquery.validate.min.js', LIB_PATH + 'lib/bootstrap-datepicker-min.js',LIB_PATH + 'lib/date-formatter.js', LIB_PATH + 'lib/bootstrap-timepicker-min.js');

<!-- Backbone -->
head.js(LIB_PATH + 'lib/underscore-min.js', LIB_PATH + 'lib/backbone-min.js', LIB_PATH + 'lib/infiniscroll.js');

<!-- Handle bars -->

if(HANDLEBARS_PRECOMPILATION)
head.js(HANDLEBARS_LIB, "tpl/min/precompiled/tpl.js");
else
head.js(HANDLEBARS_LIB);

// head.js("//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js", "tpl/min/tpl.js");

<!-- Country Names from country codes -->
head.js(LIB_PATH + 'lib/country-from-code.js');

<!-- Inital.js Text avatars -->
head.js(LIB_PATH + 'lib/text-avatar/initial.min.js');

<!-- mustache.js -->
head.js('//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min.js');

// Fetch/Create contact from our domain
var Agile_Contact = {};

head.ready(function() {
// Remove the loadinng
$('body').css('background-image', 'none');
//$('#content').html('ready');
$("img.init-loading", $('#content')).attr("src", "/img/ajax-loader-cursor.gif");
head.js({"core" : 'jscore/min/js-all-min.js' + "?_=" + _AGILE_VERSION});
head.js({"stats" : 'stats/min/agile-min.js' + "?_=" + _AGILE_VERSION});
head.ready(["core", "stats"], function(){
	
	if(!HANDLEBARS_PRECOMPILATION)
		downloadTemplate("tpl.js");
});
});

</script>

<!-- Unified CSS for All Lib -->

<link rel="stylesheet" type="text/css" href="css/misc/agile-tasks.css"></link>
<link rel="stylesheet" type="text/css" href="css/misc/agile-social-suite.css"></link>
 <link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/misc/agile-timline.css"></link>
 <link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/misc/agile-widgets.css"></link>
 <link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/chrome-extension-check.css"></link>
 <link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/bootstrap_submenu.css"></link>
<!-- <link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/misc/date-picker.css"></link> -->


<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/lib.css"></link>
<link rel="stylesheet" type="text/css" href="css/contacts-new-ui.css">
<link rel="stylesheet" type="text/css" href="css/agile-css-framework.css">
<!-- Google analytics code -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-44894190-1', 'auto');
  ga('send', 'pageview');
 
</script>


<!-- ClickDesk Live Chat Service for websites -->
<script type='text/javascript'>
var _glc =_glc || []; _glc.push('all_ag9zfmNsaWNrZGVza2NoYXRyDgsSBXVzZXJzGKD0uQoM');
var glcpath = (('https:' == document.location.protocol) ? 'https://my.clickdesk.com/clickdesk-ui/browser/' : 
'http://my.clickdesk.com/clickdesk-ui/browser/');
var glcp = (('https:' == document.location.protocol) ? 'https://' : 'http://');
</script>
<!-- End of ClickDesk -->

</body>
</html>