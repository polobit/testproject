package com.agilecrm.sendgrid.util;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.queues.backend.ModuleUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.HttpClientUtil;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.mandrill.exception.RetryException;
import com.thirdparty.sendgrid.SendGrid;
import com.thirdparty.sendgrid.lib.SendGridException;
import com.thirdparty.sendgrid.subusers.SendGridSubUser;

/**
 * <code>SendGridUtil</code> is the utility class for bulk sending using
 * SendGrid api
 * 
 * @author Naresh
 * 
 */
public class SendGridUtil
{

    public static final String UNIQUE_ARGUMENTS = "unique_args";
    public static final String SUBSTITUTION_TAG = "sub";
    public static final String FILTERS = "filters";
    public static final String CLICKTRACK = "clicktrack";
    public static final String OPENTRACK = "opentrack";

    /**
     * Sendgrid custom substitution tags
     */
    public static final String SENDGRID_SUBJECT_LIST = "subject_list";
    public static final String SENDGRID_TO_LIST = "to_list";
    public static final String SENDGRID_TEXT_LIST = "text_list";
    public static final String SENDGRID_HTML_LIST = "html_list";
    

	/**
	 * Sendgrid whitelabel setting
	 */
	public static final String SENDGRID_DOMAIN = "domain";
	public static final String SENDGRID_SUBDOMAIN = "subdomain";
	public static final String SENDGRID_USERNAME = "username";
	public static final String SENDGRID_AUTOMATIC_SECURITY = "automatic_security";

    /**
     * Substitution tags
     * 
     */
    public enum SendGridSubVars
    {
	SUBJECT, HTML, TEXT;

	public String getString()
	{
	    return "-" + this.toString() + "-";
	}
    }

