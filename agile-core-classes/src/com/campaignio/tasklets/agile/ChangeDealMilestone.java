package com.campaignio.tasklets.agile;

import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.campaignio.logger.Log;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

public class ChangeDealMilestone extends TaskletAdapter {
	/**
	 * Current milestone
	 */
	public static String CURRENT_MILESTONE = "current_milestone";

	/**
	 * Any milestone
	 */
	public static String ANY_MILESTONE = "any_milestone";

	/**
	 * Milestone to be converted
	 */
	public static String NEW_MILESTONE = "new_milestone";

	/**
	 * Owner Id
	 */
	public static String OWNER_ID = "owner_id";

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
			JSONObject data, JSONObject nodeJSON) throws Exception {
		String fromMilestone = getStringValue(nodeJSON, subscriberJSON, data,
				CURRENT_MILESTONE);
		String toMilestone = getStringValue(nodeJSON, subscriberJSON, data,
				NEW_MILESTONE);
		String givenOwnerId = getStringValue(nodeJSON, subscriberJSON, data,
				OWNER_ID);

		try {
			String contactId = AgileTaskletUtil.getId(subscriberJSON);

			// Get milestone and pipeline IDs of the given milestone
			// (default_LongID)
			Map<String, String> toMilestoneDetails = AgileTaskletUtil
					.getTrackDetails(toMilestone);
			Map<String, String> fromMilestoneDetails = AgileTaskletUtil
					.getTrackDetails(fromMilestone);

			// Get Contact Owner Id.
			Long contactOwnerId = ContactUtil.getContactOwnerId(Long
					.parseLong(contactId));

			LogUtil.addLogToSQL(
					AgileTaskletUtil.getId(campaignJSON),
					AgileTaskletUtil.getId(subscriberJSON),
					"Changed Deal's milestone from "
							+ (fromMilestone.equals(ANY_MILESTONE) ? "Any"
									: fromMilestoneDetails.get("milestone"))
							+ " to " + toMilestoneDetails.get("milestone"),
					Log.LogType.CHANGED_DEAL_MILESTONE.toString());

			if (fromMilestone.equals(ANY_MILESTONE)) {
				fromMilestoneDetails.put("milestone", null);
				fromMilestoneDetails.put("pipelineID", null);
			}
			// Change milestone with given values
			changeMilestoneToRelatedDeals(contactId, fromMilestoneDetails,
					toMilestoneDetails,
					AgileTaskletUtil.getOwnerId(givenOwnerId, contactOwnerId));
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("Exception occured while changing milestone..."
					+ e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
				nodeJSON, null);
	}

	/**
	 * Changes contact deal milestone based on given parameters
	 * 
	 * @param contactId
	 *            - campaign subscriber id
	 * @param fromMilestoneDetails
	 *            - current milestone
	 * @param toMilestoneDetails
	 *            - new milestone
	 * @param ownerId
	 *            - Owner id
	 */
	private void changeMilestoneToRelatedDeals(String contactId,
			Map<String, String> fromMilestoneDetails,
			Map<String, String> toMilestoneDetails, Long ownerId) {
		// Get list of opportunities
		List<Opportunity> deals = OpportunityUtil.getOpportunitiesByFilter(
				ownerId == null ? null : ownerId.toString(),
				fromMilestoneDetails.get("milestone"),
				contactId,
				null,
				0,
				null,
				fromMilestoneDetails.get("pipelineID") == null ? null : Long
						.parseLong(fromMilestoneDetails.get("pipelineID")));

		System.out.println("Deals size id " + deals.size());

		for (Opportunity opportunity : deals) {
			opportunity.pipeline_id = Long.parseLong(toMilestoneDetails
					.get("pipelineID"));
			opportunity.milestone = toMilestoneDetails.get("milestone");
			opportunity.save();
		}
	}
}
