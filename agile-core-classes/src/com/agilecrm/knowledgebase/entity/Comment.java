package com.agilecrm.knowledgebase.entity;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.knowledgebase.util.HelpcenterUserUtil;
import com.agilecrm.session.KnowledgebaseManager;
import com.agilecrm.session.KnowledgebaseUserInfo;
import com.agilecrm.session.KnowledgebaseUserInfo.Role;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * 
 * @author Sasi
 * 
 */
public class Comment implements Serializable
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
	public String comment = null;

	/**
	 * Stores Categorie key
	 */
	@JsonIgnore
	public Key<Article> article_key = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public Long article_id = null;

	public Long created_time = null;

	public Long updated_time = null;

	// Default access
	public Role role = Role.CUSTOMER;

	/**
	 * Stores user key
	 */
	@JsonIgnore
	public Key<HelpcenterUser> created_by_key = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public Long created_by = null;

	/**
	 * Util attribute
	 */
	@NotSaved
	public HelpcenterUser hc_user = null;

	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<Comment> dao = new ObjectifyGenericDao<Comment>(Comment.class);

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
		
		KnowledgebaseUserInfo userInfo = KnowledgebaseManager.get();
		
		System.out.println("userInfo: ");
		System.out.println(userInfo);
		
		created_by_key = new Key<HelpcenterUser>(HelpcenterUser.class, userInfo.getUserId());
	}

	public Key<Comment> save()
	{
		return dao.put(this);
	}

	@javax.persistence.PostLoad
	private void postLoad()
	{
		if (created_by_key != null)
		{
			created_by = created_by_key.getId();

			try
			{
				hc_user = HelpcenterUserUtil.getUser(created_by);
			}
			catch (Exception e)
			{
				// TODO: handle exception
			}
		}

		if (article_key != null)
			article_id = article_key.getId();
	}
}