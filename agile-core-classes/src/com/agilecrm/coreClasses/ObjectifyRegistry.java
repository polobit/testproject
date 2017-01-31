package com.agilecrm.coreClasses;

import com.agilecrm.account.EmailTemplateCategory;
import com.agilecrm.affiliate.Affiliate;
import com.agilecrm.affiliate.AffiliateDetails;
import com.agilecrm.deals.CurrencyConversionRates;
import com.agilecrm.affiliate.AffiliateDeal;
import com.agilecrm.addon.AddOn;
import com.agilecrm.customthemes.CustomTheme;
import com.agilecrm.notification.NotificationTemplate;
import com.agilecrm.notification.push.PushNotificationMessage;
import com.agilecrm.user.push.AgileUserPushNotificationId;
import com.agilecrm.workflows.WorkflowBackup;
import com.agilecrm.user.GmailSendPrefs;
import com.agilecrm.user.InvitedUser;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.videorecords.VideoRecord;
import com.googlecode.objectify.ObjectifyService;
import com.agilecrm.account.DocumentTemplates;
import com.agilecrm.products.Product;
import com.agilecrm.contact.DocumentNote;
/**
 * Register all entities used by Objectify in this module.
 * To register a new entity, use ObjectifyService.register(<ClassName>.class);
 * 
 * @author Prashannjeet
 *
 */
public class ObjectifyRegistry {
	
	public static void registerEntities(){
		
		//Add your entity class here
		ObjectifyService.register(PushNotificationMessage.class);
		ObjectifyService.register(NotificationTemplate.class);
		ObjectifyService.register(Affiliate.class);
		ObjectifyService.register(AffiliateDetails.class);
		ObjectifyService.register(CurrencyConversionRates.class);
		ObjectifyService.register(AffiliateDeal.class);
		
		ObjectifyService.register(CustomTheme.class);

		ObjectifyService.register(WorkflowBackup.class);		
		ObjectifyService.register(EmailTemplateCategory.class);
		ObjectifyService.register(VideoRecord.class);
		ObjectifyService.register(SMTPPrefs.class);
		ObjectifyService.register(GmailSendPrefs.class);
		
		// Agile Push 
		ObjectifyService.register(AgileUserPushNotificationId.class);
		
		ObjectifyService.register(DocumentTemplates.class);
		ObjectifyService.register(Product.class);
		ObjectifyService.register(DocumentNote.class);
		ObjectifyService.register(InvitedUser.class);
		ObjectifyService.register(AddOn.class);
	}
}
