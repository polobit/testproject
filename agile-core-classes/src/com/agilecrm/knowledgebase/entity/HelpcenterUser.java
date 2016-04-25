package com.agilecrm.knowledgebase.entity;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
public class HelpcenterUser implements Serializable
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
	
	/**
	 * Email of the user
	 */
	public String password = null;

	public Long created_time = null;

	public Long updated_time = null;
	
	public Boolean is_verified = Boolean.FALSE;
	
	/**
	 * Default constructor
	 */
	public HelpcenterUser()
	{

	}

	
	public HelpcenterUser(String name, String email, String password)
	{
		super();
		this.name = name;
		this.email = email;
		this.password = password;
	}


	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<HelpcenterUser> dao = new ObjectifyGenericDao<HelpcenterUser>(
			HelpcenterUser.class);

	/**
	 * Sets entity id if it is null.
	 */
	@PrePersist
	private void prePersist()
	{
		Long currentTime = Calendar.getInstance().getTimeInMillis();

		if (created_time == null)
			created_time = currentTime;

		updated_time = currentTime;
	}
	
	public Key<HelpcenterUser> save()
	{
		return dao.put(this);
	}
}
