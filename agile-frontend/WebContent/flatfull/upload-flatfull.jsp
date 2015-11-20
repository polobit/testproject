
<!DOCTYPE html>

<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="java.util.Date"%>
<html>

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<title>Upload Image</title>
<%-- <link rel="stylesheet" type="text/css" href="css/bootstrap-<%= UserPrefsUtil.getCurrentUserPrefs().template%>.min.css" /> --%>
<link rel="stylesheet" type="text/css" href="/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />
<!-- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script> -->
<script type='text/javascript' src='/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.v3.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<!-- <script type="text/javascript" src="/lib/bootstrap.min.js"></script> -->

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
    $("#form").validate({
        rules: {
        		file:{required:true,accept:"png|jpg|jpeg|gif"}
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
</script>
<style>
	label.error {
		color:red;
	}
	@media all and (max-width: 767px) {	
	.mobile-popup {
    min-height: 50vh;
  }
  .mobile-popup * {
    text-align: center;
    font-size: 20px;
  }
  .mobile-popup input {
  	display: inline-block;
  }
}
</style>

</head>


<body class="wrapper-md">

<br/>
<div class="row">
<div class="col-md-12 col-sm-12 col-xs-12">
<div class="panel panel-default mobile-popup">
<div class="panel-heading">Upload your image file</div>
<div class="panel-body">
<p>For best results, we recommend you upload png files. You can also upload jpg or gif files also.</i></p>

<br/>
<form id="form" action="https://agilecrm.s3.amazonaws.com/" method="post" enctype="multipart/form-data" onsubmit="return isValid();"> 

    
	 <input type="hidden" name="key" value="panel/uploaded-logo/<%=new Date().getTime()%>" /> 


<input type="hidden" name="acl" value="public-read" /> 
<input type="hidden" name="content-type" value="image/*" />

<input type="hidden" name="success_action_redirect" value="<%=request.getRequestURL()%>?id=<%=request.getParameter("id")%>" /> 

<input type="hidden" name="AWSAccessKeyId" value="AKIAJ62OAFOKCJTDANVA" />
<input type="hidden" name="policy" value="IHsKImV4cGlyYXRpb24iOiAiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImFnaWxlY3JtIiB9LAogICAgeyJhY2wiOiAicHVibGljLXJlYWQiIH0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAicGFuZWwvdXBsb2FkZWQtbG9nbyJdLAogICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgImltYWdlLyJdLAogICAgWyAiY29udGVudC1sZW5ndGgtcmFuZ2UiLCA1MTIsIDQxOTQzMDRdLAogICAgWyJzdGFydHMtd2l0aCIsICIkc3VjY2Vzc19hY3Rpb25fcmVkaXJlY3QiLCAiIiBdCiAgXQp9" />
<input type="hidden" name="signature" value="kTLzXhH6RYKpZ/+5oToI59iSl5Q=" />


<p><input name="file" id='fileextension' type="file" /></p>
<br/>
<input name="upload" value="Upload" class='submit btn btn-primary' type="submit"/> 
</form> 
</div>
</div>
</div>
</div>
</body>
</html>