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

    /** total records */
    TOTAL,
    /** total saved contacts. */
    SAVED_CONTACTS,
    /** Total merged contacts. */
    MERGED_CONTACTS,
    /** Total duplicate contact. */
    DUPLICATE_CONTACT,
    /** mandatory. */
    NAME_MANDATORY,
    /** email required. */
    EMAIL_REQUIRED,
    /** invalid email. */
    INVALID_EMAIL,
    /** total failed. */
    TOTAL_FAILED,
    /** new contacts. */
    NEW_CONTACTS,
    /** limit reached. */
    LIMIT_REACHED,

    /** access denied. */
    ACCESS_DENIED,
    
    TOTAL_TASKS,
    SAVED_TASKS,
    
    TOTAL_ACCOUNTS,
    SAVED_ACCOUNTS,
    MERGED_ACCOUNTS,
    
}
