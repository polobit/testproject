/**
 * To implement ACL for all the modules.
 */
 //ACCOUNT_PREFS.tag_disable=true;
(function(tight_acl, $, undefined) {
	
	//Contants to denote the permission
	tight_acl.DEAL_PER = false;
	tight_acl.REPORTS_PER = false;
	tight_acl.ACTIVITY_PER = false;
	var obj = {};

	/*
	 * Initialize the permissions when user changes the route using the menu scopes in the current domain user object.
	 */
	tight_acl.init_permissions = function(){

		if(!Current_Route)
			return;
		
		if(Current_Route.indexOf('deal') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('DEALS') > -1))
			{
				obj.entity = "{{agile_lng_translate 'menu' 'menu-deals'}}";
				tight_acl.DEAL_PER = true;
				App_ACL.notAllowed(obj);
			}
		if(Current_Route.indexOf('tasks') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('CALENDAR') > -1))
		  {
		   obj.entity = "{{agile_lng_translate 'menu' 'tasks'}}";
		   tight_acl.ACTIVITY_PER = true;
		   App_ACL.notAllowed(obj);
		  }

		  if(Current_Route.indexOf('calendar') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('CALENDAR') > -1))
		  {
		   obj.entity = "{{agile_lng_translate 'menu' 'calendar'}}";
		   tight_acl.ACTIVITY_PER = true;
		   App_ACL.notAllowed(obj);
		  }
		if(Current_Route.indexOf('activit') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('ACTIVITY') > -1))
		{
			obj.entity = "{{agile_lng_translate 'menu' 'menu-activities'}}";
			tight_acl.ACTIVITY_PER = true;
			App_ACL.notAllowed(obj);
		}
		if(Current_Route.indexOf('report') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('REPORT') > -1))
		{
			obj.entity = "{{agile_lng_translate 'menu' 'menu-reports'}}";
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		if((Current_Route.indexOf('web-rules') > -1 || Current_Route.indexOf('webrule') > -1) && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('WEBRULE') > -1))
		{
			obj.entity = "{{agile_lng_translate 'menu' 'menu-web-rules'}}";
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		
		if(Current_Route.indexOf('social') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('SOCIAL') > -1))
		{
			obj.entity = "{{agile_lng_translate 'menu' 'menu-social'}}";
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		
		if(Current_Route.indexOf('documents') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('DOCUMENT') > -1))
		{
			obj.entity = "{{agile_lng_translate 'menu' 'menu-documents'}}";
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		
		if(Current_Route.indexOf('cases') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('CASES') > -1))
		{
			obj.entity = "{{agile_lng_translate 'menu' 'menu-cases'}}";
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		
		if((Current_Route.indexOf('workflow') > -1 || Current_Route.indexOf('trigger') > -1) && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('CAMPAIGN') > -1))
		{
			obj.entity = "{{agile_lng_translate 'menu' 'menu-campaigns'}}";
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		if(Current_Route.indexOf('tickets') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('HELPDESK') > -1))
		{
			obj.entity = "{{agile_lng_translate 'menu' 'service'}}";
			tight_acl.REPORTS_PER = true;
			obj.ERR_CONTAINER = ".ticket-settings";
			App_ACL.notAllowed(obj);
		}
	}
	
	/*
	 * Check the permission based up on the given scope.
	 */
	tight_acl.checkPermission = function(scope){
		return CURRENT_DOMAIN_USER.menu_scopes.indexOf(scope) > -1;
	}

	/*
	 * Check the permission based up on the given scope.
	 */
	tight_acl.isRestrictedScope = function(scope){
		if(!CURRENT_DOMAIN_USER.restricted_menu_scopes)
			 return false;

		return $.inArray(scope, CURRENT_DOMAIN_USER.restricted_menu_scopes) != -1;
	}
}(window.tight_acl = window.tight_acl || {}, $));

