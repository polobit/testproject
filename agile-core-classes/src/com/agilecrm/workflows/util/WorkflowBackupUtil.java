package com.agilecrm.workflows.util;

import java.util.HashMap;
import java.util.Map;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.WorkflowBackup;
import com.google.appengine.api.datastore.EntityNotFoundException;

public class WorkflowBackupUtil
{

	private static ObjectifyGenericDao<WorkflowBackup> dao = new ObjectifyGenericDao<WorkflowBackup>(WorkflowBackup.class);
	
	public static WorkflowBackup getWorkflowBackup(Long workflowId) throws EntityNotFoundException
	{
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		conditionsMap.put("workflow_id", workflowId);
				
		return dao.getByProperty(conditionsMap);
	}
	
}