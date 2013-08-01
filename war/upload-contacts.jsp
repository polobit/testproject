
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="java.util.Date"%>
<%@page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%@page import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Upload Image</title>
<link rel="stylesheet" type="text/css" href="css/bootstrap-<%= UserPrefsUtil.getCurrentUserPrefs().template%>.min.css" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;
</script>
<script type="text/javascript">

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

function returnBack(key)
{
	
	if(!key)
		return;
	
	if (window.opener)
	{
		window.opener.parseCSV(key);
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
		returnBack(key);
		return;
	} 
});
function isValid(){
    $("#form").validate({
        rules: {
        		file:{required:true,accept:"csv"}
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


<body class='center' style="height:90%;width:90%;padding:5px">

<br/>

<div class="well" style="height:215px; width:390px ">

<legend>Upload CSV file</legend>

<br/>
 <form action="<%= BlobstoreServiceFactory.getBlobstoreService().createUploadUrl("/upload")  %>" method="post" enctype="multipart/form-data" onsubmit="return isValid();" id="form">
    
<p><input name="file" id='fileextension' type="file" /></p>
<br/>
<input name="submit" id="submit" value="Upload" class='submit btn btn-primary' type="submit" /> 
</form> 
</div>

</body>
</html>