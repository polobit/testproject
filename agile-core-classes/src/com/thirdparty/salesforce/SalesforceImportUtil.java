package com.thirdparty.salesforce;

import java.net.SocketTimeoutException;

import org.json.JSONArray;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

public class SalesforceImportUtil
{

	public static void importSalesforceLeads(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		try
		{
			JSONArray json = new JSONArray(SalesforceUtil.getLeadsFromSalesForce(contactPrefs));
			System.out.println(json);
			SalesforceContactToAgileContact.saveSalesforceLeadsInAgile(json, key);
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceLeads(contactPrefs, key);
		}
	}

	public static void importSalesforceAccounts(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		try
		{
			JSONArray json = new JSONArray(SalesforceUtil.getAccountsFromSalesForce(contactPrefs));
			System.out.println(json);
			SalesforceContactToAgileContact.saveSalesforceAccountsInAgile(json, key);
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceAccounts(contactPrefs, key);
		}
	}

	public static void importSalesforceContacts(ContactPrefs contactPrefs) throws Exception
	{
		try
		{
			JSONArray json = new JSONArray(SalesforceUtil.getContactsFromSalesForce(contactPrefs));
			System.out.println(json);
			SalesforceContactToAgileContact.saveSalesforceContactsInAgile(contactPrefs, json);
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceContacts(contactPrefs);
		}

	}
	
	public static void importSalesforceTasks(ContactPrefs contactPrefs) throws Exception
	{
		try
		{
			JSONArray json = new JSONArray(SalesforceUtil.getTasksFromSalesForce(contactPrefs));
			System.out.println(json);
			SalesforceContactToAgileContact.saveSalesforceTaskssInAgile(contactPrefs, json);
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceTasks(contactPrefs);
		}

	}
	

	public static void importSalesforceCases(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		try
		{
			JSONArray json = new JSONArray(SalesforceUtil.getCasesFromSalesForce(contactPrefs));
			System.out.println(json);
			SalesforceContactToAgileContact.saveSalesforceCasesInAgile(contactPrefs, json, key);
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceCases(contactPrefs, key);
		}

	}

	public static void importSalesforceOpportunities(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{
		try
		{
			JSONArray json = new JSONArray(SalesforceUtil.getopportunitiesFromSalesForce(contactPrefs));
			System.out.println(json);
			System.out.println(json.length());
			SalesforceContactToAgileContact.saveSalesforceOpportunitiesInAgile(contactPrefs, json, key);
		}
		catch (SocketTimeoutException e)
		{
			System.out.println("In exception ");
			importSalesforceOpportunities(contactPrefs, key);
		}
	}

}
