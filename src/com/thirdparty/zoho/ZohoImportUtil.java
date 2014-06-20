/***
 * @author jitendra
 */

package com.thirdparty.zoho;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.codehaus.jettison.json.JSONArray;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.utl.ContactPrefsUtil;

public class ZohoImportUtil
{
	public static ZohoAgileMapping zohoAgileMapper = new ZohoAgileMappingImpl();
	public static int MAX_INDEX = 10000;

	public static void importZohoLeads(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		try
		{

			for (int index = 1; index < MAX_INDEX;)
			{
				if (ZohoUtils.hasMore(ZohoUtils.buildUrl(ZohoModule.LEADS.getValue(), contactPrefs, index, index + 50,
						null)))
				{
					JSONArray json = new JSONArray(ZohoUtils.getZohoLeads(contactPrefs, index,null));
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
			importZohoLeads(contactPrefs, key);
		}
	}

	public static void importAccounts(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		try
		{

			for (int index = 1; index < MAX_INDEX;)
			{
				JSONArray json = new JSONArray(ZohoUtils.getContacts(contactPrefs, index,null));
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

	public static void importContacts(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		try
		{
			for (int index = 1; index < MAX_INDEX;)
			{
				JSONArray json = new JSONArray(ZohoUtils.getContacts(contactPrefs, index,null));
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

	public static void importCases(ContactPrefs prefs, Key<DomainUser> key)
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

	public static void importTask(ContactPrefs prefs, Key<DomainUser> key)
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

	public static void importEvent(ContactPrefs prefs, Key<DomainUser> key)
	{
		try
		{
			JSONArray json = new JSONArray(ZohoUtils.getEvents(prefs,null));
			zohoAgileMapper.saveEvents(json, key);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			// retry
			importEvent(prefs, key);
		}
	}
	
	public static void sync(){
		ContactPrefs pref = ContactPrefsUtil.getPrefsByType(Type.ZOHO);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:ss");
		String d = df.format(new Date());
		Key<DomainUser> key = pref.getDomainUser();
		
		if(pref != null && key != null){
			try{
			JSONArray leads = new JSONArray(ZohoUtils.getZohoLeads(pref, 0, d).toString());
			JSONArray account = new JSONArray(ZohoUtils.getAccounts(pref, 0, d).toString());
			JSONArray contact = new JSONArray(ZohoUtils.getContacts(pref, 0, d).toString());
			
			  if(leads != null && leads.length() > 0)
				  zohoAgileMapper.saveLeads(leads, key);
			  
			  if(account!= null && account.length() >0)
				  zohoAgileMapper.saveAccounts(account, key);
			  
			  if(contact != null && contact.length() >0)
				  zohoAgileMapper.saveContact(contact, key);
			
			
			}catch(Exception e){
				e.printStackTrace();
			}
		}
	}
}
