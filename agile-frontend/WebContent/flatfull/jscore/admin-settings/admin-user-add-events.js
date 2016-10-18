function bindAdminChangeAction(el, data)
{
	//Remove deals from newscopes
	var newscopesarray = $("input[type=checkbox]", $('div[name="newscopes"]', el));
	var newMenuScopesArray = $("input[type=checkbox]", $('div[name="newMenuScopes"]', el));
	$.each(newscopesarray, function(index, data) {
				if($(newscopesarray[index]).attr("id") == "deals-privilege"){	
					newscopesarray.splice(index,1);}
				});
	$('input[name="is_admin"]', el).on('change', function(e){

	var is_admin = $(this).is(":checked");
	if(_plan_restrictions.is_ACL_allowed[0]() || checkForACLExceptionalUsers())
	{
		if(is_admin == false)
			newscopesarray.removeAttr("disabled");
		else
			newscopesarray.prop("checked", "checked" ).attr("disabled", "disabled");
		
		$('#calendar-privilege', el).trigger("change");
		$('#deals-privilege', el).trigger("change");
	}else{
		if(is_admin == true)
		{
			newscopesarray.prop("checked", "checked" )
			$("input[type=checkbox]", $('div[name="newMenuScopes"]', el)).prop("checked", "checked" )
		}
	}
	});
	
	newscopesarray.on('change', function(e){
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
				$('input[value="CREATE_DEALS"]', el).attr("disabled", "disabled");
				$('input[value="UPDATE_DEALS"]', el).attr("disabled", "disabled");
				$('input[value="DELETE_DEALS"]', el).attr("disabled", "disabled");
			}
			else
			{
				if(_plan_restrictions.is_ACL_allowed[0]()){
					$('input[value="VIEW_DEALS"]', el).removeAttr("disabled");
					$('input[value="CREATE_DEALS"]', el).removeAttr("disabled");
					$('input[value="UPDATE_DEALS"]', el).removeAttr("disabled");
					$('input[value="DELETE_DEALS"]', el).removeAttr("disabled");
				}
			}
		}
	});

	$('#calendar-privilege', el).off('change');
	$(el).on('change', '#calendar-privilege', function(e){
		if(!$('input[name="is_admin"]', el).is(':checked'))
		{
			if(!$(this).is(':checked')){
				$('input[value="VIEW_CALENDAR"]', el).attr("disabled", "disabled");
				$('input[value="MANAGE_CALENDAR"]', el).attr("disabled", "disabled");
			}
			else{
				if(_plan_restrictions.is_ACL_allowed[0]()){
					$('input[value="VIEW_CALENDAR"]', el).removeAttr("disabled");
					$('input[value="MANAGE_CALENDAR"]', el).removeAttr("disabled");
				}
			}
		}
	});
	
}

// Allow acls for specific domains
function checkForACLExceptionalUsers(){
	var specialUsers = ["savourychef","organicleads","cutrone","sunsationalswimschoo","aviation", "mybandmarket", "grupocsi"];
	if($.inArray(CURRENT_DOMAIN_USER.domain, specialUsers) != -1)
		return true;
	else
		return false;
}
