<!DOCTYPE html>
<%@page import="com.agilecrm.session.KnowledgebaseUserInfo.Role"%>
<%@page import="com.agilecrm.session.KnowledgebaseUserInfo"%>
<%@page import="com.agilecrm.session.KnowledgebaseManager"%>
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
<%@page	import="com.agilecrm.knowledgebase.util.KbLandingPageUtil"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>



<html lang="en">
<head>
<meta charset="utf-8">
<title>Knowledge Base</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">
<meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/eofoblinhpjfhkjlfckmeidagfogclib">

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>


<%
  ObjectMapper mapper = new ObjectMapper();
  
  
  // Download the template the user likes
  String templated = "default";

  boolean is_fluidd = false;

  String _AGILE_VERSIONd = SystemProperty.applicationVersion.get();

  String _VERSION_IDd = VersioningUtil.getVersion();
  if(kbpage != null){
	 Long kbpagelp_id ;
  	kbpagelp_id = kbpage.kb_landing_page_id;
  }	
%>

<%
  String CSS_PATHd = "/";
  String FLAT_FULL_PATHd = "flatfull/";

  String CLOUDFRONT_TEMPLATE_LIB_PATHd = VersioningUtil.getCloudFrontBaseURL();
  
  System.out.println(CLOUDFRONT_TEMPLATE_LIB_PATHd);
    
  String CLOUDFRONT_STATIC_FILES_PATHd = VersioningUtil.getStaticFilesBaseURL();

  CSS_PATHd = CLOUDFRONT_STATIC_FILES_PATHd;
  
  // Static images s3 path
  String S3_STATIC_IMAGE_PATHd = CLOUDFRONT_STATIC_FILES_PATHd.replace("flatfull/", "");
  
  if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
  {
	  CLOUDFRONT_STATIC_FILES_PATHd = FLAT_FULL_PATHd;
	  CLOUDFRONT_TEMPLATE_LIB_PATHd = "";	
	  CSS_PATHd = FLAT_FULL_PATHd;
  }
%>

<link rel="stylesheet" type="text/css" href="flatfull/css/min/css-all-min.css?_=<%=_AGILE_VERSIONd%>"></link>
<link rel="stylesheet" type="text/css" href="flatfull/css/lib/helpcenter.css?_=<%=_AGILE_VERSIONd%>"></link>
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
<%@ include file="/helpcenter/header.html"%>
<div id="alert-message" style="display:none;"></div>
<div id="wrap" class="app app-aside-folded-inactive" style="background-color: white;">


<div class="app-content" id="agilecrm-container" style="margin-left: 0px;">
	<div id="content" class="app-content-body"></div>
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
boolean debugd = true;
boolean productiond = false;
boolean HANDLEBARS_PRECOMPILATIONd = false;
if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
{
    debugd = false;
    HANDLEBARS_PRECOMPILATIONd = true;
    productiond = true;
   
}

%>

</div>
<!-- Including Footer page -->
<jsp:include page="flatfull/footer.jsp" />

<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
<script>

try{console.time("startbackbone");}catch(e){}

var USER_IP_ADDRESSd = '<%=request.getRemoteAddr()%>'

var S3_STATIC_IMAGE_PATHd = '<%=S3_STATIC_IMAGE_PATHd%>';
//var LIB_PATH = "//-dpm72z3r2fvl4.cloudfront.net/js/";
//var LIB_PATH = "//cdnapp.agilecrm.com/";
var LIB_PATHd = '<%=CLOUDFRONT_STATIC_FILES_PATHd%>';

var FLAT_FULL_PATHd = '<%=FLAT_FULL_PATHd%>';

// Target to cloudfront URL
var LIB_PATH_FLATFULLd = '<%=CLOUDFRONT_TEMPLATE_LIB_PATHd + FLAT_FULL_PATHd%>'

var CLOUDFRONT_PATHd = '<%=CLOUDFRONT_TEMPLATE_LIB_PATHd%>';

var FLAT_FULL_UId = "flatfull/";  

var _AGILE_VERSIONd = <%="\"" + _AGILE_VERSIONd + "\""%>;

var HANDLEBARS_PRECOMPILATIONd = false || <%=productiond%>;

var CSS_PATHd = '<%=CSS_PATHd%>';
// var CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";
var kbpagelpid = <%=kbpage.kb_landing_page_id%>;

var IS_CONSOLE_ENABLEDd = <%=debugd%>;
var LOCAL_SERVERd = <%=debugd%>;

var IS_FLUIDd = <%=is_fluidd %>

var HANDLEBARS_LIBd = LOCAL_SERVERd ? "/lib/handlebars-v1.3.0.js" : "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js";

  var _AGILE_FILE_HASH;
  
  function _agile_get_file_hash(filename)
  {
    if( !filename || filename == '' ) return _AGILE_VERSION;
    
    if( _AGILE_FILE_HASH && _AGILE_FILE_HASH[filename] )  return _AGILE_FILE_HASH[filename];
    
    return _AGILE_VERSION;
  }
  head.load(  "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",
      LIB_PATH + 'final-lib/min/lib-all-new-1.js?_=' + _agile_get_file_hash('lib-all-new-1.js'),
      "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js",
      LIB_PATH + 'final-lib/min/backbone-min.js',
      LIB_PATH + 'final-lib/min/lib-all-new-2.js?_=' + _agile_get_file_hash('lib-all-new-2.js')+'_', 
      function(){
        
    });

// head.js({ library  : LIB_PATH + 'final-lib/min/lib-all-min-1.js?_=' + _AGILE_VERSION });

if(HANDLEBARS_PRECOMPILATIONd)
head.js(CLOUDFRONT_PATHd + "tpl/min/precompiled/" + FLAT_FULL_PATHd + "helpcenter-tpl.js" + "?_=" + _AGILE_VERSIONd);	

var en;


// head.ready('library', function() {

head.ready(function() {

if(!HANDLEBARS_PRECOMPILATIONd){
    head.js(HANDLEBARS_LIBd, FLAT_FULL_PATHd + "jscore/handlebars/download-template.js" + "?_=" + _AGILE_VERSIONd, function()
    {
        downloadTemplate("helpcenter-tpl.js");
    });
}
 
// Remove the loadinng
$('body').css('background-image', 'none');

//$('#content').html('ready');
$("img.init-loading", $('#content')).attr("src", "<%=CLOUDFRONT_TEMPLATE_LIB_PATHd%>/img/ajax-loader-cursor.gif");
head.js({"core" :   CLOUDFRONT_PATHd + 'jscore/min/' + FLAT_FULL_PATHd +'helpcenter-all-min.js' + "?_=" + _AGILE_VERSIONd});

// head.js({"stats" : '<%=CLOUDFRONT_TEMPLATE_LIB_PATHd%>stats/min/agile-min.js' + "?_=" + _AGILE_VERSIONd});
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
</script>
</body>
</html>