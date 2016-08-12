<!DOCTYPE html>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="com.agilecrm.user.DomainUser.ROLE"%>
<%@page import="com.campaignio.servlets.deferred.WorkflowAddAccessLevelDeferredTask"%>
<%@page import="com.google.appengine.api.taskqueue.Queue"%>
<%@page import="com.agilecrm.ipaccess.IpAccessUtil"%>
<%@page import="com.agilecrm.subscription.Subscription"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="com.campaignio.servlets.deferred.DomainUserAddPicDeferredTask"%>
<%@page import="com.google.appengine.api.taskqueue.TaskOptions"%>
<%@page import="com.google.appengine.api.taskqueue.QueueFactory"%>
<%@page import="com.agilecrm.activities.util.TaskUtil"%>
<%@page import="com.agilecrm.SafeHtmlUtil"%>
<%@page import="com.agilecrm.contact.CustomFieldDef.SCOPE"%>
<%@page import="com.agilecrm.contact.util.CustomFieldDefUtil"%>
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
<%@page import="com.agilecrm.dashboards.Dashboard"%>
<%@page import="com.agilecrm.dashboards.util.DashboardUtil"%>
<%@page import="java.util.List"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>



<html lang="en">
<head>
<meta charset="utf-8">
<title>Agile CRM Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">
<meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/eofoblinhpjfhkjlfckmeidagfogclib">

<%
	if( !(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) )
	{
%>
<%@ include file="file-hash.json"%>
<%
	}
%>
<script type="text/javascript">
	var _AGILE_FILE_HASH;
	
	function _agile_get_file_hash(filename)
	{
    if(true)
      return _AGILE_VERSION;
      
		if( !filename || filename == '' )	return _AGILE_VERSION;
		
		if( _AGILE_FILE_HASH && _AGILE_FILE_HASH[filename] )	return _AGILE_FILE_HASH[filename];
		
		return _AGILE_VERSION;
	}
</script>

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>


<%
    //Check if it is being access directly and not through servlet
if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
response.sendRedirect("/login");
return;
}




DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();

System.out.println("Domain user " + domainUser);

ObjectMapper mapper = new ObjectMapper();

String panel = request.getParameter("sp");
if(panel == null)
	panel = "false";
String clientIP = request.getRemoteAddr();

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
//Temp Code 
//Can remove after 12 mar 2016 
if(restriction.max_emails_count != null && restriction.max_emails_count > 0 && restriction.max_emails_count <=100){
  restriction.max_emails_count = 0;
  restriction.one_time_emails_count = 0;
  restriction.save();
  restriction = BillingRestrictionUtil.getBillingRestritionAndSetInCookie(request);
}
//End of temp code

if(restriction != null && restriction.checkToUpdateFreeEmails()){
	restriction.refreshEmails();
	restriction = BillingRestrictionUtil.getBillingRestritionAndSetInCookie(request);
}
Subscription subscription = SubscriptionUtil.getSubscription(true);
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

List<Dashboard> dashboardsList = DashboardUtil.getAddedDashboardsForCurrentUser();

String _LANGUAGE = currentUserPrefs.language;
JSONObject localeJSON = LanguageUtil.getLocaleJSON(currentUserPrefs, application);
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
  
  // Static images s3 path
  String S3_STATIC_IMAGE_PATH = CLOUDFRONT_STATIC_FILES_PATH.replace("flatfull/", "");
  
  if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
  {
	  CLOUDFRONT_STATIC_FILES_PATH = FLAT_FULL_PATH;
	  CLOUDFRONT_TEMPLATE_LIB_PATH = "";	
	  CSS_PATH = FLAT_FULL_PATH;
  }
%>

<!-- <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/agile-all.css?_=<%=_AGILE_VERSION%>" />  -->
<!-- <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/lib-min.css"></link> -->
<!-- <link rel="stylesheet" type="text/css" href="<%=FLAT_FULL_PATH%>css/agile-app-framework.css">  -->

<!--<link rel="stylesheet" type="text/css" href="flatfull/css/min/lib-all-new.css?_=<%=_AGILE_VERSION%>"></link>
<link rel="stylesheet" type="text/css" href="flatfull/css/min/misc-all-new.css?_=<%=_AGILE_VERSION%>"></link>
<link rel="stylesheet" type="text/css" href="flatfull/css/min/core-all-new.css?_=<%=_AGILE_VERSION%>"></link>-->

