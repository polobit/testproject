<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="css/bootstrap-pink.min.css" />
<script type="text/javascript"
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<title>Upload Google Document</title>

<script type="text/javascript">

      // The API developer key obtained from the Google Cloud Console.
      var developerKey = 'AIzaSyD_CM3PIdPhGxqLdZPcU8qnoesKxGuITzo';

      // Use the API Loader script to load google.picker.
      function loadPicker() {
        gapi.load('picker', {'callback': createPicker});
      }

      // Create and render a Picker object for searching images.
      function createPicker() {
        var picker = new google.picker.PickerBuilder().
            addView(google.picker.ViewId.DOCS).
            setDeveloperKey(developerKey).
            setCallback(pickerCallback).
            build();
        picker.setVisible(true);
      }

      // A simple callback implementation.
      function pickerCallback(data) {
        var url;
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
          var doc = data[google.picker.Response.DOCUMENTS][0];
          url = doc[google.picker.Document.URL];
        }
        if(url)
        {
        	$('#documentForm').find('#upload_url').val(url);
        	returnBack(url);
        }
      }
      
      function returnBack(url)
      {
      	 if (window.opener)
    	 {
      		var network = "GOOGLE";
      		window.opener.saveDocumentURL(url, network, window.location.search);
      	    window.close();
      	 }
      	 return;
      }
    </script>
    
    <style>
		.error ,.field_req {
			color:red;
		}
	</style>
</head>
<body class='center' style="height: 90%; width: 90%; padding:25px">
	<div class="row-fluid">
		<div class="well span9">
			<legend>Google Drive Document</legend>
			<!-- Document form  -->
			<form id="documentForm" name="documentForm" method="post">
				<fieldset>
					<div class="row-fluid">
						<a class="btn" style="margin-top:5px;" onclick=loadPicker();>Select Document</a>
						<input type="hidden" name="url" id="upload_url" class="required"/>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
    <!-- The Google API Loader script. -->
    <script type="text/javascript" src="https://apis.google.com/js/api.js?onload=loadPicker"></script>
</body>
</html>