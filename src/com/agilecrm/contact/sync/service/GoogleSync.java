/**
 * 
 */
package com.agilecrm.contact.sync.service;

import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;
import com.thirdparty.google.ContactPrefs;

/**
 * @author jitendra
 * 
 */
public class GoogleSync extends TwoWaySyncService
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
