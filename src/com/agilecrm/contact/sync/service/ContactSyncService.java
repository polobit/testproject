package com.agilecrm.contact.sync.service;

import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;

public interface ContactSyncService extends SyncService
{
    // public List<Contact> retrieveContact();

    public Contact wrapContactToAgileSchema(Object object);

    public void sendNotification(Map<ImportStatus, Integer> syncStatus, String notificationSubject);
}
