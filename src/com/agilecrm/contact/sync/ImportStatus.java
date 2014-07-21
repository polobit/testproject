/**
 * 
 */
package com.agilecrm.contact.sync;

// TODO: Auto-generated Javadoc
/**
 * <code>ImportStatus</code> contains constant which is used to
 * buildNotification status and send emailNotification to domain user.
 * 
 * @author jitendra
 */
public enum ImportStatus
{

    /** The total. */
    TOTAL, /** The saved contacts. */
    SAVED_CONTACTS, /** The merged contacts. */
    MERGED_CONTACTS, /** The duplicate contact. */
    DUPLICATE_CONTACT, /** The name mandatory. */
    NAME_MANDATORY, /** The email required. */
    EMAIL_REQUIRED, /** The invalid email. */
    INVALID_EMAIL, /** The total failed. */
    TOTAL_FAILED, /** The new contacts. */
    NEW_CONTACTS, /** The limit reached. */
    LIMIT_REACHED,

    /** The access denied. */
    ACCESS_DENIED;

}
