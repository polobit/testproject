<!DOCTYPE html>
<%@page import="com.agilecrm.util.HomeUtil"%>
<%@page import="com.agilecrm.util.MobileUADetector"%>
<%@page import="com.agilecrm.user.access.AdminPanelAccessScopes"%>
<%@page import="com.itextpdf.text.log.SysoCounter"%>
<%@page import="com.agilecrm.util.CookieUtil"%>
<%@page import="com.agilecrm.util.FileStreamUtil"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="com.agilecrm.addon.AddOn"%>
<%@page import="com.agilecrm.addon.AddOnUtil"%>
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
<%@page import="com.agilecrm.account.util.EmailGatewayUtil"%>
<%@page import="java.util.List"%>
<%@page import="java.util.*"%>
<%@page import="java.util.Map.Entry"%>

<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

<%
    //Check if it is being access directly and not through servlet
if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
response.sendRedirect("/login");
return;
}

DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();

AddOn addOn = AddOnUtil.getAddOn();

System.out.println("Domain user " + domainUser);

ObjectMapper mapper = new ObjectMapper();

String panel = request.getParameter("sp");
if(panel == null)
  panel = "false";
String clientIP = request.getRemoteAddr();

// Get current user prefs
UserPrefs currentUserPrefs = UserPrefsUtil.getCurrentUserPrefs();
String menuPosition = currentUserPrefs.menuPosition;
if(currentUserPrefs.theme.equalsIgnoreCase("15")) {
       currentUserPrefs.menuPosition = "leftcol";
} 

AccountPrefs accountPrefs = AccountPrefsUtil.getAccountPrefs();
%>

<html class="<%=HomeUtil.getNewThemeClasses(request, domainUser, currentUserPrefs) + " agile-theme-" + domainUser.role.toString()%>">
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

<%
  }
%>
<script type="text/javascript">
  var _AGILE_FILE_HASH;
  
  function _agile_get_file_hash(filename)
  {
    if(true)
      return _AGILE_VERSION;
      
    if( !filename || filename == '' ) return _AGILE_VERSION;
    
    if( _AGILE_FILE_HASH && _AGILE_FILE_HASH[filename] )  return _AGILE_FILE_HASH[filename];
    
    return _AGILE_VERSION;
  }
</script>

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>


<%

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

// Read language cookie
String languageCookieValue = CookieUtil.readCookieValue(request, "user_lang");
if(StringUtils.isBlank(languageCookieValue)){
  languageCookieValue = _LANGUAGE;
}

// Check and resave language if they are not same
if(!StringUtils.equalsIgnoreCase(languageCookieValue, _LANGUAGE) && LanguageUtil.isSupportedlanguageFromKey(languageCookieValue)){
  currentUserPrefs.language = languageCookieValue;
  currentUserPrefs.save();
  _LANGUAGE = currentUserPrefs.language;
}

JSONObject localeJSON = LanguageUtil.getLocaleJSON(currentUserPrefs, application, "menu");
String userAgent = request.getHeader("user-agent");

LinkedHashMap<String, String> servicemap = new LinkedHashMap<String, String>();
if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.HELPDESK)){
   servicemap.put("#tickets","Help Desk");
   servicemap.put("#ticket-feedback","Feedback");
   servicemap.put("#ticket-groups","Groups");
   servicemap.put("#ticket-labels","Labels");
   servicemap.put("#canned-responses","Canned Responses");
}
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

<%
  boolean isDisabledNewThemeStyles = HomeUtil.isDisabeld(request, currentUserPrefs);
    if(!isDisabledNewThemeStyles){
%>
<link href="flatfull/css/material-theme/min/agile-theme-15.css?_=<%=_AGILE_VERSION%>" <%if(isDisabledNewThemeStyles)out.println("disabled=disabled"); %> rel="stylesheet" data-agile-theme="15" />
<%} %>

<!-- Material icons update -->
<link href="flatfull/css/material-theme/min/material-icons.css" rel="stylesheet" />
<style>
.clickdesk_bubble {
  display: none !important;
}

.leftcol-menu-folded{display: none;}
.leftcol-menu-expanded{display: block;}
.app-aside-folded .leftcol-menu-folded {display: block;}
.app-aside-folded .leftcol-menu-expanded {display: none;}
/*.app-aside-dock .leftcol-menu-expanded {display: none!important;}*/
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
.free_plan_alert {
  padding-top: 5px;
  padding-bottom: 7px;
  z-index: 1;top: 65px;
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  margin: 0px auto;
  width: 429px;
}
.menuHelpPopover
{
    position: absolute;
    top: 0;
    left: -15px;
    z-index: 1060;
    /* display: none; */
    max-width: 276px;
    text-align: left;
    text-align: start;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    letter-spacing: normal;
    word-break: normal;
    word-spacing: normal;
    word-wrap: normal;
    white-space: normal;
    background-color: #fff;
    border: 1px solid #c7d3d6;
    border-radius: 6px;
  }

