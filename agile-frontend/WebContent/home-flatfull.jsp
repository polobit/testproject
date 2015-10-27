<!DOCTYPE html>
<%@page import="com.agilecrm.util.VersioningUtil"%>
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

//Update workflow entities if they are not initialized
//with new is_disabled property
if(!accountPrefs.workflows_updated)
	AccountPrefsUtil.postDataToUpdateWorkflows(accountPrefs,domainUser);

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

Boolean is_first_time_user = HomeServlet.isFirstTimeUser(request);;

Plan plan = null;
if(is_free_plan && is_first_time_user)
{
    plan = SubscriptionUtil.getSignupPlanFromSessionAndRemove(request);
}

String _AGILE_VERSION = SystemProperty.applicationVersion.get();

String _VERSION_ID = VersioningUtil.getVersion();
%>


<meta name="last-login-time"
content="<%=domainUser.getInfo(DomainUser.LAST_LOGGED_IN_TIME)%>" />


<%
  String CSS_PATH = "/";
  String FLAT_FULL_PATH = "flatfull/";

  String CLOUDFRONT_TEMPLATE_LIB_PATH = VersioningUtil.getCloudFrontBaseURL();
  
  System.out.println(CLOUDFRONT_TEMPLATE_LIB_PATH);
    
  String CLOUDFRONT_STATIC_FILES_PATH = VersioningUtil.getStaticFilesBaseURL();

  CSS_PATH = CLOUDFRONT_STATIC_FILES_PATH;
  if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
  {
	  CLOUDFRONT_STATIC_FILES_PATH = FLAT_FULL_PATH;
	  CLOUDFRONT_TEMPLATE_LIB_PATH = "";	
	  CSS_PATH = FLAT_FULL_PATH;
  }
%>

<!-- <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/agile-all.css?_=<%=_AGILE_VERSION%>" />  -->
<!-- <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/lib-min.css"></link> -->
<link rel="stylesheet" type="text/css" href="flatfull/css/min/lib-all-new.css?_=<%=_AGILE_VERSION%>"></link>
<!-- <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/agile-app-framework.css">  -->
<link rel="stylesheet" type="text/css" href="flatfull/css/min/misc-all-new.css?_=<%=_AGILE_VERSION%>"></link>
<link rel="stylesheet" type="text/css" href="flatfull/css/min/core-all-new.css?_=<%=_AGILE_VERSION%>"></link>

<style>
.clickdesk_bubble {
  display: none !important;
}


</style>
<!--  responsive table js -->
<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
<script src="lib/ie/html5.js"></script>
<![endif]-->

<!--[if lt IE 8]>
<script src="lib/ie/json.js"></script>
<![endif]-->
</head>



<body class='<%if(!currentUserPrefs.animations) out.print("disable-anim");%>'>

<div id="wrap" class="app app-aside-folded-inactive app-header-fixed app-aside-fixed 
<% 
if(currentUserPrefs.menuPosition.equals("top")){
  out.print("app-aside-dock ");
}else if(currentUserPrefs.menuPosition.equals("leftcol")){
  out.print("app-aside-folded ");
  }
/* if(currentUserPrefs.layout.equals("fixed")){
  out.print("container ");
  } */

%>">

