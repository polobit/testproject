package com.thirdparty.amazon.httpendpoint;


import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.util.EmailUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.email.webhook.util.EmailWebhookUtil;
import com.thirdparty.ses.AmazonSES;
import com.thirdparty.ses.util.AmazonSESWebhookUtil;

/**
 * <code>MandrillWebhook</code> is the webhook servlet to handle hard bounce and
 * soft bounces
 * 
 * @author prashannjeet
 * 
 */
@SuppressWarnings("serial")
public class AmazonSESWebhook extends HttpServlet
{

    public static final String TYPE = "Type";

    public static final String SUBSCRIPTION_CONFIRMATION = "SubscriptionConfirmation";
    
    public static final String HARD_BOUNCE = "Permanent";
    
    public static final String SOFT_BOUNCE = "Transient";
    
    public static final String SPAM = "complaint";

    public static final String MESSAGE = "Message";
    
    public static final String SUBSCRIPTION_URL = "SubscribeURL";
    
    public static final String SUBACCOUNT = "domain";
    
    public static final String SUBJECT = "Subject";

    public static final String NOTIFICATION = "Notification";
    
    public static final String METADATA_CAMPAIGN_ID = "campaign_id";
    
    public static final String NOTIFICATION_TYPE = "notificationType";
    
    public static final String EMAIL = "emailAddress";
    
    public static final String BOUNCE = "bounce";

    public void service(HttpServletRequest request, HttpServletResponse response)
    {
	try
	{
		JSONObject jsonData = AmazonSESWebhookUtil.readJSONDataFromRequest(request);
    	
    	//Check if JSON contains subscription URl then subscribe the webhooks endpoint
    	if(jsonData.has(TYPE))
    	{
    	  String webhookJsonType = jsonData.getString(TYPE);
    	  System.out.println("type : "+webhookJsonType);
    	  
	    	//Check if JSON contains subscription URl then subscribe the webhooks endpoint
	    	  if(webhookJsonType.equalsIgnoreCase(SUBSCRIPTION_CONFIRMATION))
	    	  {
	    		  System.out.println("subscription url : "+SUBSCRIPTION_URL);
	    		  if(jsonData.has(SUBSCRIPTION_URL))
	    			  AmazonSESWebhookUtil.subscribeAmazonSNSEndpoint(jsonData.getString(SUBSCRIPTION_URL));
	    		  return;
	    	  }
	    	  
	    	  if(webhookJsonType.equalsIgnoreCase(NOTIFICATION))
	    	  {
	    		  JSONObject webhookJSON = null;
	    		  
	    		  if(!jsonData.has(MESSAGE))
	    			  return;
	    		  
	    		  webhookJSON = new JSONObject(jsonData.getString(MESSAGE));
	    		  
	    		  String event = "";
	    		  
	    		  String email = "";
	    		  
	    		  String domainName = getStringValue(webhookJSON, AmazonSES.SUBACCOUNT_HEADER_NAME);
	    		  
	    		  String campaignId = getStringValue(webhookJSON, AmazonSES.CAMPAIGN_ID_HEADER_NAME);
	    		  
	    		  String emailSubject = getStringValue(webhookJSON, SUBJECT);
	    		  
	    		  //If metadata is empty then return
	    		  if(StringUtils.isBlank(domainName) || StringUtils.isBlank(campaignId) || StringUtils.isBlank(emailSubject))
	    			  return;
	    		  
	    		  if(webhookJSON.getString(NOTIFICATION_TYPE).equalsIgnoreCase(BOUNCE))
	    		  {
	    			  if(webhookJSON.getJSONObject(BOUNCE).getString("bounceType").equalsIgnoreCase(SOFT_BOUNCE))
	    				  event = SOFT_BOUNCE;
	    			  else
	    				  event = HARD_BOUNCE;
	    			  email = webhookJSON.getJSONObject(BOUNCE).getJSONArray("bouncedRecipients").getJSONObject(0).getString(EMAIL);
	    		  }  
	    		  else if(webhookJSON.getString(NOTIFICATION_TYPE).equalsIgnoreCase(SPAM))
	    		  {
	    			  	 event = SPAM;
	    			  	email = webhookJSON.getJSONObject(SPAM).getJSONArray("complaintRecipients").getJSONObject(0).getString(EMAIL);
	    		  }
	    		  
	    		  System.out.println("Metadata of Amazon SES : "+campaignId+"   " +domainName+"    "+event+ "   " +email);
	    		  
	    		  email = EmailUtil.getEmail(email);
	    		  EmailBounceType type=null;
	    		  if(event.equalsIgnoreCase(HARD_BOUNCE))
	    			  type=EmailBounceType.HARD_BOUNCE;
	    		  
	    		  else if(event.equalsIgnoreCase(SOFT_BOUNCE))
	    			  type = EmailBounceType.SOFT_BOUNCE;
	    		  
	    		  else if(event.equalsIgnoreCase(SPAM))
	    				  type = EmailBounceType.SPAM;
	    		  else 
	    			  return;
	    		  
	    		 //Setting namespace and updating contact and campaign log status
	    		 NamespaceManager.set(domainName);
	    		 EmailWebhookUtil.setContactEmailBounceStatus(email, emailSubject, type, campaignId);
	    	  }
    	  	
    	}

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in AmazonSES webhooks" + e.getMessage());
	    e.printStackTrace();
	}
	return;
   }

    /**
     * This method is used for get the metadata value form json object
     * @param jsonData
     * @param name
     * @return string
     */
  private static String getStringValue(JSONObject jsonData, String name)
  {  
	try 
	  {
		JSONArray jsonArray = jsonData.getJSONObject("mail").getJSONArray("headers");
		
		for(int index = 0; index < jsonArray.length(); index++)
		{
			JSONObject json=jsonArray.getJSONObject(index);
			
			if(json.getString("name").equalsIgnoreCase(name))
				return json.getString("value");
		}
	  }
	  catch (JSONException e)
	  {
		  System.err.println("Exception occured while fetching metadata AmazonSES webhooks" + e.getMessage());
		  e.printStackTrace();
	}
	  return null;
  }
    
}
