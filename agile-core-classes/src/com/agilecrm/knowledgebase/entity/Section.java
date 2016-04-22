package com.agilecrm.knowledgebase.entity;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.knowledgebase.util.ArticleUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * 
 * @author Sasi
 * 
 */
public class Section implements Serializable
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
	 * Stores Categorie key
	 */
	@JsonIgnore
	public Key<Categorie> categorie_key = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public Long categorie_id = null;

	/**
	 * Stores user key
	 */
	@JsonIgnore
	public Key<DomainUser> created_by_key = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public Long created_by = null;

	/**
	 * Stores domain key
	 */
	@JsonIgnore
	public Key<DomainUser> updated_by_key = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public Long updated_by = null;

	public static enum Visible_To
	{
		ADMIN, AGENTS, CUSTOMER
	};

	/**
	 * Util attribute
	 */
	@NotSaved
	public int articles_count = 0;

	// Default access
	public Visible_To visible_to = Visible_To.CUSTOMER;

	/**
	 * Default constructor
	 */
	public Section()
	{

	}

	public Section(String name, String description, Key<Categorie> categorie_key, Visible_To visible_to)
	{
		super();
		this.name = name;
		this.description = description;
		this.categorie_key = categorie_key;
		this.visible_to = visible_to;
	}

	public Key<Section> save()
	{
		return dao.put(this);
	}

	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<Section> dao = new ObjectifyGenericDao<Section>(Section.class);

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

		Key<DomainUser> key = DomainUserUtil.getCurentUserKey();

		if (created_by_key == null)
			created_by_key = key;

		updated_by_key = key;
	}

	@javax.persistence.PostLoad
	private void postLoad()
	{
		if (created_by_key != null)
			created_by = created_by_key.getId();

		if (updated_by_key != null)
			updated_by = updated_by_key.getId();

		if (categorie_key != null)
			categorie_id = categorie_key.getId();

		articles_count = ArticleUtil.getCount(categorie_id, id);
	}
}
