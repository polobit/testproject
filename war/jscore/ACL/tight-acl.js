(function(tight_acl, $, undefined) {
	
	tight_acl.DEAL_PER = false;
	tight_acl.REPORTS_PER = false;
	tight_acl.ACTIVITY_PER = false;
	
	tight_acl.init_permissions = function(){
		if(Current_Route.indexOf('deal') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('DEALS') > -1))
			{
				tight_acl.DEAL_PER = true;
				App_ACL.notAllowed();
			}
		if(Current_Route.indexOf('activity') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('ACTIVITY') > -1))
		{
			tight_acl.ACTIVITY_PER = true;
			App_ACL.notAllowed();
		}
		if(Current_Route.indexOf('report') > -1 && !(CURRENT_DOMAIN_USER.menu_scopes.indexOf('REPORT') > -1))
		{
			tight_acl.REPORTS_PER = true;
			App_ACL.notAllowed();
		}
	}
	
	tight_acl.checkPermission = function(scope){
		return CURRENT_DOMAIN_USER.menu_scopes.indexOf(scope) > -1;
	}
}(window.tight_acl = window.tight_acl || {}, $));