package com.thirdparty.zoho;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.codehaus.jettison.json.JSONArray;

import com.agilecrm.contact.sync.Type;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * <code>ZohoImportService</code> This class provide service for zoho module's
 * data import
 * 
 * @author jitendra
 * 
 */
public class ZohoImportService
{
    public static ZohoAgileMapping zohoAgileMapper = new ZohoAgileMappingImpl();

    /**
     * static hard coded max value for iterating loop for maximum 10k records
     * assumption zoho can have max 10k records we can change it based on
     * records later
     */

    public static int MAX_INDEX = 10000;

    /**
     * This method will Import all leads from Zoho Crm
     * 
     * @param contactPrefs
     * @param key
     * @throws Exception
     */
    public void importZohoLeads(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
    {
	try
	{

	    for (int index = 1; index < MAX_INDEX;)
	    {
		if (ZohoUtils.hasMore(ZohoUtils.buildUrl(ZohoModule.LEADS.getValue(), contactPrefs, index, index + 50,
			null)))
		{
		    JSONArray json = new JSONArray(ZohoUtils.getZohoLeads(contactPrefs, index, null));
		    if (json != null && json.length() > 0)
			zohoAgileMapper.saveLeads(json, key);
		    index = index + 50;
		}
		else
		{
		    break;
		}
	    }
	}
	catch (Exception e)
	{
	    System.out.println("In exception ");
	    // retries Import leads if there is method stops in execution in
	    // middle due to some exception
	    importZohoLeads(contactPrefs, key);
	}
    }

    /**
     * <code>ImportAccounts<code>  This code will import all Accounts record from zoho Accounts module
     * 
     * @param contactPrefs
     * @param key
     * @throws Exception
     */
    public void importAccounts(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
    {
	try
	{

	    for (int index = 1; index < MAX_INDEX;)
	    {
		JSONArray json = new JSONArray(ZohoUtils.getContacts(contactPrefs, index, null));
		if (json != null && json.length() > 0)
		    zohoAgileMapper.saveAccounts(json, key);
		if (ZohoUtils.hasMore(ZohoUtils.buildUrl(ZohoModule.ACCOUNTS.getValue(), contactPrefs, index,
			index + 50, null)))
		{
		    index = index + 50;
		}
		else
		{
		    break;
		}
	    }

	}
	catch (Exception e)
	{
	    System.out.println("In exception ");
	    importAccounts(contactPrefs, key);
	}
    }

    /**
     * <code>ImportContacts</code> will import all Contact records from Zoho
     * Contacts module
     * 
     * @param contactPrefs
     * @param key
     * @throws Exception
     */
    public void importContacts(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
    {
	try
	{
	    for (int index = 1; index < MAX_INDEX;)
	    {
		JSONArray json = new JSONArray(ZohoUtils.getContacts(contactPrefs, index, null));
		if (json != null && json.length() > 0)
		    zohoAgileMapper.saveContact(json, key);
		if (ZohoUtils.hasMore(ZohoUtils.buildUrl(ZohoModule.CONTACTS.getValue(), contactPrefs, index,
			index + 50, null)))
		{
		    index = index + 50;
		}
		else
		{
		    break;
		}
	    }
	}
	catch (Exception e)
	{
	    importContacts(contactPrefs, key);
	}

    }

    /**
     * @param prefs
     * @param key
     */
    public void importCases(ContactPrefs prefs, Key<DomainUser> key)
    {
	try
	{
	    JSONArray json = new JSONArray(ZohoUtils.getCases(prefs));
	    zohoAgileMapper.saveCases(json, key);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    // retry
	    importCases(prefs, key);
	}
    }

    /**
     * @param prefs
     * @param key
     */
    public void importTask(ContactPrefs prefs, Key<DomainUser> key)
    {
	try
	{
	    JSONArray json = new JSONArray(ZohoUtils.getTask(prefs));
	    zohoAgileMapper.saveTask(json, key);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    // retry
	    importTask(prefs, key);
	}
    }

    /**
     * @param prefs
     * @param key
     */
    public void importEvent(ContactPrefs prefs, Key<DomainUser> key)
    {
	try
	{
	    JSONArray json = new JSONArray(ZohoUtils.getEvents(prefs, null));
	    zohoAgileMapper.saveEvents(json, key);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    // retry
	    importEvent(prefs, key);
	}
    }

    /**
     * <code>Sync</code> This code will do sync contacts from zoho crm its one
     * way sync Sync new and updated contact from zoho to agile
     */

    public void sync()
    {
	ContactPrefs pref = ContactPrefsUtil.getPrefsByType(Type.ZOHO);
	SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:ss");
	String d = df.format(new Date());
	Key<DomainUser> key = pref.getDomainUser();

	if (pref != null && key != null)
	{
	    try
	    {
		JSONArray leads = new JSONArray(ZohoUtils.getZohoLeads(pref, 0, d).toString());
		JSONArray account = new JSONArray(ZohoUtils.getAccounts(pref, 0, d).toString());
		JSONArray contact = new JSONArray(ZohoUtils.getContacts(pref, 0, d).toString());

		if (leads != null && leads.length() > 0)
		    zohoAgileMapper.saveLeads(leads, key);

		if (account != null && account.length() > 0)
		    zohoAgileMapper.saveAccounts(account, key);

		if (contact != null && contact.length() > 0)
		    zohoAgileMapper.saveContact(contact, key);

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
    }
}
