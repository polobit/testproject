package com.agilecrm.coreClasses;

import com.agilecrm.affiliate.Affiliate;
import com.agilecrm.affiliate.AffiliateDetails;
import com.agilecrm.affiliate.AffiliateDeal;
import com.agilecrm.customthemes.CustomTheme;
import com.agilecrm.notification.NotificationTemplate;
import com.agilecrm.notification.push.PushNotificationMessage;
import com.agilecrm.workflows.WorkflowBackup;
import com.googlecode.objectify.ObjectifyService;
/**
 * Register all entities used by Objectify in this module.
 * To register a new entity, use ObjectifyService.register(<ClassName>.class);
 * 
 * @author Prashannjeet
 *
 */
public class ObjectifyRegistry {
	
	public static void registerEntities(){
		
		//Add your entity clas here
		ObjectifyService.register(PushNotificationMessage.class);
		ObjectifyService.register(NotificationTemplate.class);
		ObjectifyService.register(Affiliate.class);
		ObjectifyService.register(AffiliateDetails.class);
		ObjectifyService.register(AffiliateDeal.class);
		ObjectifyService.register(WorkflowBackup.class);
		ObjectifyService.register(CustomTheme.class);
		
	}
}
