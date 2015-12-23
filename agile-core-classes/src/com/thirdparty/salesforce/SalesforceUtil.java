package com.thirdparty.salesforce;

import javax.ws.rs.WebApplicationException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.sforce.soap.partner.FieldType;
import com.thirdparty.google.ContactPrefs;

/**
 * The <code>SalesforceUtil</code> class acts as a Client to ClickDeskPlugins
 * server
 * 
 * <code>SalesforceUtil</code> class contains methods for interacting with the
 * ClickDeskPlugins server using REST API.
 * 
 * @author Tejaswi
 * @since September 2013
 */
public class SalesforceUtil
{

	/**
	 * Calls method in ClickDeskPlugins server using REST API to get the details
	 * of the entity
	 * 
	 * @param contactPrefs
	 *            {@link ContactPrefs} to retrieve preferences of Salesforce
	 *            account of agile user
	 * @return {@link String} with the client response
	 * @throws Exception
	 *             if the response is an exception
	 */
	public static String getEntities(ContactPrefs contactPrefs, String query) throws Exception
	{
		JSONObject pluginPrefsJSON = buildPluginPrefsJSON(contactPrefs);
		pluginPrefsJSON.put("salesforce_query", query);

		JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON", pluginPrefsJSON);

		System.out.println(prefsJSON);

		SalesforceAPI salesforce = new SalesforceAPI(contactPrefs.userName, contactPrefs.password, contactPrefs.apiKey);

		JSONArray result = salesforce.retrieveEntities(query);
		System.out.println("result = " + result);
		
		
		salesforce.logout();

		return result.toString();

	}

	/**
	 * Retrieves Salesforce preferences from {@link ContactPrefs} and stores
	 * into a {@link JSONObject}
	 * 
	 * @param contactPrefs
	 *            {@link ContactPrefs} to retrieve Salesforce preferences from
	 *            Salesforce account of agile user
	 * @return {@link JSONObject} with Salesforce preferences
	 * @throws Exception
	 */
	public static JSONObject buildPluginPrefsJSON(ContactPrefs contactPrefs) throws Exception
	{
		try
		{
			// If widget properties null, exception occurs
			JSONObject pluginPrefs = new JSONObject().put("salesforce_userid", contactPrefs.userName)
					.put("salesforce_password", contactPrefs.password)
					.put("salesforce_user_api_key", contactPrefs.apiKey);

			return pluginPrefs;
		}
		catch (JSONException e)
		{
			System.out.println("Exception in buildinPrefs method in Salesforce: " + e.getMessage());
			throw new Exception("Something went wrong. Please try again");
		}

	}

	public static String getContactsFromSalesForce(ContactPrefs prefs) throws Exception
	{
		String query = "SELECT  Id, FirstName, LastName, Email, Title, Department,  Phone, Fax, MobilePhone, MailingCity, MailingState, MailingCountry, MailingPostalCode, MailingStreet FROM Contact";
		System.out.println("In contacts------------------------------------");
		return SalesforceUtil.getEntities(prefs, query);
	}
	
	public static String getTasksFromSalesForce(ContactPrefs prefs) throws Exception
	{
		String query = "select Id, OwnerId, whoId, whatId, Subject, Description, ActivityDate, Priority, Status, Who.Type, Who.Name, Who.Id From Task";
		System.out.println("In tasks------------------------------------");
		return SalesforceUtil.getEntities(prefs, query);
	}

	public static String getLeadsFromSalesForce(ContactPrefs prefs) throws Exception
	{
		String query = "SELECT OwnerId, ConvertedContactId, ConvertedAccountId, ConvertedOpportunityId, FirstName, LastName, Description, Email, Title, Phone, Website,  Rating, Street,City,State, Country, PostalCode,  Company,  LeadSource FROM Lead";
		System.out.println("In leads------------------------------------");
		return SalesforceUtil.getEntities(prefs, query);
	}

	public static String getAccountsFromSalesForce(ContactPrefs prefs) throws Exception
	{
		String query = "SELECT Name, Website, Phone, Fax, Industry, Description, Type, NumberOfEmployees, BillingStreet, BillingCity, BillingState, BillingCountry, BillingPostalCode FROM Account";
		System.out.println("In accounts------------------------------------");
		return SalesforceUtil.getEntities(prefs, query);
	}

	public static String getCasesFromSalesForce(ContactPrefs prefs) throws Exception
	{
		String query = "SELECT Subject,Status, Description, ContactId FROM Case";
		System.out.println("In cases------------------------------------");
		return SalesforceUtil.getEntities(prefs, query);
	}

	public static String getopportunitiesFromSalesForce(ContactPrefs prefs) throws Exception
	{
		String query = "SELECT AccountId, Name, Description, ExpectedRevenue, Probability, StageName, IsDeleted, IsWon, IsClosed, CloseDate FROM Opportunity";
		System.out.println("In opportunities------------------------------------");
		return SalesforceUtil.getEntities(prefs, query);
	}

	public static String getAccountByAccountIdFromSalesForce(ContactPrefs prefs, String id) throws Exception
	{
		String query = "SELECT Name, Website, Phone, Fax, Industry, Description, Type, NumberOfEmployees, BillingStreet, BillingCity, BillingState, BillingCountry, BillingPostalCode FROM Account WHERE Id = '"
				+ id + "'";
		System.out.println("In Account by id ------------------------------------");
		return new JSONArray(getEntities(prefs, query)).getJSONObject(0).toString();
	}

