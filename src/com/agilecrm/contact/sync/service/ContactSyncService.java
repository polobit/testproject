package com.agilecrm.contact.sync.service;

import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;

/**
 * <code>ContactSyncService</code> provide method for wrap Contacts from third
 * party to agile domain and send Notification of import status to domain user
 * third party client needs to implement these method
 * 
 * @author jitendra
 * 
 */
public interface ContactSyncService extends SyncService
{
    // public List<Contact> retrieveContact();

    public Contact wrapContactToAgileSchema(Object object);

    public void sendNotification(Map<ImportStatus, Integer> syncStatus, String notificationSubject);
}
