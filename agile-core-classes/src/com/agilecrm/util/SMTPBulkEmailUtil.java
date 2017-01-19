package com.agilecrm.util;

import java.util.ArrayList;
import java.util.List;

import javax.mail.Address;
import javax.mail.Message.RecipientType;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.thirdparty.gmail.GMail;
import com.agilecrm.user.GmailSendPrefs;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.user.util.GmailSendPrefsUtil;
import com.agilecrm.user.util.SMTPPrefsUtil;
import com.google.api.client.auth.oauth2.Credential;
import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.sun.mail.smtp.SMTPTransport;

/**
 * <code>SMTPBulkEmailUtil</code> is the utility class for SMTPSendPrefs and GmailSendPrefs
 * for count, max limit, send bulk email
 * 
 * @author Prashannjeet
 * 
 */

public class SMTPBulkEmailUtil {
	
	/**
	 * This enum for pref type
	 */
	 public enum PrefsType{
		SMTP, GMAIL
	}
	 
	 /**
	  * Memcache key for Gmail preference count
	  */
	 public static String GPREFS_COUNT_MEMCACHE_KEY = "_g_c";
	 
	 /**
	  * Memcache key for SMTP preference count
	  */
	 public static String SPREFS_COUNT_MEMCACHE_KEY = "_s_c";
	 
	 /**
	  * Memcache key for Gmail preference bulk email
	  */
	 public static String GPREFS_BULK_MEMCACHE_KEY = "_g";
	 
	 /**
	  * Memcache key for SMTP preference bulk email
	  */
	 public static String SPREFS_BULK_MEMCACHE_KEY = "_s";
	 
	 /**
	  * SMTP Domain header name 
	  */
	 public static String SMTP_DOMAIN_NAME_HEADER = "X-Agile-Domain";
	 
	 /**
	  * SMTP Campaign id header name 
	  */
	 public static String SMTP_CAMPAIGN_ID_HEADER = "X-Agile-Campaign";
	 
	 /**
	  * Memcache per day Email limit expire time in millisecond
	  */
	 public static final int SMTP_EMAIL_LIMIT_TIME = 60*60*1000;
	 
	 /**
	  * SMTP email sent log type
	  */
	 private static final String SMTP_EMAIL_SENT_LOG = "_SMTP_";
	 
	 /**
	  * GMAIL email sent log type
	  */
	 private static final String GMAIL_EMAIL_SENT_LOG = "_GMAIL_";
	
	/**
	 * This method will return max limit of GmailPrefs or SMTPPrefs from  Memcache
	 * 
	 * @param fromEmail
	 * 				- String
	 * @param domain
	 * 				-  String
	 * @return max email count
	 * 				- long
	 * 
	 */
	public static long getSMTPEmailsLimit(String fromEmail, PrefsType prefsType)
	{
	try
		 {
			if(prefsType.equals(PrefsType.GMAIL))
				return GmailSendPrefsUtil.getGmailSendPrefsEmailsLimit(fromEmail);
			
			if(prefsType.equals(PrefsType.SMTP))
				return SMTPPrefsUtil.getSMTPPrefsEmailsLimit(fromEmail);
		 }
		 catch(Exception e){
			 e.printStackTrace();
			 return 0;
		 }
		return 0;
	}
	
	/**
	 * This method will decrease email limit of GmailPrefs or SMTPPrefs from  Memcache
	 * 
	 * @param fromEmail
	 * 				- String
	 * @param domain
	 * 				-  String
	 * @return max email count
	 * 				- long
	 * 
	 */
	public static void decreaseSMTPEmailsLimit(String fromEmail, long count, PrefsType prefsType)
	{

		if(prefsType.equals(PrefsType.GMAIL))
			GmailSendPrefsUtil.decreaseGmailSendPrefsEmailsLimit(fromEmail, count);
		else
			SMTPPrefsUtil.decreaseGmailSendPrefsEmailsLimit(fromEmail, count);
		
	}
	
