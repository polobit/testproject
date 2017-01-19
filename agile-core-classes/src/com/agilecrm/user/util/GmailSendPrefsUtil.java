package com.agilecrm.user.util;

import java.util.List;

import com.agilecrm.account.VerifiedEmails;
import com.agilecrm.account.util.VerifiedEmailsUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.thirdparty.gmail.GMail;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.GmailSendPrefs;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.SMTPBulkEmailUtil;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>GmailSendPrefsUtil</code> is the utility class for
 * {@link GmailSendPrefs}. It fetches GmailSendPrefs with respect to agileuser
 * and it's own id. It handles some of the REST calls of
 * {@link GmailSendPrefsAPI}.
 * 
 * @author ravitheja.
 * 
 */
public class GmailSendPrefsUtil {
	
	/**
	 * GmailSendPrefs Dao.
	 */
	private static ObjectifyGenericDao<GmailSendPrefs> dao = new ObjectifyGenericDao<GmailSendPrefs>(
			GmailSendPrefs.class);

	/**
	 * Returns GmailSendPrefs with respect to agileuser and GmailSendPrefs Type.
	 * 
	 * @param user
	 *            - AgileUser object.
	 * @param type
	 *            - GmailSendPrefs Type.
	 * @return GmailSendPrefs.
	 */
	public static List<GmailSendPrefs> getPrefsList(AgileUser user) {
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

		return ofy.query(GmailSendPrefs.class).ancestor(agileUserKey).list();
	}

	/**
	 * Returns GmailSendPrefs with respect to agileuser and GmailSendPrefs Type.
	 * 
	 * @param user
	 *            - AgileUser object.
	 * @param type
	 *            - GmailSendPrefs Type.
	 * @return GmailSendPrefs.
	 */
	public static GmailSendPrefs getPrefs(AgileUser user, String fromEmail) {
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

		return ofy.query(GmailSendPrefs.class).ancestor(agileUserKey).filter("email", fromEmail).get();
	}

	/**
	 * Returns list of GmailSendPrefs with respect to AgileUser.
	 * 
	 * @param user
	 *            - AgileUser object.
	 * @return list of GmailSendPrefs associated with AgileUser.
	 */
	public static List<GmailSendPrefs> getPrefs(AgileUser user) {
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

		return ofy.query(GmailSendPrefs.class).ancestor(agileUserKey).list();
	}

