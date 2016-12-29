
<!DOCTYPE html>

<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.Date"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="org.jsoup.Jsoup"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="org.json.JSONArray"%>
<%@page import="java.util.Arrays"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.user.AgileUser"%>
<%@page import= "com.agilecrm.session.SessionCache"%>
<%@page import="com.agilecrm.session.SessionManager"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

<%
//User Language 
String _LANGUAGE = "en";
try{
	_LANGUAGE = UserPrefsUtil.getCurrentUserPrefsFromRequest(request).language;
}catch(Exception e){}

//Locales JSON
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "upload");

UserPrefs currentUserPrefs = UserPrefsUtil.getCurrentUserPrefs();
%>
<html>

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<title><%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-image") %></title>
<%-- <link rel="stylesheet" type="text/css" href="css/bootstrap-<%= UserPrefsUtil.getCurrentUserPrefs().template%>.min.css" /> --%>
<link rel="stylesheet" type="text/css" href="/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />
<!-- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script> -->
<script type='text/javascript' src='/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.v3.min.js"></script>
<!--<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>-->
<script type="text/javascript" src="../../lib/jquery.validate.min.js"></script>

<!-- <script type="text/javascript" src="/lib/bootstrap.min.js"></script> -->

<!-- Load angular file -->
<%if(request.getParameter("enable_crop") != null) {%>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js"></script>
<script type="text/javascript" src="/flatfull/lib/ng-img-crop/ng-img-crop.js"></script>
<script type="text/javascript" src="/flatfull/lib/ng-img-crop/ng-img-crop-util.js?_=12"></script>
<%}%>
<link rel="stylesheet" type="text/css" href="/flatfull/lib/ng-img-crop/ng-img-crop.css" />

<%if(currentUserPrefs.theme.equals("15")){%>
<link href="css/material-theme/icon/material-icons.css" rel="stylesheet" />
<link href="css/material-theme/icon/flaticons-social.css" rel="stylesheet" />
<link href="css/material-theme/css/style.css" rel="stylesheet" />
<link href="css/material-theme/css/agile-theme.css" rel="stylesheet" />
<%}%>

<style>
    .cropArea {
      background: #E4E4E4;
      overflow: hidden;
      /*width:500px;*/
      height:300px;
    }
</style>

<script>
	function getAgileResource(module, key){
		if(window.opener.getAgileResource)
			 return window.opener.getAgileResource(module, key);

		return window.opener._Agile_Resources_Json[module][key]; 
		}
</script>

<script type="text/javascript">
var localeJSON = <%=localeJSON%>;

jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});

</script>
<script type="text/javascript">
//Get URL
var url = "https://s3.amazonaws.com/agilecrm/" + unescape(getUrlVars()["key"]) + "?id=" + unescape(getUrlVars()["id"]);
var enabledToCropImage = <%=request.getParameter("enable_crop")%>;

// Get Id
//Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [],
        hash;
    
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
function returnBack()
{
	 
	 if (window.opener)
	 {   var id = "<%=request.getParameter("id")%>";
		 if(id == "contact-container")
		 {
			 window.opener.setContactImageURL(url);
		 }
		 else if(id == "upload-in-modal")
		 {
			 window.opener.setImageURLInModal(url);
		 }
		 else if(id == "tinymce_image_upload"){
			 window.opener.setTinyMCEImageUploadURL(url);
		 }
		 else
		 {
			 window.opener.setImageURL(url);
		 }
	     window.close();
	 }
	 return;
}
$(function()
{
	// Check if this was referred back again
	var key = getUrlVars()["key"];
	console.log("Key " + key);
	if(key != undefined)
	{
		returnBack();
		return;
	}
});
function isValid(){

	jQuery.extend(jQuery.validator.messages, {
    	required: '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "required") %>'
	});

    $("#form").validate({
        rules: {
        		file:{required:true,accept:"png|jpg|jpeg|gif"}
               },
         messages: {
              file: {
                accept: '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-valid-image") %>',
              },
               },
        submitHandler:function(form)
                      {   
        	              form.submit();
        	          }
   		});
    return $("#form").valid();
    } 
    
 $(function()
		{
	$("input:file").change(function (){
	var fileName = $(this).val();
    $(".filename").html(fileName);
    
    // to remove error message while change
    isValid();
  });

		});

