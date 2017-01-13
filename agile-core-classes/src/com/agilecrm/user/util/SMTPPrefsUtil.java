package com.agilecrm.user.util;

import java.io.IOException;
import java.util.List;
import java.util.Properties;

import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.email.util.ContactSMTPUtil;
import com.agilecrm.core.api.prefs.SMTPAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.thirdparty.gmail.GMail;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.SMTPBulkEmailUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.sun.mail.smtp.SMTPTransport;

/**
 * <code>SMTPPrefsUtil</code> is the utility class for SMTPPrefs. It fetches
 * SMTPPrefs with respect to AgileUser and SMTPPrefs id.It handles some of the
 * REST calls of {@link SMTPAPI}.
 * 
 * @author Manohar
 * 
 */
public class SMTPPrefsUtil {
	
	//private static final String SMTP_URL = "http://localhost:8081/agile-smtp/smtpMailSender";
	private static final String SMTP_URL = "http://54.234.153.217:80/agile-smtp/smtpMailSender";		// SMTP server
	
	/**
	 * SMTPPrefs Dao
	 */
	private static ObjectifyGenericDao<SMTPPrefs> dao = new ObjectifyGenericDao<SMTPPrefs>(
			SMTPPrefs.class);


	private final static String TRUE = "true";
	private final static String FALSE = "false";
	/**
	 * Returns SMTPPrefs with respect to agileuser.
	 * 
	 * @param user
	 *            - AgileUser object.
	 * @return SMTPPrefs of respective agileuser.
	 */
	public static List<SMTPPrefs> getSMTPPrefsList(AgileUser user) {
		System.out.println("Retrieving Userid " + user.id);
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

		System.out.println("Count " + ofy.query(SMTPPrefs.class).ancestor(agileUserKey).count());
		return ofy.query(SMTPPrefs.class).ancestor(agileUserKey).list();
	}
	
