function bindAdminChangeAction(el)
{
	$('input[name="is_admin"]', el).die().live('change', function(e){
	var is_admin = $(this).is(":checked");
	if(is_admin == false)
		$("input[type=checkbox]", $('div[name="scopes"]', el)).removeAttr("disabled");
	else
		$("input[type=checkbox]", $('div[name="scopes"]', el)).attr("checked", "checked" ).attr("disabled", "disabled");
	})
	
	$("input[type=checkbox]", $('div[name="scopes"]', el)).die().live('change', function(e){
		if(!this.checked){
			$(this).removeAttr("checked");
		}
	})
}