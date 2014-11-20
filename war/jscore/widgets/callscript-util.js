$(function()
{	
	// Add ule from modal to widget form, show save btn , hide add rule btn
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

// Get widget and fill widget form
function fill_rules()
{	
	console.log("In fill_rules");
	
	// Disable add rule btn
	$("#add_rules").text("Loading...");
	$("#add_rules").attr("disabled", true);	
	
	// Get widget from collection and Convert prefs in json 
	var callscriptWidget = getCallScriptJSON();
	
	// Add rules to widget form
	
	// Enable add rule btn
	$("#add_rules").text('<i class="icon-plus-sign"></i>Add Rule');
	$("#add_rules").attr("disabled", false);
}

// Get widget from collection and Convert prefs in json 
function getCallScriptJSON()
{
	console.log("In getCallScriptJSON");

	// Get call scrip widget
	var callscriptWidget = App_Widgets.Catalog_Widgets_View.collection.where({ name : "CallScript" });
	console.log(callscriptWidget);
	
	// Convert  prefs in json
	
	// Merge widget together	
}