package com.thirdparty.zoho;

import org.json.JSONArray;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

/*
 * @author jitendra
 */
public class ZohoImportUtil
{
	public static ZohoAgileMapping zohoAgileMapper = new ZohoAgileMappingImpl();

	public static void importZohoLeads(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		try
		{
			JSONArray json = new JSONArray(ZohoUtils.getZohoLeads(contactPrefs));
			System.out.println(json);
			zohoAgileMapper.saveLeads(json,key);
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
			JSONArray json = new JSONArray(ZohoUtils.getAccounts(contactPrefs));
			zohoAgileMapper.saveAccounts(json, key);
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
			JSONArray json = new JSONArray(ZohoUtils.getContacts(contactPrefs));
			zohoAgileMapper.saveContact(json, key);
		}
		catch (Exception e)
		{
			importContacts(contactPrefs, key);
		}

	}
	
	public static void importCases(ContactPrefs prefs, Key<DomainUser> key){
		try{
			JSONArray json = new JSONArray(ZohoUtils.getCases(prefs));
			zohoAgileMapper.saveCases(json, key);
		}catch(Exception e){
			e.printStackTrace();
			// retry
			importCases(prefs, key);
		}
	}
	
	public static void importTask(ContactPrefs prefs, Key<DomainUser> key){
		try{
			JSONArray json = new JSONArray(ZohoUtils.getTask(prefs));
			zohoAgileMapper.saveCases(json, key);
		}catch(Exception e){
			e.printStackTrace();
			// retry
			importTask(prefs, key);
		}
	}
	
	public static void importEvent(ContactPrefs prefs, Key<DomainUser> key){
		try{
			JSONArray json = new JSONArray(ZohoUtils.getEvents(prefs));
			zohoAgileMapper.saveEvents(json, key);
		}catch(Exception e){
			e.printStackTrace();
			// retry
			importEvent(prefs, key);
		}
	}
}