.helpmenupopup:after {
    content: '';
    display: block;
    position: absolute;
    top: 16px;
    /* right: -9px; */
    left: -8px;
    width: 15px;
    height: 15px;
    background: #FFFFFF;
    border-left: 1px solid #c7d3d6;
    border-top: 1px solid #c7d3d6;
    -moz-transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
}
.background-img-sales{
  background: url("https://doxhze3l6s7v9.cloudfront.net/img/menu-service-icons-sprite.png") no-repeat;
  background-position: 0 0px;
  border: 0 none;'
}
.background-img-marketing{
  background: url("https://doxhze3l6s7v9.cloudfront.net/img/menu-service-icons-sprite.png") no-repeat;
  display: inline-block;
  background-position: 49% 0px;
}
.background-img-service{
   background: url("https://doxhze3l6s7v9.cloudfront.net/img/menu-service-icons-sprite.png") no-repeat;
   background-position: 98% 0px;
}
.uservoice-icon{
  position: fixed;
  bottom: 10px;
  right: 12px;
  visibility:hidden;
  }
  .grid-v2 {
    position: fixed !important;
    left: 50%;
    top: 23px;
    z-index: 1029;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .app-aside-dock #agile-menu-navigation-container.navi ul.nav li a {padding: 10px 15px 12px 15px;}
<%
   if(MobileUADetector.isMobile(request.getHeader("user-agent"))){
%>
    #personModal #import-link{display: none!important;}
<%}%>
<%
   if(MobileUADetector.isiPhone(request.getHeader("user-agent"))){
%>
    a[href="#subscribe"] {display: none!important;}
    .hideInIphone {display: none!important;}
<%}%>
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
<div class="pos-abs pos-r-0 " style="z-index:3;top:116px">
<div id="contacts_limit_alert_info" class="contacts_plan_alert hide" style="position: relative;width:340px;"> 
</div>
</div>
<div class="pos-abs "><a href="javascript:void(0)" class="uservoice-window uservoice-icon" data-uv-trigger="smartvote">voice</a></div>
  
  

<%if(!MobileUADetector.isiPhone(userAgent)) {%>
<div id="free_plan_alert_info" class="free_plan_alert alert alert-info" role="alert" style="display:none;"> 
  <span class="free_plan_message">
   <%=LanguageUtil.getLocaleJSONValue(localeJSON, "freeplan-new-msg") %>
  </span>
  <a href="#subscribe" class="text-info font-bold" onclick="Agile_GA_Event_Tracker.track_event('Upgrade from Nav Bar Message')"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "noty-upgrade") %></a>
   <%=LanguageUtil.getLocaleJSONValue(localeJSON, "freeplan-new-message") %>
  <span class="free_plan_strip_close p-l-sm c-p">&times</span>
</div>
<%}%>

<img class='hide' src='https://doxhze3l6s7v9.cloudfront.net/img/menu-service-icons-sprite.png'></img> 

