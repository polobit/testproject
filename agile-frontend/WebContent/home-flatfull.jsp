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

BillingRestriction restriction = BillingRestrictionUtil.getBillingRestriction(null, null);
boolean is_free_plan = false;

if(restriction != null && restriction.planDetails != null)
    is_free_plan = restriction.planDetails.isFreePlan();

Boolean is_first_time_user = HomeServlet.isFirstTimeUser(request);;

Plan plan = null;
if(is_free_plan && is_first_time_user)
{
    plan = SubscriptionUtil.getSignupPlanFromSessionAndRemove(request);
}
%>


<meta name="last-login-time"
content="<%=domainUser.getInfo(DomainUser.LAST_LOGGED_IN_TIME)%>" />


<%
    String CSS_PATH = "/";
	String FLAT_FULL_PATH = "flatfull/";
//String CSS_PATH = "//cdnapp.agilecrm.com/";
%>

<link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/agilecrm.css" />

<!-- Unified CSS for All Lib -->

<link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/misc/agile-tasks.css"></link>
<link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/misc/agile-social-suite.css"></link>
 <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/misc/agile-timline.css"></link>
 <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/misc/agile-widgets.css"></link>
 <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/chrome-extension-check.css"></link>
 <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/bootstrap_submenu.css"></link>
  <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/lib/timepicker-min.css"></link>

<!-- <link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/misc/date-picker.css"></link> -->


<link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/lib.css"></link>
<link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/contacts-new-ui.css">



<!--  bootstrap 3 files -->
<%
	String ui = request.getParameter("ui");
	String css = request.getParameter("css");
	String cssWrap = request.getParameter("cssWrap");
	System.out.println(ui);
	System.out.println(css);
	System.out.println(cssWrap);
	
	System.out.println(CSS_PATH + "css/bootstrap.css />");
	
	String cssLink = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + FLAT_FULL_PATH + "css/bootstrap.v3.min.css\" />";
	
	System.out.println(cssLink);
	if(ui != null)
	    cssLink = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + FLAT_FULL_PATH + "css/bootstrap-" + ui + ".css/>";
	else if(css != null)
	{
	    cssLink = "<link rel=\"stylesheet\" type=\"text/css\" href=\"/cssloader?link="+css + "\"/>";
	    if(cssWrap != null)
		cssLink += "\n<link rel=\"stylesheet\" type=\"text/css\" href=\"/cssloader?link="+cssWrap + "\"/>";
	}
	    
	    
	System.out.println(cssLink);    
%>

<%=cssLink %>
 <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/typeahead.css">

<!--  font awesome files -->

 <link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet"> 
<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet"> 

 
<!--  agile app framework  -->
<link rel="stylesheet" href="<%=FLAT_FULL_PATH%>css/flatfull/animate.css" type="text/css" />
<link rel="stylesheet" href="<%=FLAT_FULL_PATH%>css/flatfull/font-awesome.min.css" type="text/css" />
<link rel="stylesheet" href="<%=FLAT_FULL_PATH%>css/flatfull/simple-line-icons.css" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/font.css">
<link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/app.css">
<link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/agile-css-framework.css">
<link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/migration.css" />


<!-- <link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/bootstrap-<%=template%>.min.css" /> -->
<!-- <link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/bootstrap-responsive.min.css" /> -->

<style>
.clickdesk_bubble {
	display: none !important;
}
</style>
 <!-- <script src='http://cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.load.min.js'></script> -->
<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.js'></script>
<!--  responsive table js -->

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
<script src="lib/ie/html5.js"></script>
<![endif]-->

<!--[if lt IE 8]>
<script src="lib/ie/json.js"></script>
<![endif]-->
</head>