	/**
	 * This method will used for sending bulk email through SMTP
	 * 
	 * @param tasks
	 * 
	 * @param emailSender
	 */
	public static List<MailDeferredTask> sendSMTPBulkEmails(List<MailDeferredTask> tasks, EmailSender emailSender){
		try
		{
			MailDeferredTask mailDeferredTask = tasks.get(0);
			String fromEmail = mailDeferredTask.fromEmail;
			String domain = mailDeferredTask.domain;
			
			System.out.println("sendSMTPBulkEmails is calling : domain " + domain + "   Email : " + fromEmail);
			
			//Send email through GmailPrefs
			GmailSendPrefs gmailSendPrefs= GmailSendPrefsUtil.getPrefs(fromEmail);
			
			if(gmailSendPrefs != null)
			{
				long emailLimits = getSMTPEmailsLimit(fromEmail, PrefsType.GMAIL);	
				if(emailLimits>0)
					return sendGmailPrefsBulkEmail(tasks, gmailSendPrefs, emailLimits, emailSender);
			}	
			else
			{
				SMTPPrefs smtpSendPrefs= SMTPPrefsUtil.getPrefs(fromEmail);
				if(smtpSendPrefs != null)
				{
					long emailLimits = getSMTPEmailsLimit(fromEmail, PrefsType.SMTP);
					if(emailLimits>0)
						return sendSMTPPrefsBulkEmail(tasks, smtpSendPrefs, emailLimits, emailSender);
				}	
			}
	   }
		catch(Exception e){
			System.out.println("Exception occured while calling SMTPBulk email method : " + e.getMessage());	
			return tasks;
		}
	 return tasks;
	}
	
	/** 
	 * This method will send bulk email through SMTP and it will return list of MailDeferredTask
	 * if task is remaining
	 * 
	 * @param tasks
	 * 				- List<MailDeferredTask>
	 * @param gmailSendPrefs
	 * 
	 * @param emailLimits
	 * 
	 * @param emailSender
	 * 
	 * @return List<MailDeferredTask>
	 */
	private static List<MailDeferredTask> sendSMTPPrefsBulkEmail(List<MailDeferredTask> tasks, SMTPPrefs smtpSendPrefs, long emailLimits, EmailSender emailSender) {

		List<MailDeferredTask> completedTasks = new ArrayList<MailDeferredTask>();
		try{
			  SMTPTransport smtpTransport = SMTPPrefsUtil.buildSMTPTransportObject(smtpSendPrefs);
			  
			  boolean emailCategory = EmailGatewayUtil.isEmailCategoryTransactional(emailSender);
			  
			  for(MailDeferredTask mailDeferredTask:tasks){
				  
				 if(emailLimits <= 0)
					  return tasks;
				  
				  //Append powered by and sent using Agile
				mailDeferredTask = getMailDeferredTaskWithPoweredBy(mailDeferredTask, emailSender, emailCategory);
					  
				//Sending an email
				boolean sentStatus = SMTPPrefsUtil.sendEmailBySMTPAPI(mailDeferredTask.domain, mailDeferredTask.campaignId, mailDeferredTask.fromName, smtpSendPrefs.user_name, mailDeferredTask.to,
						mailDeferredTask.cc, mailDeferredTask.bcc, mailDeferredTask.subject, mailDeferredTask.replyTo, mailDeferredTask.html, mailDeferredTask.text, smtpTransport);
				
				if(sentStatus){
					//Decreasing the count of email 
					int count = StringUtils.countMatches(mailDeferredTask.to + mailDeferredTask.cc + mailDeferredTask.bcc, "@");
					decreaseSMTPEmailsLimit(mailDeferredTask.fromEmail, count, PrefsType.SMTP);
					
					emailLimits = emailLimits - count;
					System.out.println("SMTP email count for domain : " + mailDeferredTask.domain + "  : " + emailLimits);
					//add email sent log
					completedTasks.add(addBulkSMTPEmailLogMessage(mailDeferredTask, PrefsType.SMTP));
				}
				else
					break;
			 }
			//Remove completed task
			 if(completedTasks.size() > 0)
				for(MailDeferredTask mailDeferredTask: completedTasks)
					tasks.remove(mailDeferredTask);
		}
		catch(Exception e){
			System.out.println("Exception Occured while sending bulk email through SMTPPrefs : " + smtpSendPrefs.user_name + e.getMessage());
			EmailGatewayUtil.addEmailLogs(completedTasks);
			return tasks;
		}
		//Add campaign log in sql
		EmailGatewayUtil.addEmailLogs(completedTasks);
		return tasks;
	}

