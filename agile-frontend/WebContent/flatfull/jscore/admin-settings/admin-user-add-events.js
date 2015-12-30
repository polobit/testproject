function bindAdminChangeAction(el, data)
{
	$('input[name="is_admin"]', el).on('change', function(e){
	var is_admin = $(this).is(":checked");
	if(is_admin == false)
		$("input[type=checkbox]", $('div[name="newscopes"]', el)).removeAttr("disabled");
	else
		$("input[type=checkbox]", $('div[name="newscopes"]', el)).prop("checked", "checked" ).attr("disabled", "disabled");
	$('#deals-privilege', el).trigger("change");
	})
	
	$("input[type=checkbox]", $('div[name="newscopes"]', el)).on('change', function(e){
		if(!this.checked){
			$(this).removeAttr("checked");
		}
	});
	
	var import_field = $('input[value="IMPORT_CONTACTS"]', el);
	
	if(!import_field)
		return;
	
	if(data && data.scopes)
		{
			if(jQuery.inArray("IMPORT_CONTACTS", data.scopes) >=0)
				$('input[value="CREATE_CONTACT"]', el).attr("checked", "checked" ).attr("disabled", "disabled");
		}
			
	import_field.on('change', function(e){
		var is_import_enabled = $(this).is(":checked");
		if(is_import_enabled == true)
			{
				$('input[value="CREATE_CONTACT"]', el).attr("checked", "checked" ).attr("disabled", "disabled");
			}
			
		else
			$('input[value="CREATE_CONTACT"]', el).removeAttr("disabled");
	});

	$('#deals-privilege', el).off('change');
	$(el).on('change', '#deals-privilege', function(e){
		if(!$('input[name="is_admin"]', el).is(':checked'))
		{
			if(!$(this).is(':checked')){
				$('input[value="VIEW_DEALS"]', el).attr("disabled", "disabled");
				$('input[value="MANAGE_DEALS"]', el).attr("disabled", "disabled");
			}
			else
			{
				$('input[value="VIEW_DEALS"]', el).removeAttr("disabled");
				$('input[value="MANAGE_DEALS"]', el).removeAttr("disabled");
			}
		}
	});
	
}