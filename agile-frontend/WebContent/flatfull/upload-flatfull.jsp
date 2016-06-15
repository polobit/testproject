
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

<!-- Load angular file -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js"></script>
<script type="text/javascript" src="/flatfull/lib/ng-img-crop/ng-img-crop.js"></script>
<link rel="stylesheet" type="text/css" href="/flatfull/lib/ng-img-crop/ng-img-crop.css" />
<style>
    .cropArea {
      background: #E4E4E4;
      overflow: hidden;
      /*width:500px;*/
      height:300px;
    }
</style>

<script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;

angular.module('app', ['ngImgCrop'])
      .controller('Ctrl', function($scope) {
        $scope.myImage='';
        $scope.myCroppedImage='';

        var handleFileSelect=function(evt) {
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.myImage=evt.target.result;
            });
          };
          reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileextension')).on('change',handleFileSelect);
      });

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
         messages: {
              file: {
                accept: "Please select a valid image file and try again",
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

	$("[name='upload']").click(function(e){
		var data_url = $("div#preview img").attr("ng-src");
		Cd_Add_Wesite_Screenshot.add_to_amazon_cloud(data_url, function(){
			console.log("Hehe");
		});
		disableSave();
	});
		});

function agile_is_mobile_browser(){
   return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
   }

(function()
 	{
 		if(agile_is_mobile_browser()){
   $( "<style>@media all and (max-width: 767px) {	.mobile-popup {min-height: 50vh; } .mobile-popup * {text-align: center;font-"+"size: 20px;}.mobile-popup input {display: inline-block;}}</style>" ).appendTo( "head" );
    }
 	})();

function upload_success_callback(){
	console.log("upload_success_callback");
}
var Cd_Add_Wesite_Screenshot = {
	add_to_amazon_cloud : function(dataURL, callback) {

		if (!dataURL)
			return false;

		// Create a blob from dataURL
		var blob = this.dataURItoBlob(dataURL);
		
		var file = {};
		file.file_resource = $("[name='key']").val();
		file.success_callback = "upload_success_callback";
		
		// Create form with data
		var formdata = ClickDesk_File_Upload.construct_form_data(file);
		formdata.append("file", blob);
		file.size = blob.size;
		file.name = "website-screenshot.png";

		// Send form
		ClickDesk_File_Upload.upload_to_amazon(formdata, file);

	},

	dataURItoBlob : function(dataURI) {
		var byteString = atob(dataURI.split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for ( var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ ab ], {
			type : 'image/png'
		});

	}
};

var ClickDesk_File_Upload = {
	/**
	 * Constructs Form Data with amazon keys for given file object to send
	 * request to amazon
	 * 
	 * @param file -
	 *            file object
	 */
	construct_form_data : function(file) {

		var fd = new FormData();

		// Construct post data
		fd.append('key', file.file_resource);
		fd.append('acl', 'public-read');
		fd.append('AWSAccessKeyId', 'AKIAJ62OAFOKCJTDANVA');
		fd
				.append(
						'policy',
						'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMTI6MDA6MDAuMDAwWiIsCiAgImNvbmRpdGlvbnMiOiBbCiAgICB7ImJ1Y2tldCI6ICJhZ2lsZWNybSIgfSwKICAgIHsiYWNsIjogInB1YmxpYy1yZWFkIiB9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgImNkLXVwbG9hZGVkLWZpbGVzLyJdLApbICJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDEwMCwgNTI0Mjg4MCBdCiAgXQp9')
		fd.append('signature', 'SbN7sZH26/j3+2GO4U7ZQRmLFc4=');

		return fd;
	},


	/**
	 * Sends XMLHttpRequest to amazon server to upload file
	 * 
	 * @param form_data -
	 *            form data with amazon keys
	 * @param file -
	 *            file object
	 */
	upload_to_amazon : function(form_data, file) {

		// Construct http request for post request
		var xhr = new window.XMLHttpRequest();
		xhr.upload.addEventListener("progress", function(evt) {
			ClickDesk_File_Upload.progress(evt, file);
		}, false);
		xhr.addEventListener("load", function(evt) {
			ClickDesk_File_Upload.complete(evt, file);
		}, false);
		xhr.addEventListener("error", function(evt) {
			ClickDesk_File_Upload.failed(evt, file);
		}, false);
		xhr.addEventListener("abort", function(evt) {
			ClickDesk_File_Upload.canceled(evt, file);
		}, false);

		// Must be last line before send
		xhr.open('POST', 'https://agilecrm.s3.amazonaws.com/', true);
		xhr.send(form_data);

	},
	progress : function(event, file){
		disableSave();
		console.log("progress");
	},

	complete : function(event, file){
		
		url = "https://s3.amazonaws.com/agilecrm/" + unescape(file.file_resource) + "?id=" + unescape(getUrlVars()["id"]);
		returnBack();
	},

	failed : function(event, file){
		reenableSave();
		console.log("failed");
	},
	canceled : function(event, file){
		reenableSave();
		console.log("canceled");
	}
};

