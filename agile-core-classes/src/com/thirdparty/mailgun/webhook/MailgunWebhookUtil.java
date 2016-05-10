package com.thirdparty.mailgun.webhook;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URI;

import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.VersioningUtil;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;
import com.sun.jersey.core.util.MultivaluedMapImpl;
import com.thirdparty.mailgun.MailgunNew;
import com.thirdparty.mailgun.util.MailgunUtil;

/**
 * <code>MailgunWebhookUtil</code> is the utility class for Mandrill Webhook to
 * add new webhook or fetching available webhooks through api
 * 
 * @author Prashannjeet
 * 
 */

public class MailgunWebhookUtil {
	
	public static final String AGILE_MAILGUN_WEBHOOK_URL = "https://prashannjeet.agilecrm.com/backend/mailgunwebhook";

	public static final String KEY = "api";
	public static final String ID = "id";
	public static final String URL = "url";
	public static final String DESCRIPTION = "description";
	public static final String EVENTS = "events";
	
	public static final String MAILGUN_WEBHOOK_BASE_URl="https://api.mailgun.net/v3/domains/";
	
	/**
	 * Add hard bounce webhook to Mailgun account
	 * 
	 * @param apiKey
	 *            - Mailgun  API Key
	 * @param domainName
	 * 			  - Mailgun domain/sub domain name
	 */
	public static String addWebhook(String apiKey, String domainName)
	{
		// If API key is empty return
		if (StringUtils.isBlank(apiKey))
			 return "API Key is empty.";
			
		// If Domain Name is empty return
		if (StringUtils.isBlank(apiKey))
			return "Domain Name is empty.";
		
		// If exists already return
		if (isWebhookAlreadyExists(apiKey, domainName))
			return "Agile Mailgun Webhook already exists for given api key or  " + apiKey;
	
		try
		{
		   Client client = new Client();
	       client.addFilter(new HTTPBasicAuthFilter(KEY,apiKey));
	       WebResource webResource = client.resource(MAILGUN_WEBHOOK_BASE_URl + domainName+ "/webhooks");

		   MultivaluedMapImpl formData = new MultivaluedMapImpl();
	       formData.add("id", "bounce");
	       formData.add("url", AGILE_MAILGUN_WEBHOOK_URL);
	       return webResource.type(MediaType.APPLICATION_FORM_URLENCODED). post(ClientResponse.class, formData).toString();
		}
		catch (Exception e)
		{
			System.err.println("Exception occured while adding mailgun Agile webhook..." + e.getMessage());
			e.printStackTrace();
			return null;
		}
		
	}
	
	/**
	 * Delete webhooks from Mailgun account
	 * 
	 * @param apiKey
	 *            - Mailgun  API Key
	 * @param domainName
	 * 			  - Mailgun domain/sub domain name
	 */
	public static String deleteWebhook(String apiKey, String domainName)
	{
		// If API key is empty return
		if (StringUtils.isBlank(apiKey))
			 return "API Key is empty.";
			
		// If Domain Name is empty return
		if (StringUtils.isBlank(apiKey))
			return "Domain Name is empty.";
		
		// If exists 
		if (isWebhookAlreadyExists(apiKey, domainName))
		{
			try
			{
			   Client client = new Client();
		       client.addFilter(new HTTPBasicAuthFilter(KEY,apiKey));
		       WebResource webResourceBounce = client.resource(MAILGUN_WEBHOOK_BASE_URl + domainName+ "/webhooks/bounce");
		       WebResource webResourceDrop = client.resource(MAILGUN_WEBHOOK_BASE_URl+ domainName+ "/webhooks/drop");
		       WebResource webResourceSpam = client.resource(MAILGUN_WEBHOOK_BASE_URl + domainName+ "/webhooks/spam");
		       
		        webResourceBounce.delete(ClientResponse.class);
		        webResourceDrop.delete(ClientResponse.class);
		        webResourceSpam.delete(ClientResponse.class);
		        
		        return "Mailgun Webhooks URl Deleted Successfully..";
			}
			catch (Exception e)
			{
				System.err.println("Exception occured while adding mailgun Agile webhook..." + e.getMessage());
				e.printStackTrace();
				return null;
			}
	    }
		return null;
		
	}
	
