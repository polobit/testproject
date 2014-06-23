<%@page import="com.thirdparty.google.ContactPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="java.util.Date"%>
<%@page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<%@page	import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>
<!DOCTYPE link PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<head>

<link rel="stylesheet" href="css/bootstrap-pink.min.css" />
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>



<style>
label.error {
	color: red;
}
</style>
</head>

<body class='center' style="height: 90%; width: 90%; padding: 5px" id="stripe-import">

<div class="well" style="margin-top: 30px;margin-left: 10px;">
<fieldset>
<legend>Import Customer from Stripe</legend>
<center><p>Enter Stripe details</p></center>

<form action="" class="form-horizontal" id="stripe_form">

<div class="control-group">
<label class="control-label" for="id_user">Username:</label>
<div class="controls">
<input type="text" name="username" id="id_user" placeholder="username" class="input-large" required="required" style="height: 30px;">
</div>
</div>


<div class="control-group">
<label class="control-label" for="pass">Password:</label>
<div class="controls">
<input type="password" id ="pass" name="password" placeholder="password" class="input-large" required="required" style="height: 30px;">
</div>
</div>

<div class="control-group">
<label class="control-label" for="apiKey">ApiKey:</label>
<div class="controls">
<input type="text" id="apiKey" name="apiKey" placeholder="API-KEY" class="input-large" required="required" style="height: 30px;">
</div>
</div>

<div class="clearfix"><div class="pull-right">
			<span><img src="img/ajax-spinner.gif" id="spinner-sales" style="display:none;"></img></span>
			<a id="save_stripe_info" class="btn"
				style="text-decoration: none; margin-right: 30px;">Next</a>
			</div>
			<div id="stripe-error" style="color:red;margin-left: 93px;"></div>
			</div>

</form>
</fieldset>
</div>

<script type="text/javascript">

$('#save_stripe_info').die().live('click',function(data){
	
	if(!isValid('#stripe_form'))
		return;
	$('#spinner-sales').show();
	
	$.post("/core/api/stripe/savePrefs",$('#stripe_form').serialize(),function(data){
		$('#stripe-import').html('<br /><div class="well" style="margin-left:10px">' +
				
				'<legend>Select the items to import from Stripe</legend>' + 

				'<form action="" method="post"  id="form">' + 

				'<div id="stripe_options_error" style="display:none;color:red;margin-bottom:20px"></div>' +
				
				
							'<div style="margin-left: 50px;"><label  class="checkbox"> ' + 
		                        '<input name="customer" id="id_customer"" type="checkbox"  value="true" checked="checked"/>Customers<br/>Customer will save in Contact</label>' + 
		                    '</div>' + 
		                    
		                    '<div class="clearfix"><a id="stripe_import_options" class="btn pull-right" style="text-decoration: none; margin-right: 30px;">Import</a></div>' +
		                    
				'</form></div>');
		

	}).error(function(data)
	{
		$("#stripe-error").html(data.responseText);
		$('#spinner-sales').hide();
		$("#stripe-error").show();
	});
		
	});
	
$('#stripe_import_options').die().live('click', function(data){
	
	var flag = false;
	
	if($("#id_customer").is(':checked'))
	{
		flag = true;
		$("#id_customer").val("true");
	}
	
	if(!flag)
	{
		$("#stripe_options_error").html("Please select  option");
		$("#stripe_options_error").show();
		return;
	}
	$("#stripe_options_error").hide();
	
	$.post("/core/api/stripe/importData", $(form).serialize(), function(data)
	{
		
		$("#stripe_options_error").html("Import scheduled");
		$("#stripe_options_error").show();
		
		setTimeout(function()
		{
			window.close("import_stripe.jsp?id=import_from_stripe");
		}, 5000);
				
	}).error(function(data)
	{
		$("#stripe_options_error").html(data.responseText);
	});
				
});

	


function isValid(form){
	 $(form).validate({
			
			debug : true,
			errorElement : 'span',
			errorClass : 'help-inline',

			// Higlights the field and addsClass error if validation failed
			highlight : function(element, errorClass) {
				$(element).closest('.controls').addClass('single-error');
			},

			// Unhiglights and remove error field if validation check passes
			unhighlight : function(element, errorClass) {
				$(element).closest('.controls').removeClass('single-error');
			},
			invalidHandler : function(form, validator) {
				var errors = validator.numberOfInvalids();
			}
		});

		// Return valid of invalid, to stop from saving the data
		return $(form).valid();
   }  


</script>
</body>
</html>