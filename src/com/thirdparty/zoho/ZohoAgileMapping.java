package com.thirdparty.zoho;

import java.util.Map;

import org.json.JSONArray;

import com.agilecrm.contact.Contact;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

/*
 * @author jitendra
 */
public interface ZohoAgileMapping
{
	
	public Contact saveContact(Map<String,String> contactDataMap, Key<DomainUser> key);
	public void saveLeads(JSONArray zohoData, Key<DomainUser> ownerKey);
	public void saveAccounts(JSONArray zohoData, Key<DomainUser> key);
	public void saveCases(JSONArray zohoData, Key<DomainUser> key);
	public void saveEvents(JSONArray zohoData, Key<DomainUser> key);
	public void saveTask(JSONArray zohoData, Key<DomainUser> key);
	public void saveContact(JSONArray zohoData,Key<DomainUser> key);

}
