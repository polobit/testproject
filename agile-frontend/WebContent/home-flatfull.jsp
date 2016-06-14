<!DOCTYPE html>
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
<%@page import="java.util.List"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>



<html>
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
      
    if( !filename || filename == '' ) return _AGILE_VERSION;
    
    if( _AGILE_FILE_HASH && _AGILE_FILE_HASH[filename] )  return _AGILE_FILE_HASH[filename];
    
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

AddOn addOn = AddOnUtil.getAddOn();

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
.free_plan_alert {
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
<%
   if(MobileUADetector.isMobile(request.getHeader("user-agent"))){
%>
    #personModal #import-link{display: none!important;}
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
<div id="free_plan_alert_info" class="free_plan_alert alert alert-info" role="alert" style="display:none;"> 
  <span class="free_plan_message">
   <%=LanguageUtil.getLocaleJSONValue(localeJSON, "you-are-currently-on-free-plan") %>.
  </span>
  <a href="#subscribe" class="text-info font-bold" onclick="Agile_GA_Event_Tracker.track_event('Upgrade from Nav Bar Message')"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "noty-upgrade") %></a>
  <span class="free_plan_strip_close p-l-sm c-p">&times</span>
</div>

<img class='hide' src='https://doxhze3l6s7v9.cloudfront.net/img/menu-service-icons-sprite.png'></img>

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
                    
                <li class='pull-left m-b-sm'>
                  <a href='#' class='menu-service-select' data-service-name='SALES' data-dashboard='SalesDashboard'><i class='thumb background-img-sales'></i>
                    <span class='block' ><%=LanguageUtil.getLocaleJSONValue(localeJSON, "sales") %>
                    </span>
                  </a>
                </li>

                <li class='pull-left m-b-sm'><a href='#' class='menu-service-select' data-service-name='MARKETING' data-dashboard='MarketingDashboard' ><i class='thumb background-img-marketing' ></i> <span class='block'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "menu-marketing") %></span></a></li>

                <li class='pull-left m-b-sm'><a href='#' class='menu-service-select' data-service-name='SERVICE' data-dashboard='dashboard' ><i class='thumb background-img-service'></i> <span class='block'><%=LanguageUtil.getLocaleJSONValue(localeJSON, "service") %></span></a></li>

                </ul>
                </div>
                
                  </div>">
                   <a href="#" class='grid-icon-header block wrapper' onclick="return false;"><i class=