	/**
	 * Returns GmailSendPrefs with respect to it's own id, otherwise null for
	 * exception.
	 * 
	 * @param id
	 *            - GmailSendPrefs Id.
	 * @return GmailSendPrefs.
	 */
	public static GmailSendPrefs getPrefs(Long id, Key<AgileUser> user) {
		try {
			return dao.get(new Key<GmailSendPrefs>(user, GmailSendPrefs.class, id));
		} catch(EntityNotFoundException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Checks if email already authenticated to the user, if exists, deletes the old record 
	 * and saves a new record with the prefs.
	 * 
	 * @param gmailPrefs
	 */
	public static void save(GmailSendPrefs gmailPrefs) {
		List<GmailSendPrefs> prefsList = getPrefsList(AgileUser.getCurrentAgileUser());
		for(GmailSendPrefs gmailSendPrefs : prefsList) {
			if(gmailSendPrefs.email.equals(gmailPrefs.email))
				gmailSendPrefs.delete();
		}
		gmailPrefs.save();
		
		//Add email address as a verified email address
		VerifiedEmailsUtil.addVerifiedEmail(gmailPrefs.email, VerifiedEmails.Verified.YES);
	}

	/**
	 * Returns GmailSendPrefs object related to email address
	 * 
	 * @param Email
	 *            - String
	 *            
	 * @return GmailSendPrefs.
	 */
	public static GmailSendPrefs getPrefs(String fromEmail) {
		try
		{
			return dao.getByProperty("email", fromEmail);
		}
		catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * This method will set bulk email sending is true or false in memcache
	 * @param fromEmail
	 * @return boolean
	 */
	public static boolean setGmailSendPrefsIsBulk(String fromEmail, boolean isBulk)
	{
			SMTPBulkEmailUtil.setCache(EmailUtil.getEmail(fromEmail) + SMTPBulkEmailUtil.GPREFS_BULK_MEMCACHE_KEY , isBulk);
			return isBulk;
	}
	
	/**
	 * This method will fetch bulk email sending is true or false from Memcache
	 * @param fromEmail
	 * @return boolean
	 */
	public static boolean getGmailSendPrefsIsBulk(String fromEmail)
	{
		Object isBulk = SMTPBulkEmailUtil.getCache(EmailUtil.getEmail(fromEmail) + SMTPBulkEmailUtil.GPREFS_BULK_MEMCACHE_KEY);
		if(isBulk == null){
			GmailSendPrefs gmailSendPrefs = getPrefs(fromEmail);
			
			if(gmailSendPrefs != null)
			    return setGmailSendPrefsIsBulk(fromEmail ,gmailSendPrefs.bulk_email);
		   else
			   return setGmailSendPrefsIsBulk(fromEmail , false);
		}
		return (boolean)isBulk;
	}
	
	/**
	 * This method will set max limit of Gmail preference in Memcache
	 * 
	 * @param fromEmail
	 * 				- String
	 * @param domain
	 * 				-  String
	 * @return max email count
	 * 				- long
	 */
	public static long setGmailSendPrefsMaxLimit(String fromEmail)
	{
		GmailSendPrefs gmailSendPrefs = getPrefs(fromEmail);
		
		if(gmailSendPrefs != null){
			SMTPBulkEmailUtil.setCache(EmailUtil.getEmail(fromEmail) + SMTPBulkEmailUtil.GPREFS_COUNT_MEMCACHE_KEY , gmailSendPrefs.max_email_limit, SMTPBulkEmailUtil.SMTP_EMAIL_LIMIT_TIME);
			return gmailSendPrefs.max_email_limit;
		}
	 return 0;
	}
	
	/**
	 * This method will set max limit of Gmail preference in Memcache
	 * 
	 * @param fromEmail
	 * 				- String
	 * @param domain
	 * 				-  String
	 * @return max email count
	 * 				- long
	 * 
	 */
	public static long getGmailSendPrefsEmailsLimit(String fromEmail)
	{
		Object maxEmailLimit = SMTPBulkEmailUtil.getCache(EmailUtil.getEmail(fromEmail) + SMTPBulkEmailUtil.GPREFS_COUNT_MEMCACHE_KEY);
		if(maxEmailLimit == null)
			return setGmailSendPrefsMaxLimit(fromEmail);
		
		return (long)maxEmailLimit;
	}
	
	/**
	 * This method will decrease email limit of Gmail preference in Memcache
	 * 
	 * @param fromEmail
	 * 				- String
	 * @param domain
	 * 				-  String
	 * @return max email count
	 * 				- long
	 * 
	 */
	public static void decreaseGmailSendPrefsEmailsLimit(String fromEmail, long count)
	{
		SMTPBulkEmailUtil.updateCacheLimit(EmailUtil.getEmail(fromEmail) + SMTPBulkEmailUtil.GPREFS_COUNT_MEMCACHE_KEY, count);
		
	}
	
	
	public static Credential getGoogleAuthCredential(GmailSendPrefs gmailSendPrefs){
		try{
			//Get Gmail authentication credential object
			Credential gcredential = new GoogleCredential
				.Builder()
				.setTransport(GMail.HTTP_TRANSPORT)
				.setJsonFactory(GMail.JSON_FACTORY)
				.setClientSecrets(GoogleApi.SMTP_OAUTH_CLIENT_ID, GoogleApi.SMTP_OAUTH_CLIENT_SECRET)
				.build()
				.setAccessToken(gmailSendPrefs.token)
				.setRefreshToken(gmailSendPrefs.refresh_token);
			
			// Chech if gmail auth token is expired then create new one
			if(gmailSendPrefs.expires_at == null || gmailSendPrefs.expires_at < System.currentTimeMillis()) {
				gcredential.refreshToken();
				gmailSendPrefs.refresh_token = gcredential.getRefreshToken();
				gmailSendPrefs.token = gcredential.getAccessToken();
				gmailSendPrefs.expires_at = gcredential.getExpirationTimeMilliseconds();
				
				//Update gmail prefs
				gmailSendPrefs.save();
			}
			return gcredential;
	     }
		catch(Exception e){
			e.printStackTrace();
			System.out.println("Exception occured while getting google Credential : " +e.getMessage());
			return null;
		}
    }
}