<div class="dashboard-select small dropdown grid-v2 hidden-xs <%
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
            case 15:  out.print("bg-white ");
                 break;
            default:
                    break;
         
          }
              
         %>" id='need_help_header'>
          <a href="#" class="dropdown-toggle purple-color nav-grid"  data-toggle="dropdown" aria-expanded="false">
              <i class="material-icons" style="font-size: 22px;">view_module</i><span id="rolecontainer" class="rolecontainer"><%out.print(domainUser.role);%></span>
              <div class="dash-name">
                  <span>Sales</span>
                  <i class="material-icons">arrow_drop_down</i>
              </div>
          </a>
          <ul class="dropdown-menu grid-dropdown-menu">
              <li>
              <a href='#' class='menu-service-select menu-select-sales' data-service-name='SALES' data-dashboard='SalesDashboard'>
                <div class="pull-left"><i class="material-icons purple-color">view_module</i></div>
                     <div> <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "sales") %></span>
                     <div class="menu-shortcuts">
                      <span class="grid2-sub-nav  block">
                        <%
                              if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CONTACT)){
                        %> 
                        <span class="grid-selector" navigation="#contacts">Contacts<p class="comma-seperator">,</p></span>
                        <%}%>
                        <span class="grid-selector" navigation="#companies">Companies<p class="comma-seperator">,</p></span>
                         <%
                          if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.DEALS)){
                        %>
                        <span class="grid-selector" navigation="#deals">Deals<p class="comma-seperator">,</p></span>
                        <%
                        }%>
                        <%
                          if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.DOCUMENT)){
                        %>
                        <span class="grid-selector" navigation="#documents">Documents<p class="comma-seperator">,</p></span>
                        <%}%>
                          <%
                            if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CALENDAR)){
                        %>
                        <span class="grid-selector" navigation="#calendar">Calendar<p class="comma-seperator">,</p></span>
                        <%}%>
                        <span class="grid-selector" navigation="#tasks">Tasks<p class="comma-seperator">,</p></span>

                        <span class="grid-selector" navigation="#scheduler-prefs">Online Calendar<p class="comma-seperator">,</p></span>
                      </span>
                     
                      </div>
                    </div>
                  </a>
              </li>
              <li>
              <a href='#' class='menu-service-select menu-select-marketing' data-service-name='MARKETING' data-dashboard='MarketingDashboard'>
                <div  class="pull-left"><i class="material-icons purple-color markeing-i">view_module</i></div>
                  <div> <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-marketing") %></span>
                  <div class="menu-shortcuts-marketing" >
                  <span class="grid2-sub-nav first-span block">
                   <%
                      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CAMPAIGN)){
                  %>
                    <span class="grid-selector" navigation="#workflows">Campaigns<p class="comma-seperator">,</p></span>
                    
                    <span class="grid-selector" navigation="#triggers">Triggers<p class="comma-seperator">,</p></span>
                    <%}%>
                    <span class="grid-selector pull-left" navigation="#email-templates">Email Templates,</span>
                    <span class="grid-selector" navigation="#forms">Forms<p class="comma-seperator">,</p></span>
                     <%
                        if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.LANDINGPAGES)){
                      %>
                      <span class="grid-selector" navigation="#landing-pages">Landing Pages<p class="comma-seperator">,</p></span>
                      <%}%>
                    <%
                      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.WEBRULE)){
                    %>

                    <span class="grid-selector" navigation="#web-rules">Web Rules<p class="comma-seperator">,</p></span>
                    <%}%>
                   
                     
                      <span class="grid-selector" navigation="#push-notification">Push Notifications<p class="comma-seperator">,</p></span>
                      <%
                        if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.SOCIAL)){
                     %>
                      <span class="grid-selector" navigation="#social">Social<p class="comma-seperator">,</p></span>
                      <%}%>
                        <%
                            if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.VISITORS)){
                        %>
                        <span class="grid-selector" navigation="#visitors">Visitors<p class="comma-seperator">,</p></span>
                      <%}%>
                  </span>
                  
                  </div>
                  </div>
                  </a>
              </li><li>
              <a href='#' class='menu-service-select menu-select-service' data-service-name='SERVICE' data-dashboard='dashboard'>
                <div class="pull-left"><i class="material-icons purple-color" style="margin-top:-1px;">view_module</i></div>
                      <div><span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "service") %></span>
                  <div class="menu-shortcuts-service">
                  <span class="grid2-sub-nav">
                     <%
                    if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.HELPDESK)){
                    %>
                   <span class="grid-selector help-desk-shortcut" navigation="#tickets">Help Desk<p class="comma-seperator">,</p></span>
                   <%}%>
                   <%
                    if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.SERVICE_KNOWLEDGEBASE)){
                    %>  
                    <span class="grid-selector ticketknowledgebasemenushortcut" onclick="return false;" navigation="#knowledgebase">Knowledge base<p class="comma-seperator">,</p></span>
                    <%}%> 
                      <%
                      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.HELPDESK)){
                      %>
                        <span class="grid-selector" navigation="#ticket-feedback" onclick="return false;">Feedback<p class="comma-seperator">,</p></span>
                      <%}%> 
                     <%
                      if(domainUser.is_admin && !domainUser.restricted_menu_scopes.contains(NavbarConstants.HELPDESK)){
                      %> 
                        <span class="grid-selector" navigation="#ticket-groups">Groups<p class="comma-seperator">,</p></span>
                         <span class="grid-selector" navigation="#ticket-labels">Labels<p class="comma-seperator">,</p></span>
                         <span class="grid-selector" navigation="#canned-responses">Canned Responses<p class="comma-seperator">,</p></span>
                         <span class="grid-selector" navigation="#ticket-views">Views<p class="comma-seperator">,</p></span>
                 
                      <%}%>
                   
                  </span>
                 
                  </div>
                  </div>
              </a>
              </li>

          </ul>
                </div>



