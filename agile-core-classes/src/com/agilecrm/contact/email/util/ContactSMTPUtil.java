package com.agilecrm.contact.email.util;

import java.net.URLEncoder;
import java.util.List;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.user.util.SMTPPrefsUtil;
import com.agilecrm.util.EmailUtil;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class ContactSMTPUtil
{

    /**
     * Returns url to fetch emails from given smtp account.
     * 
     * @param searchEmail
     *            - search email-id.
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    public static String getSMTPURL(AgileUser agileUser, String searchEmail, String offset, String count)
    {
		// Get SMTP Exchange Prefs
		List<SMTPPrefs> smtpPrefs = SMTPPrefsUtil.getSMTPPrefsList(agileUser);
	
		if (smtpPrefs == null || smtpPrefs.size() <= 0)
		    return null;
	
		return ContactSMTPUtil.getSMTPURLForPrefs(smtpPrefs.get(0), searchEmail, offset, count);
    }

    /**
     * Returns url to fetch emails with respect to "fromemail" smtp account.
     * 
     * @param searchEmail
     *            - search email-id.
     * @param fromEmail
     *            - username of the smtp365 account
     * 
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    public static String getSMTPURL(String fromEmail, String searchEmail, String offset, String count)
    {
		// Get SMTP Exchange Prefs
		Objectify ofy = ObjectifyService.begin();
		SMTPPrefs smtpPrefs = ofy.query(SMTPPrefs.class).filter("user_name", fromEmail).get();
	
		if (smtpPrefs == null)
		    return null;
	
		return ContactSMTPUtil.getSMTPURLForPrefs(smtpPrefs, searchEmail, offset, count);
    }

    /**
     * Returns SMTP url
     * 
     * @param smtpPrefs
     *            - SMTPPrefs
     * @param fromEmail
     *            - email
     * @param offset
     *            - offset
     * @param count
     *            - emails count
     * @return String
     */

    public static String getSMTPURLForPrefs(SMTPPrefs smtpPrefs, String fromEmail, 
    		String offset, String count)
    {
		String userName = smtpPrefs.user_name;
		String password = smtpPrefs.password;
		String host = smtpPrefs.server_url;
		String ssl = Boolean.toString(smtpPrefs.is_secure);

		String subject = "SMTP integration with Agile CRM";
		String htmlTxt = "Congratulations... You have successfully registered your email account with SMTP integrations. "
				+ "<p>Now you can send mails from Agile CRM, as if you are sending from your actual mail account."
				+ "<p>Mails sent from Agile CRM can be seen in the Sent folder of your mail box, provided your service provider supports.";
		
		String data = null;
	
		try {
			data = "user_name=" + URLEncoder.encode(userName, "UTF-8")
				    + "&password=" + URLEncoder.encode(password, "UTF-8")
				    + "&reply_to=" + URLEncoder.encode(fromEmail, "UTF-8")
				    + "&host=" + URLEncoder.encode(host, "UTF-8")
				    + "&ssl=" + ssl
				    + "&to=" + URLEncoder.encode(userName, "UTF-8")
				    + "&cc=&bcc="
				    + "&subject=" + URLEncoder.encode(subject, "UTF-8")
				    + "&html=" + URLEncoder.encode(EmailUtil.emailTemplate(htmlTxt), "UTF-8")
				    + "&file_source=&file_stream&file_name="
				    + "&validate=true";
		}
		catch(Exception e)	{
		    System.err.println("Exception occured in getSMTPURLForPrefs " + e.getMessage());
		    e.printStackTrace();
		}
		return data;
    }

}