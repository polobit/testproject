/**
 * @author jitendra
 * @since 2014
 */
package com.agilecrm.contact.sync;

import java.io.Serializable;

import com.agilecrm.contact.sync.service.IContactSyncService;
import com.agilecrm.contact.sync.service.impl.FreshbooksSyncImpl;
import com.agilecrm.contact.sync.service.impl.GoogleSyncImpl;
import com.agilecrm.contact.sync.service.impl.SalesforceSync;
import com.agilecrm.contact.sync.service.impl.ShopifySyncImpl;
import com.agilecrm.contact.sync.service.impl.StripeSyncImpl;
import com.agilecrm.contact.sync.service.impl.ZohoSyncImpl;
import com.thirdparty.quickbook.QuickBookSyncImpl;
import com.thirdparty.xero.XeroSyncImpl;

/**
 * This Enumeration defines several third party client for Contacts sync service
 * its full fledged implementation of Enumeration. Each Client will takes their
 * Sync Implementation class and Email Subject for sending notification after
 * import as parameter. SyncService will initiate Sync Implementation class and
 * provide contacts sync service.
 * 
 * 
 */
public enum Type implements Serializable
{
    GOOGLE(GoogleSyncImpl.class, "Google Import Status"), STRIPE(StripeSyncImpl.class, "Stripe Import Status"), ZOHO(
	    ZohoSyncImpl.class, "Zoho Import Status"), SALESFORCE(SalesforceSync.class, "Salesforce Import Status"), SHOPIFY(
	    ShopifySyncImpl.class, "Shopify Import Status"), QUICKBOOK(QuickBookSyncImpl.class,
	    "QuickBooks Import Status"), XERO(XeroSyncImpl.class, "Xero Import Status"), FRESHBOOKS(
	    FreshbooksSyncImpl.class, "Freshbooks Import Status");

    Class<? extends IContactSyncService> clazz;
    String notificationEmailSubject = "";

    Type(Class<? extends IContactSyncService> service, String notificationEmailSubject)
    {
	this.clazz = service;
	this.notificationEmailSubject = notificationEmailSubject;
    }

    /**
     * return clazz of Client.
     * 
     * @return the clazz
     */
    public Class<? extends IContactSyncService> getClazz()
    {
	return clazz;
    }

    public String getNotificationEmailSubject()
    {
	return notificationEmailSubject;
    }

}