<div rel="popover" data-custom-popover-class='grid_custom_popover' data-trigger="click"  data-original-title="" title="" data-placement="bottom" class="need_help hide grid_icon_center grid-v1 hidden-xs <%
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
            case 15:  out.print("bg-white");
                 break;
            default:
                    break;
         
          }
              
         %>" screen_name="Need Help? We are one click away." data-content="<div class='row' id='need_help_header'>
                  <ul class='col-xs-12 col-sm-12 grid-sub-nav text-center m-t-md p-l-md p-r-md'>
                    
                <li class='pull-left m-b-sm'>
                  <a href='#' class='menu-service-select' data-service-name='SALES' data-dashboard='SalesDashboard'><i class='thumb background-img-sales'></i>
                    <span class='block' ><%=LanguageUtil.getLocaleJSONValue(localeJSON, "sales") %>
                    </span>
                  </a>
                </li>

                <li class='pull-left m-b-sm'><a href='#' class='menu-service-select' data-service-name='MARKETING' data-dashboard='MarketingDashboard' ><i class='thumb background-img-marketing' ></i> <span class='block'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-marketing") %></span></a></li>

                <li class='pull-left m-b-sm'><a href='#' class='menu-service-select' data-service-name='SERVICE' data-dashboard='Dashboard' ><i class='thumb background-img-service'></i> <span class='block'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "service") %></span></a></li>

                </ul>
                </div>
                  </div>">
                   <a href="#" class='grid-icon-header pull-left block wrapper' onclick="return false;"><i class="glyphicon glyphicon-th"></i>
                      <span id="rolecontainer" class="rolecontainer grid-v1-rolecontainer"><%out.print(domainUser.role);%>
                      </span> 
                   </a> 
                    
                             </div>
        <%
          if(MobileUADetector.isMobile(request.getHeader("user-agent"))){
       %>
         <%
              }else {
           %>     <div style="position: fixed;left: 52%;z-index: 1029;-webkit-transform: translateX(-50%);transform: translateX(-50%);margin-left: 8px;" id="helpcontent_popover" class="hide need_help agile-feature-item-blink-new">
                <div class="block menuHelpPopover" >
                  <div class="helpmenupopup">
                  </div>
                  <div class="content p-sm">
                    <p style="width : 200px;margin-bottom:0px;" class="menu_help_content"> Check our other feature sets by clicking this icon.
                    </p>
                    <a href="#" class="menugridhelpclose" data-dismiss="alert" aria-label="close"  style="position: absolute;top:5px;color:#6b6b6b !important;right:5px;font-size:20px;margin-right:5px;">×
                    </a>
                  </div>
                </div>
              </div> 
          
          <% } %>
       
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

 <aside id="aside" class="app-aside aside-menu-fixed hidden-xs 
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
     case 15:  out.print("bg-white ");
         break;
    default:
            break;
 
  }
      
 if ("admin".equals(domainUser.domain))
  {
    out.print("hide adminPanel");
  }
  %>" style="z-index:3;">
          <div class="aside-wrap">
        <div class="navi-wrap">
  
  <nav  class="navi clearfix" ui-nav id="agile-menu-navigation-container">
    <ul class="nav">
    
  <!-- Sales menu -->  
  <%if(domainUser.role == ROLE.SALES){ %> 
    
    <li class="hidden-folded padder m-t-xs m-b-xs text-muted text-xs">
     <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "sales") %></span>
    </li>
    <!-- <li id="home_dashboard">
      <a  href="#">
        <i class="icon icon-home"></i>
        <i class="material-icons hidden-icon" style="display: none">home</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Home">home</i>
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "home")%></span>
      </a>
    </li> -->
   <!-- <li id="leadsmenu">
    <a  href="#leads">
      <i class="icon icon-group"></i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-leads") %></span>
    </a>
  </li> -->
    <%
          if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CONTACT)){
    %>      
            <li id="contactsmenu">
              <a  href="#contacts">
                <i class="icon icon-user"></i>
                <i class="material-icons hidden-icon" style="display: none">people</i>
                <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Contacts">people</i>
               <!--  <i class="icon icon-user"></i> -->
                <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-contacts") %></span>
              </a>
            </li>
    <%
        }
    %>   
        
            <li id="companiesmenu">
              <a  href="#companies" style="margin-left:2px;">
                <i class="icon icon-building"></i>
                <i class="material-icons hidden-icon" style="display: none">business</i>
                <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Companies">business</i>
                <span ><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-companies") %></span>
              </a>
            </li>
        <%
          if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.DEALS)){
        %>
            <li  id="dealsmenu">
              <a  href="#deals">
                <i class="fa fa-money"></i>
                <i class="material-icons hidden-icon" style="display: none">monetization_on</i>
                <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Deals">monetization_on</i>
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
              <i class="material-icons hidden-icon" style="display: none">insert_drive_file</i>
              <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Documents">insert_drive_file</i>
            <!-- <span class="leftcol-menu-folded">
              <%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-docs") %>
            </span> -->
            <span class="leftcol-menu-expanded">
              <%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-documents") %>
            </span>
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
            <i class="material-icons hidden-icon" style="display: none">event</i>
            <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Calendar">event</i> 
            <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "calendar") %></span> 
          </a>
        </li>
        <%
              }
        %>  
        <li id="tasksmenu">
          <a href="#tasks" onclick="Agile_GA_Event_Tracker.track_event('Tasks Option in Nav Bar')">
             <i class="icon-list" data-original-title="" title=""></i>
             <i class="material-icons hidden-icon" style="display: none">alarm_on</i>
             <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Tasks">alarm_on</i>

            <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "tasks") %></span>
            <span title="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "tasks-due") %>" class="navbar_due_tasks pull-right tasks-span-top">
                <span  id="due_tasks_count" class="badge badge-sm bg-danger"></span>
            </span>
          </a>
        </li>
        <li id="schedulingmenu">
          <a href="#scheduler-prefs" onclick="Agile_GA_Event_Tracker.track_event('Appointment scheduling Option in Nav Bar')">
            <i class="icon-tag" data-original-title="" title=""></i>
             <i class="material-icons hidden-icon" style="display: none;">date_range</i>
             <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Online Calendar">date_range</i>
            <span>Online Calendar</span>
          </a>
        </li>
      <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.ACTIVITY)){
      %>
    <li id="activitiesmenu">
      <a  href="#activities">
        <i class="icon-speedometer icon-white"></i>
        <i class="material-icons hidden-icon" style="display: none">hourglass_full</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Activities">hourglass_full</i> 
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
        <i class="material-icons hidden-icon" style="display: none">pie_chart</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Reports">pie_chart</i> 
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
     <!--  <li id="home_dashboard">
      <a  href="#">
        <i class="icon icon-home"></i>
        <i class="material-icons hidden-icon" style="display: none">home</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Home">home</i> 
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "home")%></span>
      </a>
    </li> -->
    <%
        if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CONTACT)){
    %>      
        <li id="contactsmenu">
          <a class="agile-menu-dropdown-aside1" href="#contacts">
            <i class="icon icon-user"></i>
            <i class="material-icons hidden-icon" style="display: none">people</i>
            <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Contacts">people</i> 
            <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-contacts") %></span>
          </a>
        </li>
    <%
        }
    %>
   <%
        if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CAMPAIGN)){
    %>
    <li id="workflowsmenu">
      <a  href="#workflows">
        <i class="icon icon-sitemap" style="display: block !important;"></i>
        <!-- <i class="material-icons hidden-icon" style="display: none">device_hub</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Campaigns">device_hub</i>  -->
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-campaigns") %></span>
      </a>
    </li>
    <li id="triggersmenu">
      <a  href="#triggers">
        <i class="icon icon-magic-wand" style="display:block !important"></i>
        <i class="material-icons hidden-icon" style="display: none">play_for_work</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Triggers">play_for_work</i> 
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "triggers") %></span>
      </a>
    </li>
    <%
        }
    %>
    <li id="email-templates-menu">
      <a href="#email-templates">
        <i class="icon-envelope-letter"></i>
        <i class="material-icons hidden-icon" style="display: none">email</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Email Templates">email</i> 
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "email-templates") %></span>
      </a>
    </li>
    <li id="formsmenu">
      <a  href="#forms">
         <i class="icon-large1 icon-docs"></i>
         <i class="material-icons hidden-icon" style="display: none">web_asset</i>
         <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Forms">web_asset</i> 
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "forms") %></span>  
      </a>
    </li>  
    <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.LANDINGPAGES)){
    %>
    <li id="landing-pages-menu">
      <a class="agile-menu-dropdown-aside1" href="#landing-pages" style="margin-left:2px;"> 
        <i class="fa fa-file-code-o"></i>
        <i class="material-icons hidden-icon" style="display: none">web</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Landing Pages">web</i> 
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-landing-pages") %></span>
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
        <i class="material-icons hidden-icon" style="display: none">public</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Web Rules">public</i> 
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-web-rules") %></span>
      </a>
    </li>

    <%
          }
    %>
    <li id="push-notification-menu">
    <a href="#push-notification">
      <i class="fa fa-bell-o"></i>
       <i class="material-icons hidden-icon" style="display: none">notifications</i>
       <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Push Notifications">notifications</i> 
      <span>Push Notifications</span>
    </a>
  </li>

  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.SOCIAL)){
   %>
   <li id="socialsuitemenu">
    <a class="agile-menu-dropdown-aside1" href="#social">
      <i class="icon-bubbles"></i>
       <i class="material-icons hidden-icon" style="display: none">question_answer</i>
       <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Social">question_answer</i> 
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-social") %></span>
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
        <i class="material-icons hidden-icon" style="display: none">visibility</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Visitors">visibility</i> 
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-visitors") %></span> 
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
        <i class="material-icons hidden-icon" style="display: none">hourglass_full</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Activities">hourglass_full</i> 
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
       <i class="material-icons hidden-icon" style="display: none">pie_chart</i>
       <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Reports">pie_chart</i> 
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
   <%
          }
    %> 
  <!-- <li class="line dk m-t-none m-b-none" style="height: 1px;"></li> -->
  <!-- Service menu -->   
   <%if(domainUser.role == ROLE.SERVICE){ %>
      <li class="hidden-folded padder m-t-xs m-b-xs text-muted text-xs">
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "service") %></span>
      </li>
      <!-- <li id="home_dashboard" class="hide">
        <a  href="#">
          <i class="icon icon-home"></i>
           <i class="material-icons hidden-icon" style="display: none">home</i>
           <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Home">home</i>
          <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "home")%></span>
        </a>
      </li> -->
  <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.CONTACT)){
  %>      
    <li id="contactsmenu" class="hide">
      <a  href="#contacts">
        <i class="icon icon-user"></i>
        <i class="material-icons hidden-icon" style="display: none">people</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Contacts">people</i>
        <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-contacts") %></span>
      </a>
    </li>
  <%
      }
  %> 
  <li id="tickets">
    <a class="agile-menu-dropdown-aside1" href="#tickets">
      <i class="icon icon-ticket"></i>
       <i class="material-icons hidden-icon" style="display: none">email</i>
       <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Help Desk">email</i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "help-desk") %></span>
    </a>
  </li>
  <li id="tasksmenu" class="hide">
    <a class="agile-menu-dropdown-aside1" href="#tasks" onclick="Agile_GA_Event_Tracker.track_event('Tasks Option in Nav Bar')">
      <i class="icon-list" data-original-title="" title=""></i>
      <span>Tasks</span>
      <span title="<%=LanguageUtil.getLocaleJSONValue(localeJSON, "tasks-due") %>" class="navbar_due_tasks pull-right tasks-span-top">
          <span  id="due_tasks_count" class="badge badge-sm bg-danger"></span>
      </span>
    </a>
  </li>
  <%
  if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.SERVICE_KNOWLEDGEBASE)){
  %>   
  <li id="ticketknowledgebasemenu">
    <a  class="agile-menu-dropdown-aside1" href="#knowledgebase">
      <i class="fa fa-search"></i>
      <i class="material-icons hidden-icon" style="display: none">local_library</i>
      <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Knowledge Base">local_library</i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "knowledge-base") %></span>
    </a>
  </li>
  <%
  }
  %>
  <%
  if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.HELPDESK)){
  %>
  <li id="feedbackactivitiesmenu">
    <a class="agile-menu-dropdown-aside1" href="#ticket-feedback">
        <i class="m-r-sm fa fa-thumbs-up v-middle"></i>
        <i class="material-icons hidden-icon" style="display: none">thumb_up</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Feedback">thumb_up</i>
        <span>Feedback</span>
    </a>
  </li>
  <%
  }
  %>
  <%
  if(domainUser.is_admin && !domainUser.restricted_menu_scopes.contains(NavbarConstants.HELPDESK)){
  %>       
  <li id="ticketgroupsmenu">
    <a class="agile-menu-dropdown-aside1" href="#ticket-groups">
      <i class="icon icon-users"></i>
      <i class="material-icons hidden-icon" style="display: none">group_work</i>
      <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Groups">group_work</i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "groups") %></span>
    </a>
  </li>
  <li id="ticketlabelsmenu">
    <a  class="agile-menu-dropdown-aside1" href="#ticket-labels">
      <i class="icon icon-flag"></i>
      <i class="material-icons hidden-icon" style="display: none">label</i>
      <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Labels">label</i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "labels") %></span>
    </a>
  </li>
  <li id="ticketcannedmessagesmenu">
    <a class="agile-menu-dropdown-aside1" href="#canned-responses">
      <i class="icon icon-cursor"></i>
       <i class="material-icons hidden-icon" style="display: none">message</i>
       <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Canned Responses">message</i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "canned-responses") %></span>
    </a>
  </li>
  <li id="ticketviewsmenu">
    <a class="agile-menu-dropdown-aside1" href="#ticket-views">
      <i class="icon icon-directions"></i>
      <i class="material-icons hidden-icon" style="display: none">layers</i>
      <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Views">layers</i>
      <span><%=LanguageUtil.getLocaleJSONValue(localeJSON, "views") %></span>
    </a>
  </li>
   <%
      }
  %>
    
    <%
      if(!domainUser.restricted_menu_scopes.contains(NavbarConstants.ACTIVITY)){
    %>
    <li id="activitiesmenu" class="dashboard-activitiesnavbar">
    <a  href="#activities">
      <i class="icon-speedometer icon-white"></i>
      <i class="material-icons hidden-icon" style="display: none">hourglass_full</i>
      <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Activities">hourglass_full</i>
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
        <i class="material-icons hidden-icon" style="display: none">pie_chart</i>
        <i class="material-icons show-icon-folded" style="display: none" data-icon-toggle="tooltip" title="Reports">pie_chart</i>
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
                  if ("admin".equals(domainUser.domain)) 
                  {
                    
                  out.println("<li><a href='#all-domain-users'><i class='icon-group'></i> All Domain Users</a></li></ul>");  
               
                    out.println("<ul class='nav navbar-nav pull-right' style='float:right!important;'><li class='nav-bar-search'> <form id='domainSearchForm' class=' navbar-search'  style='margin: 5px;'> <input id='domainSearchText' class='form-control pull-left' type='text' style='line-height: 17px;width:85%;'  data-provide='typeahead'    placeholder='Search'></input> <input id='domain-search-results' type='image' src='img/SearchIcon.png' class='searchbox pull-left m-xs p-t-xs' /><div class='clearfix'></div></form></li>");
                    if(domainUser.adminPanelAccessScopes !=null && domainUser.adminPanelAccessScopes.contains(AdminPanelAccessScopes.ADD_USER))
                    {
                      out.println("<li style='margin-top: 7px;'><div class='btn-group'><a href='#users-add' class='btn btn-default btn-sm ''><i class='icon-plus-sign'></i> Add User</a>");
                      out.println("<button class='btn btn-default btn-sm dropdown-toggl' data-toggle='dropdown' style='background: transparent;border: 0px;'><span class='caret'></span></button><ul class='dropdown-menu pull-right' role='menu'><li><a href='#users'>All Users</a></li></ul>");
                      out.println("</div></li>");
                       out.println("<li class='pull-right'><div class='m-t-xs'><span  class=' dropdown-toggle' data-toggle='dropdown' ><a style='background: transparent;border: 0px;'>");
                    if (!StringUtils.isEmpty(currentUserPrefs.pic))
                        out.println("<img height='35' width='35' style='border-radius: 50%;margin-left: 20px;' src='"+ domainUser.pic+ "' alt='...' class='pos-rlt pos-t-xs'></img>");
                    else
                      out.println("<img height='35' width='35' style='border-radius: 50%;margin-left: 20px;'  src='img/gravatar.png'  alt='...'></img>");
                      out.println("</a></span><ul class='dropdown-menu m-t-sm' style='right: 0;left: auto;'><li><a href='#user-prefs' class='b-b p-r-none'><div class='pull-left text-ellipsis w-auto hidden-sm hidden-md' style='max-width:210px;clear: both;''><span class='hidden-sm hidden-md text-head-black'>"+SafeHtmlUtil.sanitize(domainUser.name)+"</span></div><span class='text-sm text-ellipsis block' style='clear: both;''> <b>"+user.getEmail()+"</b></span></a></li>");
                      out.println("<li><a href="+logoutURL+"><i class='icon-off'></i>Logout</a></li></ul></div></li>");
                    }
                  
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

                  <%if(!MobileUADetector.isiPhone(userAgent)) {%>
                  <li><a href="#subscribe"><!-- <i class="icon-cog"></i> -->
                      <div class="pull-left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "upgrade") %></div><div class='pull-right shortcuts'>Shift + U</div><div class="clearfix"></div></a></li>
                  <%}%>
                  <%if(!MobileUADetector.isMobile(userAgent)) {%>
                  <li><a href="https://www.agilecrm.com/product-updates" target="_blank"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "product-updates") %></div><div class='pull-right shortcuts'>Shift + R</div><div class="clearfix"></div></a></li>
                  <li><a href="https://www.agilecrm.com/support" target="_blank"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "help") %></div><div class='pull-right shortcuts'>Shift + H</div><div class="clearfix"></div></a></li>
                  <%}%>
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
<div class='app-content <%if("admin".equals(domainUser.domain)) out.print("adminPanelcontainer"); %>' id="agilecrm-container">
<div id="direct-dialler-div" style = "height:0px;position: absolute!important;"></div>
<div id="draggable_noty" style = "height:0px;position: absolute!important;"><div style="z-index: 10000;position: relative;"><div class="draggable_noty_notes"></div><div class="draggable_noty_info"></div><div class="draggable_noty_callScript" style="display:none;"></div></div></div>
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
String tplFile = "tpl/min/precompiled/locales/" + _LANGUAGE + "/" + _LANGUAGE + ".html";
// String tplFile = _LANGUAGE + ".html";
try{
  if(HANDLEBARS_PRECOMPILATION)
    out.println(FileStreamUtil.readResource(application.getRealPath("/") + "/" + tplFile));  
}catch(Exception e){
  e.printStackTrace();
}
%>

