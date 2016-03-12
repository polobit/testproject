package com.campaignio.tasklets.agile;

import java.util.Map;

import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.access.util.UserAccessControlUtil.CRUDOperation;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>AddDeal</code> represents Add Deal node of campaigns. Deal can be added
 * through campaigns with campaign subscriber as related contact.
 * 
 * @author Naresh
 * 
 */
public class AddDeal extends TaskletAdapter
{

	/**
	 * Deal Name
	 */
	public static String DEAL_NAME = "deal_name";

	/**
	 * Expected Value of a deal.
	 */
	public static String EXPECTED_VALUE = "expected_value";

	/**
	 * Deal Probability
	 */
	public static String PROBABILITY = "probability";

	/**
	 * Deal description
	 */
	public static String DESCRIPTION = "description";

	/**
	 * Milestone of a deal
	 */
	public static String MILESTONE = "milestone";

	/**
	 * Expected days to close a deal. The value is added to current time before
	 * converting to epoch time.
	 */
	public static String DAYS_TO_CLOSE = "days_to_close";

	/**
	 * Deal Owner Id.
	 */
	public static String OWNER_ID = "owner_id";

	/**
	 * Deal source
	 */
	public static String SOURCE_ID = "deal_source_id";

	/**
	 * Saves deal and add log
	 * 
	 * @param campaignJSON
	 *            - complete workflow json
	 * @param subscriberJSON
	 *            - contact json
	 * @param data
	 *            - intermittent data json within workflow
	 * @param nodeJSON
	 *            - current node json i.e, Add Deal json
	 **/
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		/** Reads each value of Add Deal **/
		String dealName = getStringValue(nodeJSON, subscriberJSON, data, DEAL_NAME);
		String expectedValue = getStringValue(nodeJSON, subscriberJSON, data, EXPECTED_VALUE);
		String probability = getStringValue(nodeJSON, subscriberJSON, data, PROBABILITY);
		String description = getStringValue(nodeJSON, subscriberJSON, data, DESCRIPTION);
		String milestone = getStringValue(nodeJSON, subscriberJSON, data, MILESTONE);
		String daysToClose = getStringValue(nodeJSON, subscriberJSON, data, DAYS_TO_CLOSE);
		String givenOwnerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);
		String source_id = getStringValue(nodeJSON, subscriberJSON, data, SOURCE_ID);

		// Add given days value to calendar instance before getting required
		// epoch time
		Long epochTime = AgileTaskletUtil.getDateInEpoch(daysToClose);

		Long deal_sorce_id = null;
		try
		{
			deal_sorce_id = Long.parseLong(source_id);
		}
		catch (Exception e)
		{
			deal_sorce_id = null;
		}

		// Contact Id
		String contactId = AgileTaskletUtil.getId(subscriberJSON);

		try
		{
			// Contact ownerId.
			Long contactOwnerId = ContactUtil.getContactOwnerId(Long.parseLong(contactId));

			Map<String, String> milestoneDetails = AgileTaskletUtil.getTrackDetails(milestone);

			try
			{
				milestone = milestoneDetails.get("milestone");

				// Add Deal with given values
				addDeal(dealName, expectedValue, probability, description, milestone,
						Long.parseLong(milestoneDetails.get("pipelineID")), epochTime, contactId,
						AgileTaskletUtil.getOwnerId(givenOwnerId, contactOwnerId), deal_sorce_id);

				// Add log
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Deal Title: " + dealName + "<br/> Value: " + expectedValue + "<br/> Milestone: " + milestone
								+ " (" + probability + "%)", LogType.ADD_DEAL.toString());
			}
			catch (NumberFormatException ne)
			{
				System.out.println("Number format exception in add deals: " + ne.getMessage());
			}
			catch (Exception e)
			{
				System.out.println(" Exception in AddDeal run: " + e.getMessage());
			}
		}

		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured in AddDeal " + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	}

	/**
	 * Saves deal with the given parameters
	 * 
	 * @param name
	 *            - name of deal
	 * @param value
	 *            - value of deal
	 * @param probability
	 *            - probability of deal
	 * @param milestone
	 *            - milestone of deal
	 * @param closedEpochTime
	 *            - Number of days are converted to epoch time.
	 * @param contactId
	 *            - Subscriber contact id.
	 * @param ownerId
	 *            - Selected owner id
	 */

	private void addDeal(String name, String value, String probability, String description, String milestone,
			Long pipelineID, Long closedEpochTime, String contactId, Long ownerId, Long source_id)
	{
		Opportunity opportunity = new Opportunity(name, description, Double.parseDouble(value), milestone,
				Integer.parseInt(probability), null, ownerId == null ? null : ownerId.toString());
		opportunity.addContactIds(contactId);
		opportunity.pipeline_id = pipelineID;
		opportunity.close_date = closedEpochTime;
		opportunity.deal_source_id = source_id;
		System.out.println("addDeal------------Checking ACLs for creating deal");
		UserAccessControlUtil.check(Opportunity.class.getSimpleName(), opportunity, CRUDOperation.CREATE, true);
		opportunity.save();
	}
}