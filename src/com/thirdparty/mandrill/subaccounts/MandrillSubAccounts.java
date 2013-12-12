package com.thirdparty.mandrill.subaccounts;

import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.util.HTTPUtil;
import com.thirdparty.mandrill.Mandrill;

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
     * Creates new Mandrill SubAccount through API. Subaccount ids should be
     * unique.
     * 
     * @param subaccountId
     *            - subaccount id which is AgileCRM domain.
     */
    public static void createMandrillSubAccount(String subaccountId)
    {
	System.out.println("Creating new subaccount id " + subaccountId);

	JSONObject subaccount = new JSONObject();

	try
	{
	    subaccount.put(Mandrill.MANDRILL_API_KEY, Globals.MANDRIL_API_KEY_VALUE);
	    subaccount.put(MANDRILL_SUBACCOUNT_ID, subaccountId);
	    subaccount.put(MANDRILL_SUBACCOUNT_NAME, subaccountId);

	    String response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL + MANDRILL_API_SUBACCOUNT_ADD_CALL, subaccount.toString());
	    System.out.println("Response for creating subaccount: " + response);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
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
    public static String getSubAccountInfo(String subaccountId)
    {
	JSONObject info = new JSONObject();

	try
	{
	    info.put(Mandrill.MANDRILL_API_KEY, Globals.MANDRIL_API_KEY_VALUE);
	    info.put(MANDRILL_SUBACCOUNT_ID, subaccountId);

	    // Request for subaccount json.
	    String response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL + MANDRILL_API_SUBACCOUNT_INFO_CALL, info.toString());

	    return response;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in getSubAccountInfo... " + e.getMessage());
	    return null;
	}
    }
}