<!-- Including Template page -->

<!-- Include bootstrap modal divs-->
<%@ include file="flatfull/modals.html"%>

</div>



<!-- Including Footer page -->
<jsp:include page="flatfull/footer.jsp" /> 



<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
<script src='<%=FLAT_FULL_PATH%>jscore/handlebars/download-template.js'></script>
<script>

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

//Get current domain addon json
var ADDON_INFO = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(addOn))%>;

// Get current user dashboards
var CURRENT_USER_DASHBOARDS = <%=mapper.writeValueAsString(dashboardsList)%>;
// Get Current Agile User
var CURRENT_AGILE_USER = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(AgileUser.getCurrentAgileUser()))%>;

// Get Contact Date Fields
var CONTACTS_DATE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeContactTypeDate")))%>;
// Get Contact Date Fields
var COMPANY_DATE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeCompanyTypeDate")))%>;

// Get Lead Date Fields
var LEADS_DATE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeLeadTypeDate")))%>;

// Get Contact contact type custom fields
var CONTACTS_CONTACT_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeContactTypeContact")))%>;
// Get Contact company type custom fields
var CONTACTS_COMPANY_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeContactTypeCompany")))%>;

// Get Company contact type custom fields
var COMPANIES_CONTACT_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeCompanyTypeContact")))%>;
// Get Company company type custom fields
var COMPANIES_COMPANY_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeCompanyTypeCompany")))%>;

