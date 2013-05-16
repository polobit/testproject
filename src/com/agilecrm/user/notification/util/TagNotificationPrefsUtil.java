package com.agilecrm.user.notification.util;

import java.util.HashSet;
import java.util.Set;

import com.agilecrm.contact.Contact;
import com.agilecrm.user.notification.NotificationPrefs;

/**
 * <code>TagNotificationPrefsUtil</code> is the base class for executing
 * notifications of tags. Checks tag changes for a contact. Executes
 * notification when tag is added and tag is deleted.
 * 
 * @author Naresh
 * 
 */
public class TagNotificationPrefsUtil
{
    /**
     * Checks tag changes and execute notification accordingly.
     * 
     * @param oldContact
     *            Contact object before changes.
     * @param updatedContact
     *            Contact object after changes.
     */
    public static void checkTagsChange(Contact oldContact,
	    Contact updatedContact)
    {

	Set<String> oldTags = new HashSet<String>(oldContact.getContactTags());
	Set<String> updatedTags = new HashSet<String>(
		updatedContact.getContactTags());

	// Tags that are added newly
	Set<String> addedTags = new HashSet<String>(updatedTags);
	addedTags.removeAll(oldTags);

	// Executes Notification for added tags
	if (!addedTags.isEmpty())
	    executeNotificationWhenTagsAdded(updatedContact);

	// Tags that are deleted
	Set<String> deletedTags = new HashSet<String>(oldTags);
	deletedTags.removeAll(updatedTags);

	// Executes notification for deleted tags
	if (!deletedTags.isEmpty())
	    executeNotificationWhenTagsDeleted(updatedContact);
    }

    /**
     * Executes notification when tag is added.
     * 
     * @param contact
     *            Contact object to which tag is added.
     */
    public static void executeNotificationWhenTagsAdded(Contact contact)
    {
	NotificationPrefsUtil.executeNotification(
		NotificationPrefs.Type.TAG_CREATED, contact);
    }

    /**
     * Executes notification when tag is deleted.
     * 
     * @param contact
     *            Contact object to which tag is deleted.
     */
    public static void executeNotificationWhenTagsDeleted(Contact contact)
    {
	NotificationPrefsUtil.executeNotification(
		NotificationPrefs.Type.TAG_DELETED, contact);
    }
}