<link rel="stylesheet" type="text/css" href="flatfull/css/min/css-all-min.css?_=<%=_AGILE_VERSION%>"></link>

<style>
.clickdesk_bubble {
  display: none !important;
}

.leftcol-menu-folded{display: none;}
.leftcol-menu-expanded{display: block;}
.app-aside-folded .leftcol-menu-folded {display: block;}
.app-aside-folded .leftcol-menu-expanded {display: none;}
.app-aside-dock .leftcol-menu-expanded {display: none!important;}
.search label { position:absolute; margin:5px 0 0 5px; }
.search input[type="text"]{
    text-indent:1px;
    padding:0 0 0 22px;
    width:0;
    height:22px;
    
    border:1px solid #ccc;
    color:#000;
   
    -webkit-transition:width 0.5s ease-in-out;
    -moz-transition:width 0.5s ease-in-out;
    cursor:pointer;
}
.search input[type="text"]:focus{
    width:200px;
    outline:none;
    cursor:text;
}
.free_plan_alert{
  padding-top: 5px;
  padding-bottom: 7px;
  z-index: 1;top: 65px;
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  margin: 0px auto;
  width: 280px;
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

<script type="text/javascript">
function isIE() {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

 if(isIE() && isIE() < 10)
 {window.location='/error/not-supported.jsp';}

</script>
<div id="alert-message" style="display:none;"></div>

<div id="free_plan_alert_info" class="free_plan_alert alert alert-info" role="alert" style="display:none;"> 
  <span class="free_plan_message">
   <%=LanguageUtil.getLocaleJSONValue(localeJSON, "you-are-currently-on-free-plan") %>.
  </span>
  <a href="#subscribe" class="text-info font-bold" onclick="Agile_GA_Event_Tracker.track_event('Upgrade from Nav Bar Message')"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "noty-upgrade") %></a>
  <span class="free_plan_strip_close p-l-sm c-p">&times</span>
</div>

<div rel="popover" data-custom-popover-class='grid_custom_popover' data-trigger="click"  data-original-title="" title="" data-placement="bottom" class="need_help grid_icon_center hidden-xs <%
          switch (Integer.parseInt(currentUserPrefs.theme)) {
            case 1:  out.print("bg-white-only ");
                   break;
            case 2:  out.print("bg-white-only ");
                 break;
            case 3:  out.print("bg-white-only ");
                 break;
            case 4:  out.print("bg-white-only ");
                 break;
            case 5:  out.print("bg-white-only ");
                 break;
            case 6:  out.print("bg-white-only ");
                 break;
            case 7:  out.print("bg-black ");
                 break;
            case 8:  out.print("bg-info dker ");
                 break;
            case 9:  out.print("bg-primary ");
                 break;
            case 10:  out.print("bg-info dk ");
                 break;
            case 11:  out.print("bg-success ");
                 break;
            case 12:  out.print("bg-danger dker ");
                 break;
            case 13:  out.print("bg-white-only ");
                 break;
            case 14:  out.print("bg-dark ");
                 break;
            default:
                    break;
         
          }
              
         %>" screen_name="Need Help? We are one click away." data-content="<div class='row' id='need_help_header'>
                  <ul class='col-xs-12 col-sm-12 grid-sub-nav text-center m-t-md p-l-md p-r-md'>
                    
                <li class='pull-left m-b-sm'><a href='#' class='menu-service-select' data-service-name='SALES' data-dashboard='SalesDashboard'><i class='thumb'><img src='img/sales.svg'></i><span class='block'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "sales") %></span></a></li>

                <li class='pull-left m-b-sm'><a href='#' class='menu-service-select' data-service-name='MARKETING' data-dashboard='MarketingDashboard'><i class='thumb'><img src='img/marketing.svg'></i> <span class='block'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-marketing") %></span></a></li>

                <li class='pull-left m-b-sm'><a href='#' class='menu-service-select' data-service-name='SERVICE' data-dashboard='dashboard'><i class='thumb'><img src='img/service.svg'></i> <span class='block'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "service") %></span></a></li>

                </ul>
                </div>
                
                  </div>">
                   <a href="#" class='grid-icon-header block wrapper' onclick="return false;"><i class="glyphicon glyphicon-th"></i></a>    
               </div>

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
  
  <nav  class="navi clearfix" id="agile-menu-navigation-container">
  	<ul class="nav">
  	
	<!-- Sales menu -->  	
  <%if(domainUser.role == ROLE.SALES){ %>
   <li class="hidden-folded padder m-t-xs m-b-xs text-muted text-xs">
     <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "sales") %></span>
   </li>
        
  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CONTACT)){
  %>      
  <li id="contactsmenu">
    <a  href="#contacts">
      <i class="icon icon-user"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-contacts") %></span>
    </a>
  </li>
  <%
      }
  %>

  <li id="companiesmenu">
    <a  href="#companies">
      <i class="icon icon-building"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-companies") %></span>
    </a>
  </li>

  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.DEALS)){
  %>
   <li  id="dealsmenu">
    <a  href="#deals">
      <i class="fa fa-money"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-deals") %></span>
    </a>
  </li>
  <%
      }
  %>
  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CASES) && domainUser.version == null){
  %>
  <li id="casesmenu">
    <a  href="#cases">
      <i class="icon icon-folder"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-cases") %></span>
    </a>
  </li> 
  <%
      }
  %>
  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.DOCUMENT)){
  %>
  
   <li id="documentsmenu">
    <a  href="#documents">
      <i class="icon icon-doc"></i>
      <span class="leftcol-menu-folded"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-docs") %></span>
      <span class="leftcol-menu-expanded"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-documents") %></span>
      <%if(currentUserPrefs.menuPosition.equals("leftcol")){%>
      <%}else {%>
      <%}%>
    </a>
  </li>
  <%
        }
  %>  
  
  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CALENDAR)){
  %>
  
  <li id="calendarmenu">
    <a href="#calendar" onclick="Agile_GA_Event_Tracker.track_event('Calendar Option in Nav Bar')">
    	<i class="icon icon-calendar"></i> 
    	<span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "calendar") %></span> 
    </a>
  </li>
  <%
        }
  %>  
  
  <li id="tasksmenu">
    <a href="#tasks" onclick="Agile_GA_Event_Tracker.track_event('Tasks Option in Nav Bar')">
      <i class="icon-list" data-original-title="" title=""></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "tasks") %></span>
      <span title="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "tasks-due") %>" class="navbar_due_tasks pull-right tasks-span-top">
          <span  id="due_tasks_count" class="badge badge-sm bg-danger"></span>
      </span>
    </a>
  </li>

  <li id="schedulingmenu">
    <a href="#scheduler-prefs" onclick="Agile_GA_Event_Tracker.track_event('Appointment scheduling Option in Nav Bar')">
      <i class="icon-tag" data-original-title="" title=""></i>
      <span>Online Calendar</span>
    </a>
  </li>

  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.ACTIVITY)){
    %>
    <li id="activitiesmenu">
    <a  href="#activities">
      <i class="icon-speedometer icon-white"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-activities") %></span>
    </a>
  </li>
    <%
          }
    %>
    <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.REPORT)){
    %>
  <li id="reportsmenu">
    <a  href="#reports">
      <i class="icon-bar-chart icon-white"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-reports") %></span>
    </a>
  </li> 
    <%
          }
    %> 
  
  <!-- End of Sales menu -->
  <%} %>

  
  <!--  <li class="line dk  m-t-none m-b-none" style="height: 1px;"></li> -->
  
  <!-- Marketing menu -->  	
  <%if(domainUser.role == ROLE.MARKETING){ %>
  <li class="hidden-folded padder m-t-xs m-b-xs text-muted text-xs">
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-marketing") %></span>
  </li>
   <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CAMPAIGN)){
   %>
   <li id="workflowsmenu">
    <a  href="#workflows">
      <i class="icon icon-sitemap"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-campaigns") %></span>
    </a>
  </li>

  <li id="triggersmenu">
    <a  href="#triggers">
      <i class="icon icon-magic-wand"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "triggers") %></span>
    </a>
  </li>
    <%
        }
    %>
    <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.WEBRULE)){
    %>
   <li id="web-rules-menu">
    <a  href="#web-rules">
      <i class="icon icon-globe"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-web-rules") %></span>
    </a>
  </li>
    <%
          }
    %>
     <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.VISITORS)){
    %>
   <li id="segmentationmenu">
    <a  href="#visitors">
       <i class="icon-eye"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-visitors") %></span> 
    </a>
  </li>
   <%
          }
    %>
     <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.LANDINGPAGES)){
    %>
  <li id="landing-pages-menu">
    <a href="#landing-pages">
      <i class="fa fa-file-code-o"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-landing-pages") %></span>
    </a>
  </li>
  <%
          }
    %>

  <%
  if(domainUser.is_admin){
  %>
  <li id="formsmenu">
    <a  href="#forms">
       <i class="icon-large1 icon-docs"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "forms") %></span>  
    </a>
  </li>
  <%}%>
  
  <li id="email-templates-menu">
    <a href="#email-templates">
      <i class="icon-envelope-letter"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "email-templates") %></span>
    </a>
  </li>

  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.SOCIAL)){
   %>
   <li id="socialsuitemenu">
    <a  href="#social">
      <i class="icon-bubbles"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-social") %></span>
    </a>
  </li>
    <%
          }
    %>
    
    <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.ACTIVITY)){
    %>
    <li id="activitiesmenu">
    <a  href="#activities">
      <i class="icon-speedometer icon-white"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-activities") %></span>
    </a>
  </li>
    <%
          }
    %>
    <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.REPORT)){
    %>
  <li id="reportsmenu">
    <a  href="#reports">
      <i class="icon-bar-chart icon-white"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-reports") %></span>
    </a>
  </li> 
  <li id="tasksmenu" class="hide">
    <a href="#tasks" onclick="Agile_GA_Event_Tracker.track_event('Tasks Option in Nav Bar')">
      <i class="icon-list" data-original-title="" title=""></i>
      <span>Tasks</span>
      <span title="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "tasks-due") %>" class="navbar_due_tasks pull-right tasks-span-top">
          <span  id="due_tasks_count" class="badge badge-sm bg-danger"></span>
      </span>
    </a>
  </li>
    <%
          }
    %> 
    
  <!-- End of Marketing menu -->
  <%} %>
  
  <!-- <li class="line dk m-t-none m-b-none" style="height: 1px;"></li> -->
  <!-- Service menu -->  	
  <%if(domainUser.role == ROLE.SERVICE){ %>
  
  <li class="hidden-folded padder m-t-xs m-b-xs text-muted text-xs">
    <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "service") %></span>
  </li>
  
  <li id="tickets">
    <a href="#tickets">
      <i class="icon icon-ticket"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "help-desk") %></span>
    </a>
  </li>

  <li id="tasksmenu" class="hide">
    <a href="#tasks" onclick="Agile_GA_Event_Tracker.track_event('Tasks Option in Nav Bar')">
      <i class="icon-list" data-original-title="" title=""></i>
      <span>Tasks</span>
      <span title="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "tasks-due") %>" class="navbar_due_tasks pull-right tasks-span-top">
          <span  id="due_tasks_count" class="badge badge-sm bg-danger"></span>
      </span>
    </a>
  </li>

  <%
  if(domainUser.is_admin && !domainUser.restricted_menu_scopes.contains(NavbarConstants.HELPDESK)){
  %>          
  <li id="ticketgroupsmenu">
    <a href="#ticket-groups">
      <i class="icon icon-users"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "groups") %></span>
    </a>
  </li>
  <li id="ticketlabelsmenu">
    <a href="#ticket-labels">
      <i class="icon icon-flag"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "labels") %></span>
    </a>
  </li>
  <li id="ticketcannedmessagesmenu">
    <a href="#canned-responses">
      <i class="icon icon-cursor"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "canned-responses") %></span>
    </a>
  </li>
  <li id="ticketviewsmenu">
    <a href="#ticket-views">
      <i class="icon icon-directions"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "views") %></span>
    </a>
  </li>
  <li id="ticketknowledgebasemenu">
    <a href="#knowledgebase">
      <i class="fa fa-search"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "knowledge-base") %></span>
    </a>
  </li>
   <%
      }
  %> 

  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.ACTIVITY)){
    %>
    <li id="activitiesmenu">
    <a  href="#activities">
      <i class="icon-speedometer icon-white"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-activities") %></span>
    </a>
  </li>
    <%
          }
    %>
    <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.REPORT)){
    %>
  <li id="reportsmenu">
    <a  href="#reports">
      <i class="icon-bar-chart icon-white"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-reports") %></span>
    </a>
  </li> 
    <%
          }
    %> 
 
  <!-- End of Service menu -->
  <%} %>
             
  </ul>




  </nav>

  <div id="navbar" class="pos-rlt navbar-collapse visible-xs hidden-sm navbar-view-mobile">
          <div class="nav navbar-nav hidden-xs">