(function()
 	{
 		if(agile_is_mobile_browser()){
   $( "<style>@media all and (max-width: 767px) {	.mobile-popup {min-height: 50vh; } .mobile-popup * {text-align: center;font-"+"size: 20px;}.mobile-popup input {display: inline-block;}}</style>" ).appendTo( "head" );
    }
 	})();

var upload = window.opener._Agile_Resources_Json.upload_window['upload-img-error'];
</script>
<style>
	label.error {
		color:red;
	}
	
</style>

</head>


<body class='wrapper-md <%if(!currentUserPrefs.animations) out.print("disable-anim");%> <%if(currentUserPrefs.theme.equals("15")) out.print("agile-new-theme agile-theme-15");%>' ng-app="app" ng-controller="Ctrl">

<br/>
<div class="row">
<div class="col-md-12 col-sm-12 col-xs-12">
<div class="panel panel-default mobile-popup upload-panel">
<div class="panel-heading"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-your-image") %></div>
<div class="panel-body">
<p><%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-image-format") %></i></p>

<br/>
<form id="form" action="https://agilecrm.s3.amazonaws.com/" method="post" enctype="multipart/form-data" onsubmit="return isValid();"> 
 
 <%if(request.getParameter("enable_crop") != null){
 %>
 	<input type="hidden" name="key" value="cd-uploaded-files/<%=new Date().getTime()%>" />  
 <%} else {
 %>
 	<input type="hidden" name="key" value="panel/uploaded-logo/<%=new Date().getTime()%>" />      
 <%}%>

<input type="hidden" name="acl" value="public-read" /> 
<input type="hidden" name="content-type" value="image/*" />

<input type="hidden" name="success_action_redirect" value="<%=request.getRequestURL()%>?id=<%=request.getParameter("id")%>" /> 

<input type="hidden" name="AWSAccessKeyId" value="AKIAJ62OAFOKCJTDANVA" />
<input type="hidden" name="policy" value="IHsKImV4cGlyYXRpb24iOiAiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImFnaWxlY3JtIiB9LAogICAgeyJhY2wiOiAicHVibGljLXJlYWQiIH0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAicGFuZWwvdXBsb2FkZWQtbG9nbyJdLAogICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgImltYWdlLyJdLAogICAgWyAiY29udGVudC1sZW5ndGgtcmFuZ2UiLCA1MTIsIDQxOTQzMDRdLAogICAgWyJzdGFydHMtd2l0aCIsICIkc3VjY2Vzc19hY3Rpb25fcmVkaXJlY3QiLCAiIiBdCiAgXQp9" />
<input type="hidden" name="signature" value="kTLzXhH6RYKpZ/+5oToI59iSl5Q=" />


<p><input name="file" id='fileextension' type="file" /></p>

<div class="row m-n cropAreaContainer" style="display: none;">
	<div class="cropArea col-xs-8 col-sm-8 col-md-8">
	    <img-crop image="myImage" result-image="myCroppedImage" area-type="{{cropType}}"></img-crop>
	</div>
	<div class="col-xs-4 col-sm-4 col-md-4" id="preview">
		<div><%=LanguageUtil.getLocaleJSONValue(localeJSON, "cropped-image") %>:</div>
		<div><img ng-src="{{myCroppedImage}}" style="width: 100%;"/></div>
	</div>
</div>

<!--
<div class="btn-group m-t">
      <label class="btn btn-default" ng-model="cropType" btn-radio="'circle'">Circle</label>
      <label class="btn btn-default" ng-model="cropType" btn-radio="'square'">Square</label>
</div>
-->


<br/>
<input name="upload" value='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload") %>' class='submit btn btn-primary' type="submit"/> 
</form> 
</div>
</div>
</div>
</div>
</body>
</html>