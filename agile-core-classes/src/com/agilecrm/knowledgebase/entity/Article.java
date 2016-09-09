package com.agilecrm.knowledgebase.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.knowledgebase.entity.Section.Visible_To;
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

	public String encodedtitle = null;
	/**
     * Order of the categorie in the list.
     */
    public Integer order = 0;
    
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

	public Boolean is_article_published = Boolean.TRUE;

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
	 * constructor to create default articles
	 */
	public Article(String name, String description, String plain_text,Key<Categorie> categorie_key,Key<Section> section_key,Boolean is_article_published,String encodedtitle)
	{
		super();
		this.title = name;
		this.content = description;
		this.plain_content = plain_text;
		this.categorie_key = categorie_key;
		this.section_key = section_key;
		this.is_article_published = is_article_published ;
		this.encodedtitle = encodedtitle;
		this.save();
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
		String plain_text = this.plain_content;
		
		Key<Article> articleKey = dao.put(this);
        
		this.plain_content =  plain_text;
		
		// Adding article to text search
		new HelpcenterArticleDocument().add(this);

		return articleKey;
	}

	@javax.persistence.PostLoad
	private void postLoad()
	{
		if (created_by_key != null)
		{
			created_by = created_by_key.getId();

	        System.out.println("created_by : "+ created_by);
			
			try
			{
				domainUser = DomainUserUtil.getPartialDomainUser(created_by);
			}
			catch (Exception e)
			{
                System.out.println(ExceptionUtils.getFullStackTrace(e));
			}
		}

		if (updated_by_key != null)
			updated_by = updated_by_key.getId();

		if (categorie_key != null)
			categorie_id = categorie_key.getId();

		if (section_key != null)
			section_id = section_key.getId();

	}

	@Override
	public String toString()
	{
		return "Article [id=" + id + ", title=" + title + ", content=" + content + ", plain_content=" + plain_content
				+ ", created_time=" + created_time + ", updated_time=" + updated_time + ", categorie_key="
				+ categorie_key + ", categorie_id=" + categorie_id + ", section_key=" + section_key + ", section_id="
				+ section_id + ", is_article_published=" + is_article_published + ", comments_disabled="
				+ comments_disabled + ", attachments_list=" + attachments_list + ", created_by_key=" + created_by_key
				+ ", created_by=" + created_by + ", updated_by_key=" + updated_by_key + ", updated_by=" + updated_by
				+ ", categorie=" + categorie + ", section=" + section + ", domainUser=" + domainUser + "]";
	}

}
