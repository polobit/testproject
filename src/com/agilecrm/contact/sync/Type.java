/**
 * 
 */
package com.agilecrm.contact.sync;

import java.io.Serializable;

import com.agilecrm.contact.sync.service.SyncService;
import com.agilecrm.contact.sync.service.impl.GoogleSyncImpl;
import com.agilecrm.contact.sync.service.impl.SalesforceSync;
import com.agilecrm.contact.sync.service.impl.ShopifySyncImpl;
import com.agilecrm.contact.sync.service.impl.StripeSyncImpl;
import com.agilecrm.contact.sync.service.impl.ZohoSyncImpl;
import com.thirdparty.quickbook.QuickBookSyncImpl;

/**
 * <code>SyncClient</code> contains various third party client that client need
 * to set for import contact
 * 
 * @author jitendra
 * 
 */
public enum Type implements Serializable
{
    GOOGLE(GoogleSyncImpl.class, "Google Import Status"), STRIPE(StripeSyncImpl.class, "Stripe Import Status"), ZOHO(
	    ZohoSyncImpl.class, "Zoho Import Status"), SALESFORCE(SalesforceSync.class, "Salesforce Import Status"), SHOPIFY(
	    ShopifySyncImpl.class, "Shopify Import Status"), QUICKBOOK(QuickBookSyncImpl.class,
	    "QuickBook Import Status");

    Class<? extends SyncService> clazz;
    String notificationEmailSubject = "";

    Type(Class<? extends SyncService> service, String notificationEmailSubject)
    {
	this.clazz = service;
	this.notificationEmailSubject = notificationEmailSubject;
    }

    /**
     * return clazz of Client.
     * 
     * @return the clazz
     */
    public Class<? extends SyncService> getClazz()
    {
	return clazz;
    }

    public String getNotificationEmailSubject()
    {
	return notificationEmailSubject;
    }

}