function disableSave(){
     $("[name='upload']").attr("disabled", "disabled");
}

function reenableSave(){
	$("[name='upload']").removeAttr("disabled");
}
</script>
<style>
	label.error {
		color:red;
	}
	
</style>

</head>


<body class="wrapper-md" ng-app="app" ng-controller="Ctrl">

<br/>
<div class="row">
<div class="col-md-12 col-sm-12 col-xs-12">
<div class="panel panel-default mobile-popup">
<div class="panel-heading">Upload your image file</div>
<div class="panel-body">
<p>For best results, we recommend that you upload .png files. We even support .jpg and .gif formats.</i></p>

<br/>
<form id="form" action="https://agilecrm.s3.amazonaws.com/" method="post" enctype="multipart/form-data" onsubmit="return isValid();"> 

	 <input type="hidden" name="key" value="cd-uploaded-files/<%=new Date().getTime()%>" /> 


<input type="hidden" name="acl" value="public-read" /> 
<input type="hidden" name="content-type" value="image/*" />

<input type="hidden" name="success_action_redirect" value="<%=request.getRequestURL()%>?id=<%=request.getParameter("id")%>" /> 

<input type="hidden" name="AWSAccessKeyId" value="AKIAJ62OAFOKCJTDANVA" />
<input type="hidden" name="policy" value="IHsKImV4cGlyYXRpb24iOiAiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImFnaWxlY3JtIiB9LAogICAgeyJhY2wiOiAicHVibGljLXJlYWQiIH0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAicGFuZWwvdXBsb2FkZWQtbG9nbyJdLAogICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgImltYWdlLyJdLAogICAgWyAiY29udGVudC1sZW5ndGgtcmFuZ2UiLCA1MTIsIDQxOTQzMDRdLAogICAgWyJzdGFydHMtd2l0aCIsICIkc3VjY2Vzc19hY3Rpb25fcmVkaXJlY3QiLCAiIiBdCiAgXQp9" />
<input type="hidden" name="signature" value="kTLzXhH6RYKpZ/+5oToI59iSl5Q=" />


<p><input name="file" id='fileextension' type="file" /></p>

<div class="row m-n">
	<div class="cropArea col-xs-8 col-sm-8 col-md-8">
	    <img-crop image="myImage" result-image="myCroppedImage"></img-crop>
	</div>
	<div class="col-xs-4 col-sm-4 col-md-4" id="preview">
		<div>Cropped Image:</div>
		<div><img ng-src="{{myCroppedImage}}" style="width: 100%;"/></div>
	</div>
</div>
<br/>
<input name="upload" value="Upload" class='submit btn btn-primary' type="submit" onclick="return false;"/> 
</form> 
</div>
</div>
</div>
</div>
</body>
</html>