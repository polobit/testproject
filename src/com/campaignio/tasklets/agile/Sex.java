package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;
import com.thirdparty.Rapleaf;

/**
 * <code>Sex</code> represents Sex node in the workflow.�Sex� option is used to
 * retrieve the gender of contact based on the email-id of that contact.Sex
 * class uses Rapleaf to get gender from email-ids.It consists of three branches
 * such as Male,Female and Unknown. If unable to retrieve the gender from the
 * email-id that contact is taken as Unknown. This node helps to target the
 * contacts based on their gender.
 * 
 * @author Manohar
 * 
 */
public class Sex extends TaskletAdapter
{
    // Fields

    /**
     * Email Id of contact
     */
    public static String EMAIL = "email";
    // public static String DURATION_TYPE = "duration_type";

    // Branches - Male, Female, Unknown
    /**
     * Branch Male- if gender retrieved from email-id is male
     */
    public static String BRANCH_MALE = "Male";
    /**
     * Branch Female- if gender retrieved from email-id is female
     */
    public static String BRANCH_FEMALE = "Female";
    /**
     * Branch Unknown- if gender cannot be retrieved from email-id
     */
    public static String BRANCH_UNKNOWN = "Unknown";

    // Run
    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	String email = getStringValue(nodeJSON, subscriberJSON, data, EMAIL);

	// Retrieve From Rapleaf if not already done
	if (!data.has(Rapleaf.RAPLEAF))
	{
	    JSONObject rapleafJSON = Rapleaf.getRapportiveValue(email);
	    if (rapleafJSON != null)
	    {
		LogUtil.addLog(campaignJSON, subscriberJSON, "Rapleaf "
			+ rapleafJSON);
		data.put(Rapleaf.RAPLEAF, rapleafJSON);
	    }
	    else
		LogUtil.addLog(campaignJSON, subscriberJSON,
			"Could not retrieve data from Rapleaf");
	}

	//
	String branch = BRANCH_UNKNOWN;

	// Get RapLeaf
	if (data.has(Rapleaf.RAPLEAF))
	{
	    JSONObject rapLeafJSON = data.getJSONObject(Rapleaf.RAPLEAF);
	    if (rapLeafJSON.has(Rapleaf.RAPPORTIVE_RESULT)
		    && rapLeafJSON
			    .getString(Rapleaf.RAPPORTIVE_RESULT)
			    .equalsIgnoreCase(Rapleaf.RAPPORTIVE_RESULT_SUCCESS))
	    {
		String gender = rapLeafJSON
			.getString(Rapleaf.RAPPORTIVE_RESULT_GENDER);
		if (gender
			.equalsIgnoreCase(Rapleaf.RAPPORTIVE_RESULT_GENDER_FEMALE))
		    branch = BRANCH_FEMALE;

		if (gender
			.equalsIgnoreCase(Rapleaf.RAPPORTIVE_RESULT_GENDER_MALE))
		    branch = BRANCH_MALE;
	    }
	}

	// Execute Next Branch
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, branch);

    }

}
