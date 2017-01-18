<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="org.json.JSONArray"%>
<%@page import="com.agilecrm.user.AgileUser"%>
<%@page import="java.util.Arrays"%>
<%@page import= "com.agilecrm.session.SessionCache"%>
<%@page import="com.agilecrm.session.SessionManager"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.util.language.LanguageUtil"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<%

SessionManager.set(request);

//User Language 
String _LANGUAGE = "en";
try{
	_LANGUAGE = UserPrefsUtil.getCurrentUserPrefsFromRequest(request).language;
}catch(Exception e){}

//Locales JSON
JSONObject localeJSON = LanguageUtil.getLocaleJSON(_LANGUAGE, application, "upload-attachment");

%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-attachment") %></title>

<link rel="stylesheet" type="text/css" href="/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />

<script type='text/javascript' src='/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.v3.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>

<script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});

var localeJSON = <%=localeJSON%>;
jQuery.extend(jQuery.validator.messages, {
    	required: '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "required") %>'
	});
</script>
<script type="text/javascript">
var LOCALES_JSON = <%=localeJSON%>;
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
function returnBack(key,fileName)
{
	 if (window.opener)
	 {
		 window.opener.saveAttachmentBlobKey(key,fileName);
	     window.close();
	 }
	 return;
}
$(function()
{
	// Check if this was referred back again
	var key = getUrlVars()["key"];
	var fileName = unescape(getUrlVars()["fileName"]);
	if(key != undefined)
	{
		returnBack(key,fileName);
		return;
	}
	 
	$("input:file").change(function (){
	    if(this.files[0].size > 5242880)
	    {
	    	$("#fileextension").replaceWith($("#fileextension").clone(true));
	    	$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
												+ '<%=LanguageUtil.getLocaleJSONValue(localeJSON, "file-size-exceeded") %>'
												+ '</i></p></small></div>');
	    	$("#mail-upl").after($save_info);
	    	$save_info.show().delay(4000).hide(1);
	    }
	    else
	    {
	      	var fileName = $(this).val();
			$(".filename").html(fileName);
			// To remove error message while change
			isValid();
	    }
	  });

	$("#mail-upl").click(function(e) {
		e.preventDefault();
		if(isValid()) {
			var fileInput = document.getElementById('fileextension');
    		uploadAttachmentToS3(fileInput.files[0]);
		}
	});
}); 

function isValid(){
    $("#form").validate({
        rules: {
        		  attachmentfile:{required:true,accept:""}
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

function uploadAttachmentToS3(file) {
    if(typeof file != "undefined") {
        $("#mail-upl").prop("disabled",true);
        $("#mail-upl").val("Uploading ...");

        var uploadedFileName = file.name;
        var filename = uploadedFileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = filename + "_" + new Date().getTime() + "." + uploadedFileName.split('.').pop();

		var d = (new Date()).toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$3-$1-$2');

        formData = new FormData();
        formData.append('key',  "editor/email-attachments/" + d + "/" + filename);
        formData.append('AWSAccessKeyId', 'AKIAIBK7MQYG5BPFHSRQ');
        formData.append('acl', 'public-read');
        formData.append('content-type', 'image/*');
        formData.append('policy', 'CnsKICAiZXhwaXJhdGlvbiI6ICIyMDI1LTAxLTAxVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJidWNrZXQiOiAiYWdpbGVjcm0iIH0sCiAgICB7ImFjbCI6ICJwdWJsaWMtcmVhZCIgfSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJlZGl0b3IvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiaW1hZ2UvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRzdWNjZXNzX2FjdGlvbl9zdGF0dXMiLCAiMjAxIl0sCiAgXQp9');
        formData.append('signature', '59pSO5qgWElDA/pNt+mCxxzYC4g=');
        formData.append('success_action_status', '201');
        formData.append('file', file);

        $.ajax({
            data: formData,
            dataType: 'xml',
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            url: "https://agilecrm.s3.amazonaws.com/",
            success: function(data) {
              // getting the url of the file from amazon and insert it into the editor
              $("#mail-upl").prop("disabled",false);
              $("#mail-upl").val("Upload");

              var url = decodeURIComponent($(data).find('Location').text());
              console.log(url);
              opener.getFileUrl(url, uploadedFileName);
              window.close();
            }
        });
    }
}

</script>
	<style>
		label.error {
			color:red;
		}
	</style>

</head>


<body class='wrapper-md'>
	<div class="row">
	<div class="col-md-3 col-sm-6 col-xs-12">
	<div class="panel panel-default upload-panel" style="height:215px;">
	<div class="panel-heading"><%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload-attachment") %></div>
	<div class="panel-body">
		<form id="form" action="https://agilecrm.s3.amazonaws.com/" method="post" enctype="multipart/form-data"> 
			<input type="hidden" name="success_action_redirect" value="<%=request.getRequestURL()%>?id=<%=request.getParameter("id")%>" /> 
			<p><input name="attachmentfile" id='fileextension' type="file" /></p>
			<br/>
			<input name="upload" id="mail-upl" value='<%=LanguageUtil.getLocaleJSONValue(localeJSON, "upload") %>' class='submit btn btn-primary m-r-xs' type="button"/> 
		</form> 
	</div>
	</div>
	</div>
	</div>
	</div>
</body>
</html>