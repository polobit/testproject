/**
 * 
 */
package com.agilecrm.contact.sync;

/**
 * @author jitendra
 * 
 */
public enum ImportStatus
{

    TOTAL, SAVED_CONTACTS, MERGED_CONTACTS, DUPLICATE_CONTACT, NAME_MANDATORY, EMAIL_REQUIRED, INVALID_EMAIL, TOTAL_FAILED, NEW_CONTACTS, LIMIT_REACHED,

    ACCESS_DENIED;

}
