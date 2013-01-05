
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@ page
	import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService"%>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Upload Image</title>
<link rel="stylesheet" type="text/css"
	href="css/bootstrap-<%=UserPrefsUtil.getCurrentUserPrefs().template%>.min.css" />
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<%
    BlobstoreService blobstoreService = BlobstoreServiceFactory
		    .getBlobstoreService();
%>

<script type="text/javascript">
	//Get Id
	//Read a page's GET URL variables and return them as an associative array.
	function getUrlVars() {
		var vars = [], hash;

		var hashes = window.location.href.slice(
				window.location.href.indexOf('?') + 1).split('&');
		for ( var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	function returnBack() {

		if (window.opener) {

			// Gets the blob-key from the url
			var blob_key = "<%=request.getParameter("blob-key")%>";
			
			// If blobkey is not null, data processing reqeust is sent and window is closed
			if (blob_key != null) {
				window.opener.processBlobData(blob_key);
				window.close();
			}
		}
		return;
	}

	$(function() {
		
		// Get import query parameter from url
		var is_import = getUrlVars()["import"];
		
		// If is_import is true , then request is from client to upload file. 
		// If is_import is not true or undefiend, then request is from the blobstore 
		// callback url, which returns blobkey on which data processing has to be done
		if (is_import != "true") {
			returnBack();
			return;
		}
	});



</script>
<style>
label.error {
	color: red;
}
</style>

</head>


<body class='center' style="height: 90%; width: 90%; padding: 5px">

	<br />

	<div class="well" style="height: 215px; width: 390px">

		<legend>Upload your image file</legend>

		<p>
			Upload CSV file, to upload and contacts.</i>
		</p>

		<br />
		<form action="<%=blobstoreService.createUploadUrl("/upload/file")%>"
			method="post" enctype="multipart/form-data">
			<p></p><input type="file" name="contacts_csv_file"/> </p><br /> 
			
			<input name="submit"
				id="submit" value="Upload" class='submit btn btn-primary'
				type="submit" />
		</form>
	</div>

</body>
</html>