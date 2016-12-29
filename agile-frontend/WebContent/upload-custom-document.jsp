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
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "upload-custom-document");

UserPrefs currentUserPrefs = UserPrefsUtil.getCurrentUserPrefs();
%>

<!DOCTYPE html>
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
<%@page import= "com.agilecrm.session.SessionCache"%>
<%@page import="com.agilecrm.session.SessionManager"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<title><%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-new-doc") %></title>

<link rel="stylesheet" type="text/css" href="/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />

<script type='text/javascript' src='/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.v3.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>

<script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;

var localeJSON = <%=localeJSON%>;
jQuery.extend(jQuery.validator.messages, {
      required: '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "required") %>'
  });

</script>
<script type="text/javascript">
var LOCALES_JSON = <%=localeJSON%>;
//Get URL
var url = "https://s3.amazonaws.com/agilecrm/" + unescape(getUrlVars()["key"]) + "?id=" + unescape(getUrlVars()["id"]);

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
	 {
		 var network = "S3";
		 window.opener.saveDocumentURL(url, network, window.location.search);
	     window.close();
	 }
	 return;
}
$(function()
{
	// Check if this was referred back again
	var key = getUrlVars()["key"];
	if(key != undefined)
	{
		returnBack();
		return;
	}
	 
	$("input:file").change(function (){
		var size = this.files[0].size;
		
		if(this.files[0].size > 10485760)
	    {
	    	
	    	$("#fileextension").replaceWith($("#fileextension").clone(true));
	    	$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
												+ '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "doc-size-limit-exceeded") %>.'
												+ '</i></p></small></div>');
	    	$("#upl_doc").after($save_info);
	    	$save_info.show().delay(4000).hide(1);
	    }
	    else
	    {
	    	window.opener.CUSTOM_DOCUMENT_SIZE = size;
			var fileName = $(this).val();
		    $(".filename").html(fileName);
		    // To remove error message while change
		    isValid();
		}
	  });
}); 

function isValid(){
	    $("#form").validate({
	        rules: {
	        		  file:{required:true,accept:""}
	               },
	        submitHandler:function(form)
                  {  
	        		// Concating file extension to key
		    	    var fileName = $("input:file").val();
	        		var extension;
		    	    
		    	    if(fileName.lastIndexOf(".") > 0)
		    	    	extension = fileName.substring(fileName.lastIndexOf(".")+1);
		    	    
		    	    if(fileName.lastIndexOf("\\") > 0)
		    	    	fileName = fileName.substring(fileName.lastIndexOf("\\")+1);
		    	    
		    	    var key = $("#key").val();
		    	    key = key + "/" + fileName;
		    	    $("#key").val(key);
		    	    
		    	    // Form submission
      	            form.submit();
      	          }
	   		});
	    return $("#form").valid();
}
</script>

<%if(currentUserPrefs.theme.equals("15")){%>
<link href="flatfull/css/material-theme/icon/material-icons.css" rel="stylesheet" />
<link href="flatfull/css/material-theme/icon/flaticons-social.css" rel="stylesheet" />
<link href="flatfull/css/material-theme/css/style.css" rel="stylesheet" />
<link href="flatfull/css/material-theme/css/agile-theme.css" rel="stylesheet" />
<%}%>

<style>
	label.error {
		color:red;
	}
</style>

</head>


<body  class='wrapper-md <%if(!currentUserPrefs.animations) out.print("disable-anim");%> <%if(currentUserPrefs.theme.equals("15")) out.print("agile-new-theme");%>'>
<div class="row">
<div class="col-md-3 col-sm-6 col-xs-12">
<div class="panel panel-default" style="height:215px;">
<div class="panel-heading"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-doc") %></div>
<div class="panel-body">
<form id="form" action="https://agilecrm.s3.amazonaws.com/" method="post" enctype="multipart/form-data" onsubmit="return isValid();"> 
<input type="hidden" id="key" name="key" value="panel/uploaded-logo/<%=request.getParameter("d")%>" /> 
<input type="hidden" name="acl" value="public-read" /> 
<input type="hidden" name="content-type" value="image/*" />
<input type="hidden" name="success_action_redirect" value="<%=request.getRequestURL()%>?id=<%=request.getParameter("id")%>" /> 
<input type="hidden" name="AWSAccessKeyId" value="AKIAIBK7MQYG5BPFHSRQ" />
<input type="hidden" name="policy" value="IHsKImV4cGlyYXRpb24iOiAiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImFnaWxlY3JtIiB9LAogICAgeyJhY2wiOiAicHVibGljLXJlYWQiIH0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAicGFuZWwvdXBsb2FkZWQtbG9nbyJdLAogICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgImltYWdlLyJdLAogICAgWyAiY29udGVudC1sZW5ndGgtcmFuZ2UiLCA1MTIsIDEwNDg1NzYwXSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJHN1Y2Nlc3NfYWN0aW9uX3JlZGlyZWN0IiwgIiIgXQogIF0KfQ==" />
<input type="hidden" name="signature" value="lJaO/ZQyMANyulpZrP/FcxVLz5M=" />
<p><input name="file" id='fileextension' type="file" /></p>
<br/>
<input name="upload" id="upl_doc" value='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload") %>' class='submit btn btn-primary m-r-xs' type="submit"/> 
</form> 
</div>
</div>
</div>
</div>
</div>
</body>
</html>