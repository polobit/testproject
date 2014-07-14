/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.service.SyncService;
import com.agilecrm.contact.sync.service.TwoWaySyncService;
import com.thirdparty.google.ContactPrefs;

/**
 * @author jitendra
 * 
 */
public class GoogleSyncImpl extends TwoWaySyncService
{

    @Override
    public Contact wrapContactToAgileSchema(Object object)
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public void sendNotification(Map<ImportStatus, Integer> syncStatus, String notificationSubject)
    {
	// TODO Auto-generated method stub

    }

    @Override
    public SyncService createService(ContactPrefs prefs)
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public ContactPrefs getPrefs()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public void initSync()
    {
	// TODO Auto-generated method stub

    }

}
