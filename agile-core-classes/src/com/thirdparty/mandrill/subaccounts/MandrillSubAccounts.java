package com.thirdparty.mandrill.subaccounts;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.Globals;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.mandrill.Mandrill;
import com.thirdparty.mandrill.exception.RetryException;
import com.thirdparty.mandrill.subaccounts.util.deferred.SubaccountCheckDeferredTask;

/**
 * <code>MandrillSubAccounts</code> handles subaccounts of Mandrill API. Each
 * AgileCRM domain name is set as different Mandrill subaccount.
 * 
 * <p>
 * Subaccounts are an additional way for users who send on behalf of AgileCRM,
 * with subaccounts we can separate reputation, activity, reports, and quotas
 * for different types of senders in a single Mandrill account.
 * </p>
 * 
 * @author Naresh
 * 
 */
public class MandrillSubAccounts
{
    /**
     * Mandrill API Subaccount call to add subaccounts through API.
     */
    public static final String MANDRILL_API_SUBACCOUNT_ADD_CALL = "subaccounts/add.json";

    /**
     * Mandrill API Subaccount call to get subaccount info through API
     */
    public static final String MANDRILL_API_SUBACCOUNT_INFO_CALL = "subaccounts/info.json";

    /**
     * Mandrill API Subaccount call to pause subaccount from sending emails
     */
    public static final String MANDRILL_API_SUBACCOUNT_PAUSE_CALL = "subaccounts/pause.json";

    /**
     * Update Subaccount
     */
    public static final String MANDRILL_API_SUBACCOUNT_UPDATE_CALL = "subaccounts/update.json";
    
    /**
     * Mandrill API Subaccount call to pause subaccount from sending emails
     */
    public static final String MANDRILL_API_SUBACCOUNT_RESUME_CALL = "/subaccounts/resume.json";

    /**
     * Mandrill subaccount key which is embedded in message json. It is used to
     * send subaccount id in message json while sending email.
     */
    public static final String MANDRILL_SUBACCOUNT = "subaccount";

    /**
     * Subaccount id which is AgileCRM domain
     */
    public static final String MANDRILL_SUBACCOUNT_ID = "id";

    /**
     * Optional Subaccount name
     */
    public static final String MANDRILL_SUBACCOUNT_NAME = "name";

    /**
     * Optional Subaccount description
     */
    public static final String MANDRILL_SUBACCOUNT_NOTES = "notes";

    /**
     * Optional manual hourly quota for the subaccount. If not specified, the
     * hourly quota will be managed based on reputation
     */
    public static final String MANDRILL_SUBACCOUNT_CUSTOM_QUOTA = "custom_quota";

    /**
     * Tag to be added in 'Our' domain to admins of subaccount paused
     */
    public static final String MANDRILL_SUBACCOUNT_PAUSED_TAG = "Email Pause";

    /**
     * Custom value saved in notes
     */
    public static String CUSTOM_NOTES_PAUSED_ON = "paused_on";

    /**
     * Creates new Mandrill SubAccount through API. Subaccount ids should be
     * unique.
     * 
     * @param subaccountId
     *            - subaccount id which is AgileCRM domain.
     */
    public static void createMandrillSubAccount(String subaccountId, String apiKey)
    {
	System.out.println("Creating new subaccount id " + subaccountId);

	// If empty use Agile Mandrill key
	if (StringUtils.isBlank(apiKey))
	    apiKey = Globals.MANDRIL_API_KEY_VALUE;

	JSONObject subaccount = new JSONObject();

	try
	{
	    subaccount.put(Mandrill.MANDRILL_API_KEY, apiKey);
	    subaccount.put(MANDRILL_SUBACCOUNT_ID, subaccountId);
	    subaccount.put(MANDRILL_SUBACCOUNT_NAME, subaccountId);

	    String response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL
		    + MANDRILL_API_SUBACCOUNT_ADD_CALL, subaccount.toString());
	    System.out.println("Response for creating subaccount: " + response);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * Updates Subaccount in Mandrill
     * 
     * @param subaccountId
     *            - subaccount id
     * @param apiKey
     *            - Mandrill account api key
     * @param notes
     *            - notes
     */
    public static String updateMandrillSubAccount(String subaccountId, String apiKey, String notes)
    {
	System.out.println("Updating subaccount id " + subaccountId);

	// If empty use Agile Mandrill key
	if (StringUtils.isBlank(apiKey))
	    apiKey = Globals.MANDRIL_API_KEY_VALUE;

	JSONObject subaccount = new JSONObject();

	try
	{
	    subaccount.put(Mandrill.MANDRILL_API_KEY, apiKey);
	    subaccount.put(MANDRILL_SUBACCOUNT_ID, subaccountId);
	    subaccount.put(MANDRILL_SUBACCOUNT_NAME, subaccountId);
	    
	    if(StringUtils.isNotBlank(notes))
	    subaccount.put(MANDRILL_SUBACCOUNT_NOTES, notes);

	    String response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL
		    + MANDRILL_API_SUBACCOUNT_UPDATE_CALL, subaccount.toString());

	    System.out.println("Response for updating subaccount: " + response);
	    
	    return response;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while updating subaccount..." + e.getMessage());
	    return e.getMessage();
	}

    }

