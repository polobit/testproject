/**
 * To implement ACL for all the modules.
 */
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
				obj.entity = 'Deals';
				tight_acl.DEAL_PER = true;
				App_ACL.notAllowed(obj);
			}
		if(Current_Route.indexOf('tasks') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('CALENDAR') > -1))
		  {
		   obj.entity = 'Tasks';
		   tight_acl.ACTIVITY_PER = true;
		   App_ACL.notAllowed(obj);
		  }

		  if(Current_Route.indexOf('calendar') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('CALENDAR') > -1))
		  {
		   obj.entity = 'Calendar';
		   tight_acl.ACTIVITY_PER = true;
		   App_ACL.notAllowed(obj);
		  }
		if(Current_Route.indexOf('activit') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('ACTIVITY') > -1))
		{
			obj.entity = 'Acivities';
			tight_acl.ACTIVITY_PER = true;
			App_ACL.notAllowed(obj);
		}
		if(Current_Route.indexOf('report') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('REPORT') > -1))
		{
			obj.entity = 'Reports';
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		if((Current_Route.indexOf('web-rules') > -1 || Current_Route.indexOf('webrule') > -1) && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('WEBRULE') > -1))
		{
			obj.entity = 'Webrules';
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		
		if(Current_Route.indexOf('social') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('SOCIAL') > -1))
		{
			obj.entity = 'Social';
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		
		if(Current_Route.indexOf('documents') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('DOCUMENT') > -1))
		{
			obj.entity = 'Documents';
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		
		if(Current_Route.indexOf('cases') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('CASES') > -1))
		{
			obj.entity = 'Cases';
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
		
		if((Current_Route.indexOf('workflow') > -1 || Current_Route.indexOf('trigger') > -1) && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('CAMPAIGN') > -1))
		{
			obj.entity = 'Campaigns';
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed(obj);
		}
	}
	
	/*
	 * Check the permission based up on the given scope.
	 */
	tight_acl.checkPermission = function(scope){
		return CURRENT_DOMAIN_USER.menu_scopes.indexOf(scope) > -1;
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
					alert("Tag '" + tag + "' does not exist. You don't have permissions to create a new Tag.");
					if(errorCallback)
						errorCallback("Tag '" + tag + "' does not exist. You don't have permissions to create a new Tag.");
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
					alert("Tag '" + newTags + "' does not exist. You don't have permissions to create a new Tag.");
					if(errorCallback)
						errorCallback("Tag '" + newTags + "' does not exist. You don't have permissions to create a new Tag.");
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
					alert(response.responseText);
					if(errorCallback)
						errorCallback(response.responseText);
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
		$('#new_tag_acl',el).off('change').on('change',function(){
			updateTagAcl($(this).is(':checked'));
		});
		setTagACL(el);
	}
}(window.acl_util = window.acl_util || {}, $));