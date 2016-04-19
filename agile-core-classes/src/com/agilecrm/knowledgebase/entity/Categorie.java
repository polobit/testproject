package com.agilecrm.knowledgebase.entity;

import java.io.Serializable;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.knowledgebase.util.SectionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * 
 * @author Sasi
 * 
 */
public class Categorie implements Serializable
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
	 * Stores category description
	 */
	public String description = null;

	public Long created_time = null;

	public Long updated_time = null;

	/**
	 * Stores user ID to whom ticket is assigned
	 */
	@JsonIgnore
	public Key<DomainUser> created_by_key = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public Long created_by = null;

	/**
	 * Stores user ID to whom ticket is assigned
	 */
	@JsonIgnore
	public Key<DomainUser> updated_by_key = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public Long updated_by = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public List<Section> sections = null;

	/**
	 * Default constructor
	 */
	public Categorie()
	{

	}

	public Categorie(String name, String description)
	{
		super();
		this.name = name;
		this.description = description;
	}

	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<Categorie> dao = new ObjectifyGenericDao<Categorie>(Categorie.class);

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

		Key<DomainUser> key = DomainUserUtil.getCurentUserKey();

		if (created_by_key == null)
			created_by_key = key;

		updated_by_key = key;
	}

	public Key<Categorie> save()
	{
		return dao.put(this);
	}

	@javax.persistence.PostLoad
	private void postLoad()
	{
		if (created_by_key != null)
			created_by = created_by_key.getId();

		if (updated_by_key != null)
			updated_by = updated_by_key.getId();

		sections = SectionUtil.getSectionByCategorie(id);
	}
}