    /**
     * Returns subaccount info json from Mandrill. The info json consists of
     * last 30 days email-send activity stats including hard bounces, soft
     * bounces etc.
     * 
     * @param subaccountId
     *            - subaccount id which is agilecrm domain
     * @return String of subaccount info
     */
    public static String getSubAccountInfo(String subaccountId, String apiKey)
    {
	return accessMandrillAPI(subaccountId, apiKey, MANDRILL_API_SUBACCOUNT_INFO_CALL);
    }

    /**
     * Checks reputation of subaccount in Mandrill
     * 
     * @param subaccountId
     *            - subaccount id
     */
    public static void checkReputation(String subaccountId)
    {
	String info = getSubAccountInfo(subaccountId, null);
	int MAX_REPUTATION_LIMIT = 10;
	
	try
	{
	    JSONObject infoJSON = new JSONObject(info);

	    if (infoJSON.has("reputation"))
	    {
		int reputation = infoJSON.getInt("reputation");

		System.out.println("Reputation of subaccount " + subaccountId + " is " + reputation);

		// If less than 10 pause subaccount
		if (reputation > 1 && reputation < MAX_REPUTATION_LIMIT && doPausedTimeLimitExceeded(infoJSON))
		{
		    pauseSubaccount(subaccountId, null);

		    // Add tag in our domain
		    BillingRestrictionReminderUtil.addRestictionTagsInOurDomain(MANDRILL_SUBACCOUNT_PAUSED_TAG);
		}
	    }
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    /**
     * Pauses Mandrill subaccount
     * 
     * @param subaccountId - subaccount id
     * @param apiKey - Mandrill account apikey
     */
    public static void pauseSubaccount(String subaccountId, String apiKey)
    {
	accessMandrillAPI(subaccountId, apiKey, MANDRILL_API_SUBACCOUNT_PAUSE_CALL);
    }
    
    public static void resumeSubaccount(String subaccountId)
    {
    	resumeSubaccount(subaccountId, null);
    	Set<String> tags = new HashSet<String>();
    	tags.add(MANDRILL_SUBACCOUNT_PAUSED_TAG);
    	BillingRestrictionReminderUtil.removeRestictionTagsInOurDomain(subaccountId, tags);
    }
    public static void resumeSubaccount(String subaccountId, String apiKey)
    {
	accessMandrillAPI(subaccountId, apiKey, MANDRILL_API_SUBACCOUNT_RESUME_CALL);
    }

    /**
     * Access Mandrill with given subaccount, api key and subaccount calls
     * 
     * @param subaccountId
     *            - Subaccount Id
     * @param apiKey
     *            - Mandrill api key
     * @return String
     */
    private static String accessMandrillAPI(String subaccountId, String apiKey, String callURL)
    {
	JSONObject info = new JSONObject();

	// If api is null or blank, use Agile key
	if (StringUtils.isBlank(apiKey))
	    apiKey = Globals.MANDRIL_API_KEY_VALUE;

	try
	{
	    info.put(Mandrill.MANDRILL_API_KEY, apiKey);
	    info.put(MANDRILL_SUBACCOUNT_ID, subaccountId);

	    // Request for subaccount json.
	    String response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL + callURL, info.toString());

	    return response;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in accessMandrillAPI... " + e.getMessage());
	    return null;
	}
    }

    /**
     * Checks last paused time and pause subaccount again if exceeded
     * 
     * @param infoJSON - subaccount info 
     * @return boolean
     */
    public static boolean doPausedTimeLimitExceeded(JSONObject infoJSON)
    {
	int DAYS_LIMIT = 30;

	try
	{
	    
	    // if already paused, return false
	    if(infoJSON.has("status") && StringUtils.equals(infoJSON.getString("status"), "paused"))
		return false;
		
	    
	    // Check for notes key
	    if (!infoJSON.has(MANDRILL_SUBACCOUNT_NOTES))
		return false;

	    String notes = infoJSON.getString(MANDRILL_SUBACCOUNT_NOTES);

	    // First time, notes will be emtpy
	    if (StringUtils.isBlank(notes))
	    {
		addSubaccountNotes(infoJSON);
		return true;
	    }

	    JSONObject notesJSON = new JSONObject(notes);

	    // If paused_on key doesn't exist, add
	    if (!notesJSON.has(CUSTOM_NOTES_PAUSED_ON))
	    {
		addSubaccountNotes(infoJSON);
		return true;
	    }

	    String pausedOn = notesJSON.getString(CUSTOM_NOTES_PAUSED_ON);

	    SimpleDateFormat myFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss zz");
	    Date pausedOnDate = myFormat.parse(pausedOn);

	    // Current Date
	    Date currentDate = new Date(System.currentTimeMillis());

	    long diffDays = (currentDate.getTime() - pausedOnDate.getTime()) / (24 * 60 * 60 * 1000);

	    // Days limit reached, pause subaccount again
	    if (diffDays >= DAYS_LIMIT)
	    {
		// Update paused time
		addSubaccountNotes(infoJSON);
		return true;
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while calculating paused days limit..." + e.getMessage());
	}

	return false;

    }

    /**
     * Add notes to Mandrill subaccount
     * 
     * @param subaccountJSON - subaccount info json
     * @throws JSONException
     */
    public static void addSubaccountNotes(JSONObject subaccountJSON) throws JSONException
    {

	JSONObject notesJSON = new JSONObject();
	
	SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss zz");
	Date currentDate = new Date(System.currentTimeMillis());

	try
	{
	    notesJSON.put(CUSTOM_NOTES_PAUSED_ON, dateFormat.format(currentDate));
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	updateMandrillSubAccount(subaccountJSON.getString(MANDRILL_SUBACCOUNT_ID), null, notesJSON.toString());
    }

	/**
	 * Verifies whether subaccount exists, if not creates
	 * 
	 * @param subaccountId
	 * @param apiKey
	 */
	public static void checkSubAccountExists(String subaccountId, String apiKey){
		
		if(StringUtils.isBlank(subaccountId) || StringUtils.isBlank(apiKey))
			return;
		
		// To get the response
		String response = updateMandrillSubAccount(subaccountId, apiKey, "");
		
		 if (StringUtils.contains(response, "Unknown_Subaccount"))
		 {
			try 
			{
				// throw retry exception and create new subaccount
				throw new RetryException("Unknown Mandrill Subaccount");
			} 
			catch (RetryException e) {
				
				 // Creates new subaccount
			    createMandrillSubAccount(subaccountId, apiKey);
			}
		 }
	}
	
	/**
	 * Creates subaccount in Agile Mandrill account.
	 * 
	 * @param subaccount
	 */
	public static void createSubAccountInAgileMandrill(String subaccount)
	{
		
		if(StringUtils.isBlank(subaccount))
			return;
		
		String[] apiKeys = { Globals.MANDRIL_API_KEY_VALUE, Globals.MANDRILL_API_KEY_VALUE_2 };
		
		Queue queue = QueueFactory.getQueue(AgileQueues.ACCOUNT_STATS_UPDATE_QUEUE);
				
		// Creates subaccount in both accounts
		for(int i = 0; i < apiKeys.length; i++)
		{
			SubaccountCheckDeferredTask task = new SubaccountCheckDeferredTask(apiKeys[i], subaccount);
			queue.add(TaskOptions.Builder.withPayload(task));
		}
		
	}

}
