package com.agilecrm.account;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.account.util.DocumentTemplatesUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>DocumentTemplates</code> is the base class for Document Templates. User can
 * create custom document templates with Subject and Body. Document Templates are
 * useful while sending document to the Contact. User can just include required
 * template before sending document. DocumentTemplates gives re-usability feature for
 * sending document to different contacts.
 * <p>
 * DocumentTemplates are saved in datastore with unique id, Subject and Body.
 * </p>
 * 
 */
@XmlRootElement
@Cached
public class DocumentTemplates
{
	/**
	 * DocumentTemplate Id.
	 */
	@Id
	public Long id;

	/**
	 * Document Template Name.
	 */
	@NotSaved(IfDefault.class)
	public String name = null;

	@NotSaved(IfDefault.class)
	public String description = null;
	

	/**
	 * Document Body.
	 */
	@NotSaved(IfDefault.class)
	public String text = null;

	/******************************** New Field ********************/
	/**
	 * DomainUser Id who created document template.
	 */
	@NotSaved
	public String owner_id = null;

	/**
	 * Key object of DomainUser.
	 */
	@NotSaved(IfDefault.class)
	private Key<DomainUser> owner = null;

	/**
	 */
	public Long created_time = 0L;
	
	/**
	 * Attached document id
	 */
	public String attachment_id = null;
	/***************************************************************/

	/**
	 * DocumentTemplates Dao.
	 */
	public static ObjectifyGenericDao<DocumentTemplates> dao = new ObjectifyGenericDao<DocumentTemplates>(
			DocumentTemplates.class);

	/**
	 * Default DocumentTemplates.
	 */
	DocumentTemplates()
	{

	}

	/**
	 * Constructs a new {@link DocumentTemplates}.
	 * 
	 * @param text
	 *            - Document Text Body.
	 */
	public DocumentTemplates(String name,String description,  String text)
	{
		this.name = name;
		
		this.text = text;
		this.description = description;
	}

	/**
	 * Saves DocumentTemplates.
	 */
	public void save()
	{
		System.out.println("document template : " + this);
		dao.put(this);
	}

	/**
	 * Deletes DocumentTemplates.
	 */
	public void delete()
	{
		dao.delete(this);
	}


	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		return "id: " + id + " name: " + this.name + " description: " + this.description;
	}

	/******************************** New Field related method ********************/
	@JsonIgnore
	public void setOwner(Key<DomainUser> user)
	{
		owner = user;
	}

	/**
	 * Gets picture of owner who created document template. Owner picture is
	 * retrieved from user prefs of domain user who created document template and
	 * is used to display owner picture in document templates list.
	 * 
	 * @return picture of owner.
	 * @throws Exception
	 *             when agileuser doesn't exist with respect to owner key.
	 */
	@XmlElement(name = "ownerPic")
	public String getOwnerPic() throws Exception
	{
		AgileUser agileuser = null;
		UserPrefs userprefs = null;

		try
		{
			// Get owner pic through agileuser prefs
			if (owner != null)
				agileuser = AgileUser.getCurrentAgileUserFromDomainUser(owner.getId());

			if (agileuser != null)
				userprefs = UserPrefsUtil.getUserPrefs(agileuser);

			if (userprefs != null)
				return userprefs.pic;
		}
		catch (Exception e)
		{
			e.printStackTrace();

		}

		return "";
	}

	/**
	 * Gets domain user with respect to owner id if exists, otherwise null.
	 * 
	 * @return Domain user object.
	 * @throws Exception
	 *             when Domain User not exists with respect to id.
	 */
	@XmlElement(name = "documentTemplateOwner")
	public DomainUser getDocumentTemplateOwner() throws Exception
	{
		if (owner != null)
		{
			try
			{
				// Gets Domain User Object
				return DomainUserUtil.getDomainUser(owner.getId());
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
		return null;
	}

	/**
	 * Assigns created time for the new one, creates document template with owner
	 * key.
	 */
	@PrePersist
	private void PrePersist()
	{
		if (id != null)
		{
			DocumentTemplates et = DocumentTemplatesUtil.getDocumentTemplate(id);
			created_time = et.created_time;
			owner_id = et.owner_id;
			owner = et.owner;
			return;
		}

		// Store Created Time
		if (created_time == 0L)
		{
			created_time = System.currentTimeMillis() / 1000;

			System.out.println("Owner_id : " + this.owner_id);

			DomainUser du = DomainUserUtil.getCurrentDomainUser();
			owner_id = du.id.toString();

			// Saves domain user key
			if (owner_id != null)
				owner = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner_id));

			System.out.println("Owner : " + this.owner);
		}
	}
	/******************************************************************************/
}