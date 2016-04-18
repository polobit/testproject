package com.agilecrm.knowledgebase.entity;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import com.agilecrm.db.ObjectifyGenericDao;

/**
 * 
 * @author Sasi
 * 
 */
public class HelpcenterUsers implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	// Key
	@Id
	public Long id;

	/**
	 * Stores category name
	 */
	public String name = null;

	/**
	 * Email of the user
	 */
	public String email = null;

	public Long created_time = null;

	public Long updated_time = null;
	
	public Boolean is_verified = Boolean.FALSE;
	
	/**
	 * Default constructor
	 */
	public HelpcenterUsers()
	{

	}

	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<HelpcenterUsers> dao = new ObjectifyGenericDao<HelpcenterUsers>(
			HelpcenterUsers.class);

	/**
	 * Sets entity id if it is null.
	 */
	@PrePersist
	private void prePersist()
	{
		Long currentTime = Calendar.getInstance().getTimeInMillis();

		if (currentTime == null)
			created_time = currentTime;

		updated_time = currentTime;
	}
}
