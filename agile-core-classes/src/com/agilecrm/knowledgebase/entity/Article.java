package com.agilecrm.knowledgebase.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.search.document.HelpcenterArticleDocument;
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
public class Article extends Cursor implements Serializable
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
	
	/**
	 * Stores category description
	 */
	@NotSaved
	public String plain_content = null;

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
	 * Util attribute
	 */
	@NotSaved
	public Categorie categorie = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public Section section = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public DomainUserPartial domainUser = null;

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

		if (created_time == null)
			created_time = currentTime;

		updated_time = currentTime;

		Key<DomainUser> key = DomainUserUtil.getCurentUserKey();

		if (created_by_key == null)
			created_by_key = key;

		updated_by_key = key;
	}

	/**
	 * 
	 * @return
	 */
	public Key<Article> save()
	{
		Key<Article> articleKey = dao.put(this);

		// Adding article to text search
		new HelpcenterArticleDocument().add(this);

		return articleKey;
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

		if (created_by == null)
		{
			try
			{
				domainUser = DomainUserUtil.getPartialDomainUser(created_by);
			}
			catch (Exception e)
			{

			}
		}
	}
}
