<!DOCTYPE html>
<%@page import="com.google.appengine.api.taskqueue.Queue"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="com.google.appengine.api.taskqueue.TaskOptions"%>
<%@page import="com.google.appengine.api.taskqueue.QueueFactory"%>
<%@page import="com.agilecrm.activities.util.TaskUtil"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.agilecrm.HomeServlet"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.StringUtils2"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Helpcenter | Agile CRM</title>
<%
  // Download the template the user likes
 String template = "default";
  
 String domain = NamespaceManager.get();

 System.out.println (domain+"domain test");
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
<link rel="stylesheet" type="text/css" href="flatfull/css/min/css-all-min.css?_=<%=_AGILE_VERSION%>"></link>
<link rel="stylesheet" type="text/css" href="flatfull/css/lib/helpcenter.css?_=<%=_AGILE_VERSION%>"></link>
</head>
<div  id="agile_kb_result_embed" style="background-color:#FFFFFF; margin-left: 0px;">
</div>
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

<script src='//cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'></script>
<script>

try{console.time("startbackbone");}catch(e){}

var LOCAL_SERVER = <%=debug%>;

var KB_DOMAIN = LOCAL_SERVER ?'':'<%=domain%>';

var USER_IP_ADDRESS = '<%=request.getRemoteAddr()%>'

var S3_STATIC_IMAGE_PATH = KB_DOMAIN+'<%=S3_STATIC_IMAGE_PATH%>';


var LIB_PATH = KB_DOMAIN+'<%=CLOUDFRONT_STATIC_FILES_PATH%>';

var FLAT_FULL_PATH = KB_DOMAIN+'<%=FLAT_FULL_PATH%>';

// Target to cloudfront URL
var LIB_PATH_FLATFULL = KB_DOMAIN+'<%=CLOUDFRONT_TEMPLATE_LIB_PATH + FLAT_FULL_PATH%>'

var CLOUDFRONT_PATH = KB_DOMAIN+'<%=CLOUDFRONT_TEMPLATE_LIB_PATH%>';

var FLAT_FULL_UI = KB_DOMAIN+"flatfull/";  

var _AGILE_VERSION = <%="\"" + _AGILE_VERSION + "\""%>;

var HANDLEBARS_PRECOMPILATION = false || <%=production%>;

var CSS_PATH = KB_DOMAIN+'<%=CSS_PATH%>';
// var CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";

var IS_CONSOLE_ENABLED = <%=debug%>;

var IS_FLUID = <%=is_fluid %>

var HANDLEBARS_LIB = LOCAL_SERVER ? "/lib/handlebars-v1.3.0.js" : "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js";

head.load(LIB_PATH + 'final-lib/min/lib-all-min-1.js?_=' + _AGILE_VERSION, function(){
        load_globalize();
});

if(HANDLEBARS_PRECOMPILATION)
head.js(CLOUDFRONT_PATH + "tpl/min/precompiled/" + FLAT_FULL_PATH + "helpcenter.js" + "?_=" + _AGILE_VERSION);	

var en;

head.ready(function() {

if(!HANDLEBARS_PRECOMPILATION){
    head.js(HANDLEBARS_LIB, FLAT_FULL_PATH + "jscore/handlebars/download-template.js" + "?_=" + _AGILE_VERSION, function()
    {
        downloadTemplate("helpcenter-tpl.js");
    });
}
 

head.js({"core" :   CLOUDFRONT_PATH + 'jscore/min/' + FLAT_FULL_PATH +'helpcenter-min.js' + "?_=" + _AGILE_VERSION});

});    
function load_globalize()
{
  Globalize.load(Globalize_Main_Data);
  en = Globalize("en");

}
</script>
</html>