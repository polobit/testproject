package com.thirdparty.salesforce;

import org.json.JSONArray;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

public class SalesforceImportUtil
{

	public static void importSalesforceLeads(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		JSONArray json = new JSONArray(SalesforceUtil.getLeadsFromSalesForce(contactPrefs));
		System.out.println(json);
		SalesforceContactToAgileContact.saveSalesforceLeadsInAgile(json, key);
	}

	public static void importSalesforceAccounts(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		JSONArray json = new JSONArray(SalesforceUtil.getAccountsFromSalesForce(contactPrefs));
		System.out.println(json);
		SalesforceContactToAgileContact.saveSalesforceAccountsInAgile(json, key);
	}

	public static void importSalesforceContacts(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		JSONArray json = new JSONArray(SalesforceUtil.getContactsFromSalesForce(contactPrefs));
		System.out.println(json);
		SalesforceContactToAgileContact.saveSalesforceContactsInAgile(contactPrefs, json, key);
	}

	public static void importSalesforceCases(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		JSONArray json = new JSONArray(SalesforceUtil.getCasesFromSalesForce(contactPrefs));
		System.out.println(json);
		SalesforceContactToAgileContact.saveSalesforceCasesInAgile(contactPrefs, json, key);
	}

	public static void importSalesforceOpportunities(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		JSONArray json = new JSONArray(SalesforceUtil.getopportunitiesFromSalesForce(contactPrefs));
		System.out.println(json);
		System.out.println(json.length());
		SalesforceContactToAgileContact.saveSalesforceOpportunitiesInAgile(contactPrefs, json, key);
	}

}
