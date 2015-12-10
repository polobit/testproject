package com.agilecrm.user.notification.util;

import com.agilecrm.contact.Contact;
import com.agilecrm.user.notification.NotificationPrefs;

/**
 * <code>ContactNotificationPrefsUtil</code> is the base class for contact
 * notifications. Executes notifications for adding and deleting contact. Checks
 * if tags are added while adding new contact and execute notification for tags,
 * if added.
 * 
 * @author Naresh
 * 
 */
public class ContactNotificationPrefsUtil
{
    /**
     * Executes notification when new contact is created. Checks if any tag is
     * added or deleted from old contact.
     * 
     * @param oldContact
     *            Contact object before changes.
     * @param newContact
     *            Contact object after changes.
     */
    public static void executeNotificationToContact(Contact oldContact, Contact newContact)
    {
	// Check if contact is new
	if (oldContact == null)
	{
	    executeNotificationForNewContact(newContact);
	    return;
	}

	TagNotificationPrefsUtil.checkTagsChange(oldContact, newContact);
    }

    /**
     * Executes notification when contact is added. If tags are also added along
     * with new contact, executes notification for tags.
     * 
     * @param contact
     *            Contact object that is added.
     */
    public static void executeNotificationForNewContact(Contact contact)
    {
	NotificationPrefsUtil.executeNotification(NotificationPrefs.Type.CONTACT_ADDED, contact, null);

	// Executes Notification for tags added along with new Contact
	if (!contact.getContactTags().isEmpty())
	    TagNotificationPrefsUtil.executeNotificationWhenTagsAdded(contact, contact.getContactTags());

    }

    /**
     * Executes notification when contact is deleted.
     * 
     * @param contact
     *            Contact object that is deleted.
     */
    public static void executeNotificationForDeleteContact(Contact contact)
    {
	NotificationPrefsUtil.executeNotification(NotificationPrefs.Type.CONTACT_DELETED, contact, null);
    }
}