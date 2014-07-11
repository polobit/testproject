/**
 * 
 */
package com.agilecrm.contact.sync;

import org.scribe.utils.Preconditions;

import com.agilecrm.contact.sync.service.SyncService;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * @author jitendra
 * 
 */
public class SyncPrefsBuilder
{
    private ContactPrefs prefs;

    private SyncService api;

    public SyncPrefsBuilder config(ContactPrefs prefs)
    {
	Preconditions.checkNotNull(prefs, "ContactPrefs can't be null");
	this.prefs = prefs;
	return this;
    }

    public SyncService getService(Class<? extends SyncService> clazz)
    {
	Preconditions.checkNotNull(clazz, "service class can't be empty");
	try
	{
	    this.api = clazz.newInstance();
	}
	catch (InstantiationException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (IllegalAccessException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return api.createService(prefs);
    }

}