<body>

 <!-- <div  class="settings panel panel-default ">
  <button class="btn btn-default no-shadow pos-abt ng-scope toggle-inactive" ui-toggle-class="active" target=".settings">
    <i class="fa fa-spin fa-gear"></i>
  </button>
  <div class="panel-heading ">
    Settings
  </div>
  <div class="panel-body ng-scope"> 
    <div class="m-b-sm">
      <label class="i-checks i-checks i-checks-sm pull-right"><input type="checkbox" id="check-fix-head" class="tbody_check" value=""><i></i></label>
      Fixed header 
    </div>
    <div class="m-b-sm">
      <label class="i-checks i-checks i-checks-sm pull-right"><input type="checkbox" id="check-fix-aside" class="tbody_check" value=""><i></i></label>
      Fixed aside 
    </div>
    <div class="m-b-sm">
      <label class="i-checks i-checks i-checks-sm pull-right"><input type="checkbox" id="check-fold-aside" class="tbody_check" value=""><i></i></label>
      Folded aside 
    </div>
    <div class="m-b-sm">
      <label class="i-checks i-checks i-checks-sm pull-right"><input type="checkbox" id="check-dock-aside" class="tbody_check" value=""><i></i></label>
      Dock aside
    </div>
    <div>
      <label class="i-checks i-checks i-checks-sm pull-right"><input type="checkbox" id="check-box-layout" class="tbody_check" value=""><i></i></label>
      Boxed layout
    </div>
  </div>
  <div class="wrapper b-t b-light bg-light lter r-b magicMenu">
    <div class="row row-sm">
      <div class="col-xs-6">
        <label class="i-checks i-checks-sm block m-b">
          <input type="radio" name="a" target-aside-class="bg-black" target-logo-class="bg-black" target-topbar-class="bg-white-only" value="1" class="ng-valid ng-dirty ng-touched ng-valid-parse">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-black header"></b>
            <b class="bg-white header"></b>
            <b class="bg-black"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block m-b">
          <input type="radio" name="a" target-aside-class="bg-dark" target-logo-class="bg-dark" target-topbar-class="bg-white-only"  value="13" class="ng-valid ng-dirty ng-touched">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-dark header"></b>
            <b class="bg-white header"></b>
            <b class="bg-dark"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block m-b">
          <input type="radio"  name="a" target-aside-class="bg-black" target-logo-class="bg-white-only" target-topbar-class="bg-white-only" value="2">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-white header"></b>
            <b class="bg-white header"></b>
            <b class="bg-black"></b>
          </span>
        </label>

        <label class="i-checks block m-b">
          <input type="radio"  name="a" target-aside-class="bg-dark" target-logo-class="bg-primary" target-topbar-class="bg-white-only"  value="3" >
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-primary header"></b>
            <b class="bg-white header"></b>
            <b class="bg-dark"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block m-b">
          <input type="radio" name="a" target-aside-class="bg-black" target-logo-class="bg-info" target-topbar-class="bg-white-only"  value="4">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-info header"></b>
            <b class="bg-white header"></b>
            <b class="bg-black"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block m-b">
          <input type="radio" name="a" target-aside-class="bg-dark" target-logo-class="bg-success" target-topbar-class="bg-white-only"  value="5" >
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-success header"></b>
            <b class="bg-white header"></b>
            <b class="bg-dark"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block">
          <input type="radio" name="a" target-aside-class="bg-dark" target-logo-class="bg-danger" target-topbar-class="bg-white-only"  name="39">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-danger header"></b>
            <b class="bg-white header"></b>
            <b class="bg-dark"></b>
          </span>
        </label>
      </div>
      <div class="col-xs-6">
        <label class="i-checks i-checks-sm block m-b">
          <input type="radio" name="a" target-aside-class="bg-white" target-logo-class="bg-black" target-topbar-class="bg-black"  value="7" class="ng-valid ng-dirty ng-touched">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-black header"></b>
            <b class="bg-black header"></b>
            <b class="bg-white"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block m-b">
          <input type="radio" name="a" target-aside-class="bg-light" target-logo-class="bg-dark" target-topbar-class="bg-dark"  value="14" >
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-dark header"></b>
            <b class="bg-dark header"></b>
            <b class="bg-light"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block m-b">
          <input type="radio" name="a" target-aside-class="bg-light-dker" target-logo-class="bg-info-dker" target-topbar-class="bg-info-dker"  value="8">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-info dker header"></b>
            <b class="bg-info dker header"></b>
            <b class="bg-light dker"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block m-b">
          <input type="radio" name="a" target-aside-class="bg-dark" target-logo-class="bg-primary" target-topbar-class="bg-primary"  value="9">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-primary header"></b>
            <b class="bg-primary header"></b>
            <b class="bg-dark"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block m-b">
          <input type="radio" name="a" target-aside-class="bg-black" target-logo-class="bg-info-dker" target-topbar-class="bg-info-dk"  value="10">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-info dker header"></b>
            <b class="bg-info dk header"></b>
            <b class="bg-black"></b>
          </span>
        </label>

        <label class="i-checks i-checks-sm block m-b">
          <input type="radio"  name="a" target-aside-class="bg-dark" target-logo-class="bg-success" target-topbar-class="bg-success" value="11">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-success header"></b>
            <b class="bg-success header"></b>
            <b class="bg-dark"></b>
          </span>
        </label>
        
        <label class="i-checks i-checks-sm block">
          <input type="radio"  name="a" target-aside-class="bg-dark" target-logo-class="bg-danger-dker" target-topbar-class="bg-danger-dker" value="12">
          <span class="block bg-light clearfix pos-rlt">
            <span class="active pos-abt w-full h-full bg-black-opacity text-center">
              <i class="glyphicon glyphicon-ok text-white m-t-xs"></i>
            </span>
            <b class="bg-danger dker header"></b>
            <b class="bg-danger dker header"></b>
            <b class="bg-dark"></b>
          </span>
        </label>
      </div>
    </div>
  </div>
