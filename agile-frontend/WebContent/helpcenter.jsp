<!DOCTYPE html>
<%@page import="com.agilecrm.session.KnowledgebaseUserInfo.Role"%>
<%@page import="com.agilecrm.session.KnowledgebaseUserInfo"%>
<%@page import="com.agilecrm.session.KnowledgebaseManager"%>
<%@page import="com.google.appengine.api.taskqueue.Queue"%>
<%@page import="com.agilecrm.subscription.Subscription"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page
	import="com.campaignio.servlets.deferred.DomainUserAddPicDeferredTask"%>
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
<%@page
	import="com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil"%>
<%@page
	import="com.agilecrm.subscription.restrictions.db.BillingRestriction"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.StringUtils2"%>
<%@page import="com.agilecrm.user.AgileUser"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page import="com.agilecrm.landingpages.LandingPageUtil"%>
<%@page	import="com.agilecrm.knowledgebase.entity.LandingPageKnowledgebase"%>
<%@page	import="com.agilecrm.landingpages.LandingPage"%>
<%@page	import="com.agilecrm.landingpages.LandingPageServlet"%>

<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@page	import="com.agilecrm.db.ObjectifyGenericDao"%>
<%@page	import="com.agilecrm.account.APIKey"%>
<%@page	import="com.agilecrm.knowledgebase.util.KbLandingPageUtil"%>

  
  <%
  LandingPageKnowledgebase  kbpage = KbLandingPageUtil.get(); ;

	if(kbpage == null ||kbpage.kb_landing_page_id == 0 
			|| LandingPageUtil.getLandingPage(kbpage.kb_landing_page_id) == null){
	%>
		<%@ include file="/knowledgebase.jsp"%>
	<%}%> 
	
	<% 
  
	
  String template = "default";

  boolean is_fluid = false;

  String _AGILE_VERSION = SystemProperty.applicationVersion.get();

  String _VERSION_ID = VersioningUtil.getVersion();

  
		try{
	
	if(kbpage !=null){
		Long landingpageid = kbpage.kb_landing_page_id;
	LandingPageUtil lpUtil = new LandingPageUtil();
	LandingPage landingPage = lpUtil.getLandingPage(landingpageid);
	if(landingPage == null)
	throw new Exception("No landing page found.");

	String fullXHtml = landingPage.html;
	fullXHtml =  new LandingPageServlet().getResponsiveMediaIFrame(fullXHtml);

	String domainHost = "http://localhost:8888";
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production) {
		domainHost = "https://" + lpUtil.requestingDomain +  ".agilecrm.com";		
		//domainHost = "https://" + lpUtil.requestingDomain + "-dot-sandbox-dot-agilecrmbeta.appspot.com";
	}

	String analyticsCode = "";
			
	if(landingPage.elements_css != null){
		fullXHtml = fullXHtml.replace("</head>", "<style id=\"elements-css\">"+landingPage.elements_css+"</style></head>");	
	}
	fullXHtml = fullXHtml.replace("</head>", "<style>"+landingPage.css+"</style></head>");
	fullXHtml = fullXHtml.replace("</body></html>", landingPage.js+"</script>");		
		

	out.write(fullXHtml);
		}
	} catch (Exception e) {
	out.print("<h1>"+e.getMessage()+"</h1>");
	} finally {
	}

  
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
<link rel="stylesheet" type="text/css" href="flatfull/css/min/css-all-min.css?_=<%=_AGILE_VERSION%>"></link>
  <link rel="stylesheet" type="text/css" href="flatfull/css/min/helpcenter-custom.css?_=<%=_AGILE_VERSION%>"></link>
<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
<script>

<%-- var landingpageid = <%=landingpageid %> --%>

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

var _AGILE_VERSION = "<%=_AGILE_VERSION%>";

var HANDLEBARS_PRECOMPILATION = false || <%=production%>;

var CSS_PATH = '<%=CSS_PATH%>';
// var CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";

var IS_CONSOLE_ENABLED = <%=debug%>;
var LOCAL_SERVER = <%=debug%>;

var IS_FLUID = <%=is_fluid %>



var HANDLEBARS_LIB = LOCAL_SERVER ? "/lib/handlebars-v1.3.0.js" : "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js";

head.load(LIB_PATH + 'final-lib/min/lib-all-min-1.js?_=' + _AGILE_VERSION, function(){
        load_globalize();
});

// head.js({ library  : LIB_PATH + 'final-lib/min/lib-all-min-1.js?_=' + _AGILE_VERSION });

if(HANDLEBARS_PRECOMPILATION)
head.js(CLOUDFRONT_PATH + "tpl/min/precompiled/" + FLAT_FULL_PATH + "helpcenter-tpl.js" + "?_=" + _AGILE_VERSION);	

var en;

// Fetch/Create contact from our domain
var Agile_Contact = {};


// head.ready('library', function() {

head.ready(function() {

if(!HANDLEBARS_PRECOMPILATION){
    head.js(HANDLEBARS_LIB, FLAT_FULL_PATH + "jscore/handlebars/download-template.js" + "?_=" + _AGILE_VERSION, function()
    {
        downloadTemplate("helpcenter-tpl.js");
    });
}
 
// Remove the loadinng
$('body').css('background-image', 'none');

//$('#content').html('ready');
$("img.init-loading", $('#content')).attr("src", "<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>/img/ajax-loader-cursor.gif");
head.js({"core" :   CLOUDFRONT_PATH + 'jscore/min/' + FLAT_FULL_PATH +'helpcenter-all-min.js' + "?_=" + _AGILE_VERSION});

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
</script>
</body>
</html>