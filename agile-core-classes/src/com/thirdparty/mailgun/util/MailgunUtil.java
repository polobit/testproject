package com.thirdparty.mailgun.util;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.parser.ParseException;

import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.util.EmailUtil;
import com.google.appengine.api.NamespaceManager;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;
import com.sun.jersey.core.util.MultivaluedMapImpl;
import com.thirdparty.mailgun.MailgunNew;

import java.util.List;

import javax.ws.rs.core.MediaType;
/**
 * <code>MailgunUtil</code> is the utility class for fetching tasks from pull
 * queue and process them. It constructs mail json to send bulk emails with
 * Mailgun
 * 
 * @author Prashannjeet
 * 
 */
public class MailgunUtil {
	
	
	private static boolean flag=false;
	private static final String SUBACCOUNT="subaccount";
	
	/**
	 * sendMailgunMails method is used for sending bulk emails and campaign emails
	 * @param MailDeferredTask list
	 * @param emailSender
	 */
	
	public static void sendMailgunMails(List<MailDeferredTask> tasks, EmailSender emailSender)
	{
		try
		 {
			System.out.println("calling sendmailgunmails method");
			 Client client = new Client();
		     client.addFilter(new HTTPBasicAuthFilter(MailgunNew.MAILGUN_API_KEY,emailSender.emailGateway.api_key));
		       
		     WebResource webResource=client.resource(MailgunNew.MAILGUN_API_POST_URL + emailSender.emailGateway.api_user +"/messages");
		       			
		     MultivaluedMapImpl formData = new MultivaluedMapImpl();
		     
		     JSONObject mailgunMessageJSON=getMailgunMailJson(tasks, emailSender);
		     
			 formData.add(MailgunNew.MAILGUN_API_PARAM_FROM, getMailgunFromAddress(tasks) );
			 
			 formData.add(MailgunNew.MAILGUN_API_PARAM_TO,getMailgunTo(tasks));
			 
			 formData.add(MailgunNew.MAILGUN_API_PARAM_SUBJECT, "%recipient.subject%");
			 
			 formData.add(MailgunNew.MAILGUN_API_PARAM_TEXT_BODY, "%recipient.text%");
			 			 
			 if(flag)
			     formData.add(MailgunNew.MAILGUN_API_PARAM_HTML_BODY, "%recipient.html%");
			
			 String bcc=getMailgunBCCAddress(tasks);
			 if(!StringUtils.isEmpty(bcc))
		    	   formData.add(MailgunNew.MAILGUN_API_PARAM_BCC, bcc);
		       
			 String cc=getMailgunCCAddress(tasks);
		       if(!StringUtils.isEmpty(cc))
		    	   formData.add(MailgunNew.MAILGUN_API_PARAM_CC, cc);
		       
		       String replyTo=getMailgunReplyToAddress(tasks);
		       if(!StringUtils.isEmpty(replyTo))
		         formData.add(MailgunNew.MAILGUN_API_PARAM_REPLY_TO, replyTo);
		       
		       JSONObject metadata=getMetadata(tasks);
		       if(metadata !=null)
		           formData.add(MailgunNew.MAILGUN_API_PARAM_METADATA, metadata.toString());
			 
			   formData.add("recipient-variables",mailgunMessageJSON.toString());
				      // formData.add("o:testmode","true");
			 
			   
				       
		     ClientResponse response= webResource.type(MediaType.APPLICATION_FORM_URLENCODED_TYPE).
				               post(ClientResponse.class, formData);
		     System.out.println("Response is ; "+response.toString());
		 }
    	catch(Exception e)
    	{
    		e.printStackTrace();
		    System.err.println("Exception occured while sending bulk emails");
    	}
	}
	
	/**
	 * 
	 * @param MailDeferredTask
	 * @return To Address of bulk email
	 */
	private static String getMailgunTo(List<MailDeferredTask> task)
	{
		if(task.isEmpty())
			return null;
		
		String toAddress="";
		//Concating all To address
		for(MailDeferredTask mailDeferredTask : task)
		{
			toAddress +=mailDeferredTask.to+", ";
			
		}
		return toAddress;
	}
	
	/**
	 * 
	 * @param MailDeferredTask
	 * @return From email address for bulk email
	 */
	private static String getMailgunFromAddress(List<MailDeferredTask> task)
	{
		if(task.isEmpty())
			return null;
		
		MailDeferredTask message=task.get(0);
		String fromAddress=message.fromEmail;
		return fromAddress;
	}
	
