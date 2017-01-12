package com.agilecrm.user.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.email.util.ContactSMTPUtil;
import com.agilecrm.core.api.prefs.SMTPAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>SMTPPrefsUtil</code> is the utility class for SMTPPrefs. It fetches
 * SMTPPrefs with respect to AgileUser and SMTPPrefs id.It handles some of the
 * REST calls of {@link SMTPAPI}.
 * 
 * @author Manohar
 * 
 */
public class SMTPPrefsUtil {
	
	private static final String SMTP_URL ="http://104.155.153.221:8080/agile-smtp/smtpMailSender";		//GCloud
	//private static final String SMTP_URL = "http://localhost:8081/agile-smtp/smtpMailSender";
	//private static final String SMTP_URL = "http://54.234.153.217:80/agile-smtp-beta/smtpMailSender";
	//private static final String SMTP_URL = "http://54.234.153.217:80/agile-smtp/smtpMailSender";
	
	/**
	 * SMTPPrefs Dao
	 */
	private static ObjectifyGenericDao<SMTPPrefs> dao = new ObjectifyGenericDao<SMTPPrefs>(
			SMTPPrefs.class);

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
	
}