// Get Lead contact type custom fields
var LEADS_CONTACT_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeLeadTypeContact")))%>;
// Get Lead company type custom fields
var LEADS_COMPANY_TYPE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(request.getAttribute("customFieldsScopeLeadTypeCompany")))%>;

//Get email gateway status
var _IS_EMAIL_GATEWAY = <%=EmailGatewayUtil.isEmailGatewayExist()%>;

//online scheduling url will be filled  only when user goes to calendar route 
var ONLINE_SCHEDULING_URL ="" ;

var HANDLEBARS_LIB = LOCAL_SERVER ? "/lib/handlebars-v1.3.0.js" : "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js";

// Billing Restriction
var _billing_restriction = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(restriction))%>;
var USER_BILLING_PREFS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(subscription))%>;

// Iphone
var IS_IPHONE_APP = <%=MobileUADetector.isiPhone(userAgent)%>;
try{if(!HANDLEBARS_PRECOMPILATION)console.time("startbackbone");}catch(e){}

// Load language JSON
var _LANGUAGE = "<%=_LANGUAGE%>";
// var _Agile_Resources_Json = {};
// head.js("locales/" + _LANGUAGE + "/" + _LANGUAGE + ".json?" + _agile_get_file_hash('lib-all-new-2.js'));
head.load(  "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",
      LIB_PATH + 'final-lib/min/lib-all-new-1.js?_=' + _agile_get_file_hash('lib-all-new-1.js'),
      "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js",
      LIB_PATH + 'final-lib/min/backbone-min.js',
      LIB_PATH + 'final-lib/min/lib-all-new-2.js?_=' + _agile_get_file_hash('lib-all-new-2.js'),  
      function(){
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
/*$('.grid-selector').click(function(e){*/
  /*$('.grid-dropdown-menu').on('click','.grid-selector',function(e){
  e.stopImmediatePropagation();
  var route = $(this).attr("navigation");
  Backbone.history.navigate(route, {
                trigger: true
            });
  $("#need_help_header").removeClass("open");
  });*/

// Remove the loadinng
$('body').css('background-image', 'none');
//$('#content').html('ready');
$("img.init-loading", $('#content')).attr("src", "<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>/img/ajax-loader-cursor.gif");

head.load([{'js-core-1': CLOUDFRONT_PATH + 'jscore/min/locales/' + _LANGUAGE  +'/js-all-min-1.js' + "?_=" + _agile_get_file_hash('js-all-min-1.js')}, 
    {'js-core-2': CLOUDFRONT_PATH + 'jscore/min/locales/' + _LANGUAGE +'/js-all-min-2.js' + "?_=" + _agile_get_file_hash('js-all-min-2.js')}, 
    {'js-core-3': CLOUDFRONT_PATH + 'jscore/min/locales/' + _LANGUAGE +'/js-all-min-3.js' + "?_=" + _agile_get_file_hash('js-all-min-3.js')}, 
    {'js-core-4': CLOUDFRONT_PATH + 'jscore/min/locales/' + _LANGUAGE +'/js-all-min-4.js' + "?_=" + _agile_get_file_hash('js-all-min-4.js')}, 
    CLOUDFRONT_PATH + "tpl/min/precompiled/locales/" + _LANGUAGE + "/contact-view.js" + "?_=" + _agile_get_file_hash('contact-view.js')], function(){
      // console.log("All files loaded. Now continuing with script");
      load_globalize();
      try{
        // $('[data-icon-toggle="tooltip"]').tooltip({container : "body", placement : "right"});
        $('[data-toggle="tooltip"]').tooltip();  
        appendAgileNewThemeSubNavMenu();
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

        // Dont sanitize domain name
        CURRENT_DOMAIN_USER.domain = CURRENT_DOMAIN_USER.domain.replace(/&#x73;/g, "s");

        //Turn off all animations if this is mobile
        if( agile_is_mobile_browser() )
        {
          $("body")[0].addClass('disable-anim');
        }

      } catch(e) {
        
      }

  });


// Safari Browser Specific CSS

function isSafari() {
  return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
}

if(isSafari()){
  head.load("/css/safari-only.css?_=<%=_AGILE_VERSION%>");
}


// head.js({"stats" : '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>stats/min/agile-min.js' + "?_=" + _AGILE_VERSION});

}); //End of head.ready() function. Check above.


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
    // console.log("Ref = " + document.referrer);

  if(!document.referrer || document.referrer.indexOf("invite-users") == -1)
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
          <h3 id="myModalLabel">Sell, Market and Service like Fortune 500</h3>
          <small>Getting started with Agile CRM is simple. We made this video for you.</small>
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
