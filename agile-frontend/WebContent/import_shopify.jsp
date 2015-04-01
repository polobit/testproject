
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@page import="com.thirdparty.google.ContactPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="java.util.Date"%>
<%@page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%@page
	import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Import</title>
<link rel="stylesheet" type="text/css" href="css/bootstrap-pink.min.css" />
<script type="text/javascript"
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<script type="text/javascript">
	jQuery.validator.setDefaults({ debug : true, success : "valid" });
</script>




<style>
label.error {
	color: red;
}
</style>

</head>


<body class='center' style="height: 90%; width: 90%; padding: 5px"
	id="shopify_import">

	<br />

	<fieldset>
		<legend>Import from Shopify </legend>
		<div class="well" style="margin-left: 10px">
			<form action="" method="post" id="shopify-login-form"
				class="form-horizontal">

				<div class="control-group" style="margin-top: 10px;">
				<label class="control-label">Shop-Name :</label>
					<div class="controls">
						<input type="text" placeholder="Enter shop name" name="Shop"
							required="required" id="shopeName" /><br />eg: company name</br>
					</div>

				</div>

				<div class="clearfix">
					<div class="pull-right">
						<span><img src="img/ajax-spinner.gif" id="spinner-sales"
							style="display: none;"></img></span> <a id="save_shopify_prefs"
							class="btn" style="text-decoration: none; margin-right: 30px;">Next</a>
					</div>
					<div id="shopify-error" style="color: red; margin-left: 93px;"></div>
				</div>

			</form>
		</div>
	</fieldset>



	<script type="text/javascript">
		$(function()
		{

			$('#shopify_import_options').die().live('click', function(data)
			{

				var flag = false;
				if ($('#customer').is(":checked"))
					flag = true;

				if (!flag)
				{
					$("#shopify_options_error").html("Please select atleast one option");
					$("#shopify_options_error").show();
					return;
				}
				$("#shopify_options_error").hide();

				$.post("/core/api/shopify/importCustomer", $(form).serialize(), function(data)
				{

					$("#shopify_options_error").html("Import scheduled");
					$("#shopify_options_error").show();

					setTimeout(function()
					{
						window.close("import_shopify.jsp?id=import_shopify");
					}, 5000);

				}).error(function(data)
				{
					$("#shopify_options_error").html(data.responseText);
				});

			});

		});

		function isValid(form)
		{
			$(form).validate({

			debug : true, errorElement : 'span', errorClass : 'help-inline',

			// Higlights the field and addsClass error if validation failed
			highlight : function(element, errorClass)
			{
				$(element).closest('.controls').addClass('single-error');
			},

			// Unhiglights and remove error field if validation check passes
			unhighlight : function(element, errorClass)
			{
				$(element).closest('.controls').removeClass('single-error');
			}, invalidHandler : function(form, validator)
			{
				var errors = validator.numberOfInvalids();
			} });

			// Return valid of invalid, to stop from saving the data
			return $(form).valid();
		}
	</script>
</body>
</html>