	/**
	 * This method will send bulk email through Gmail auth and it will return list of MailDeferredTask
	 * if task is remaining
	 * 
	 * @param tasks
	 * 				- List<MailDeferredTask>
	 * @param gmailSendPrefs
	 * 
	 * @param emailLimits
	 * 
	 * @param emailSender
	 * 
	 * @return List<MailDeferredTask>
	 */
	private static List<MailDeferredTask> sendGmailPrefsBulkEmail(List<MailDeferredTask> tasks, GmailSendPrefs gmailSendPrefs, long emailLimits, EmailSender emailSender) {
		 
		  List<MailDeferredTask> completedTasks = new ArrayList<MailDeferredTask>();
		  
		try{
			  Credential gcredential = GmailSendPrefsUtil.getGoogleAuthCredential(gmailSendPrefs);
			  if(gcredential == null)
				  return tasks;
			  
			  boolean emailCategory = EmailGatewayUtil.isEmailCategoryTransactional(emailSender);
			 
			  for(MailDeferredTask mailDeferredTask:tasks){
				 
				  if(emailLimits <= 0)
					  return tasks;
				  
				  //Append powered by and sent using Agile
				  mailDeferredTask = getMailDeferredTaskWithPoweredBy(mailDeferredTask, emailSender, emailCategory);
					  
				boolean sentStatus = GMail.sendEmailByGmailAPI(mailDeferredTask.domain, mailDeferredTask.campaignId, gmailSendPrefs.email, gmailSendPrefs.name, mailDeferredTask.to,
						mailDeferredTask.cc, mailDeferredTask.bcc, mailDeferredTask.subject, mailDeferredTask.replyTo, mailDeferredTask.html, mailDeferredTask.text, gcredential);
				
				if(sentStatus){
					//Decreasing the count of email 
					int count = StringUtils.countMatches(mailDeferredTask.to + mailDeferredTask.cc + mailDeferredTask.bcc, "@");
					decreaseSMTPEmailsLimit(mailDeferredTask.fromEmail, count, PrefsType.GMAIL);
					
					emailLimits = emailLimits - count;
					System.out.println("GMAIL email count for domain : " + mailDeferredTask.domain + "  : " + emailLimits);
					//add email sent log
					completedTasks.add(addBulkSMTPEmailLogMessage(mailDeferredTask, PrefsType.GMAIL));
					
				}
			  }
			//Remove completed task
				if(completedTasks.size() > 0)
				  for(MailDeferredTask mailDeferredTask: completedTasks)
					tasks.remove(mailDeferredTask);
		}
		catch(Exception e){
			System.out.println("Exception Occured while sending bulk email through GmailPrefs : " + gmailSendPrefs.email + e.getMessage());
			EmailGatewayUtil.addEmailLogs(completedTasks);
			return tasks;
		}
		//Add email send log to SQL for campaign
		EmailGatewayUtil.addEmailLogs(completedTasks);
		return tasks;
	}

	/**
	 * This method will check user can send email via SMPT or not
	 * 
	 * @param task
	 *  			-MailDeferredTask
	 * @param emailSender
	 * 				-EmailSender
	 * @return boolean
	 */
	public static boolean canSMTPSendEmail(String fromEmail){
	
	boolean isBulk = false;	
 	 try
 	 {  		
 		 //Check Gmail Preference is exist or not for this email sender
 		 isBulk = GmailSendPrefsUtil.getGmailSendPrefsIsBulk(fromEmail);
 		 
		 if(isBulk && GmailSendPrefsUtil.getGmailSendPrefsEmailsLimit(fromEmail) > 0)
			 return isBulk;
			
		  //Check SMTP Preference is exist or not for this email sender
		  isBulk = SMTPPrefsUtil.getSMTPPrefsIsBulk(fromEmail);
		 
		  if(isBulk && SMTPPrefsUtil.getSMTPPrefsEmailsLimit(fromEmail) > 0)
				 return isBulk;
			
		 return false;
 	   }
 	 catch(Exception e){
 		 System.out.println("Exception occured while checking SMTP Preference is exist or not : " + e.getMessage());
 		 return false;
 	 }
	}
	
