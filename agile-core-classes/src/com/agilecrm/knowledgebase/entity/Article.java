package com.agilecrm.knowledgebase.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * 
 * @author Sasi
 * 
 */
public class Article implements Serializable
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
	public String title = null;

	/**
	 * Stores category description
	 */
	public String content = null;

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
	 * Stores Categorie key
	 */
	@JsonIgnore
	public Key<Section> section_key = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public Long section_id = null;

	public Boolean is_article_published = Boolean.FALSE;

	public Boolean comments_disabled = Boolean.FALSE;

	/**
	 * Stores list of attachments URL's saved in Google cloud
	 */
	@Embedded
	public List<TicketDocuments> attachments_list = new ArrayList<TicketDocuments>();

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

	/**
	 * Default constructor
	 */
	public Article()
	{
		
	}

	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<Article> dao = new ObjectifyGenericDao<Article>(Article.class);

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
	
	public Key<Article> save()
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

		if (categorie_key != null)
			categorie_id = categorie_key.getId();

		if (section_key != null)
			section_id = section_key.getId();
	}
}
