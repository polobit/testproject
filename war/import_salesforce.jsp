
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


<script type="text/javascript">
	
	$(function()
	{
		
		
		$('#save_salesforce_prefs').die().live('click', function(data){
			
			if(!isValid('#salesforce-login-form'))
				return;
			
			$('#spinner-sales').show();
			
			
				$.post("/core/api/salesforce/save", $('#salesforce-login-form').serialize(), function(data)
				{
					
					$("#salesforce_import").html('<br /><div class="well" style="margin-left:10px">' +
							
							'<legend>Select the items to import from Salesforce</legend>' + 

							'<form action="" method="post"  id="form">' + 

							'<div id="salesforce_options_error" style="display:none;color:red;margin-bottom:20px"></div>' +
							
							
										'<div style="margin-left: 50px;"> ' + 
					                        '<input name="accounts" id="salesforce_accounts" type="checkbox" style="vertical-align:top; " value="true" checked="checked"/>' + 
											'<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Accounts<br/><small> Accounts will be saved as Companies </small></label>' + 
					                    '</div>' + 
					                    
					                    '<div style="margin-left: 50px;">' + 
					                        '<input name="leads" id="salesforce_leads" type="checkbox" style="vertical-align:top; " value="true"  checked="checked"/>' + 
											'<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Leads<br/><small> Leads will be saved as Contacts </small></label>' + 
					                    '</div>' +
					                    
					                    '<div style="margin-left: 50px;">' + 
					                         '<input name="contacts" id="salesforce_contacts" type="checkbox" style="vertical-align:top; " value="true"  checked="checked"/>' + 
											 '<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Contacts<br/><small> Contacts will be saved as Contacts </small></label>' + 
					                    '</div>' +
					                    
					                    '<div style="margin-left: 50px;">' + 
					                         '<input name="deals" id="salesforce_deals" type="checkbox" style="vertical-align:top; " value="true"  checked="checked"/>' + 
											 '<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Deals<br/><small> Deals will be saved as Deals in Agile CRM. <br/> Salesforce milestones will also be imported.</small></label>' + 
					                    '</div>' + 
					                    
					                    '<div style="margin-left: 50px;">' + 
					                         '<input name="cases" id="salesforce_cases" type="checkbox" style="vertical-align:top; " value="true"  checked="checked"/>' + 
											 '<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Cases<br/><small> Cases will be saved as Cases in Agile CRM.</small></label>' + 
					                    '</div>' + 
					                    
					                    '<div class="clearfix"><a id="salesforce_import_options" class="btn pull-right" style="text-decoration: none; margin-right: 30px;">Import</a></div>' +
					                    
							'</form></div>');
					

				}).error(function(data)
				{
					$("#salesforce-error").html(data.responseText);
					$('#spinner-sales').hide();
					$("#salesforce-error").show();
				});
			
			
		});
		
		$('#salesforce_import_options').die().live('click', function(data){
			
			var flag = false;
			
			if($("#salesforce_accounts").attr('checked'))
			{
				flag = true;
				$("#salesforce_accounts").val("true");
			}
			

			if($("#salesforce_leads").attr('checked'))
			{
				flag = true;
				$("#salesforce_leads").val("true");
			}
			

			if($("#salesforce_contacts").attr('checked'))
			{
				flag = true;
				$("#salesforce_contacts").val("true");
			}
			

			if($("#salesforce_deals").attr('checked'))
			{
				flag = true;
				$("#salesforce_deals").val("true");
			}
			

			if($("#salesforce_cases").attr('checked'))
			{
				flag = true;
				$("#salesforce_cases").val("true");
			}
			
			if(!flag)
			{
				$("#salesforce_options_error").html("Please select atleast one option");
				$("#salesforce_options_error").show();
				return;
			}
			$("#salesforce_options_error").hide();
			
			$.post("/core/api/salesforce/import", $(form).serialize(), function(data)
			{
				
				$("#salesforce_options_error").html("Import scheduled");
				$("#salesforce_options_error").show();
				
				setTimeout(function()
				{
					window.close("import_salesforce.jsp?id=import_from_salesforce");
				}, 5000);
						
			}).error(function(data)
			{
				$("#salesforce_options_error").html(data.responseText);
			});
						
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


<style>
label.error {
	color: red;
}
</style>

</head>


<body class='center' style="height: 90%; width: 90%; padding: 5px" id="salesforce_import">

	<br />

	<div class="well" style="margin-left:10px" >

		<legend>Import from salesforce</legend>

		<form action="" method="post"  id="salesforce-login-form">

			<label>Enter your Salesforce details </label><br />
			
			<div id="salesforce-error" style="display:none;color:red;margin-bottom:20px">
			
			</div>
			
			<div class="control-group" style="margin-bottom: 0px">
				<div class="controls">
					<input type="text" id="username"
						class="input-medium required widget_input_box" style="width: 90%"
						placeholder="User Name" name="username"></input>
				</div>
			</div>
			<div class="control-group" style="margin-bottom: 0px">
				<div class="controls">
					<input type="password" id="password"
						class="input-medium required widget_input_box" style="width: 90%"
						placeholder="Password" name="password"></input><br />
				</div>
			</div>
			<div class="control-group">
				<div class="controls">
					<input type="text" id="apiKey"
						class="input-medium required widget_input_box" style="width: 90%"
						placeholder="API key" name="apiKey"></input>
				</div>
			</div>
			<div class="clearfix"><div class="pull-right">
			<span><img src="img/ajax-spinner.gif" id="spinner-sales" style="display:none;"></img></span>
			<a id="save_salesforce_prefs" class="btn"
				style="text-decoration: none; margin-right: 30px;">Next</a>
			</div></div>
			
			
		</form>
	</div>

</body>
</html>