<a href="#" id="app-aside-folded" style="top:8px;" class="p-b-sm p-l-sm p-r-sm inline-block pos-rlt pos-t-xs  no-shadow navbar-btn" ui-toggle="app-aside-folded" target=".app">
            <i class="fa fa-dedent fa-fw text"></i>
          <!--   <i class="fa fa-indent fa-fw text-active"></i> -->
          </a>
</div>

            <ul class="nav navbar-nav agile-menu">
              <li id="homemenu" class="active"></li>
              <%
                  if ("admin".equals(domainUser.domain)) {
                      out.println("<li><a href='#all-domain-users'><i class='icon-group'></i> All Domain Users</a></li></ul>");
                      out.println("<ul class='nav navbar-nav pull-right' style='float:right!important;'><li class='nav-bar-search'> <form id='domainSearchForm' class=' navbar-search'  style='margin: 5px;'> <input id='domainSearchText' class='form-control pull-left' type='text' style='line-height: 17px;width:85%;'  data-provide='typeahead'    placeholder='Search'></input> <input id='domain-search-results' type='image' src='img/SearchIcon.png' class='searchbox pull-left m-xs p-t-xs' /><div class='clearfix'></div></form></li><li><a href="
                          + logoutURL
                          + "><i class='icon-off'></i>Logout</a></li>");
                    } else {
              %>
              
             <!--  <li class="line dk"></li>
            <li class="hidden-folded padder m-t m-b-sm text-muted text-xs">
                <span>More</span>
              </li>
                <li data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Calendar"><a href="#calendar"><i class="icon icon-calendar"></i> <span class="visible-xs"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "calendar") %></span> </a></li>
                <li id="due_tasks"  data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Tasks"><a class="pos-rlt" href="#tasks"><i class="icon-list"></i>
                  <span class="visible-xs"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "tasks") %></span>
                      <span title="Tasks due" class="navbar_due_tasks pull-right-xs"><span  id="due_tasks_count" class="badge badge-sm up bg-danger"></span></span></a></li> -->
            </ul>
  
      <ul class="nav  navbar-nav  navbar-right show_shortcuts"> 
              <li rel="popover" data-trigger="click" class="need_help hidden-xs" screen_name='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "need-help") %>' data-content="<div class='row' id='need_help_header'  style='color:#7D7474'>
                  <div class='col-md-12 text-sm p-b-xs'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "need-help") %></div>
                </div>
                <div class='row m-none' style='color:#7D7474'>
                <div class='pull-left inline-block' style='width:50%;border-right: 1px solid #E2E4E4;'>
                 <div class='p-r-none p-l-none'>
                  <div class='text-center'>
                   <div class='text-xs' style='margin-top:-2px;padding-bottom:2px;'><b><a href='https://our.agilecrm.com/calendar/Vikas,Mrudula,Shravi_Sharma,Bharat,Manish,Nick,Stephen' target='_blank' rep class='text-info'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "sales") %></a></b>
                   </div>
                  </div> 
                   </div>
                  </div>
                  <div class='pull-right' style='width:50%;border-left: 1px solid #FFFFFF;'>
                 <div class='p-r-none p-l-none'>
                  <div class=' text-center text-xs'  style='margin-top:-2px;padding-bottom:2px;'><b><a href='https://our.agilecrm.com/calendar/Haaris_farooqi,Khader' target='_blank' rep class='text-info'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "support") %></a></b>
                  </div>
                 </div>
                </div><div class='clearfix'></div>
                  </div>" data-original-title="" title="">
                   <a href="#" onclick="return false;"><i class="fa fa-question-circle"></i></a>      
                                                        </li>
                   
                  
              
             <%
                               if(request.getHeader("User-Agent").indexOf("Mobile") == -1) {

                        %>
                             <li class="hidden-xs" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Full Screen"><a  class="enable-element-full-screen"><span class="fa fa-arrows-alt"></span></a></li>
                        <%
                               }
            %>
            
                  
             

                <li class="line dk"></li>
                <li class="hidden-folded padder m-t m-b-sm text-muted text-xs">
                <span>Profile</span>
              </li>

              <li id="fat-menu" class="mobile-fat-menu">
              <a href='#user-prefs'>
              <span><!-- <i
                  class="agilecrm-profile-dropdown"></i> -->
