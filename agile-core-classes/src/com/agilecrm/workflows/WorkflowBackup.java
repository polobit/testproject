package com.agilecrm.workflows;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.services.ServiceLocator;
import com.agilecrm.user.service.DomainUserService;
import com.googlecode.objectify.annotation.Unindexed;

@Unindexed
public class WorkflowBackup
{

	@Id
	public Long campaign_id = 0l;
	
	public Long updated_time;
	
	public String rules = null;
	
	private static ObjectifyGenericDao<WorkflowBackup> dao = new ObjectifyGenericDao<WorkflowBackup>(WorkflowBackup.class);
	
	public WorkflowBackup()
	{
		
	}
	
	public WorkflowBackup(Long campaign_id, Long updated_time, String rules)
	{
		this.campaign_id = campaign_id;
		this.updated_time = updated_time;
		this.rules = rules;
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
}