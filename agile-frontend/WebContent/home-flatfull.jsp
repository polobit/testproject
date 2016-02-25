<!DOCTYPE html>
<%@page import="com.agilecrm.subscription.Subscription"%>
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

<script type="text/javascript">
function isIE() {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

 if(isIE() && isIE() < 10)
 {window.location='/error/not-supported.jsp';}

</script>
<div id="alert-message" style="display:none;"></div>
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
  <li id="landing-pages-menu">
    <a href="#landing-pages">
      <i class="fa fa-file-code-o"></i>
      <span>Landing Pages</span>
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
  <!-- <li class='<%if(currentUserPrefs.menuPosition.equals("top")){out.print("dockedicons ");} else{out.print("fixedicons ");} %>' id="planView"> <a href="#subscribe"><i class="icon-shopping-cart"></i> <span> Plan &amp; Upgrade </span></a></li>
  <li class='pos-b-0 <%if(currentUserPrefs.menuPosition.equals("top")){out.print("dockedicons ");} else{out.print("fixedicons ");} %>' id ="helpView"><a href="#help"><i class="icon-question"></i>
                      <span> Help </span></a></li> -->
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

              <%--
              <%
              
                for(NavbarConstants constant : domainUser.menu_scopes)
                {
              %>
                    <li id="<%=constant.id%>"><a href="<%=constant.href%>"><i
                    class="<%=constant.icon%> icon-white"></i> <%=constant.heading%></a></li>
              <%
                }
              %>
              
              
              <%
              String css_classes = "";
              int size = domainUser.menu_scopes.size();
              if(size <=7)
              {
                  
                  css_classes = css_classes + " more-menu-hide-medium";
              }
              else
              {
                  css_classes = css_classes + " more-menu-show-medium";
              }
              if(size <= 4)
              {
                  css_classes = css_classes + " more-menu-hide-low";
              }
              else
              {
                  css_classes = css_classes + " more-menu-show-low";
              }
              
              
                  if (domainUser.menu_scopes.size() > 3) {
              %>
                <li id="more-menu" class="dropdown <%=css_classes%>"><a
                  class="dropdown-toggle" data-toggle="dropdown" href=""> More
                    <i class='caret'></i>
                </a>
                <%
                  } else
                  {
                %>
                <li id="more-menu" class="dropdown <%=css_classes%>"><a
                  class="dropdown-toggle" data-toggle="dropdown" href=""> More
                    <i class='caret'></i>
                </a>
              <%
                  }
              %>
                <ul class="dropdown-menu drop-drop">
                  <%
                Iterator<NavbarConstants> iterator = domainUser.menu_scopes.iterator();
                int index = 0;
                for(NavbarConstants constant : domainUser.menu_scopes)
                {
                    
                    if(index < 2)
                    {
                    ++index;
                    continue;
                    }
                    
              %>
                    <li  id="<%=constant.id%>"><a href="<%=constant.href%>"><i
                    class="<%=constant.icon%> icon-white"></i> <%=constant.heading%></a></li>
              <%
                }
              %>
                </ul>
              </li> 
              --%>
              
              <li class="line dk"></li>
            <li class="hidden-folded padder m-t m-b-sm text-muted text-xs">
                <span>More</span>
              </li>
                <li data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Calendar"><a href="#calendar"><i class="icon icon-calendar"></i> <span class="visible-xs">Calendar</span> </a></li>
                <li id="due_tasks"  data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Tasks"><a class="pos-rlt" href="#tasks"><i class="icon-list"></i>
                  <span class="visible-xs">Tasks</span>

                      <span title="Tasks due" class="navbar_due_tasks pull-right-xs"><span  id="due_tasks_count" class="badge badge-sm up bg-danger"></span></span></a></li>
               <!-- <li id="recent-menu" class="dropdown" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Activity"><a
                class="dropdown-toggle" data-toggle="dropdown" href=""> <i class='fa fa-history' style="opacity:0.8"></i>
                <span class="visible-xs">Recent Activity</span>
              </a><ul class="dropdown-menu animated fadeInRight recent-view" style="width:23em; right:-11px;"></ul>
              </li>  -->
              
              
            </ul>
  
      <ul class="nav  navbar-nav  navbar-right show_shortcuts"> 
              <li rel="popover" data-trigger="click" class="need_help hidden-xs" screen_name="Need Help? We are one click away." data-content="<div class='row' id='need_help_header'  style='color:#7D7474'>
                  <div class='col-md-12 text-sm p-b-xs'>Need Help? We are one click away.</div>
                </div>
                <div class='row m-none' style='color:#7D7474'>
                <div class='pull-left inline-block' style='width:50%;border-right: 1px solid #E2E4E4;'>
                 <div class='p-r-none p-l-none'>
                  <div class='text-center'>
                   <div class='text-xs' style='margin-top:-2px;padding-bottom:2px;'><b><a href='https://our.agilecrm.com/calendar/Vikas,Mrudula,Shravi_Sharma,Bharat,Manish,Nick,Stephen' target='_blank' rep class='text-info'>Sales</a></b>
                   </div>
                  </div> 
                   </div>
                  </div>
                  <div class='pull-right' style='width:50%;border-left: 1px solid #FFFFFF;'>
                 <div class='p-r-none p-l-none'>
                  <div class=' text-center text-xs'  style='margin-top:-2px;padding-bottom:2px;'><b><a href='https://our.agilecrm.com/calendar/Haaris_farooqi,Khader' target='_blank' rep class='text-info'>Support</a></b>
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
                      <%-- <%
                          if (!StringUtils.isEmpty(currentUserPrefs.pic))
                                out.println("<img src='"
                                    + currentUserPrefs.pic
                                    + "'style='padding:2px !important' class='thumbnail m-b-none thumb-xxs m-r-xs inline'></img>");
                              else
                                out.println("<img src='img/gravatar.png' style='padding:2px !important' class='thumbnail m-b-none thumb-xxs m-r-xs inline'></img>");
                      %> --%> <span class="text-sm m-r-md"> <%=SafeHtmlUtil.sanitize(user.getEmail())%></span>

                  </div>
                  </span>              
                   </a>
                </li>

                  <li></li>

                  <li><a href="#user-prefs"><!-- <i class="icon-cog"></i> -->

                      <div class="pull-left">Preferences</div><div class='pull-right shortcuts'>Shift + P</div><div class="clearfix"></div></a></li>

                  <%
                      if (domainUser != null && domainUser.is_admin)
                      {
                            out.print("<li><a href='#account-prefs'><div class='pull-left'>Admin Settings</div><div class='pull-right shortcuts'>Shift + A</div><div class='clearfix'></div></a></li>");
                          //  out.println("<li><a href='#subscribe'><i class='icon-shopping-cart'></i> Plan & Upgrade</a></li>");
                      }
                  %>
                  <li><a href="#themeandlayout"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left">Theme & Layout</div><div class='pull-right shortcuts'>Shift + L</div><div class="clearfix"></div></a></li>
                  
                  <li><a href="#subscribe"><!-- <i class="icon-cog"></i> -->
                      <div class="pull-left">Upgrade</div><div class='pull-right shortcuts'>Shift + U</div><div class="clearfix"></div></a></li>
                  <li><a href="https://www.agilecrm.com/product-updates" target="_blank"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left">Product Updates</div><div class='pull-right shortcuts'>Shift + R</div><div class="clearfix"></div></a></li>
                  <li><a href="#help"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left">Help</div><div class='pull-right shortcuts'>Shift + H</div><div class="clearfix"></div></a></li>
                  <!-- <li><a href="https://www.agilecrm.com/support.html" target="_blank"><i class="icon-facetime-video"></i> Help
                      Videos</a></li>
                  <li><a href="#" onclick="$('li#fat-menu').removeClass('open');clickdesk_show_livechat_popup();"><i class="icon-comment"></i> Live Chat</a></li>  -->
                  <!-- <li><a href="#help"><i class="icon-question"></i>
                      Help</a></li> -->
                  
                  <li><a href="<%=logoutURL%>"><!-- <i class="icon-off"></i> -->
                      <div class="pull-left">Logout</div><div class='pull-right shortcuts'>Shift + G</div><div class="clearfix"></div></a></li>

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
 
  <!-- Include bootstrap modal divs-->
 <%@ include file="flatfull/modals.html"%>

</div>
<!-- Including Footer page -->
<jsp:include page="flatfull/footer.jsp" />

<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
<script>

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

// Get Contact Date Fields
var CONTACTS_DATE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.CONTACT, "DATE")))%>;
// Get Contact Date Fields
var COMPANY_DATE_FIELDS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(CustomFieldDefUtil.getCustomFieldsByScopeAndType(SCOPE.COMPANY, "DATE")))%>;

