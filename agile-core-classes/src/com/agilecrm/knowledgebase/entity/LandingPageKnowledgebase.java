package com.agilecrm.knowledgebase.entity;

import java.util.Calendar;

import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;

public class LandingPageKnowledgebase
{
	@Id
	public Long id;

	//
	public Long kb_landing_page_id;

	// Time
	public Long created_time;

	// Updated time
	public Long updated_time;

	public static ObjectifyGenericDao<LandingPageKnowledgebase> dao = new ObjectifyGenericDao<LandingPageKnowledgebase>(
			LandingPageKnowledgebase.class);

	/**
	 * 
	 */
	public void save()
	{
		if (this.id == null){
			this.created_time = Calendar.getInstance().getTimeInMillis() / 1000;
		}	
		this.updated_time = Calendar.getInstance().getTimeInMillis() / 1000;

		dao.put(this);
	}
}