<span class="thumb-sm avatar pull-right m-t-n-sm m-b-n-sm m-l-sm" style="margin-top:5px;">
        <%  if (!StringUtils.isEmpty(currentUserPrefs.pic))
              out.println("<img src='"
              + currentUserPrefs.pic
              + "' alt='...'  style='width:40px;height:40px;'></img>");
          else
              out.println("<img src='img/gravatar.png'  alt='...'></img>");
        %>
               
               
              </span>
              <div class="text-ellipsis w-auto hidden-sm hidden-md" style="max-width:150px;"><span class="hidden-sm hidden-md"><%=SafeHtmlUtil.sanitize(domainUser.name)%></span></div>
             <!-- <b class="caret"></b> -->   

             <div  class="">
                     <span class="text-sm m-r-md"> <%=SafeHtmlUtil.sanitize(user.getEmail())%></span>
                  </div>
                  </span>              
                   </a>
                </li>

                  <li></li>

                  <li><a href="#user-prefs"><!-- <i class="icon-cog"></i> -->

                      <div class="pull-left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "preferences") %></div><div class='pull-right shortcuts'>Shift + P</div><div class="clearfix"></div></a></li>

                  <%
                      if (domainUser != null && domainUser.is_admin)
                      {
                            out.print("<li><a href='#account-prefs'><div class='pull-left'>" + LanguageUtil.getLocaleJSONValue(localeJSON, "admin-settings") + "</div><div class='pull-right shortcuts'>Shift + A</div><div class='clearfix'></div></a></li>");
                      }
                  %>
                  <li><a href="#themeandlayout"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "theme-and-layout") %></div><div class='pull-right shortcuts'>Shift + L</div><div class="clearfix"></div></a></li>
                  
                  <li><a href="#subscribe"><!-- <i class="icon-cog"></i> -->
                      <div class="pull-left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "upgrade") %></div><div class='pull-right shortcuts'>Shift + U</div><div class="clearfix"></div></a></li>
                  <li><a href="https://www.agilecrm.com/product-updates" target="_blank"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "product-updates") %></div><div class='pull-right shortcuts'>Shift + R</div><div class="clearfix"></div></a></li>
                  <li><a href="https://www.agilecrm.com/support" target="_blank"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "help") %></div><div class='pull-right shortcuts'>Shift + H</div><div class="clearfix"></div></a></li>
                  <li><a href="<%=logoutURL%>"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "logout") %></div><div class='pull-right shortcuts'>Shift + G</div><div class="clearfix"></div></a></li>

                </li>
              <%
                  }
              %>
            </ul>
          </div>
  </div>
  </div>
  </aside>
