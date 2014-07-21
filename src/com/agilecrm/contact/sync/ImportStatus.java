/**
 * 
 */
package com.agilecrm.contact.sync;

/**
 * <code>ImportStatus</code> contains constant which is used to
 * buildNotification status and send emailNotification to domain user.
 * 
 * @author jitendra
 */
public enum ImportStatus
{

    TOTAL, SAVED_CONTACTS, MERGED_CONTACTS, DUPLICATE_CONTACT, NAME_MANDATORY, EMAIL_REQUIRED, INVALID_EMAIL, TOTAL_FAILED, NEW_CONTACTS, LIMIT_REACHED,

    ACCESS_DENIED;

}
