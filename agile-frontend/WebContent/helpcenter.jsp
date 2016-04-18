<!DOCTYPE html>
<%@page import="com.google.appengine.api.taskqueue.Queue"%>
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
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>



<html lang="en">
<head>
<meta charset="utf-8">
<title>Helpcenter | Agile CRM</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">
<meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/eofoblinhpjfhkjlfckmeidagfogclib">

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>


<%
DomainUser domainUser = DomainUserUtil.getDomainOwner(NamespaceManager.get());

// Download the template the user likes
String template = "default";

boolean is_fluid = false;

String _AGILE_VERSION = SystemProperty.applicationVersion.get();

String _VERSION_ID = VersioningUtil.getVersion();
%>

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
<link rel="stylesheet" type="text/css" href="flatfull/css/lib/helpcenter.css?_=<%=_AGILE_VERSION%>"></link>
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



<body>

<script type="text/javascript">
function isIE() {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

 if(isIE() && isIE() < 10)
 {window.location='/error/not-supported.jsp';}

</script>
<div id="alert-message" style="display:none;"></div>
<div id="wrap" class="app app-aside-folded-inactive app-header-fixed app-aside-fixed">

<!-- Including header(Navigation Bar) page -->
<%@ include file="/helpcenter/header.html"%>

<div class="app-content" id="agilecrm-container" style="margin-left: 0px;">
	<!-- <div class="butterbar animation-active" style="z-index:99;"><span class="bar"></span></div>-->
	<div id="content" class="app-content-body">
		<!-- Search box -->
	
			<div class="search-box">
                <h1>Have a question?</h1>
                <h3>you have any question you can enter what you are looking for!</h3>
				<form id="article_search_form" name="article_search_form" class="" method="get" action="">	
					<div class="input-append">
  						<input id="hc_query" name="hc_query" type="text" placeholder="Search">
  						<input name="commit" type="submit" value="Search" class="btn btn-primary">
					</div>
				</form>	
			</div>

		<!-- /Search box -->
		 <div class="container">
			<div class="row">
		       <div class="col-md-8" id="content_wrapper"">
		
				<!-- Categories  -->
				<div class="row">
					<div class="col-md-8">
						<div class="category-header">
							<a href="#category-add" class="btn btn-primary pull-right">Add Category</a>
							<h2>Categories</h2>
						</div>
		                <div class="section-end"></div>
					</div>
				</div>
		
		       <div id="hc_categories" class="hc-categories"></div>
				<!-- /Categories -->
		
				</div>
			</div>
		  </div>
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

</div>
<!-- Including Footer page -->
<jsp:include page="flatfull/footer.jsp" />

<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
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

var FLAT_FULL_UI = "flatfull/";  

var _AGILE_VERSION = <%="\"" + _AGILE_VERSION + "\""%>;

var HANDLEBARS_PRECOMPILATION = false || <%=production%>;

var CSS_PATH = '<%=CSS_PATH%>';
// var CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";

var IS_CONSOLE_ENABLED = <%=debug%>;
var LOCAL_SERVER = <%=debug%>;

var IS_FLUID = <%=is_fluid %>

var CLICKDESK_CODE_LOADED = false;

var HANDLEBARS_LIB = LOCAL_SERVER ? "/lib/handlebars-v1.3.0.js" : "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js";

head.load(LIB_PATH + 'final-lib/min/lib-all-min-1.js?_=' + _AGILE_VERSION, function(){
        load_globalize();
        showVideoForRegisteredUser();
});

// head.js({ library  : LIB_PATH + 'final-lib/min/lib-all-min-1.js?_=' + _AGILE_VERSION });

if(HANDLEBARS_PRECOMPILATION)
head.js(CLOUDFRONT_PATH + "tpl/min/precompiled/" + FLAT_FULL_PATH + "tpl.js" + "?_=" + _AGILE_VERSION);	

var en;

// Fetch/Create contact from our domain
var Agile_Contact = {};


// head.ready('library', function() {

head.ready(function() {

if(!HANDLEBARS_PRECOMPILATION){
    head.js(HANDLEBARS_LIB, FLAT_FULL_PATH + "jscore/handlebars/download-template.js" + "?_=" + _AGILE_VERSION, function()
    {
        downloadTemplate("tpl.js");
        downloadTemplate("contact-view.js");
    });
}
 
// Remove the loadinng
$('body').css('background-image', 'none');

//$('#content').html('ready');
$("img.init-loading", $('#content')).attr("src", "<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>/img/ajax-loader-cursor.gif");

// head.js({"stats" : '<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>stats/min/agile-min.js' + "?_=" + _AGILE_VERSION});
head.ready(["core"], function(){

   try{
      $('[data-toggle="tooltip"]').tooltip();  
      //Code to display alerts of widgets.
      showNotyPopUp('<%=session.getAttribute("widgetMsgType") %>', '<%=session.getAttribute("widgetMsg") %>' , "bottomRight");
   }catch(e){}
	 
	//Resting the variables.
	<% session.removeAttribute("widgetMsgType");
	   session.removeAttribute("widgetMsg"); 
  %>
	
	try{
      var sig = CURRENT_USER_PREFS.signature;
      sig = sig.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      CURRENT_USER_PREFS.signature = sig;
	}catch(e){}

});

});    
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
</script>


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

</body>
</html>