
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Upload WAV File</title>

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
		 window.opener.saveVoiceMailFileURL(url, network, window.location.search);
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
		var fileName = $(this).val();
	    $(".filename").html(fileName);
	    // To remove error message while change
	    isValid();
	  });
}); 

$.validator.addMethod("validWaveFile", 
		 function(value, element) {
		 var extension = value.substring(value.lastIndexOf(".")+1);
		 if(extension.toLowerCase() == "wav")
			return true;
		else
			return false;
		  }, 
		  "File selected is not a WAV file."
	);


function isValid(){
	    $("#form").validate({
	        rules: {
	        		  file:{required:true,validWaveFile:true}
	               },
	        submitHandler:function(form)
                  {  
	        		var fpath =  $("input:file").val();
	        		fpath = fpath.replace(/\\/g, '/');
		    	    var fileName = fpath;
	        		var extension;
	        		var fileNameWithOutExt = fpath.substring(fpath.lastIndexOf('/')+1, fpath.lastIndexOf('.'));
	        		
		    	    if(fileName.lastIndexOf(".") > 0)
		    	    	extension = fileName.substring(fileName.lastIndexOf(".")+1);
		    	    
		    	    //remove space and special characters
		    	    var safeFilename = fileNameWithOutExt.replace(/[^a-z0-9]/gi, '_').toLowerCase();
		    	    var key = $("#key").val();
		    	    key = key + "/" + safeFilename + "_" + Math.round(new Date().getTime()/1000.0) + "."+extension;
		    	   // alert(key);
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


<body class="wrapper-md">
<div class="row">
<div class="col-md-3 col-sm-6 col-xs-12">
<div class="panel panel-default" style="height:215px;">
<div class="panel-heading">Upload WAV File</div>
<div class="panel-body">
<p>You may upload a recorded voice (.wav) file here.</p>
<form id="form" action="https://agilecrm.s3.amazonaws.com/" method="post" enctype="multipart/form-data" onsubmit="return isValid();"> 

<input type="hidden" id="key" name="key" value="audiofiles/<%=request.getParameter("d")%>" /> 

<input type="hidden" name="acl" value="public-read" /> 
<input type="hidden" name="content-type" value="audio/wav" />

<input type="hidden" name="success_action_redirect" value="<%=request.getRequestURL()%>?id=<%=request.getParameter("id")%>" /> 

<input type="hidden" name="AWSAccessKeyId" value="AKIAIBK7MQYG5BPFHSRQ" />
<input type="hidden" name="policy" value="ewogICJleHBpcmF0aW9uIjogIjIwMjUtMDEtMDFUMTI6MDA6MDAuMDAwWiIsCiAgImNvbmRpdGlvbnMiOiBbCiAgICB7ImJ1Y2tldCI6ICJhZ2lsZWNybSIgfSwKICAgIHsiYWNsIjogInB1YmxpYy1yZWFkIiB9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgImF1ZGlvZmlsZXMvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiYXVkaW8vIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRzdWNjZXNzX2FjdGlvbl9yZWRpcmVjdCIsICJodHRwIl0sCiAgXQp9" />
<input type="hidden" name="signature" value="sbrZL4HGpxgbMIvooXG/63Hbn14=" />


<p><input name="file" id='fileextension' type="file" /></p>
<br/>
<input name="upload" value="Upload" class='submit btn btn-primary' type="submit"/> 
</form> 
</div>
</div>
</div>
</div>
</div>
</body>
</html>