	/**
	 * This method will apend sent and powerd by in mail deferred task
	 * 
	 * @param mailDeferredTask
	 * @param emailSender
	 * @param emailCategory
	 * 
	 * @return mailDeferredTask
	 */
	private static MailDeferredTask getMailDeferredTaskWithPoweredBy(MailDeferredTask mailDeferredTask, EmailSender emailSender, boolean emailCategory ){
		
			if (!StringUtils.isBlank(mailDeferredTask.campaignId) && !StringUtils.isBlank(mailDeferredTask.subscriberId))
			{
			    if (!StringUtils.isBlank(mailDeferredTask.text))
			    {
					// Appends Agile label
					mailDeferredTask.text = StringUtils.replace(mailDeferredTask.text, EmailUtil.getPoweredByAgileLink("campaign", "Powered by", emailCategory), "Sent using Agile");
					mailDeferredTask.text = EmailUtil.appendAgileToText(mailDeferredTask.text, "Sent using", emailSender.isEmailWhiteLabelEnabled());
			    }

			    // If no powered by merge field, append Agile label to html
			    if (!StringUtils.isBlank(mailDeferredTask.html) && !StringUtils.contains(mailDeferredTask.html, EmailUtil.getPoweredByAgileLink("campaign", "Powered by", emailCategory)))
			    	mailDeferredTask.html = EmailUtil.appendAgileToHTML(mailDeferredTask.html, "campaign", "Powered by", emailSender.isEmailWhiteLabelEnabled(), emailCategory);
			}
		return mailDeferredTask;
	}
	
	/**
	 * This method will add email address with name in mimeMessage object
	 * 
	 * @param mimeMessage
	 * @param emailAddress
	 * @param type
	 * @return mimeMessage
	 */
	public static MimeMessage getEmailAddress(MimeMessage mimeMessage, String emailAddress, RecipientType type) {
		
		try{
			for(String emailString : StringUtils.split(emailAddress, ","))
			{
				String name = EmailUtil.getEmailName(emailString);
				name = StringUtils.isBlank(name) ? "" : name ;
				
				String email = EmailUtil.getEmail(emailString);
				mimeMessage.addRecipients(type, new Address[]
			    		 {
			    		    new InternetAddress(email, name, "UTF-8")
			    		});
			}
		}
		catch(Exception e){
			System.out.println("Exception occured while building email address in SMTP : " + e.getMessage());
		}
		return mimeMessage;
	}
	
    /**
     * This method will append campaign log send via
     * 
     * @param mailDeferredTask
     * 
     * @param PrefsType
     * 
     * @return MailDeferredTask
     */
	private static MailDeferredTask addBulkSMTPEmailLogMessage(	MailDeferredTask mailDeferredTask, PrefsType type) {
	     
		if(type.equals(PrefsType.GMAIL))
	    	  mailDeferredTask.to += GMAIL_EMAIL_SENT_LOG;
		else
			mailDeferredTask.to += SMTP_EMAIL_SENT_LOG;
		
		return mailDeferredTask;
	}
		
	/**
	 * This method will return sent vai for campaign log
	 * @param message
	 * @return
	 */
	 public static String getEmailSentVia(String message){
	    	if(message.contains(SMTP_EMAIL_SENT_LOG))
	    		return "SMTP";
	    	
	    	if(message.contains(GMAIL_EMAIL_SENT_LOG))
	    	   return "Gmail";
	    	
	    	return "";
	    }
	 
	 /**
		 * This method will return message of the campaign log
		 * after subtracting sent via log
		 * 
		 * @param message
		 * @returnmessage
		 */
	public static String getEmailLogMessage(String message){
		    	message = StringUtils.remove(message, SMTP_EMAIL_SENT_LOG);
		    	
		    	message = StringUtils.remove(message, GMAIL_EMAIL_SENT_LOG);
		    	
		    	return message;
	 }
	
	/**
	 * This method will set memcache based on Domain level
	 * 
	 * @param key
	 * @param value
	 * @param timeInMilliSeconds
	 */
	public static void setCache(String key, Object value, int timeInMilliSeconds)
	{
		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
		syncCache.put(key, value, Expiration.byDeltaMillis(timeInMilliSeconds));
	}
	
	/**
	 * This method will set memcache based on Domain level
	 * 
	 * @param key
	 * @param value
	 */
	public static void setCache(String key, Object value)
	{
		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
		syncCache.put(key, value);
	}

	/**
	 * This method will fetch the Memcache 
	 * 
	 * @param key
	 */
	public static Object getCache(String key) {
		
		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
		Object value = syncCache.get(key);
		
		return value;
	}
	

	/**
	 * This method will update the Memcache count
	 * 
	 * @param key
	 * 
	 * @param value
	 */
	public static void updateCacheLimit(String key, long value){

		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
		syncCache.increment(key, -value);
	}

}