<div class="app-content" id="agilecrm-container">
<div id="direct-dialler-div" style = "height:0px;position: absolute!important;"></div>
<div id="draggable_noty" style = "height:0px;position: absolute!important;"><div style="z-index: 10000;position: relative;"><div class="draggable_noty_info"></div><div class="draggable_noty_notes"></div><div class="draggable_noty_callScript" style="display:none;"></div></div></div>
<div id="call-campaign-content" class="box-shadow width-min-100p height-min-100p z-lg" style = "background-color: #edf1f2;"></div> 
<script type="text/javascript">
// In mobile browsers, don't show animation bar
if( (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) )
{
	document.write('<div class="butterbar" style="z-index:99;"><span class="bar"></span></div>');
} else {
	document.write('<div class="butterbar animation-active" style="z-index:99;"><span class="bar"></span></div>');
}
</script>
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
// String tplFile = "tpl/min/precompiled/locales/" + _LANGUAGE + "/" + _LANGUAGE + ".html";
String tplFile = _LANGUAGE + ".html";
%>

<!-- Including Footer page -->

<!-- Include bootstrap modal divs-->
<%@ include file="flatfull/modals.html"%>

</div>



<!-- Including Footer page -->
<jsp:include page="flatfull/footer.jsp" /> 



<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
<script src='<%=FLAT_FULL_PATH%>jscore/handlebars/download-template.js'></script>
<script>