</div>  -->



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
<jsp:include page="flatfull/header.jsp" />

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
  </li id="dealsmenu">
   <li>
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
      <span>Documents</span>
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
  <li class='<%if(currentUserPrefs.menuPosition.equals("top")){out.print("dockedicons ");} else{out.print("fixedicons ");} %>' id="planView"> <a href="#subscribe"><i class="icon-shopping-cart"></i> <span> Plan &amp; Upgrade </span></a></li>
  <li class='pos-b-0 <%if(currentUserPrefs.menuPosition.equals("top")){out.print("dockedicons ");} else{out.print("fixedicons ");} %>' id ="helpView"><a href="#help"><i class="icon-question"></i>
											<span> Help </span></a></li>
  </ul>
  </nav>
  </div>
  </div>
  </aside>
<div class="app-content" id="agilecrm-container">
<div class="butterbar animation-active"><span class="bar"></span></div>
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


                <%@ include file="tpl/min/precompiled/flatfull/tpl.html"%>   


</div>
<!-- Including Footer page -->
<jsp:include page="flatfull/footer.jsp" />


<!-- <script src='https://dpm72z3r2fvl4.cloudfront.net/js/lib/headjs-min.js'></script> -->
<!-- <script src='/lib/headjs-min.js'></script> -->



<script>
//var LIB_PATH = "//dpm72z3r2fvl4.cloudfront.net/js/";
//var LIB_PATH = "//cdnapp.agilecrm.com/";
var LIB_PATH = "";

var LIB_PATH_FLATFULL = "flatfull/";

var FLAT_FULL_PATH = LIB_PATH_FLATFULL;

LIB_PATH = LIB_PATH_FLATFULL;

var FLAT_FULL_UI = "flatfull/";

var HANDLEBARS_PRECOMPILATION = false || <%=production%>;


var CSS_PATH = FLAT_FULL_UI;
//var CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";

var IS_CONSOLE_ENABLED = <%=debug%>;
var LOCAL_SERVER = <%=debug%>;
var _IS_FREE_PLAN = <%=is_free_plan%>;

var IS_NEW_USER = <%=is_first_time_user%>;

var IS_FLUID = <%=is_fluid %>

var CLICKDESK_CODE_LOADED = false;

var _plan_on_signup = <%=mapper.writeValueAsString(plan)%>;

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
//var JQUERY_LIB_PATH = LIB_PATH + 'lib/jquery.min.js';


<!-- JQUery Core and UI CDN -->	
<!-- The same ajax libraries are used by designer - if you are changing the version here, change in designer too -->
head.load("//code.jquery.com/jquery-1.10.2.js", "//code.jquery.com/jquery-migrate-1.2.1.js", LIB_PATH_FLATFULL + "/lib/agile/agile-jquery-migration.js", LIB_PATH_FLATFULL + "lib/bootstrap.js", LIB_PATH_FLATFULL + 'lib/bootstrap3-typeahead.js', LIB_PATH_FLATFULL + 'lib/jquery.validate.min.js', LIB_PATH_FLATFULL + 'lib/bootstrap-datepicker-min.js',LIB_PATH_FLATFULL + 'lib/date-formatter.js', LIB_PATH_FLATFULL + 'lib/bootstrap-timepicker-min.js');

<!-- Backbone -->
head.js(LIB_PATH + 'lib/underscore-min.js', LIB_PATH + 'lib/backbone-min.js', LIB_PATH + 'lib/infiniscroll.js');

<!-- Handle bars -->

if(HANDLEBARS_PRECOMPILATION)
head.js(HANDLEBARS_LIB,   "tpl/min/precompiled/" + FLAT_FULL_PATH + "tpl.js");
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
head.js({"core" :   '/jscore/min/' + FLAT_FULL_PATH +'js-all-min.js'});
head.js({"stats" : 'stats/min/agile-min.js'});
head.ready(["core", "stats"], function(){
	
	if(!HANDLEBARS_PRECOMPILATION)
		downloadTemplate(FLAT_FULL_PATH + "tpl.js");
});
});

</script>

<!--  <script type="text/javascript" src="js/flatfull/app.min.js"></script>  -->





<!--  responsive table -->

<!-- <link rel="stylesheet" type="text/css" href="/css/responsive-table/responsive-tables.css"> -->



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
