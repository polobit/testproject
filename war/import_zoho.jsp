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

<body class='center' style="height: 90%; width: 90%; padding: 5px" id="zoho-import">

<div class="well" style="margin-top: 30px;margin-left: 10px;">
<fieldset>
<legend>Import contacts from Zoho</legend>
<center><p>Enter Zoho details</p></center>

<div id="zoho-error" style="display:none;color:red;margin-bottom:20px"></div>
			

<form action="" class="form-horizontal" id="zoho_form">

<div class="control-group">
<label class="control-label" for="id_user">Username:</label>
<div class="controls">
<input type="text" name="username" id="id_user" placeholder="username" class="input-large" required="required">
</div>
</div>


<div class="control-group">
<label class="control-label" for="pass">Password:</label>
<div class="controls">
<input type="password" id ="pass" name="password" placeholder="password" class="input-large" required="required">
</div>
</div>

<div class="control-group">
<label class="control-label" for="auth_token">Authtoken:</label>
<div class="controls">
<input type="text" id="auth_token" name="authtoken" placeholder="Auth-token" class="input-large" required="required">
</div>
</div>

<div class="clearfix"><div class="pull-right">
			<span><img src="img/ajax-spinner.gif" id="spinner-sales" style="display:none;"></img></span>
			<a id="save_zoho_info" class="btn"
				style="text-decoration: none; margin-right: 30px;">Next</a>
			</div></div>

</form>
</fieldset>
</div>

<script type="text/javascript">

$('#save_zoho_info').die().live('click',function(data){
	
	if(!isValid('#zoho_form'))
		return;
	$.post("/core/api/zoho/save",$('#zoho_form').serialize(),function(data){
		$('#zoho-import').html('<br /><div class="well" style="margin-left:10px">' +
				
				'<legend>Select the items to import from Zoho</legend>' + 

				'<form action="" method="post"  id="form">' + 

				'<div id="zoho_options_error" style="display:none;color:red;margin-bottom:20px"></div>' +
				
				
							'<div style="margin-left: 50px;"> ' + 
		                        '<input name="accounts" id="zoho_accounts" type="checkbox" style="vertical-align:top; " value="true" checked="checked"/>' + 
								'<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Accounts<br/><small> Accounts will be saved as Companies </small></label>' + 
		                    '</div>' + 
		                    
		                    '<div style="margin-left: 50px;">' + 
		                        '<input name="leads" id="zoho_leads" type="checkbox" style="vertical-align:top; " value="true"  checked="checked"/>' + 
								'<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Leads<br/><small> Leads will be saved as Contacts </small></label>' + 
		                    '</div>' +
		                    
		                    '<div style="margin-left: 50px;">' + 
		                         '<input name="contacts" id="zoho_contacts" type="checkbox" style="vertical-align:top; " value="true"  checked="checked"/>' + 
								 '<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Contacts<br/><small> Contacts will be saved as Contacts </small></label>' + 
		                    '</div>' +
		                    
		                    '<div style="margin-left: 50px;">' + 
		                         '<input name="deals" id="zoho_deals" type="checkbox" style="vertical-align:top; " value="true"  checked="checked"/>' + 
								 '<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Deals<br/><small> Deals will be saved as Deals in Agile CRM. <br/> Salesforce milestones will also be imported.</small></label>' + 
		                    '</div>' + 
		                    
		                    '<div style="margin-left: 50px;">' + 
		                         '<input name="cases" id="zoho_cases" type="checkbox" style="vertical-align:top; " value="true"  checked="checked"/>' + 
								 '<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Cases<br/><small> Cases will be saved as Cases in Agile CRM.</small></label>' + 
		                    '</div>' + 
		                    
		                    '<div class="clearfix"><a id="zoho_import_options" class="btn pull-right" style="text-decoration: none; margin-right: 30px;">Import</a></div>' +
		                    
				'</form></div>');
		

	}).error(function(data)
	{
		$("#zoho-error").html(data.responseText);
		$('#spinner-sales').hide();
		$("#zoho-error").show();
	});
		
	});
	
$('#zoho_import_options').die().live('click', function(data){
	
	var flag = false;
	
	if($("#zoho_accounts").is(':checked'))
	{
		flag = true;
		$("#zoho_accounts").val("true");
	}
	

	if($("#zoho_leads").attr('checked'))
	{
		flag = true;
		$("#zoho_leads").val("true");
	}
	

	if($("#zoho_contacts").attr('checked'))
	{
		flag = true;
		$("#zoho_contacts").val("true");
	}
	

	if($("#zoho_deals").attr('checked'))
	{
		flag = true;
		$("#zoho_deals").val("true");
	}
	

	if($("#zoho_cases").attr('checked'))
	{
		flag = true;
		$("#zoho_cases").val("true");
	}
	
	if(!flag)
	{
		$("#zoho_options_error").html("Please select atleast one option");
		$("#zoho_options_error").show();
		return;
	}
	$("#zoho_options_error").hide();
	
	$.post("/api/zoho/import", $(form).serialize(), function(data)
	{
		
		$("#zoho_options_error").html("Import scheduled");
		$("#zoho_options_error").show();
		
		setTimeout(function()
		{
			window.close("import_zoho.jsp?id=import_from_zoho");
		}, 5000);
				
	}).error(function(data)
	{
		$("#zoho_options_error").html(data.responseText);
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