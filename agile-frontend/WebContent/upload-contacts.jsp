
<!DOCTYPE html>

<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="java.util.Date"%>
<%@page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%@page import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>

<html>

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">
<title>Upload CSV</title>
<%-- <link rel="stylesheet" type="text/css" href="css/bootstrap-<%= UserPrefsUtil.getCurrentUserPrefs().template%>.min.css" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script> --%>

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

function returnBack(key,type)
{
	
	if(!key)
		return;
	
	if (window.opener)
	{
		window.opener.parseCSV(key,type);
	   	window.close();
	}
	return;
}

$(function()
{
	// Check if this was referred back again
	var key = getUrlVars()["key"];
	var fail = getUrlVars()["f"];
	var file = getUrlVars()["type"];
	

	//$('.error', $("#form")).remove();
	if(fail && !key)
		{	
			$("#form").append('<label class="error">Max limit 10,000 contacts.</label>');	
			return;
		}
	if(key != undefined)
	{
		returnBack(key,file);
		return;
	} 
});

$(function()
		{
	$("input:file").change(function (){
	var fileName = $(this).val();
    $(".filename").html(fileName);
    
    // to remove error message while change
    isValid();
  });
		}); 
		
function isValid(){
    $("#form").validate({
        	rules: {
        		file:{required:true,accept:"csv"}
               },
       		messages: {
  	    	  	file: {
  	      			accept: "Please upload a CSV file",
  	      		},
               },
             submitHandler:function(form)
             {   
          	   if($('.submit', form).attr('disabled') != undefined)
          		   return;
          	   
          	   $('.submit', form).attr('disabled', true);
          	   $('.submit', form).after('<img class="loading" style="padding-right:5px" src= "img/21-0.gif"></img>');
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
  .mobile-popup input[type='file']{
    max-width: 100%;
  }
}
</style>

</head>


<body class='wrapper-md'>

<br/>

<div class="row">
<div class="col-md-12 col-sm-12 col-xs-12">
<div class="panel panel-default mobile-popup">
<div class="panel-heading">Upload CSV file</div>
<div class="panel-body">
<br/>
 <form action="<%= BlobstoreServiceFactory.getBlobstoreService().createUploadUrl("/upload")  %>" method="post" enctype="multipart/form-data" onsubmit="return isValid();" id="form">
  
<p><input name="file" id='fileextension' type="file" /></p>
<br/>
<input name="upload" value="Upload" class='submit btn btn-primary' type="submit" /> 
<%String filetype = request.getParameter("type"); 
if(!filetype.equalsIgnoreCase("undefind")){
    %>
    <input  type ="hidden" name="type" value ="<%=filetype%>"/>
    <%
}
%>
</form> 
</div>
</div>
</div>
</div>

</body>
</html>