try{console.time("startbackbone");}catch(e){}

var USER_IP_ADDRESS = '<%=request.getRemoteAddr()%>'

var S3_STATIC_IMAGE_PATH = '<%=S3_STATIC_IMAGE_PATH%>';
//var LIB_PATH = "//-dpm72z3r2fvl4.cloudfront.net/js/";
//var LIB_PATH = "//cdnapp.agilecrm.com/";
var LIB_PATH = '<%=CLOUDFRONT_STATIC_FILES_PATH%>';

var FLAT_FULL_PATH = '<%=FLAT_FULL_PATH%>';

// Target to cloudfront URL
var LIB_PATH_FLATFULL = '<%=CLOUDFRONT_TEMPLATE_LIB_PATH + FLAT_FULL_PATH%>'

var CLOUDFRONT_PATH = '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>';

var LOGIN_FROM_PANEL = '<%=panel%>';

var CURRENTIP = '<%=clientIP%>';

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

var _plan_on_signup = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(plan))%>;

// Get current user prefs json
var CURRENT_USER_PREFS = <%=SafeHtmlUtil.sanitize(UserPrefsUtil.getMapperString(currentUserPrefs))%>;

//Get current user prefs json
var ACCOUNT_PREFS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(accountPrefs))%>; 

// Get current domain user json
var CURRENT_DOMAIN_USER = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(domainUser))%>;

