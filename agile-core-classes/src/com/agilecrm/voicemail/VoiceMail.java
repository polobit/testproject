package com.agilecrm.voicemail;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class VoiceMail extends Cursor
{

	@Id
	public Long id;

	@NotSaved(IfDefault.class)
	public String name = null;

	public Long uploaded_time = 0L;

	@NotSaved(IfDefault.class)
	public String extension = null;

	@NotSaved(IfDefault.class)
	public String url = null;

	@NotSaved
	public String owner_id = null;

	/**
	 * Key object of DomainUser.
	 */
	@NotSaved(IfDefault.class)
	private Key<DomainUser> ownerKey = null;

	/**
	 * ObjectifyDao of Document.
	 */
	public static ObjectifyGenericDao<VoiceMail> dao = new ObjectifyGenericDao<VoiceMail>(VoiceMail.class);

	/**
	 * Default Constructor.
	 */
	public VoiceMail()
	{
	}

	public VoiceMail(String name, String extension, String url)
	{
		this.name = name;
		this.extension = extension;
		this.url = url;
	}

	/**
	 * Gets domain user with respect to owner id if exists, otherwise null.
	 * 
	 * @return Domain user object.
	 * @throws Exception
	 *             when Domain User not exists with respect to id.
	 */
	@XmlElement(name = "owner")
	public DomainUser getOwner() throws Exception
	{
		if (ownerKey != null)
		{
			try
			{
				// Gets Domain User Object
				return DomainUserUtil.getDomainUser(ownerKey.getId());
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
		return null;
	}

	/**
	 * Saves in dao.
	 */
	public void save()
	{
		dao.put(this);

		// Enables to build "VoiceMail" search on current entity
		AppengineSearch<VoiceMail> search = new AppengineSearch<VoiceMail>(VoiceMail.class);

		if (id == null)
		{
			search.add(this);
			return;
		}
//		search.edit(this);
	}

	/**
	 * Deletes Uploaded Document from dao.
	 */
	public void delete()
	{
		dao.delete(this);
		new AppengineSearch<VoiceMail>(VoiceMail.class).delete(id.toString());
	}

	/**
	 * Sets uploaded time, owner key, related to contacts, deals, cases.
	 * PrePersist is called each time before object gets saved.
	 */
	@PrePersist
	private void PrePersist()
	{
		// Initializes created Time
		if (uploaded_time == 0L)
			uploaded_time = System.currentTimeMillis() / 1000;

		// If owner_id is null
		if (owner_id == null)
		{
			UserInfo userInfo = SessionManager.get();
			if (userInfo == null)
				return;

			owner_id = SessionManager.get().getDomainId().toString();
		}

		// Saves domain user key
		ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner_id));

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		return "id: " + id + " name: " + name + " Owner " + owner_id;
	}

}