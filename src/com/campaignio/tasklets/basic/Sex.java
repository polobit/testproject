package com.campaignio.tasklets.basic;

import org.json.JSONObject;

import com.campaignio.logger.Log;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;
import com.thirdparty.Rapleaf;

public class Sex extends TaskletAdapter
{
    // Fields
    public static String EMAIL = "email";
    public static String DURATION_TYPE = "duration_type";

    // Branches - Male, Female, Unknown
    public static String BRANCH_MALE = "Male";
    public static String BRANCH_FEMALE = "Female";
    public static String BRANCH_UNKNOWN = "Unknown";

    // Run
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
		Log.addLog(campaignJSON, subscriberJSON, "Rapleaf "
			+ rapleafJSON);
		data.put(Rapleaf.RAPLEAF, rapleafJSON);
	    }
	    else
		Log.addLog(campaignJSON, subscriberJSON,
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
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, branch);

    }

}
