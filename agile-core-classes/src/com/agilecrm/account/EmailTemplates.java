package com.agilecrm.account;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.account.util.EmailTemplatesUtil;
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
 * <code>EmailTemplates</code> is the base class for Email Templates. User can
 * create custom email templates with Subject and Body. Email Templates are
 * useful while sending an email to the Contact. User can just include required
 * template before sending email. EmailTemplates gives reusability feature for
 * sending email to different contacts.
 * <p>
 * EmailTemplates are saved in datastore with unique id, Subject and Body.
 * </p>
 * 
 */
@XmlRootElement
@Cached
public class EmailTemplates
{
	/**
	 * EmailTemplate Id.
	 */
	@Id
	public Long id;

	/**
	 * Email Name.
	 */
	@NotSaved(IfDefault.class)
	public String name = null;

	/**
	 * Email Subject.
	 */
	@NotSaved(IfDefault.class)
	public String subject = null;

	/**
	 * Email Body.
	 */
	@NotSaved(IfDefault.class)
	public String text = null;
	
	/**
	 * Plain text email.
	 */
	@NotSaved(IfDefault.class)
	public String text_email = null;

	/**
	 * Email HTML compatible to builder.
	 */
	@NotSaved(IfDefault.class)
	public String html_for_builder = null;
	
	public boolean is_template_built_using_builder = false;
	
	public int builder_version;

	/******************************** New Field ********************/
	/**
	 * DomainUser Id who created email template.
	 */
	@NotSaved
	public String owner_id = null;

	/**
	 * Key object of DomainUser.
	 */
	@NotSaved(IfDefault.class)
	private Key<DomainUser> owner = null;

	/**
	 * Created time of email template
	 */
	public Long created_time = 0L;
	
	/**
	 * Attached document id
	 */
	public String attachment_id = null;
	/***************************************************************/

	/**
	 * EmailTemplates Dao.
	 */
	public static ObjectifyGenericDao<EmailTemplates> dao = new ObjectifyGenericDao<EmailTemplates>(
			EmailTemplates.class);

	/**
	 * Default EmailTemplates.
	 */
	EmailTemplates()
	{

	}

	/**
	 * Constructs a new {@link EmailTemplates}.
	 * 
	 * @param subject
	 *            - Email Subject.
	 * @param text
	 *            - Email Text Body.
	 */
	public EmailTemplates(String name, String subject, String text)
	{
		this.name = name;
		this.subject = subject;
		this.text = text;
	}

	/**
	 * Saves EmailTemplates.
	 */
	public void save()
	{
		System.out.println("email template : " + this);
		dao.put(this);
	}

	/**
	 * Deletes EmailTemplates.
	 */
	public void delete()
	{
		dao.delete(this);
	}

	/**
	 * Sets name to subject if its null for old templates. PrePersist is called
	 * each time before object gets saved.
	 */
	@PostLoad
	public void postLoad()
	{
		if (this.name == null)
			this.name = this.subject;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		return "id: " + id + " name: " + this.name + " subject" + this.subject;
	}

	/******************************** New Field related method ********************/
	@JsonIgnore
	public void setOwner(Key<DomainUser> user)
	{
		owner = user;
	}

	/**
	 * Gets picture of owner who created email template. Owner picture is
	 * retrieved from user prefs of domain user who created email template and
	 * is used to display owner picture in email templates list.
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
	@XmlElement(name = "emailTemplateOwner")
	public DomainUser getEmailTemplateOwner() throws Exception
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
	 * Assigns created time for the new one, creates email template with owner
	 * key.
	 */
	@PrePersist
	private void PrePersist()
	{
		builder_version = 1;
		
		if (id != null)
		{
			EmailTemplates et = EmailTemplatesUtil.getEmailTemplate(id);
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
