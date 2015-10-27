package com.campaignio.workflows.deferred;

import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>UpdateWorkflows</code> is the class which updates the property of a
 * workflow to its default value if it has not been initialized. This class acts
 * like a mini cron which only gets invoked once when the account preferences
 * are not updated. This won't be called again as the account preferences are
 * changed here once updating the workflow is done
 * 
 * @author Kona
 *
 */
public class UpdateWorkflows implements DeferredTask
{

	/**
	 * Serial ID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Account preferences
	 */
	AccountPrefs account_prefs;

	/**
	 * Domain name
	 */
	String domain;

	/**
	 * gets all workflows and sets is_disabled field to a default value and
	 * updates account preferences about all workflows being updated
	 */
	@Override
	public void run()
	{
		System.out.println("Domain is: " + domain);

		WorkflowUtil.updateWorkflows(WorkflowUtil.getAllWorkflows());

		// update the account_prefs
		account_prefs.workflows_updated = true;

		AccountPrefsUtil.update_account_prefs(account_prefs);

		System.out.println("All workflows updated for domain: " + domain);
	}

	/**
	 * Sets domain name and account prefs which can be used for a task to work
	 * 
	 * @param domain_user
	 *            - domain user
	 * 
	 * @param account_prefs
	 *            - account preferences
	 * 
	 */
	public UpdateWorkflows(DomainUser domain_user, AccountPrefs account_prefs)
	{
		this.domain = domain_user.domain;
		this.account_prefs = account_prefs;
	}

}