// Get current user dashboards
var CURRENT_USER_DASHBOARDS = <%=mapper.writeValueAsString(dashboardsList)%>;
// Get Current Agile User
var CURRENT_AGILE_USER = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(AgileUser.getCurrentAgileUser()))%>;

// Get Contact Date Fields
var CONTACTS_DATE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeContactTypeDate")))%>;
// Get Contact Date Fields
var COMPANY_DATE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeCompanyTypeDate")))%>;

// Get Contact contact type custom fields
var CONTACTS_CONTACT_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeContactTypeContact")))%>;
// Get Contact company type custom fields
var CONTACTS_COMPANY_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeContactTypeCompany")))%>;

// Get Company contact type custom fields
var COMPANIES_CONTACT_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeCompanyTypeContact")))%>;
// Get Company company type custom fields
var COMPANIES_COMPANY_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeCompanyTypeCompany")))%>;

//online scheduling url will be filled  only when user goes to calendar route 
var ONLINE_SCHEDULING_URL ="" ;

var HANDLEBARS_LIB = LOCAL_SERVER ? "/lib/handlebars-v1.3.0.js" : "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js";

// Billing Restriction
var _billing_restriction = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(restriction))%>;
var USER_BILLING_PREFS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(subscription))%>;

// Load language JSON
var _LANGUAGE = "<%=_LANGUAGE%>";
// var _Agile_Resources_Json = {};
// head.js("locales/" + _LANGUAGE + "/" + _LANGUAGE + ".json?" + _agile_get_file_hash('lib-all-new-2.js'));
load_tpl_html();

head.load(	"https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",
			LIB_PATH + 'final-lib/min/lib-all-new-1.js?_=' + _agile_get_file_hash('lib-all-new-1.js'),
			"https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js",
			LIB_PATH + 'final-lib/min/backbone-min.js',
			LIB_PATH + 'final-lib/min/lib-all-new-2.js?_=' + _agile_get_file_hash('lib-all-new-2.js'),  
			function(){
         // Load tpl.html
        // load_tpl_html();
		    showVideoForRegisteredUser();
		});

// head.js({ library  : LIB_PATH + 'final-lib/min/lib-all-min-1.js?_=' + _AGILE_VERSION });

if(HANDLEBARS_PRECOMPILATION)
head.js(CLOUDFRONT_PATH + "tpl/min/precompiled/locales/" + _LANGUAGE + "/" + _LANGUAGE + ".js" + "?_=" + _agile_get_file_hash(_LANGUAGE + '.js'));	

var en;

// Fetch/Create contact from our domain
var Agile_Contact = {};


// head.ready('library', function() {