	/**
	 * Verifies whether Agile Mailgun webhook exists for given Mailgun api
	 * account
	 * 
	 * @param apiKey
	 *            - Mailgun apiKey
	 * @param domainName         
	 *            -Mailgun Domain name
	 * @return boolean
	 */
	public static boolean isWebhookAlreadyExists(String apiKey, String domainName)
	{
		// If Agile webhooks doesn't exists
		if (getAgileWebhook(apiKey, domainName) == null)
			return false;

		return true;
	}
	
	/**
	 * Returns Agile webhook JSONObject
	 * 
	 * @param apiKey
	 *            - Mailgun api key
	 * @param domainName
	 *            - Mailgun Domain Name
	 * @return JSONObject
	 */
	private static JSONObject getAgileWebhook(String apiKey, String domainName)
	{
		// Fetch all webhooks
		JSONObject webhooks = getAllWebhooks(apiKey, domainName);
			System.out.println(webhooks.toString());
		try
		{    
			if(webhooks.has("webhooks"))
			{  
				if(webhooks.getJSONObject("webhooks").getJSONObject("bounce").getString("url").equals(AGILE_MAILGUN_WEBHOOK_URL))
					 return webhooks;
				else if(webhooks.getJSONObject("webhooks").getJSONObject("drop").getString("url").equals(AGILE_MAILGUN_WEBHOOK_URL))
					 return webhooks;
				else if(webhooks.getJSONObject("webhooks").getJSONObject("spam").getString("url").equals(AGILE_MAILGUN_WEBHOOK_URL))
					 return webhooks;
			}
		}
		catch (Exception e)
		{
			System.err.println("Exception occured while checking Agile webhook..." + e.getMessage());
			e.printStackTrace();
			return null;
		}

		return null;
	}

	/**
	 * Returns all available webhooks for given Mailgun api key account
	 * 
	 * @param apiKey
	 *            - Mailgun api key
	 *            -Mailgun Domain Name
	 * @return String
	 */
	public static JSONObject getAllWebhooks(String apiKey, String domainName)
	{
		JSONObject response = null;

		try
		{
			   Client client = new Client();
		       client.addFilter(new HTTPBasicAuthFilter(KEY,apiKey));
		       WebResource webResource = client.resource("https://api.mailgun.net/v3/domains/" + domainName+ "/webhooks");
		       
		       //Getting all webhooks from Mailgun in Json Format
		       ClientResponse clientResponse=webResource.get(ClientResponse.class);
		       InputStream inputSrem = clientResponse.getEntityInputStream();
			    
			    BufferedReader streamReader = new BufferedReader(new InputStreamReader(inputSrem, "UTF-8"));
			    StringBuilder responseStrBuilder = new StringBuilder();
			    
			    String inputStr;
			    while ((inputStr = streamReader.readLine()) != null)
			           responseStrBuilder.append(inputStr);

			     JSONObject jsonObject = new JSONObject(responseStrBuilder.toString());
		      
			     return jsonObject;
		}
		catch (Exception e)
		{
			System.err.println("Exception occured while fetching all webhooks from Mailgun..." + e.getMessage());
			e.printStackTrace();
		}

		return response;
	}
	
	public static void main(String asd[]) throws IOException, JSONException
	{
	  System.out.println(MailgunUtil.checkMailgunAutorization("key-ca81c2c2b8f1ee11722c082c6f7fb287", "sandboxc187f63f5f25412fbd8e5c1d757431b3.mailgun.org"));
		//java.net.URL rul=new java.net.URL("https://api.mailgun.net/v3/sandboxc187f63f5f25412fbd8e5c1d757431b3.mailgun.org/log");
		//System.out.println(MailgunUtil.checkMailgunAutorization("key-ca81c2c2b8f1ee11722c082c6f7fb28", "sandboxc187f63f5f25412fbd8e5c1d757431b3.mailgun.org"));
	}
	

}
