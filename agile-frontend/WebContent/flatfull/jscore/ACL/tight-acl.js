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