<!-- Including header(Navigation Bar) page -->
  <%@ include file="flatfull/header.html"%>

 <aside id="aside" class="app-aside hidden-xs 
 <%
  switch (Integer.parseInt(currentUserPrefs.theme)) {
    case 1:  out.print("bg-black ");
           break;
    case 2:  out.print("bg-black ");
         break;
    case 3:  out.print("bg-dark ");
         break;
    case 4:  out.print("bg-black ");
         break;
    case 5:  out.print("bg-dark ");
         break;
    case 6:  out.print("bg-dark ");
         break;
    case 7:  out.print("bg-white b-r ");
         break;
    case 8:  out.print("bg-light dker b-r ");
         break;
    case 9:  out.print("bg-dark ");
         break;
    case 10:  out.print("bg-black ");
         break;
    case 11:  out.print("bg-dark ");
         break;
    case 12:  out.print("bg-dark ");
         break;
    case 13:  out.print("bg-dark ");
         break;
    case 14:  out.print("bg-light ");
         break;
    default:
            break;
 
  }
      
 %>">
          <div class="aside-wrap">
        <div class="navi-wrap">
  
  <nav  class="navi clearfix">
            <ul class="nav">
              <li class="hidden-folded padder m-t m-b-sm text-muted text-xs">
                <span>Sales</span>
              </li>
              
  <li id="contactsmenu">
    <a  href="#contacts">
      <i class="icon icon-user"></i>
      <span>Contacts</span>
    </a>
  </li>
  <li id="companiesmenu">
    <a  href="#companies">
      <i class="icon icon-building"></i>
      <span>Companies</span>
    </a>
  </li>
   <li  id="dealsmenu">
    <a  href="#deals">
      <i class="fa fa-money"></i>
      <span>Deals</span>
    </a>
  </li>
   <li id="casesmenu">
    <a  href="#cases">
      <i class="icon icon-folder"></i>
      <span>Cases</span>
    </a>
  </li>
   <li id="documentsmenu">
    <a  href="#documents">
      <i class="icon icon-doc"></i>
      <span><%if(currentUserPrefs.menuPosition.equals("leftcol")){%>Docs<%}else{ %>Documents<%} %></span>
    </a>
  </li>
  <li class="line dk"></li>
    <li class="hidden-folded padder m-t m-b-sm text-muted text-xs">
                <span>Marketing</span>
              </li>
   <li id="workflowsmenu">
    <a  href="#workflows">
      <i class="icon icon-sitemap"></i>
      <span>Campaigns</span>
    </a>
  </li>
   <li id="socialsuitemenu">
    <a  href="#social">
      <i class="icon icon-comments"></i>
      <span>Social</span>
    </a>
  </li>
   <li id="web-rules-menu">
    <a  href="#web-rules">
      <i class="icon icon-globe"></i>
      <span>Web Rules</span>
    </a>
  </li>
  <!-- <li id="web-pages-menu">
    <a href="#webpages">
      <i class="fa fa-file-code-o"></i>
      <span>Web Pages</span>
    </a>
  </li> -->
    <li id="activitiesmenu">
    <a  href="#activities">
      <i class="icon-cogs icon-white"></i>
      <span>Activities</span>
    </a>
  </li>
  <li id="reportsmenu">
    <a  href="#reports">
      <i class="icon-bar-chart icon-white"></i>
      <span>Reports</span>
    </a>
  </li>
  <!-- <li class='<%if(currentUserPrefs.menuPosition.equals("top")){out.print("dockedicons ");} else{out.print("fixedicons ");} %>' id="planView"> <a href="#subscribe"><i class="icon-shopping-cart"></i> <span> Plan &amp; Upgrade </span></a></li>
  <li class='pos-b-0 <%if(currentUserPrefs.menuPosition.equals("top")){out.print("dockedicons ");} else{out.print("fixedicons ");} %>' id ="helpView"><a href="#help"><i class="icon-question"></i>
                      <span> Help </span></a></li> -->
  </ul>
  </nav>
  </div>
  </div>
  </aside>
<div class="app-content" id="agilecrm-container">
<div id="call-campaign-content" class="box-shadow width-min-100p height-min-100p z-lg" style = "background-color: #edf1f2;"></div> 
<div class="butterbar animation-active" style="z-index:99;"><span class="bar"></span></div>
<div id="content" class="app-content-body">
<!-- <img class="init-loading" style="padding-right: 5px"
src="img/21-0.gif"></img> -->
</div>
</div>
<div id="push"></div>

<!-- Notifications -->
<div class='notifications top-left'></div>
<div class='notifications top-right'></div>
<div class='notifications bottom-left'></div>
<div class='notifications bottom-right'></div>

<div id='templates'></div>

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

 <%@ include file="tpl/min/precompiled/flatfull/tpl.html"%> 
</div>
<!-- Including Footer page -->
<jsp:include page="flatfull/footer.jsp" />

<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
<script>

//var LIB_PATH = "//-dpm72z3r2fvl4.cloudfront.net/js/";
//var LIB_PATH = "//cdnapp.agilecrm.com/";
var LIB_PATH = '<%=CLOUDFRONT_STATIC_FILES_PATH%>';

var FLAT_FULL_PATH = '<%=FLAT_FULL_PATH%>';

// Target to cloudfront URL
var LIB_PATH_FLATFULL = '<%=CLOUDFRONT_TEMPLATE_LIB_PATH + FLAT_FULL_PATH%>'

var CLOUDFRONT_PATH = '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>';