(function(acl_util, $, undefined) {

	acl_util.canAddTag = function(tag,callback,errorCallback){
		
		if(CURRENT_DOMAIN_USER.is_admin || ACCOUNT_PREFS.tagsPermission){
			if(callback)
				callback(true);
			else
				return true;
			return;
		}
		
		if(tagsCollectionView){
			if(tag.indexOf('[') < 0){
				if(tagsCollectionView.collection.where({"tag":tag}).length == 0){
					showAlertModal("{{agile_lng_translate 'tags' 'no-perm-to-add'}}", undefined, function(){
						if(errorCallback)
							errorCallback("{{agile_lng_translate 'tags' 'no-perm-to-add'}}");
					}, undefined, "{{agile_lng_translate 'others' 'alert'}}");
					return;
				}
				else if(callback)
					callback(tagsCollectionView.collection.where({"tag":tag}).length > 0);
			} else {
				var tagArray = JSON.parse(tag);
				var newTags = '';
				$.each(tagArray,function(i,tagStr){
					if(tagsCollectionView.collection.where({"tag":tagStr}).length == 0)
						if(newTags.length == 0)
							newTags = tagStr;
						else
							newTags += ", "+tagStr;
				});
				
				if(newTags.length > 0){
					showAlertModal("{{agile_lng_translate 'tags' 'no-perm-to-add'}}", undefined, function(){
						if(errorCallback)
							errorCallback("{{agile_lng_translate 'tags' 'no-perm-to-add'}}");
					},undefined,"{{agile_lng_translate 'others' 'alert'}}");
					return;
				}
				else if(callback)
					callback(true);
				
			}
		} else {
			$.ajax({
				url: 'core/api/tags/can_add_tag?tag='+tag,
				type: 'GET',
				success: function(result){
					if(callback)
						callback(result);
					else
						return result;
				}, error: function(response){
					if(response.responseText.indexOf("don't have permissions")  != -1){
						response.responseText = "{{agile_lng_translate 'tags' 'no-perm-to-add'}}"
					}
					showAlertModal(response.responseText, undefined, function(){
						if(errorCallback)
							errorCallback(response.responseText);
					},undefined, "{{agile_lng_translate 'others' 'alert'}}");
					return;
				}
			});
		}
	};
	
	var setTagACL = function(el){
		if(ACCOUNT_PREFS){
			if(ACCOUNT_PREFS.tagsPermission)
				$('#new_tag_acl',el).attr('checked','checked');
		}else {
			$.ajax({ type : 'GET', url : '/core/api/account-prefs', dataType : 'json',
				success: function(data){
					
					if(isCheck)
						$('#new_tag_acl',el).attr('checked','checked');
				} });
		}
		
	};
	
	var updateTagAcl = function(isEnable){
		var input = {};
		input.is_enable = isEnable;
		queuePostRequest('tag_acl', "/core/api/account-prefs/allow-new-tag", input, function(){
			if(ACCOUNT_PREFS){
				ACCOUNT_PREFS.tagsPermission = isEnable;
			}
		}, function(){});
	};
	
	acl_util.initTagACL = function(el){
	$('#disable_new_tags').on('click',function(e){
	if($('#disable_new_tags').text().trim() == "{{agile_lng_translate 'tags' 'enable-access'}}")
	{
		$('#disable_new_tags').text("{{agile_lng_translate 'tags' 'disable-access'}}");
				
		updateTagAcl(true);console.log(false);
	}
	else if($('#disable_new_tags').text().trim() == "{{agile_lng_translate 'tags' 'disable-access'}}")
	{
		$('#disable_new_tags').text("{{agile_lng_translate 'tags' 'enable-access'}}");
		//ACCOUNT_PREFS.setTagPermission(true);
		updateTagAcl(false);
		//$('#disable_new_tags').attr("option","");
	}  
	});
	/*	$('#new_tag_acl',el).off('change').on('change',function(){
			updateTagAcl($(this).is(':checked'));
		});*/
		setTagACL(el);
	}
}(window.acl_util = window.acl_util || {}, $));