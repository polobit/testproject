
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="java.util.Date"%>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Upload Image</title>
<link rel="stylesheet" type="text/css" href="css/bootstrap-<%= UserPrefs.getCurrentUserPrefs().template%>.min.css" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;
</script>
<script type="text/javascript">

//Get URL
var url = "https://s3.amazonaws.com/agilecrm/" + unescape(getUrlVars()["key"]);

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
	     window.opener.setImageURL(url);
	     window.close();
	 }
	 return;
}

$(function()
{

	// Check if this was referred back again
	var key = getUrlVars()["key"];
	console.log("Key" + key);
	if(key != undefined)
	{
		returnBack();
		return;
	}
});
function isValid(){
    $("#form").validate({
        rules: {
        		file:{required:true,accept:"png|jpg|jpeg|gif"}
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

<legend>Upload your image file</legend>


<p>For best results, we recommend you upload png files. You can also upload jpg or gif files also.</i></p>

<br/>
<form id="form" action="https://agilecrm.s3.amazonaws.com/" method="post" enctype="multipart/form-data" onsubmit="return isValid();"> 

    
	 <input type="hidden" name="key" value="panel/uploaded-logo/<%=new Date().getTime()%>" /> 


<input type="hidden" name="acl" value="public-read" /> 
<input type="hidden" name="content-type" value="image/*" />

<input type="hidden" name="success_action_redirect" value="<%=request.getRequestURL()%>" /> 

<input type="hidden" name="AWSAccessKeyId" value="AKIAJ62OAFOKCJTDANVA" />

<input type="hidden" name="policy" value="ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMTI6MDA6MDAuMDAwWiIsCiAgImNvbmRpdGlvbnMiOiBbCiAgICB7ImJ1Y2tldCI6ICJhZ2lsZWNybSIgfSwKICAgIHsiYWNsIjogInB1YmxpYy1yZWFkIiB9LAogICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJwYW5lbC91cGxvYWRlZC1sb2dvIl0sCiAgICAgeyJzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCI6ICJodHRwOi8vbG9jYWxob3N0Ojg4ODgvdXBsb2FkLmpzcCJ9LAogICAgIFsic3RhcnRzLXdpdGgiLCAiJENvbnRlbnQtVHlwZSIsICJpbWFnZS8iXSwKICBdCn0=" />
<input type="hidden" name="signature" value="3RcvbEnh5oQncA7CbR3WA0qFyKY=" />
<p><input name="file" id='fileextension' type="file" /></p>
<br/>
<input name="submit" id="submit" value="Upload" class='submit btn btn-primary' type="submit" /> 
</form> 
</div>

</body>
</html>