var FLAT_FULL_UI = "flatfull/";  

var _AGILE_VERSION = <%="\"" + _AGILE_VERSION + "\""%>;

var HANDLEBARS_PRECOMPILATION = false || <%=production%>;

var CSS_PATH = '<%=CSS_PATH%>';
// var CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";

var IS_CONSOLE_ENABLED = <%=debug%>;
var LOCAL_SERVER = <%=debug%>;
var _IS_FREE_PLAN = <%=is_free_plan%>;

var IS_NEW_USER = <%=is_first_time_user%>;

var IS_FLUID = <%=is_fluid %>

var CLICKDESK_CODE_LOADED = false;

var _plan_on_signup = <%=mapper.writeValueAsString(plan)%>;

// Get current user prefs json
var CURRENT_USER_PREFS = <%=UserPrefsUtil.getMapperString(currentUserPrefs)%>;

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
//var JQUERY_LIB_PATH = LIB_PATH + 'lib/jquery.min.js';

// head.load("https://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js", LIB_PATH + 'final-lib/min/lib-all-min.js', LIB_PATH + 'lib/backbone-route-filter.js');

<!-- JQUery Core and UI CDN --> 
<!-- The same ajax libraries are used by designer - if you are changing the version here, change in designer too -->
head.load("https://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js", LIB_PATH + "lib/bootstrap.js",  LIB_PATH + 'final-lib/min/lib-all-min.js?_=' + _AGILE_VERSION, function(){
        load_globalize();
})
// , LIB_PATH + 'lib/backbone-route-filter.js'

if(HANDLEBARS_PRECOMPILATION)
head.js(HANDLEBARS_LIB, CLOUDFRONT_PATH + "tpl/min/precompiled/" + FLAT_FULL_PATH + "tpl.js" + "?_=" + _AGILE_VERSION);
else
	head.js(HANDLEBARS_LIB, FLAT_FULL_PATH + "jscore/handlebars/download-template.js" + "?_=" + _AGILE_VERSION);

var en;


// Fetch/Create contact from our domain
var Agile_Contact = {};


head.ready(function() {
	
if(!HANDLEBARS_PRECOMPILATION)
    downloadTemplate("tpl.js", function(){		         
    });
	
// Remove the loadinng
$('body').css('background-image', 'none');
//$('#content').html('ready');
$("img.init-loading", $('#content')).attr("src", "<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>/img/ajax-loader-cursor.gif");
head.js({"core" :   CLOUDFRONT_PATH + 'jscore/min/' + FLAT_FULL_PATH +'js-all-min.js' + "?_=" + _AGILE_VERSION});
// head.js({"stats" : '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>stats/min/agile-min.js' + "?_=" + _AGILE_VERSION});
head.ready(["core"], function(){
	 $('[data-toggle="tooltip"]').tooltip();  
});

});    
function load_globalize()
{

  Globalize.load(Globalize_Main_Data);
  en = Globalize("en");

}

/**
 * Downloads the template synchronously (stops other browsing actions) from the
 * given url and returns it
 * 
 * @param {String}
 *            url location to download the template
 * @returns down-loaded template content
 */
function downloadTemplate(url, callback)
{

	var dataType = 'html', template_url = CLOUDFRONT_PATH;


	// If Precompiled is enabled, we change the directory to precompiled. If
	// pre-compiled flat is set true then template path is sent accordingly
	if (HANDLEBARS_PRECOMPILATION)
	{
		url = "tpl/min/precompiled/" + FLAT_FULL_UI +  url;
	}
	else
		url = "tpl/min/" + FLAT_FULL_UI +  url;

	// If JS
	if (url.endsWith("js") && HANDLEBARS_PRECOMPILATION)
	{
		dataType = 'script';
		template_url = template_url.replace("flatfull/", "");
		url = template_url + url;
	}

	url += "?_=" + _AGILE_VERSION;
	
	// If callback is sent to this method then template is fetched synchronously
	var is_async = false;
	if (callback && typeof (callback) === "function")
		is_async = true;

	console.log(url + " " + dataType + " " + is_async);

	var is_cached = !LOCAL_SERVER;

	jQuery.ajax({ url : url, dataType : dataType, cache:is_cached, success : function(result)
	{
		// If HTMl, add to body
		if (dataType == 'html')
			$('body').append((result));

		if (is_async)
			callback(result);
	}, async : is_async });

	return "";
}
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