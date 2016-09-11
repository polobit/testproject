package com.agilecrm.workflows;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.Unindexed;

@Unindexed
public class WorkflowBackup
{

	@Id
	public Long id;
	
	public Long updated_time;
	
	@Indexed
	public Long workflow_id = 0l;
	
	private String rules = null;
	
	private static ObjectifyGenericDao<WorkflowBackup> dao = new ObjectifyGenericDao<WorkflowBackup>(WorkflowBackup.class);
	
	public WorkflowBackup()
	{
		
	}
	
	public WorkflowBackup(Long workflow_id, Long updated_time, String rules)
	{
		this.workflow_id = workflow_id;
		this.updated_time = updated_time;
		this.setRules(rules);
	}
	
	public void save()
	{
		dao.put(this);
	}
	
	public void saveAsync()
	{
		try
		{
			dao.ofy().async().put(this);
		}
		catch (Exception e)
		{
			System.err.println("Exception occured while saving workflow backup async..." + e.getMessage());
			e.printStackTrace();
			
			System.out.println("Saving synchronously...");
			save();
		}
	}
	
	public void delete()
	{
		dao.delete(this);
	}
	
	@PrePersist
	private void prePersist()
	{
		if(updated_time == null || updated_time == 0L)
			updated_time = System.currentTimeMillis()/1000;
	}

	public String getRules()
	{
		return rules;
	}

	public void setRules(String rules)
	{
		this.rules = rules;
	}
}