head.ready(function() {

if(!HANDLEBARS_PRECOMPILATION){
    head.js(HANDLEBARS_LIB, function()
    {
        downloadTemplate("tpl.js");
        downloadTemplate("contact-view.js");
    });
}
 
// Remove the loadinng
$('body').css('background-image', 'none');
//$('#content').html('ready');
$("img.init-loading", $('#content')).attr("src", "<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>/img/ajax-loader-cursor.gif");

// load_tpl_html(function(){
head.load([{'js-core-1': CLOUDFRONT_PATH + 'jscore/min/locales/' + _LANGUAGE  +'/js-all-min-1.js' + "?_=" + _agile_get_file_hash('js-all-min-1.js')}, 
		{'js-core-2': CLOUDFRONT_PATH + 'jscore/min/locales/' + _LANGUAGE +'/js-all-min-2.js' + "?_=" + _agile_get_file_hash('js-all-min-2.js')}, 
		{'js-core-3': CLOUDFRONT_PATH + 'jscore/min/locales/' + _LANGUAGE +'/js-all-min-3.js' + "?_=" + _agile_get_file_hash('js-all-min-3.js')}, 
		{'js-core-4': CLOUDFRONT_PATH + 'jscore/min/locales/' + _LANGUAGE +'/js-all-min-4.js' + "?_=" + _agile_get_file_hash('js-all-min-4.js')}, 
		CLOUDFRONT_PATH + "tpl/min/precompiled/locales/" + _LANGUAGE + "/contact-view.js" + "?_=" + _agile_get_file_hash('contact-view.js')], function(){
			console.log("All files loaded. Now continuing with script");
      load_globalize();
			try{
				$('[data-toggle="tooltip"]').tooltip();  
				//Code to display alerts of widgets.
				showNotyPopUp('<%=session.getAttribute("widgetMsgType") %>', '<%=session.getAttribute("widgetMsg") %>' , "bottomRight");
			} catch(e) {
				//Do nothing
			}
			 
			//Resting the variables.
			<% session.removeAttribute("widgetMsgType");
			session.removeAttribute("widgetMsg"); 
			%>
			
			try{
				var sig = CURRENT_USER_PREFS.signature;
				sig = sig.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
				CURRENT_USER_PREFS.signature = sig;

        //Turn off all animations if this is mobile
        if( agile_is_mobile_browser() )
        {
          $("body")[0].addClass('disable-anim');
        }

			} catch(e) {
				
			}

	});

// head.js({"stats" : '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>stats/min/agile-min.js' + "?_=" + _AGILE_VERSION});
// });// End of template loading

}); //End of head.ready() function. Check above.

function load_tpl_html(callback){
  // For localhost
  if(!HANDLEBARS_PRECOMPILATION){
        if(callback)
           callback();
    return;
  }
  
  downloadTemplate('<%=tplFile%>', function(){
    // initializeDealModalEvents();
    if(callback)
         callback();
  });
}

function load_globalize()
{

  /*if (typeof Globalize != "function") {
    setTimeout(function() {
      load_globalize();
    }, 100);
    return;
  } */

  Globalize.load(Globalize_Main_Data);
  en = Globalize("en");

}

function showVideoForRegisteredUser(){
    console.log("Ref = " + document.referrer);

    if(!document.referrer || document.referrer.indexOf("register") == -1)
         return;
    var domainuser_video_cookie = CURRENT_DOMAIN_USER.domain+'_video_cookie';
    if(!localStorage.getItem(domainuser_video_cookie))
    {     
       $("#dashboard_video").modal("show");
       var $frame = $("#dashboard_video iframe");
       $frame.attr("src", $frame.attr("data-source"));
       
    } 
    
    localStorage.setItem(domainuser_video_cookie,true);
    
}
function closeVideo(){
   $('#dashboard_video').on("click", ".close", function () {
       $('#dashboard_video').modal("hide");
        $('#dashboard_video iframe').removeAttr("src");
    });
}

// Deal Modals Event Listeners
function initializeDealModalEvents(){
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

 <!--video on dashboard -->
 <div class="modal  fade hidden-xs" id="dashboard_video"  tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" data-backdrop="static" data-keyboard="false">
       <div class="modal-dialog" id="dashboard-video" >
        <div class="modal-content">
        <div class="modal-header">
          <button class="close" onClick="closeVideo()">&times;</button>
          <h3 id="myModalLabel">Welcome to Agile CRM</h3>
          <small>Here is a short video which explains the steps to get started with Agile. We recommend you watch it.</small>
        </div>      
        <div class="modal-body">
              <div class="embed-responsive embed-responsive-16by9">
                      <iframe class="embed-responsive-item" data-source="https://www.youtube.com/embed/9aH60N6HPcc?list=PLqZv4FUxASTctDCZmdVbheU75Y3Szk9Ny" frameborder="0" allowfullscreen></iframe>
              </div> 

              
        </div>
               
        <div class="modal-footer">
                 <a href="http://salescal.agilecrm.com/" target="_blank" class="btn btn-primary" id="schedule_demo" onclick="Agile_GA_Event_Tracker.track_event('Demo from Getting Started Video');">Schedule a Demo</a>
        </div>                     
                                 
        </div>
          
        
        </div>
  </div>
<div id="fb-root"></div>
</body>
</html>
