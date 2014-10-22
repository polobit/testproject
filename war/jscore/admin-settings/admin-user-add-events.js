function bindAdminChangeAction(el)
{
	$('input[name="is_admin"]', el).die().live('change', function(e){
	var is_admin = $(this).is(":checked");
	if(is_admin == false)
		$("input[type=checkbox]", $('div[name="newscopes"]', el)).removeAttr("disabled");
	else
		$("input[type=checkbox]", $('div[name="newscopes"]', el)).attr("checked", "checked" ).attr("disabled", "disabled");
	})
	
	$("input[type=checkbox]", $('div[name="newscopes"]', el)).die().live('change', function(e){
		if(!this.checked){
			$(this).removeAttr("checked");
		}
	});
	
	var import_field = $('input[value="IMPORT_CONTACTS"]', el);
	
	if(!import_field)
		return;
	
	if($('input[value="IMPORT_CONTACTS"]:checked', el).length > 0)
		{
			$('input[value="CREATE_CONTACT"]', el).attr("checked", "checked" ).attr("disabled", "disabled");
		}
			
	import_field.die().live('change', function(e){
		var is_import_enabled = $(this).is(":checked");
		if(is_import_enabled == true)
			{
				$('input[value="CREATE_CONTACT"]', el).attr("checked", "checked" ).attr("disabled", "disabled");
			}
			
		else
			$('input[value="CREATE_CONTACT"]', el).removeAttr("disabled");
	})
	
}