	/**
	 * 
	 * @param MailDeferredTask
	 * @return CC address for bulk email
	 */
	private static String getMailgunCCAddress(List<MailDeferredTask> task)
	{
		if(task.isEmpty())
			return null;
		
		MailDeferredTask message=task.get(0);
		String fromAddress=message.cc;
		return fromAddress;
	}
	/**
	 * 
	 * @param MailDeferredTask
	 * @return BCC address for bulk email
	 */
	private static String getMailgunBCCAddress(List<MailDeferredTask> task)
	{
		if(task.isEmpty())
			return null;
		
		MailDeferredTask message=task.get(0);
		String fromAddress=message.bcc;
		return fromAddress;
	}
	
	/**
	 * 
	 * @param MailDeferredTask
	 * @return ReplyTo address for bulk email
	 */
	private static String getMailgunReplyToAddress(List<MailDeferredTask> task)
	{
		if(task.isEmpty())
			return null;
		
		MailDeferredTask message=task.get(0);
		String fromAddress=message.replyTo;
		return fromAddress;
	}
	/**
	 * 
	 * @param list of MailDeferredTask
	 * @return json object of message
	 */
	
	private static JSONObject getMailgunMailJson( List<MailDeferredTask> task, EmailSender emailSender)
	{
		if(task.isEmpty())
			return null;
		//Mailgun mail json
		JSONObject mailgunJSON=new JSONObject();
		
		//add mail data from MailDeferredTask to json
		for(MailDeferredTask mailDeferredTask :task)
		{
			if (!StringUtils.isBlank(mailDeferredTask.campaignId)
					&& !StringUtils.isBlank(mailDeferredTask.subscriberId))
				{

				    System.out.println("Namespace mail deferred task : " + mailDeferredTask.domain);

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
			
			JSONObject msgJSON=new JSONObject();
			try 
			{
				msgJSON.put(MailgunNew.MAILGUN_API_PARAM_SUBJECT, mailDeferredTask.subject);
				msgJSON.put(MailgunNew.MAILGUN_API_PARAM_TEXT_BODY, mailDeferredTask.text);
				
	            if( !StringUtils.isBlank(mailDeferredTask.html)){
	            	  msgJSON.put(MailgunNew.MAILGUN_API_PARAM_HTML_BODY, mailDeferredTask.html);
	            	  flag=true;
	            }
	            
				mailgunJSON.put(getToEmail(mailDeferredTask.to), msgJSON);
			} 
			catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				System.err.print("Error occured in getting Mailgun Message json");
			}
			
		}
		
		return mailgunJSON;
	}
	
	 /**
     * Returns to email in the form of "prashannjeet@agilecrm.com" if
     * fromName is not empty, otherwise simply returns email.
     * 
     * @param fromEmail with name
     *            - from email.
     * @return String
     */
    private static String getToEmail(String toEmail)
    {
	// if fromName is empty, simply return email
	if (StringUtils.isEmpty(toEmail) || !toEmail.contains("<"))
	    return toEmail;

	String from = StringUtils.substringBetween(toEmail, "<", ">");

	return from;
    }
    
    /**
     * @throws ParseException 
     * Returns to metadata json object with campaign id and
     * sub account name.
     * 
     * @param MailDeferredTask
     *            - 
     * @return JSON object of metadata
     * @throws  
     */
    private static JSONObject getMetadata(List <MailDeferredTask> task ) throws ParseException
    {
    	for(MailDeferredTask mailDeferredTask :task)
		{
    		try
    		{  if(mailDeferredTask.metadata==null)
    			   return null;
    			
	    		JSONObject metadata=new JSONObject(mailDeferredTask.metadata);
		    
	    		String subAccount=NamespaceManager.get();
	    		metadata.put(SUBACCOUNT, subAccount);
	    		 return metadata;
    		} 
			catch (JSONException e)
			{
				e.printStackTrace();
				System.err.print("Error occured in getting Mailgun Metadata json");
				return null;
			}
		}
	    return null;
    }
    
    public static String checkMailgunAutorization(String apiKey, String domainName)
    {
    	   Client client = new Client();
	       client.addFilter(new HTTPBasicAuthFilter(MailgunNew.MAILGUN_API_KEY,apiKey));
	       
	       WebResource webResource=client.resource("https://api.mailgun.net/v3/"+domainName+"/log");
	       
	       return webResource.get(ClientResponse.class).toString();
	    
    }
	
}
