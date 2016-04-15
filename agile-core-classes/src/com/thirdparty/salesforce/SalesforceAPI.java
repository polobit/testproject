package com.thirdparty.salesforce;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Iterator;

import net.sf.json.JSON;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;

import com.sforce.soap.partner.Connector;
import com.sforce.soap.partner.Error;
import com.sforce.soap.partner.PartnerConnection;
import com.sforce.soap.partner.QueryResult;
import com.sforce.soap.partner.SaveResult;
import com.sforce.soap.partner.sobject.SObject;
import com.sforce.ws.ConnectorConfig;
import com.sforce.ws.bind.XmlObject;

/**
 * <code>SalesforceAPI</code> acts as a connector to the Salesforce server.
 * 
 * <code>SalesforceAPI</code> class contains methods to get the leads from
 * Salesforce account and add note to the leads in Salesforce account as per the
 * request from the client using the credentials sent by the client.
 * 
 * @author Tejaswi
 * @since December 2012
 */
public class SalesforceAPI
{
	/**
	 * Holds an instance of PartnerConnection which connects to Salesforce
	 * server
	 */
	PartnerConnection connection;

	/**
	 * Initializes {@link SalesforceAPI} with the given credentials username,
	 * password and apiKey which thereby creates a connection to the Salesforce
	 * CRM.
	 * 
	 * @param userName
	 *            username of the agent to connect with Salesforce CRM server
	 * @param password
	 *            password of the agent to connect with Salesforce CRM server
	 * @param apiKey
	 *            apiKey of the agent to connect with Salesforce CRM server
	 * @throws Exception
	 *             if parameters are null or given credentials are wrong
	 */
	public SalesforceAPI(String userName, String password, String apiKey) throws Exception
	{

		System.out.println("slaesforce password:" + password);
		String api = password.trim() + apiKey.trim();

		PartnerConnection connection = Connector.newConnection(userName.trim(), api);
		ConnectorConfig config = connection.getConfig();

		this.connection = new PartnerConnection(config);
	}

	public JSONArray retrieveEntities(String query) throws Exception
	{

		QueryResult queryResult = connection.query(query);
		JSONArray arrayOfEntities = new JSONArray();

		if (queryResult.getSize() == 0 && queryResult.getRecords().length == 0)
			return arrayOfEntities;

		System.out.println(queryResult.getRecords().length);

		for (int i = 0; i < queryResult.getRecords().length; i++)
			arrayOfEntities.put(getJSONObjectFromSObject(queryResult.getRecords()[i]));

		return arrayOfEntities;
	}

	/**
	 * This method is used to get the details of the chat visitor from Lead or
	 * Contact based on query given
	 * 
	 * @param email
	 *            Email of the chat visitor
	 * @param query
	 *            Query given by the agent to get the details before chat
	 * @return response returned from Salesforce server
	 * @throws Exception
	 *             if parameters are null or if there is no entity found.
	 */
	public String getEntityDetails(String email, String query) throws Exception
	{

		JSONObject resultJSON = new JSONObject();

		System.out.println("in prechat query" + query);
		query = query.replace("$email", email);
		System.out.println("in prechat query" + query);
		QueryResult queryResult = connection.query(query);

		System.out.println("salesforce query result" + queryResult);
		if (queryResult.getSize() == 0)
		{
			throw new Exception("No records found for this visitor");
		}

		SObject sObject = queryResult.getRecords()[0];

		resultJSON = getJSONObjectFromSObject(sObject);

		String url = "https://ap1.salesforce.com/" + resultJSON.getString("Id");
		resultJSON.put("URL", url);

		return resultJSON.toString();
	}

	/**
	 * This method is used to add an Entity whether it is Lead,contact or others
	 * to Salesforce account of agent
	 * 
	 * @param name
	 *            Name of the chat visitor
	 * @param email
	 *            Email of the chat visitor
	 * @param query
	 *            Query given by the agent to add Entity
	 * @return response returned from Salesforce server
	 * @throws Exception
	 *             if parameters are null or if visitor already exists
	 */
	public String addEntity(String name, String email, String query) throws Exception
	{

		JSONObject queryJSON = getJSONObjectFromQuery(query);

		// Any entity will have id given by salesforce
		String searchQuery = "SELECT Id FROM " + queryJSON.getString("Type") + " WHERE Email='" + email + "'";

		QueryResult queryResult = connection.query(searchQuery);

		System.out.println("salesforce query result" + queryResult);
		if (queryResult.getSize() != 0)
		{
			throw new Exception("Visitor already exists");
		}

		queryJSON.put("LastName", name);
		queryJSON.put("Email", email);

		if (queryJSON.getString("Type").equals("Lead"))
			queryJSON.put("Company", "unknown");

		JSONObject responseJSON = insertSObect(queryJSON);

		return responseJSON.toString();
	}