	public static String getContactByContactIdFromSalesForce(ContactPrefs prefs, String id) throws Exception
	{
		String query = "SELECT FirstName, LastName, Email, Title, Description,Department,  Phone, Fax, MobilePhone, MailingCity, MailingState, MailingCountry, MailingPostalCode, MailingStreet, LeadSource FROM Contact WHERE Id = '"
				+ id + "'";
		System.out.println("In Contact by id ------------------------------------");
		return new JSONArray(getEntities(prefs, query)).getJSONObject(0).toString();
	}

	public static String checkSalesforcePrefs(ContactPrefs prefs) throws Exception
	{
		try
		{
			String query = "SELECT FirstName FROM User WHERE Email='" + prefs.userName + "'";
			System.out.println("In check salesforce prefs ------------------------------------");
			return getEntities(prefs, query);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			throw new Exception("Invalid login. Please try again");
		}
	}

	public static void main(String[] args)
	{
		ContactPrefs prefs = new ContactPrefs();
		
		prefs.userName = "ragaqt@gmail.com";
		prefs.password = "mantra123";
		prefs.apiKey = "Zovgoz4alO2SrDg0Fnf0Fy0Z";
		
		/*prefs.userName = "govindarajulu3@gmail.com";
		prefs.password = "govind8706!";
		prefs.apiKey = "N8KPS4sZLuw31VYBZ1ZuPnVUx";*/

		try
		{
			
			// describeSObjectsSample();
			
			// System.out.println(SalesforceUtil.checkSalesforcePrefs(prefs));

			 System.out.println(SalesforceUtil.getTasksFromSalesForce(prefs));
			
			// System.out.println(SalesforceUtil.getContactsFromSalesForce(prefs));

			/*System.out.println(SalesforceUtil.getLeadsFromSalesForce(prefs));

			System.out.println(SalesforceUtil.getAccountsFromSalesForce(prefs));

			System.out.println(SalesforceUtil.getCasesFromSalesForce(prefs));

			System.out.println(SalesforceUtil.getopportunitiesFromSalesForce(prefs));

			System.out.println(SalesforceUtil.getAccountByAccountIdFromSalesForce(prefs, "0019000000U5pTDAAZ"));*/

		}
		catch (WebApplicationException e)
		{
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			// if (e.getMessage().contains("'INVALID_LOGIN'"))
			// System.out.println("invalid");
			e.printStackTrace();
		}

	}
	
	public static void describeSObjectsSample() throws Exception 
    {
		
      try {
    	  
    	 ContactPrefs contactPrefs = new ContactPrefs();
  		
    	 contactPrefs.userName = "ragaqt@gmail.com";
    	 contactPrefs.password = "mantra123";
    	 contactPrefs.apiKey = "Zovgoz4alO2SrDg0Fnf0Fy0Z";
  		
    	 SalesforceAPI salesforce = new SalesforceAPI(contactPrefs.userName, contactPrefs.password, contactPrefs.apiKey);

  		
        // Call describeSObjectResults and pass it an array with
        // the names of the objects to describe.
        com.sforce.soap.partner.DescribeSObjectResult[] describeSObjectResults = 
        		salesforce.connection.describeSObjects(
                            new String[] { "task" });

        //  "account", "contact", "lead"
        // Iterate through the list of describe sObject results
        for (int i=0;i < describeSObjectResults.length; i++)
        {
            com.sforce.soap.partner.DescribeSObjectResult desObj = describeSObjectResults[i];
            // Get the name of the sObject
            String objectName = desObj.getName();
            System.out.println("sObject name: " + objectName);

            // For each described sObject, get the fields
            com.sforce.soap.partner.Field[] fields = desObj.getFields();
                            
            // Get some other properties
            if (desObj.getActivateable()) System.out.println("\tActivateable");
            
            // Iterate through the fields to get properties for each field
            for(int j=0;j < fields.length; j++)
            {                        
                com.sforce.soap.partner.Field field = fields[j];
                System.out.println("\tField: " + field.getName());
                System.out.println("\t\tLabel: " + field.getLabel());
                if (field.isCustom()) 
                    System.out.println("\t\tThis is a custom field.");
                System.out.println("\t\tType: " + field.getType());
                if (field.getLength() > 0)
                    System.out.println("\t\tLength: " + field.getLength());
                if (field.getPrecision() > 0)
                    System.out.println("\t\tPrecision: " + field.getPrecision());
                
                // Determine whether this is a picklist field
                if (field.getType() == FieldType.picklist)
                {                            
                    // Determine whether there are picklist values
                    com.sforce.soap.partner.PicklistEntry[] picklistValues = field.getPicklistValues();
                    if (picklistValues != null && picklistValues[0] != null)
                    {
                        System.out.println("\t\tPicklist values = ");
                        for (int k = 0; k < picklistValues.length; k++)
                        {
                            System.out.println("\t\t\tItem: " + picklistValues[k].getLabel());
                        }
                    }
                }

                // Determine whether this is a reference field
                if (field.getType() == FieldType.reference)
                {                            
                    // Determine whether this field refers to another object
                    String[] referenceTos = field.getReferenceTo();
                    if (referenceTos != null && referenceTos[0] != null)
                    {
                        System.out.println("\t\tField references the following objects:");
                        for (int k = 0; k < referenceTos.length; k++)
                        {
                            System.out.println("\t\t\t" + referenceTos[k]);
                        }
                    }
                }
            }            
        }
      } catch(com.sforce.ws.ConnectionException ce) {
        ce.printStackTrace();  
      }
    }
}
