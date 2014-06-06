/**
 * 
 */
package com.thirdparty.zoho;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

/**
 * @author jitendra
 *
 */
public interface ZohoImportAPI
{
	
	public void importData(ContactPrefs contactPrefs, Key<DomainUser> key);

}
