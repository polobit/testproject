
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="java.util.Date"%>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Upload Image</title>
<link rel="stylesheet" type="text/css" href="css/bootstrap-<%= UserPrefs.getCurrentUserPrefs().template%>.min.css" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>

<script type="text/javascript">

//Get URL
var url = "https://s3.amazonaws.com/agilecrm/" + unescape(getUrlVars()["key"]);

// Get Id
var id = getUrlVars()["id"];

function isNotValid(value)
{
	if(value == undefined)
		return true;
	
	if(value.length == 0)
		return true;
	
	return false;
}

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
	 console.log(url + " " + id);
	 
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
	}	
});


function validateFileExtension()
{
	var input = $('#fileextension').val();
	$('#fileerror').hide();
	
	if(isNotValid(input))
	{
		$('#fileerror p').text("Please enter a valid image file. We only accept png, jpg, jpeg or gif file.");
		$('#fileerror').slideDown();

		return false;	
	}
	
	var extension = input.substr(input.lastIndexOf('.'));
	
	if(isNotValid(extension))
	{
		$('#fileerror p').text("Please enter a valid image file. We only accept png, jpg, jpeg or gif file.");
		$('#fileerror').slideDown();

		return false;	
	}
	
	
	if(extension.toLowerCase() != '.png' && extension.toLowerCase() != '.jpg' &&  extension.toLowerCase() != '.gif' &&  extension.toLowerCase() != '.jpeg')
		{
		$('#fileerror p').text("Please enter a valid image file. We only accept png, jpg, jpeg or gif file.");
		$('#fileerror').slideDown();

		return false;	
		
		}
	
	return true;
}

</script>

</head>


<body>

<div id="hld" style='padding:10px'>
<div class="wrapper" style='min-width:450px;'><!-- wrapper begins -->

<div class="block small" style="width:100%; float:left;">


<div class="block_head">
<div class="bheadl"></div>
<div class="bheadr"></div>

</div>
<!-- .block_head ends -->

<div class="block_content well center">

<legend>Upload Image</legend>


<h4>Upload Image for Agent (image files)</h4>
<p></p><p></p>
<p>For best results, we recommend you upload png files. You can also upload jpg or gif files also.</p>


<form action="https://agilecrm.s3.amazonaws.com/" method="post" enctype="multipart/form-data" onsubmit="return validateFileExtension();""> 
<div id='fileerror' style='display:none;'><div class='alert alert-error'><a class='close' data-dismiss='alert' href='#'>×</a><p></p></div></div>

							
<scrpit>
    
	 <input type="hidden" name="key" value="panel/uploaded-logo/<%=new Date().getTime()%>" /> 
	 
</scrpit>	

<input type="hidden" name="acl" value="public-read" /> 
<input type="hidden" name="content-type" value="image/*" />

<input type="hidden" name="success_action_redirect" value="<%=request.getRequestURL()%>" /> 

<input type="hidden" name="AWSAccessKeyId" value="AKIAJ62OAFOKCJTDANVA" />


<%
/* Production 
String policy = "ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMTI6MDA6MDAuMDAwWiIsCiAgImNvbmRpdGlvbnMiOiBbCiAgICB7ImJ1Y2tldCI6ICJhZ2lsZWNybSIgfSwKICAgIHsiYWNsIjogInB1YmxpYy1yZWFkIiB9LAogICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJwYW5lbC91cGxvYWRlZC1sb2dvIl0sCiAgICAgeyJzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCI6ICJodHRwOi8vbG9jYWxob3N0Ojg4ODgvdXBsb2FkLmpzcCJ9LAogICAgIFsic3RhcnRzLXdpdGgiLCAiJENvbnRlbnQtVHlwZSIsICJpbWFnZS8iXSwKICBdCn0=";
String signature = "3RcvbEnh5oQncA7CbR3WA0qFyKY=";
*/
%>

<input type="hidden" name="policy" value="ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMTI6MDA6MDAuMDAwWiIsCiAgImNvbmRpdGlvbnMiOiBbCiAgICB7ImJ1Y2tldCI6ICJhZ2lsZWNybSIgfSwKICAgIHsiYWNsIjogInB1YmxpYy1yZWFkIiB9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgInBhbmVsL3VwbG9hZGVkLWxvZ28iXSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJENvbnRlbnQtVHlwZSIsICJpbWFnZS8iXSwKICAgIFsgImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwgNTEyLCA0MTk0MzA0XSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJHN1Y2Nlc3NfYWN0aW9uX3JlZGlyZWN0IiwgIiIgXQogIF0KfQ==" />
<input type="hidden" name="signature" value="8yRCXZwztrYAYZO2xk38Efp9Nj4=" />



<input name="file" id='fileextension' type="file" />
<br/><br/><br/>
<input name="submit" value="Upload" class='submit' type="submit" /> 
</form> 

				

</div>
<!-- .block_content ends -->

<div class="bendl"></div>
<div class="bendr"></div>

</div>

</div>
<!-- wrapper ends --></div>
<!-- #hld ends -->
</body>
</html>