package com.thirdparty.sendgrid.webhook;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.mail.internet.MimeUtility;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.EmailUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.thirdparty.mandrill.webhook.MandrillWebhookTriggerInbound;
import com.thirdparty.mandrill.webhook.MandrillWebhookTriggerInbound.AgileDetail;

public class SendGridInboundWebhook extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = -7687844334096070601L;
	private String ENVELOPE = "envelope";
	private String FROM = "from";

	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		try
		{
			JSONObject mailJSON = getJSONFromMIME(request);
			
			if(mailJSON == null)
			{
				System.err.println("SendGrid mailjson is null");
				return;
			}
			
			
			System.out.println("MailJSON is " + mailJSON.toString());
			
			MandrillWebhookTriggerInbound mwt = new MandrillWebhookTriggerInbound();
			
			String agileEmail = getAgileEmail(mailJSON);
			String apiKey = mwt.getAgileDetail(agileEmail, AgileDetail.API_KEY);
			String agileDomain = mwt.getAgileDetail(agileEmail, AgileDetail.DOMAIN);
			
			System.out.println("Agile Email - " + agileEmail + " apiKey - " + apiKey + " agileDomain - "+ agileDomain);
			if (agileEmail == null || agileDomain == null || apiKey == null)
				return;
			
			NamespaceManager.set(agileDomain);
			
			Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
			System.out.println("owner is " + owner);
			
			if (owner == null)
				return;
			
			System.out.println("CURRENT namespace is " + NamespaceManager.get());

			if(!mailJSON.has(FROM))
				return;
			
			String from = mailJSON.getString(FROM);
			String fromEmail = EmailUtil.getEmail(from);
			String fromName = EmailUtil.getEmailName(from);
			
			JSONObject message = new JSONObject();
			
			if(message.has("subject"))
				message.put("subject", mailJSON.getString("subject"));
			
			if(message.has("text"))
				message.put("text", mailJSON.getString("text"));
			
			if(message.has("html"))
				message.put("html", mailJSON.getString("html"));
			
			if(MandrillWebhookTriggerInbound.confirmationEmails.contains(fromEmail.toLowerCase()))
			{
				mwt.sendConfirmationEmail(apiKey, message);
				return;
			}
			
			// Invokes email reply node in campaign
			mwt.parseEmailMessageAndRunCampaign(message, agileDomain);

			System.out.println("from email is " + fromEmail);
			System.out.println("from name is " + fromName);

			Boolean isNewContact = mwt.isNewContact(fromEmail);
			Contact contact = mwt.buildContact(fromName, fromEmail, isNewContact);

			if (contact == null)
			return;
			
			try
			{
				if (isNewContact)
					contact.setContactOwner(owner);
				
				contact.save();
			}
			catch (PlanRestrictedException e)
			{
				System.err.println("Contacts limits reached...." + e.getMessage());
			}
			catch (Exception e)
			{
				System.err.println("Exception occured while saving contact in SendGridInboundWebhook..." + e.getMessage());
			}
			
			// Invoke New Email Triggers
			mwt.invokeInboundTriggers(isNewContact, contact, message);
		}
		catch (Exception e)
		{
			System.err.println("Exception occured in service method..." + e.getMessage());
			e.printStackTrace();
		}
	}

	private JSONObject getJSONFromMIME(HttpServletRequest request)
	{
		JSONObject dataJSON = new JSONObject();

		ServletFileUpload upload = new ServletFileUpload();

		try
		{
			FileItemIterator iter = upload.getItemIterator(request);
			
			FileItemStream item = null;

			while (iter.hasNext())
			{
				item = iter.next();

				 String fieldName = item.getFieldName();
				 
				 System.out.println("Field name: " + item.getFieldName());
				 
				 if(fieldName != null && !StringUtils.containsIgnoreCase(fieldName, "attachment"))
				 {
					 dataJSON.put(fieldName, IOUtils.toString(item.openStream()));
				 }
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return dataJSON;
	}
	
	private String getAgileEmail(JSONObject mailJSON)
	{
		if(mailJSON == null)
			return null;
		
		JSONArray emails = new JSONArray();
		
		try
		{
			if(mailJSON.has(ENVELOPE)){
				
				JSONObject envelope = new JSONObject(mailJSON.getString(ENVELOPE));
				
				if(envelope.has("to"))
					emails = envelope.getJSONArray("to");
			}
			System.out.println("Emails: " + emails);
			
			for(int i=0; i< emails.length(); i++)
			{
				if(StringUtils.containsIgnoreCase(emails.getString(i), "@agle.cc") || StringUtils.containsIgnoreCase(emails.getString(i), "@pagenut.com"))
					return emails.getString(i);
			}
		}
		catch (JSONException e)
		{
			
			System.err.println("JSON Exception: " + e.getMessage());
			e.printStackTrace();
		}
		
		return null;
	}
}
