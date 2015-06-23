<%@ page import="com.google.appengine.api.blobstore.BlobstoreServiceFactory" %>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService" %>

<%
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Upload Attachment</title>

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
</script>
<script type="text/javascript">

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
												+ 'The file you are trying to send exceeds the 5MB attachment limit'
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
<div class="panel panel-default" style="height:215px;">
<div class="panel-heading">Upload Attachment</div>
<div class="panel-body">
<form id="form" action="<%= blobstoreService.createUploadUrl("/uploadattachment") %>" method="post" enctype="multipart/form-data" onsubmit="return isValid();">  
<p><input name="attachmentfile" id='fileextension' type="file" /></p>
<br/>
<input id="mail-upl" name="upload" value="Upload" class='submit btn btn-primary' type="submit"/> 
</form> 
</div>
</div>
</div>
</div>
</div>
</body>
</html>