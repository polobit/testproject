package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Replied</code> represents replied node in workflow. It searches in
 * mailbox of given domain user email, if and only if IMAP is set with that
 * email.
 * <p>
 * Subject is optional. When subject is not given, emails are searched based on
 * email.
 * </p>
 * 
 * @author Naresh
 * 
 */
public class Replied extends TaskletAdapter
{

    /**
     * Domain User Id
     */
    public static String MAILBOX = "mailbox";

    /**
     * Search Email
     */
    public static String SEARCH_FROM_EMAIL = "search_from_email";

    /**
     * Email Subject to search. It can be substring or full
     */
    public static String SEARCH_SUBJECT = "search_subject";

    /**
     * If replied then Yes
     */
    public static String BRANCH_YES = "Yes";

    /**
     * If not replied then No
     */
    public static String BRANCH_NO = "No";

    /**
     * Fetches IMAP emails based on given params.
     * 
     * @param campaignJSON
     *            - campaign json
     * @param subscriberJSON
     *            - subsriber json
     * @param data
     *            - workflow data
     * @param nodeJSON
     *            - Node json
     **/
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {

	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);
	return;

	// // Gets parameters
	// String ownerId = getStringValue(nodeJSON, subscriberJSON, data,
	// MAILBOX);
	// String searchEmailSubject = getStringValue(nodeJSON, subscriberJSON,
	// data, SEARCH_SUBJECT);
	// String searchFromEmail = getStringValue(nodeJSON, subscriberJSON,
	// data, SEARCH_FROM_EMAIL);
	//
	// try
	// {
	// // Fetch IMAP Prefs of selected user
	// AgileUser agileUser =
	// AgileUser.getCurrentAgileUserFromDomainUser(Long.parseLong(ownerId));
	// JSONArray emails = ContactEmailUtil.getIMAPEmails(agileUser,
	// searchFromEmail, searchEmailSubject);
	//
	// // If null or empty
	// if (emails == null || emails.length() == 0)
	// {
	// String message = (emails == null) ?
	// "Please set <a href=\"#email\">Email preferences</a> to the given mailbox in your account."
	// : "No reply to the E-mail";
	//
	// // Creates log for replied
	// LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON),
	// AgileTaskletUtil.getId(subscriberJSON),
	// message, LogType.REPLIED.toString());
	//
	// TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
	// nodeJSON, BRANCH_NO);
	// return;
	// }
	//
	// TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
	// nodeJSON, BRANCH_YES);
	// }
	// catch (Exception e)
	// {
	// System.err.println("Exception occured in Replied node while fetching emails..."
	// + e.getMessage());
	// TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
	// nodeJSON, BRANCH_NO);
	// }
    }
}
