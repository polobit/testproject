package com.agilecrm.contact.sync.service;

import java.util.Map;

import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.thirdparty.google.ContactPrefs;

/**
 * @author jitendra
 * 
 */
public abstract class OneWaySyncService implements ContactSyncService
{
    private static final String NOTIFICATION_TEMPLATE = "contact_sync_notification_template";
    protected ContactPrefs prefs;

    @Override
    public SyncService createService(ContactPrefs pref)
    {
	Preconditions.checkNotNull(pref, "Prefs can't be null");
	this.prefs = pref;
	return this;
    }

    public ContactPrefs getPrefs()
    {
	return prefs;

    }

    public abstract void initSync();

    @Override
    public void sendNotification(Map<ImportStatus, Integer> syncStatus, String notificationSubject)
    {
	DomainUser user = DomainUserUtil.getCurrentDomainUser();
	if (user != null)
	    SendMail.sendMail(user.email, notificationSubject, NOTIFICATION_TEMPLATE, new Object[] { user, syncStatus });
    }

    @Override
    public abstract Contact wrapContactToAgileSchema(Object object);

}