	/**
	 * get SMTP prefs based on the Agileuser and fromemail
	 * @param user
	 * @param fromEmail
	 * @return
	 */
	public static SMTPPrefs getPrefs(AgileUser user, String fromEmail) {
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);
		return ofy.query(SMTPPrefs.class).ancestor(agileUserKey).filter("user_name", fromEmail).get();
	}

	/**
	 * Returns SMTPPrefs with respect to id and agileuser, otherwise null for
	 * exception.
	 * 
	 * @param id
	 *            - SMTPPrefs Id.
	 * @param user
	 *            - AgileUser object.
	 * @return SMTPPrefs.
	 */
	public static SMTPPrefs getSMTPPrefs(Long id, Key<AgileUser> user) {
		try {
			return dao.get(new Key<SMTPPrefs>(user, SMTPPrefs.class, id));
		} catch(EntityNotFoundException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Throws exception if the prefs are invalid.
	 * 
	 * @param id
	 *            - SMTPPrefs prefs
	 */
	public static void checkSMTPPrefs(SMTPPrefs prefs) throws Exception {
		String errorMsg = "Error saving: [ALERT] Your account is not enabled for SMTP use. "
				+ "Please enable your email settings. (Failure) \n";

		String data = ContactSMTPUtil.getSMTPURLForPrefs(prefs, "noreply@agilecrm.com", "0", "1");
		System.err.println("+++ SMTP URL +++ " + SMTP_URL+"?"+data);
		
		String resp = HTTPUtil.accessURLUsingPost(SMTP_URL, data);
		System.err.println("+++ SMTP response +++ " + resp);
		
		String[] smtpResponse = null;
		
		if(StringUtils.isBlank(resp)) 
			throw new Exception(errorMsg);
		else 
			smtpResponse = resp.split(" ");
			
		if(smtpResponse != null && smtpResponse.length > 0) {
			if(!"CONNECTED".equalsIgnoreCase(smtpResponse[0])) {
				if(resp.contains("FAILEDCONN")) {
					errorMsg = StringUtils.replaceEach(resp.substring(0, resp.indexOf("FAILEDCONN")), 
							new String[]{"421", "450", "451", "452", "454", "501", "502", "503", 
									"504", "530", "534", "535", "550", "552", "553", "554", "555",
									"4.4.5", "4.7.0", "4.2.1", "4.3.0", "4.4.2", "4.5.0", "4.5.3", 
									"4.7.0", "5.1.1", "5.1.2", "5.2.1", "5.2.2", "5.2.3", "5.4.5",  
									"5.5.1", "5.5.2", "5.5.4", "5.6.0", "5.7.0", "5.7.4", "5.7.8", "5.7.14"}, 
							new String[]{"", "", "", "", "", "", "", "", 
									"", "", "", "", "", "", "", "", "",
									"", "", "", "", "", "", "", 
									"", "", "", "", "", "", "", 
									"", "", "", "", "", "", "", ""});
				}
				throw new Exception(errorMsg);
			}
		}
	}

	/**
	 * This method will send campaign or bulk email through Gmail Auth.
	 * 
	 * @param domain
     *            - Domain name
     * @param campaignId
     *            - Campaign Id
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param cc
     *            - cc
     * @param bcc
     *            - bcc
     * @param subject
     *            - subject
     * @param replyTo
     *            - reply to
     * @param html
     *            - html body
     * @param text
     *            - text body
	 * @param gcredential
	 * 
	 * @throws MessagingException
	 * 
	 * @throws IOException
	 * 
	 * @throws Exception
	 */
	public static boolean sendEmailBySMTPAPI(String domain, String campaignId, String fromName, String from, String to, String cc, String bcc, String subject,	String replyTo, String html, String text,	SMTPTransport smtpTransport){
		
	try{
		MimeMessage mimeMessage = GMail.createMimeMessageForBulk(domain, campaignId, to, cc, bcc, from, fromName, subject, text, html, replyTo);	
		
		if(mimeMessage == null)
			return false;
		
		smtpTransport.sendMessage(mimeMessage, mimeMessage.getRecipients(RecipientType.TO));
		String response = smtpTransport.getLastServerResponse();
		
		System.out.println("SMTP Bulk Email Response : " + response);
		
		if(smtpTransport.getLastReturnCode() >= 200 && smtpTransport.getLastReturnCode() < 400)
		 return true;
	 }
	 catch(Exception e){
		 System.out.println("Exception occured while sending bulk email via Gmail auth : " + e.getMessage());
		 return false;
	 }
	   return false;
	}
	
	/**
	 * This method will build and return SMTP TRansport object
	 * 
	 * @param smtpPrefs
	 * 
	 * @return SMTPTransport
	 */
	public static SMTPTransport buildSMTPTransportObject(SMTPPrefs smtpPrefs){
		
		String host = smtpPrefs.server_host;
		boolean ssl = smtpPrefs.is_secure;
		
	  try{	
		 if(host.equals("smtp.live.com") || host.equals("smtp.office365.com"))
	        	ssl = false;
	       
	        String port = (Boolean.valueOf(ssl)) ? "465" : "587";
	        Properties properties = setSMTPProperties(host, ssl, port);
	        
			Session session = Session.getInstance(properties);
			
			SMTPTransport smtpTransport = new SMTPTransport(session, null);
			
			smtpTransport.connect(host, Integer.valueOf(port), smtpPrefs.user_name, smtpPrefs.password);
			
			return smtpTransport;
		}
	  catch(Exception e){
		  System.out.println("Exception occurred while buildinng SMTP Transport object : " + e.getMessage());
		  return null;
	  }
	}

	/**
	 * Returns SMTPPrefs object related to email address
	 * 
	 * @param Email
	 *            - String
	 *            
	 * @return SMTPPrefs.
	 */
	public static SMTPPrefs getPrefs(String fromEmail) {
		try
		{
			return dao.getByProperty("user_name", fromEmail);
		}
		catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * This method will set max limit of SMTP preference in Memcache
	 * 
	 * @param fromEmail
	 * 				- String
	 * @param domain
	 * 				-  String
	 * @return max email count
	 * 				- long
	 */
	private static long setSMTPPrefsMaxLimit(String fromEmail, String domain)
	{
		SMTPPrefs smtpPrefs = getPrefs(fromEmail);
		
		if(smtpPrefs != null){
			CacheUtil.setCache(domain + SMTPBulkEmailUtil.SMTP_PREFS_MEMCACHE_KEY + EmailUtil.getEmail(fromEmail) , smtpPrefs.max_email_limit, SMTPBulkEmailUtil.SMTP_EMAIL_LIMIT_TIME);
			return smtpPrefs.max_email_limit;
		}
		return 0;
	}
	
	/**
	 * This method will set max limit of SMTP preference in Memcache
	 * 
	 * @param fromEmail
	 * 				- String
	 * @param domain
	 * 				-  String
	 * @return max email count
	 * 				- long
	 * 
	 */
	public static long getSMTPPrefsEmailsLimit(String fromEmail, String domain)
	{
		Object maxEmailLimit = CacheUtil.getCache(domain + SMTPBulkEmailUtil.SMTP_PREFS_MEMCACHE_KEY + EmailUtil.getEmail(fromEmail));
		if(maxEmailLimit == null)
			return setSMTPPrefsMaxLimit(fromEmail, domain);
		
		return (long)maxEmailLimit;
	}
	
	/**
	 * This method will decrease email limit of SMTp preference in Memcache
	 * 
	 * @param fromEmail
	 * 				- String
	 * @param domain
	 * 				-  String
	 * @return max email count
	 * 				- long
	 * 
	 */
	public static void decreaseGmailSendPrefsEmailsLimit(String fromEmail, String domain, long count)
	{
		SMTPBulkEmailUtil.updateCacheLimit(domain + SMTPBulkEmailUtil.SMTP_PREFS_MEMCACHE_KEY + EmailUtil.getEmail(fromEmail) , count);
		
     }
	
	/**
	 * Separately configure SMTP Properties for SSL enabled/SSL disabled (TLS)
	 * 
	 * @param host
	 * @param ssl
	 * @param port
	 * 
	 * @return Properties
	 */
	private static Properties setSMTPProperties(String host, boolean ssl, String port) {
		Properties properties = System.getProperties();
        if(ssl) {
        	properties.put("mail.smtps.host", host);
        	properties.put("mail.smtps.port", port);
        	properties.put("mail.smtps.auth", TRUE);
        	properties.setProperty("mail.smtp.ssl.enable", TRUE);
        	properties.setProperty("mail.transport.protocol", "smtps");
        } 
        else {
        	properties.put("mail.smtp.host", host);
            properties.put("mail.smtp.port", port);
            properties.setProperty("mail.smtp.starttls.enable", TRUE);
            properties.setProperty("mail.smtp.starttls.required", TRUE);
            properties.setProperty("mail.smtp.ssl.enable", FALSE);
        	properties.setProperty("mail.transport.protocol", "smtp");
        }
		return properties;
	}

}