//online scheduling url will be filled  only when user goes to calendar route 
var ONLINE_SCHEDULING_URL ="" ;

var HANDLEBARS_LIB = LOCAL_SERVER ? "/lib/handlebars-v1.3.0.js" : "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js";

// Billing Restriction
var _billing_restriction = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(restriction))%>;
var USER_BILLING_PREFS = <%=SafeHtmlUtil.sanitize(mapper.writeValueAsString(subscription))%>;
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
head.js(HANDLEBARS_LIB, CLOUDFRONT_PATH + "tpl/min/precompiled/" + FLAT_FULL_PATH + "tpl.js" + "?_=" + _AGILE_VERSION, CLOUDFRONT_PATH + "tpl/min/precompiled/" + FLAT_FULL_PATH + "contact-view.js" + "?_=" + _AGILE_VERSION);
else
	head.js(HANDLEBARS_LIB, FLAT_FULL_PATH + "jscore/handlebars/download-template.js" + "?_=" + _AGILE_VERSION);

var en;


// Fetch/Create contact from our domain
var Agile_Contact = {};


head.ready(function() {
	
if(!HANDLEBARS_PRECOMPILATION){
    downloadTemplate("tpl.js", function(){             
    });
    downloadTemplate("contact-view.js", function(){             
    });
}
 
// Remove the loadinng
$('body').css('background-image', 'none');
//$('#content').html('ready');
$("img.init-loading", $('#content')).attr("src", "<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>/img/ajax-loader-cursor.gif");
head.js({"core" :   CLOUDFRONT_PATH + 'jscore/min/' + FLAT_FULL_PATH +'js-all-min.js' + "?_=" + _AGILE_VERSION});
// head.js({"stats" : '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>stats/min/agile-min.js' + "?_=" + _AGILE_VERSION});
head.ready(["core"], function(){
	 $('[data-toggle="tooltip"]').tooltip();  
	//Code to display alerts of widgets.
	showNotyPopUp('<%=session.getAttribute("widgetMsgType") %>', '<%=session.getAttribute("widgetMsg") %>' , "bottomRight");
   
	//Resting the variables.
	<%  session.removeAttribute("widgetMsgType");
	session.removeAttribute("widgetMsg"); %>
	
	try{
      var sig = CURRENT_USER_PREFS.signature;
      sig = sig.replace(/&lt;/g, "<").replace(/&gt;/g, ">");

      CURRENT_USER_PREFS.signature = sig;
	}catch(e){}
});

});    
function load_globalize()
{

  Globalize.load(Globalize_Main_Data);
  en = Globalize("en");

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