	/**
	 * This method is used to add a note to any entity based on the preChat
	 * query
	 * 
	 * @param email
	 *            email of the chat visitor
	 * @param subject
	 *            subject to be added to the note
	 * @param description
	 *            description which describes the note
	 * @param query
	 *            Query to be executed at the end of chat
	 * @param preChatQuery
	 *            PreChat Query given by the agent to get the details before
	 *            chat
	 * @return String with the response in JSON format
	 * @throws Exception
	 *             if parameters are null or if there is no entity found with
	 *             the given email.
	 */
	public String addNoteToEntity(String email, String subject, String description, String query, String preChatQuery)
			throws Exception
	{

		System.out.println("note query" + query);
		JSONObject queryJSON = getJSONObjectFromQuery(query);

		preChatQuery = preChatQuery.replace("$email", email);
		String response = getEntityDetails(email, preChatQuery);

		String parentId = new JSONObject(response).getString("Id");
		queryJSON.put("ParentId", parentId);
		queryJSON.put("Title", subject);
		queryJSON.put("Body", description);

		JSONObject responseJSON = insertSObect(queryJSON);

		return responseJSON.toString();
	}

	/**
	 * This method is used to logout of the Salesforce account
	 * 
	 * @throws Exception
	 *             if Salesforce server throws an Exception
	 */
	public void logout() throws Exception
	{
		if (connection != null)
		{
			connection.logout();
			connection = null;
		}
	}

	/**
	 * This method is used to add an entity to Salesforce account
	 * 
	 * @param queryJSONObject
	 *            Takes query as JSONObject
	 * @return JSONObject with id and url of the entity
	 * @throws Exception
	 *             if Salesforce server throws an Exception
	 */
	private JSONObject insertSObect(JSONObject queryJSONObject) throws Exception
	{
		SObject sObject = new SObject();
		sObject.setType(URLDecoder.decode(queryJSONObject.getString("Type"), "UTF-8"));
		// there is no field "Type" in Entity it is just used to set type
		queryJSONObject.remove("Type");

		HashMap<String, String> params = new ObjectMapper().readValue(queryJSONObject.toString(),
				new TypeReference<HashMap<String, String>>()
				{
				});

		for (String key : params.keySet())
		{
			if (!queryJSONObject.getString(key).contains("$"))
			{
				sObject.addField(key, queryJSONObject.getString(key));
			}
			else
			{
				sObject.addField(key, "unknown");
			}
		}

		SaveResult[] saveResults = connection.create(new SObject[] { sObject });

		JSONObject responseJSON = new JSONObject();

		if (saveResults[0].isSuccess())
		{
			responseJSON.put("Id", saveResults[0].getId());
			String url = "https://ap1.salesforce.com/" + responseJSON.getString("Id");
			responseJSON.put("URL", url);
		}
		else
		{
			System.out.println("error");
			Error[] errors = saveResults[0].getErrors();
			throw new Exception(errors[0].getMessage());
		}

		return responseJSON;
	}

	/**
	 * This method is used to get JSONObject from SObject.
	 * 
	 * @param sfObject
	 *            Takes Sobject returned from salesforce
	 * @return JSONObject with the details of the entity
	 * @throws Exception
	 *             if Salesforce server throws an Exception
	 */
	private JSONObject getJSONObjectFromSObject(SObject sfObject) throws Exception
	{
		JSONObject responseJSON = new JSONObject();

		Iterator<XmlObject> fields = sfObject.getChildren();

		while (fields.hasNext())
		{
			com.sforce.ws.bind.XmlObject elem = fields.next();
			responseJSON.put(elem.getName().getLocalPart(), elem.getValue());
		}
		return responseJSON;
	}

	/**
	 * This method is used to get JSONObject from given query
	 * 
	 * @param query
	 *            Query given by the agent
	 * @return JSONObject formed out of Query
	 * @throws Exception
	 *             if the string is not in JSON format
	 */
	private JSONObject getJSONObjectFromQuery(String query) throws Exception
	{
		query = "{Type:" + query + "}";
		query = query.replaceAll("\\r\\n|\\r|\\n", ",").replaceAll("\\r\\n|\\r|\\n", ",").replaceAll(" ", "").trim();

		JSONObject queryJSON = null;

		try
		{
			System.out.println("json object" + query);
			queryJSON = new JSONObject(query);

		}
		catch (Exception e)
		{
			throw new Exception("Improper query");
		}
		return queryJSON;
	}

	public static void main(String[] args)
	{
		try
		{
			SalesforceAPI api = new SalesforceAPI("tejaswitest@gmail.com", "agile1234", "CgBv3oy3GAY7eoNNQnx7yb2e");
			String query = "SELECT OwnerId, ConvertedContactId, ConvertedAccountId, ConvertedOpportunityId, FirstName, LastName, Description, Email, Title, Phone, Website,  Rating, Street,City,State, Country, PostalCode,  Company,  LeadSource FROM Lead";
			System.out.println(api.retrieveEntities(query));
			query = "SELECT  FirstName, LastName, name, Email, Title, Description,Department,  Phone, Fax, MobilePhone, MailingCity, MailingState, MailingCountry, MailingPostalCode, MailingStreet, LeadSource FROM Contact";
			System.out.println(api.retrieveEntities(query));
			query = "SELECT Name, Website, Phone, Fax, Industry, Description, Type, NumberOfEmployees, BillingStreet, BillingCity, BillingState, BillingCountry, BillingPostalCode FROM Account";
			System.out.println(api.retrieveEntities(query));
			query = "SELECT Subject,Status, Description, ContactId FROM Case";
			System.out.println(api.retrieveEntities(query));
			query = "SELECT AccountId, Name, Description, ExpectedRevenue, Probability,  IsDeleted, IsWon, IsClosed, CloseDate FROM Opportunity";
			System.out.println(api.retrieveEntities(query));

		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
