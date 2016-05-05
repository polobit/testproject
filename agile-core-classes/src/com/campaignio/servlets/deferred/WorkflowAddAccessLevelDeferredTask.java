package com.campaignio.servlets.deferred;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.Workflow;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>EmailRepliedDeferredTask</code> is the deferred task that handles
 * campaign email Replied tasklet cron jobs.
 *
 * @author Govind
 * 
 */
@SuppressWarnings("serial")
public class WorkflowAddAccessLevelDeferredTask implements DeferredTask {

	public String domain;

	public WorkflowAddAccessLevelDeferredTask(String domain) {
		this.domain = domain;
	}

	public void run() {

		try {

			if (StringUtils.isBlank(domain))
				return;

			NamespaceManager.set(domain);
			
			ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(Workflow.class);
			List<Workflow> workflows = dao.fetchAll();
			System.out.println("workflows = " + workflows.size());

			for (Workflow workflow : workflows) {
				workflow.updated_time_update = false;

				List<Activity> activities = ActivityUtil.getActivititesBasedOnSelectedConditon(
						ActivityType.CAMPAIGN.toString(), null, 5, null, null, null, workflow.id);

				if (activities != null) {
					System.out.println("activities = " + activities.size());
					for (Activity activity : activities) {
						System.out.println(workflow.name + " : " + activity.time);
					}

					if (activities.size() > 0) {
						System.out.println("time = " + activities.get(0).time);
						workflow.updated_time = activities.get(0).time;
						System.out.println("time = " + workflow.updated_time);

					}
				}

				workflow.save(true);
			}

		} finally {
		}

	}
}
