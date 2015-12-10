
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@page import="java.nio.charset.Charset"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="com.agilecrm.scribe.util.ScribeUtil"%>
<%@page import="com.agilecrm.subscription.stripe.StripeUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.Enumeration"%>
<%@page import="com.agilecrm.scribe.ScribeServlet"%>
<%@page import="com.thirdparty.google.ContactPrefs.SYNC_TYPE"%>
<%@page import="com.thirdparty.google.utl.ContactPrefsUtil"%>
<%@page import="com.thirdparty.google.ContactPrefs"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="css/bootstrap-pink.min.css" />
<script type="text/javascript"
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<title>Upload Google Document</title>
<%
    String code = request.getParameter("code");
			String token = null;

			// Checks whether request if from client or access code already fetched
			// As code sent from server is one time accessable, if jsp is refreshed user is asked to allow access again. For this we check if access token fetched is null
			if (StringUtils.isEmpty(code)
					|| (token = ScribeUtil.getGoogileDrivePrefs(code))
							.equals("null")) {

				request.removeAttribute("code");

				// Create return url
				String return_url = request.getRequestURL() + "?id="
						+ request.getParameter("id");

				response.sendRedirect("/scribe?service="
						+ ScribeServlet.SERVICE_TYPE_GOOGLE_DRIVE
						+ "&return_url=" + URLEncoder.encode(return_url));
				return;
			}

			// Append quotes as token will have a number with decimals in it which cant be directly given to javascript variable
			token = "\"" + token + "\"";
%>
<script type="text/javascript">
 
	// The API developer key obtained from the Google Cloud Console.
      var developerKey = 'AIzaSyApc647aMom3kEHsTQ9m6WiL9_6iHrsl_4';

      // Use the API Loader script to load google.picker.
      function loadPicker() {
        gapi.load('picker', {'callback': createPicker});
      }

      // Create and render a Picker object for searching images.
      function createPicker() {
        var picker = new google.picker.PickerBuilder().
            addView(google.picker.ViewId.DOCS).
         	setOAuthToken(decodeURIComponent(<%=token.toString()%>)).
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
          window.opener.CUSTOM_DOCUMENT_SIZE = 0;
      		window.opener.saveDocumentURL(url, network, window.location.search);
      	    window.close();
      	 }
      	 return;
      }
    </script>

<style>
.error,.field_req {
	color: red;
}
</style>
</head>
<body class='center' style="height: 90%; width: 90%; padding: 25px">
	<div class="row-fluid">
		<div class="well span9">
			<legend>Google Drive Document</legend>
			<!-- Document form  -->
			<form id="documentForm" name="documentForm" method="post">
				<fieldset>
					<div class="row-fluid">
						<a class="btn" style="margin-top: 5px;" onclick=loadPicker();>Select
							Document</a> <input type="hidden" name="url" id="upload_url"
							class="required" />
					</div>

				</fieldset>
			</form>
		</div>
	</div>
	<!-- The Google API Loader script. -->
	<script type="text/javascript"
		src="https://apis.google.com/js/api.js?onload=loadPicker"></script>
</body>
</html>