    /**
     * Sends bulk emails in one request
     * 
     * @param tasks
     */
    public static void sendSendGridMails(List<MailDeferredTask> tasks, EmailSender emailSender)
    {
	try
	{
	    MailDeferredTask firstSendGridDefferedTask = tasks.get(0);
	    
	    // SendGrid Credentials based on domain and gateway
	    JSONObject credentials = getSendGridCredentials(firstSendGridDefferedTask.domain, emailSender.emailGateway);
	    String apiUser = credentials.getString("api_user"), apiKey = credentials.getString("api_key");
	    
	    System.out.println("Domain is " + firstSendGridDefferedTask.domain + " EmailGateway " + emailSender.emailGateway + " apiUser " 
	    		+ apiUser + " ApiKey " + apiKey);
	    
	    // Email fields lists
	    JSONArray toArray = new JSONArray();
	    JSONArray subjectArray = new JSONArray();
	    JSONArray htmlArray = new JSONArray();
	    JSONArray textArray = new JSONArray();

	    // To emails separated by commas
	    String to = "";

	    // To split json
	    JSONArray tempArray = new JSONArray();

	    for (MailDeferredTask mailDeferredTask : tasks)
	    {

		// Creates log for sending email
		if (!StringUtils.isBlank(mailDeferredTask.campaignId)
			&& !StringUtils.isBlank(mailDeferredTask.subscriberId))
		{
		    if (!StringUtils.isBlank(mailDeferredTask.text))
		    {
			// Appends Agile label
			mailDeferredTask.text = StringUtils.replace(mailDeferredTask.text,
				EmailUtil.getPoweredByAgileLink("campaign", "Powered by"), "Sent using Agile");
			mailDeferredTask.text = EmailUtil.appendAgileToText(mailDeferredTask.text, "Sent using",
				emailSender.isEmailWhiteLabelEnabled());
		    }

		    // If no powered by merge field, append Agile label to
		    // html
		    if (!StringUtils.isBlank(mailDeferredTask.html)
			    && !StringUtils.contains(mailDeferredTask.html,
				    EmailUtil.getPoweredByAgileLink("campaign", "Powered by")))
			mailDeferredTask.html = EmailUtil.appendAgileToHTML(mailDeferredTask.html, "campaign",
				"Powered by", emailSender.isEmailWhiteLabelEnabled());
		}

		// If same To email or CC or BCC exists, send email without
		// merging
		if (!StringUtils.isBlank(mailDeferredTask.cc) || !StringUtils.isBlank(mailDeferredTask.bcc)
			|| isToExists(toArray, mailDeferredTask.to) || mailDeferredTask.to.contains(","))
		{
		    sendWithoutMerging(mailDeferredTask, apiUser, apiKey);
		    continue;
		}

		toArray.put(mailDeferredTask.to);

		subjectArray.put(mailDeferredTask.subject);

		htmlArray.put(MandrillUtil.getHTML(mailDeferredTask.html, mailDeferredTask.text));

		textArray.put(mailDeferredTask.text);

		// to emails separated by comma
		to += mailDeferredTask.to + ",";

		if (toArray.length() > MandrillUtil.MIN_TO_EMAILS
			&& htmlArray.toString().length() >= MandrillUtil.MAX_CONTENT_SIZE)
		{
		    tempArray.put(new JSONObject().put("to", to).put(SENDGRID_TO_LIST, toArray)
			    .put(SENDGRID_SUBJECT_LIST, subjectArray).put(SENDGRID_HTML_LIST, htmlArray)
			    .put(SENDGRID_TEXT_LIST, textArray));

		    // Reset fields
		    toArray = new JSONArray();
		    subjectArray = new JSONArray();
		    htmlArray = new JSONArray();
		    textArray = new JSONArray();
		    to = "";
		}

	    }

	    // Append those not exceeded
	    if (toArray.length() != 0)
		tempArray.put(new JSONObject().put("to", to).put(SENDGRID_TO_LIST, toArray)
			.put(SENDGRID_SUBJECT_LIST, subjectArray).put(SENDGRID_HTML_LIST, htmlArray)
			.put(SENDGRID_TEXT_LIST, textArray));

	    // Iterates over splitted json array and send batch of emails
	    for (int i = 0, len = tempArray.length(); i < len; i++)
	    {
		String postData = SendGrid.getSendGridQueryString(apiUser, apiKey, firstSendGridDefferedTask.fromEmail,
			firstSendGridDefferedTask.fromName, tempArray.getJSONObject(i).getString("to"), null, null,
			SendGridSubVars.SUBJECT.getString(), firstSendGridDefferedTask.replyTo,
			SendGridSubVars.HTML.getString(), SendGridSubVars.TEXT.getString(),
			getSMTPJSON(tempArray.getJSONObject(i), firstSendGridDefferedTask).toString());

//			System.out.println("POST Data in SendGridUtil \n" + postData);
		
			try
			{
				boolean retry = false;
				int count = 0, maxRetries = 2;
				String response = null;
				
				// Retry 
				do{
					try
					{
						response = HttpClientUtil.accessPostURLUsingHttpClient(SendGrid.SENDGRID_API_POST_URL,
					"application/x-www-form-urlencoded", postData);
					
						// If response consists of 'Bad Username', throws Retry exception
		        		if(StringUtils.contains(apiUser, SendGridSubUser.AGILE_SUB_USER_NAME_TOKEN) && StringUtils.containsIgnoreCase(response, "Bad username"))
						{
		        			// Update password and retry again
		        			SendGridSubUser.updateSendGridSubUserPassword(firstSendGridDefferedTask.domain);
		        			
		        			// Sample email after password update
		        			SendGrid.sendMail(apiUser, apiKey, "alert@agilecrm.com", "Agile CRM Alert", "naresh@agilecrm.com", 
		        					null, null, "SubUser Password is updated in " + NamespaceManager.get(), null, null, "Sample Email after password update. \n Username: " + apiUser 
		        					+ "\n Pwd: " + apiKey+ "\n Application id: " + VersioningUtil.getApplicationAPPId() 
		        					+ " \n Module: " + ModuleUtil.getCurrentModuleName(), null);
		        			
		        			retry = true;
						}
		        		else
		        			retry = false;
		        			
					}
					catch (SendGridException e) // To handle new sub user
					{
						System.err.println("SendGrid exception occured " + e.getMessage());
						break;
					}
					
					count++;
					
				}while(retry && count < maxRetries);
        			
				if(StringUtils.contains(apiUser, SendGridSubUser.AGILE_SUB_USER_NAME_TOKEN) && StringUtils.containsIgnoreCase(response, "Bad username"))
					throw new RetryException(response);
				
			}
			catch(RetryException rex)
			{
				System.out.println("Creating SubUser..." + apiUser);
				
				// Create SubUser
				SendGridUtil.createSendGridSubUser(StringUtils.remove(apiUser, SendGridSubUser.AGILE_SUB_USER_NAME_TOKEN));
	        	
				System.out.println("Retrying again after creating subuser in bulk emails....");
				
				Thread.sleep(3000); // Wait for 3 secs after creating subuser to fix emails drop
				
				String res = HttpClientUtil.accessPostURLUsingHttpClient(SendGrid.SENDGRID_API_POST_URL,
						"application/x-www-form-urlencoded", postData);
				
				System.out.println("Response after second attempt in bulk emails..." + res);
			}
	    }

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending ..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Returns constructed SMTP JSON
     * 
     * @param json
     * @param i
     * @return
     * @throws JSONException
     */
    private static JSONObject getSMTPJSON(JSONObject json, MailDeferredTask deferredtask) throws JSONException
    {
	JSONObject SMTPJSON = new JSONObject();

	SMTPJSON.put(SendGrid.SENDGRID_API_PARAM_TO, json.getJSONArray(SENDGRID_TO_LIST));

	SMTPJSON.put(
		UNIQUE_ARGUMENTS,
		new JSONObject().put("domain", deferredtask.domain).put("subject", deferredtask.subject)
			.put("campaign_id", deferredtask.campaignId));
	SMTPJSON.put(
		SUBSTITUTION_TAG,
		new JSONObject().put(SendGridSubVars.SUBJECT.getString(), json.getJSONArray(SENDGRID_SUBJECT_LIST))
			.put(SendGridSubVars.HTML.getString(), json.getJSONArray(SENDGRID_HTML_LIST))
			.put(SendGridSubVars.TEXT.getString(), json.getJSONArray(SENDGRID_TEXT_LIST)));
	
	SMTPJSON.put(FILTERS, getFilterJSON());
	
	return SMTPJSON;
    }
    
    public static JSONObject getFilterJSON()
    {
    	JSONObject filterJSON = new JSONObject();
    	try
		{
			filterJSON.put(CLICKTRACK, getSettingsJSON(0));
			filterJSON.put(OPENTRACK, getSettingsJSON(0));
		}
		catch (JSONException e)
		{
			System.err.println("Exception occured in filter settings JSON..." + e.getMessage());
			e.printStackTrace();
		}
    	return filterJSON;
    }
    
    private static JSONObject getSettingsJSON(int enable)
    {
    	JSONObject settingsJSON = new JSONObject();
    	
    	try
		{
			settingsJSON.put("settings", new JSONObject().put("enable", enable));
		}
		catch (JSONException e)
		{
			System.err.println("Exception occured in settings JSON..." + e.getMessage());
			e.printStackTrace();
		};
		
		return settingsJSON;
    			
    }

    /**
     * Sends email normally
     * 
     * @param sendGridDeferred
     */
    public static void sendWithoutMerging(MailDeferredTask sendGridDeferred, String apiUser, String apiKey)
    {

    	// Send Unique arguments in SMTP Header JSON
    	JSONObject SMTPJSON = new JSONObject();
    	
    	try
		{
			SMTPJSON.put(
					UNIQUE_ARGUMENTS,
					new JSONObject().put("domain", sendGridDeferred.domain).put("subject", sendGridDeferred.subject)
						.put("campaign_id", sendGridDeferred.campaignId));
			SMTPJSON.put(FILTERS, getFilterJSON());
			
			SendGrid.sendMail(apiUser, apiKey, sendGridDeferred.fromEmail, sendGridDeferred.fromName, sendGridDeferred.to, sendGridDeferred.cc, sendGridDeferred.bcc, 
	    			sendGridDeferred.subject, sendGridDeferred.replyTo, sendGridDeferred.html, sendGridDeferred.text, SMTPJSON.toString(), null, null, new String[]{});
		}
		catch (JSONException e)
		{
			e.printStackTrace();
			System.err.println("Exception occured while building SMTP JSON..." + e.getMessage());
		}
    	catch(Exception ex)
    	{
    		System.err.println("Exception occured while sending emails without merging...");
    		System.out.println(ExceptionUtils.getFullStackTrace(ex));
    	}
    	
    	
    }

    /**
     * Verifies whether To email exists in list. When multiple send email nodes
     * exists in a workflow, emails need to be send immediately.
     * 
     * @param toList
     *            - To emails list
     * @param toEmail
     *            - email to compare
     * @return boolean
     */
    public static boolean isToExists(JSONArray toArray, String toEmail)
    {
	try
	{
	    for (int i = toArray.length() - 1; i >= 0; i--)
	    {
		if (StringUtils.contains(toEmail, toArray.getString(i)))
		    return true;
	    }
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while comparing To..." + e.getMessage());
	    e.printStackTrace();
	}

	return false;
    }
    
    public static void createSendGridSubUser(String domain) throws IllegalArgumentException, Exception
    {
    	if(StringUtils.isBlank(domain))
    		return;
    	
    	DomainUser user = DomainUserUtil.getDomainOwner(domain);
    	
    	createSendGridSubUser(user);
    }
    
    public static void createSendGridSubUser(DomainUser user) throws IllegalArgumentException, Exception
    {
    	try
		{
    		if(user == null)
    			throw new IllegalArgumentException("DomainUser is null, can't create SubUser in SendGrid");
    		
    		SendGridSubUser sendgrid = new SendGridSubUser(Globals.SENDGRID_API_USER_NAME, Globals.SENDGRID_API_KEY);
        	
        	SendGridSubUser.SubUser subUser = new SendGridSubUser.SubUser();
        	subUser.setEmail(user.email);
        	subUser.setName(SendGridSubUser.getAgileSubUserName(user.domain));
        	subUser.setPassword(SendGridSubUser.getAgileSubUserPwd(user.domain));
        	
        	System.out.println("SubUser is " + subUser.toString());
			String response = sendgrid.createSubUser(subUser);
			
			System.out.println("Response for subuser creation - " + response);
			
			// Adds Webhook Handler and Agile WhiteLabel
			if(!StringUtils.containsIgnoreCase(response, "errors"))
			{
				sendgrid.addWebhookURL(subUser);
				sendgrid.associateAgileWhiteLabel(subUser);
			}
			
		}
		catch (UnsupportedEncodingException e)
		{
			System.err.println("Unsupported encoding exception..." + e.getMessage());
			e.printStackTrace();
		}
    }
    
    private static JSONObject getSendGridCredentials(String agileDomain, EmailGateway emailGateway)
    {
    	String apiUser = null, apiKey = null;
    	
    	// If no gateway configured
    	if(emailGateway == null)
    	{
    		apiUser = (StringUtils.isBlank(agileDomain)) ? Globals.SENDGRID_API_USER_NAME : SendGridSubUser.getAgileSubUserName(agileDomain);
    		apiKey = (StringUtils.isBlank(agileDomain)) ? Globals.SENDGRID_API_KEY : SendGridSubUser.getAgileSubUserPwd(agileDomain);
		}
    	else
    	{
    		apiUser = emailGateway.api_user;
    		apiKey = emailGateway.api_key;
    	}
    	
    	JSONObject credentials = new JSONObject();
    	
    	try
		{
			credentials.put("api_user", apiUser);
			credentials.put("api_key", apiKey);
		}
		catch (JSONException e)
		{
			e.printStackTrace();
		}
    	
    	return credentials;
	    
    } 
    

	
	/**
	 * 
	 * @param emailDomain
	 * @param gateway
	 * @param domain
	 * @return
	 */
	public static String addSendgridWhiteLabelDomain(String emailDomain, EmailGateway gateway, String domain){
		String response=null;
		
		//if (StringUtils.isBlank(domain))
		//	return null;
		
		String username = null, password = null;
		
		if (gateway != null)
		{
			username = gateway.api_user;
			password = gateway.api_key;
		}
		
		if(username == null || password == null)
		{
			username = Globals.SENDGRID_API_USER_NAME;
			password = Globals.SENDGRID_API_KEY;
		}
		
		response=createSendgridWhiteLabelDomain(emailDomain, username, password, domain);
		
		try
		{
			JSONObject data=new JSONObject(response);
			response=data.getJSONObject("dns").toString();
		}
		catch (JSONException e)
		{
			System.out.println("Error occured while getting sendgrid whitelabel key json"+e.getMessage());
		}
		return response;
	}
	
	
	/**
	 * This method will create sendgrid whitelabel json 
	 * 
	 * @param emailDomain
	 * @param gateway
	 * @return whitelabel string json
	 */
	public static String createSendgridWhiteLabelDomain(String emailDomain, String username, String password, String domain){
		
		
		String subuserName=SendGridSubUser.getAgileSubUserName(domain);
		String response = null, url = "https://api.sendgrid.com/v3/whitelabel/domains";
		
		response=getSendgridWhiteLabelDomain(emailDomain, username, password, domain);
		
		if(response.contains("id"))
			return response;
		
		JSONObject data=new JSONObject();
		try {
				data.put(SENDGRID_DOMAIN, emailDomain);
				data.put(SENDGRID_SUBDOMAIN, "email");
				data.put(SENDGRID_USERNAME, subuserName);
				data.put(SENDGRID_AUTOMATIC_SECURITY,false);
					try
					{
						response = HTTPUtil.accessURLUsingAuthentication(url, username, password,
								"POST", data.toString(), false, "application/json", "application/json");
						return response;
					} 
					catch (Exception e) {						
						System.out.println("Error occured while creating sendgrid whitelabel "+e.getMessage());
					}
				} 
		catch (JSONException e) {
			System.out.println("Error occured while creating sendgrid whitelabel "+e.getMessage());
		}
		return null;
	}
	
	/**
	 * 
	 * @param emailDomain
	 * @param username
	 * @param password
	 * @param domain
	 * @return whitlabel json
	 */
public static String getSendgridWhiteLabelDomain(String emailDomain, String username, String password, String domain)
{
	String response = null, queryString="?domain="+emailDomain, url = "https://api.sendgrid.com/v3/whitelabel/domains";
	try
	 {
	   response = HTTPUtil.accessURLUsingAuthentication(url+queryString, username, password,"GET", null, false, "application/json", "application/json");
	   if(response.contains("id"))
	        response=new JSONArray(response).getJSONObject(0).toString();
	   return response;
	 } 
	catch (Exception e)
	{						
		System.out.println("Error occured while getting sendgrid whitelabel "+e.getMessage());
	}
		return null;
}

public static String validateSendgridWhiteLabelDomain(String emailDomain, EmailGateway gateway, String domain){
	String whitelabelDomainId=null, response=null;
	
	if (StringUtils.isBlank(domain))
		return null;
	
	String username = null, password = null;
	
	if (gateway != null)
	{
		username = gateway.api_user;
		password = gateway.api_key;
	}
	
	if(username == null || password == null)
	{
		username = Globals.SENDGRID_API_USER_NAME;
		password = Globals.SENDGRID_API_KEY;
	}
	
	response=getSendgridWhiteLabelDomain(emailDomain, username, password, domain);
	try
	   {
				if(response.contains("id")){
				     JSONObject data=new JSONObject(response);
				     whitelabelDomainId=data.getString("id");  
				  }
        } 
	catch (Exception e)
	{						
		System.out.println("Error occured while getting sendgrid whitelabel "+e.getMessage());
	}
	
		if(whitelabelDomainId==null)
		    return null;
		
		String url="https://api.sendgrid.com/v3/whitelabel/domains/"+whitelabelDomainId+"/validate";
		
		try {
			response=HTTPUtil.accessURLUsingAuthentication(url, username, password,"POST", null, false, "application/json", "application/json");
		} 
		catch (Exception e) {
			System.out.println("Error occured while validating sendgrid whitelabel "+e.getMessage());
		}
		
		
		try
		{
			if(response.contains("validation_results")){
			   JSONObject validate=new JSONObject(response);
			   response=validate.getJSONObject("validation_results").toString();
			}
		}
		catch (JSONException e) 
		{
			System.out.println("Error occured while gettingvalidate result of sendgrid whitelabel "+e.getMessage());
		}
		
		return response;
	
}
	
	public static void main(String asd[]){
		MailDeferredTask mt = new MailDeferredTask(null, null, null, "naresh", "naresh@agilecrm.com", "Naresh", "naresh@faxdesk.com", null, null, "Hello", null, "<b>Hello</b>", null, null, "333", "222");
		
		List<MailDeferredTask> lt = new ArrayList<MailDeferredTask>();
		lt.add(mt);
		
		sendSendGridMails(lt, null);
	}
    
}