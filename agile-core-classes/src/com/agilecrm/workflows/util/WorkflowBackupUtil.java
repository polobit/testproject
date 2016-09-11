package com.agilecrm.workflows.util;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.WorkflowBackup;
import com.google.appengine.api.datastore.EntityNotFoundException;

public class WorkflowBackupUtil
{

	private static ObjectifyGenericDao<WorkflowBackup> dao = new ObjectifyGenericDao<WorkflowBackup>(WorkflowBackup.class);
	
	public static WorkflowBackup getWorkflowBackup(Long workflowId) throws EntityNotFoundException
	{
		return dao.get(workflowId);
	}
	
}