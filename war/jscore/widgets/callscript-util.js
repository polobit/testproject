$(function()
{	
	$("#add_callscriptrule").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("In add_callscriptrule event");

		// Checks whether all input fields are given
		if (!isValidForm($("#callscriptruleForm")))
		{
			return;
		}
		
		// Get data from form elements
		var formData = jQuery(callscriptruleForm).serializeArray();
		var json = {};

		// Convert into JSON
		jQuery.each(formData, function()
		{
			json[this.name] = this.value || '';
		});

		console.log("json: ");console.log(json);console.log(json.length);console.log(json != null);console.log(!json);
		
		$('#callscriptruleModal').modal('hide');
		
		$("#csr_fields").show();
		$("#csr_name").val(json.name);
		
		$("#add_rules").hide();
		$("#save_prefs").show();
	});
});