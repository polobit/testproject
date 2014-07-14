/**
 * 
 */
package com.agilecrm.contact.sync;

import java.io.Serializable;

import com.agilecrm.contact.sync.service.GoogleSync;
import com.agilecrm.contact.sync.service.SalesforceSync;
import com.agilecrm.contact.sync.service.ShopifySync;
import com.agilecrm.contact.sync.service.StripeSync;
import com.agilecrm.contact.sync.service.SyncService;
import com.agilecrm.contact.sync.service.ZohoSync;

/**
 * <code>SyncClient</code> contains various third party client that client need
 * to set for import contact
 * 
 * @author jitendra
 * 
 */
public enum SyncClient implements Serializable
{
    GOOGLE(GoogleSync.class), STRIPE(StripeSync.class), ZOHO(ZohoSync.class), SALESFORCE(SalesforceSync.class), SHOPIFY(
	    ShopifySync.class);

    Class<? extends SyncService> clazz;

    SyncClient(Class<? extends SyncService> service)
    {
	this.clazz = service;
    }

    public Class<? extends SyncService> getClazz()
    {
	return clazz;
    }

}
