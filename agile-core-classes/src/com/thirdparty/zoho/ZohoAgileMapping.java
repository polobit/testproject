package com.thirdparty.zoho;

import org.codehaus.jettison.json.JSONArray;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

/**
 * <code>This interface is provide method for saving Module data in agile contacts</code>
 * 
 * @author jitendra
 * 
 */
public interface ZohoAgileMapping
{

    public void saveLeads(JSONArray zohoData, Key<DomainUser> ownerKey);

    public void saveAccounts(JSONArray zohoData, Key<DomainUser> key);

    public void saveCases(JSONArray zohoData, Key<DomainUser> key);

    public void saveEvents(JSONArray zohoData, Key<DomainUser> key);

    public void saveTask(JSONArray zohoData, Key<DomainUser> key);

    public void saveContact(JSONArray zohoData, Key<DomainUser> key);

}
