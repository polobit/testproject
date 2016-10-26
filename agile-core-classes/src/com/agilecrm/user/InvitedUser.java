package com.agilecrm.user;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Entity;


@XmlRootElement
@Entity
@Cached
public class InvitedUser {

	@Id
	public Long id;

	// Email
	public String email;
	public String domain;
	public String name;
	public String domainUserName;
	public String verification_code;
	public Long invited_user_id;

	private static ObjectifyGenericDao<InvitedUser> dao = new ObjectifyGenericDao<InvitedUser>(InvitedUser.class);

	public InvitedUser() {
	}

	public InvitedUser(String email, Long invited_user_id, Long id) {
		this.domain = NamespaceManager.get();
		this.name = email.split("@")[0];
		this.invited_user_id = invited_user_id;
		this.id = id;
	}

	public void save() {

		this.domain = NamespaceManager.get();
		this.name = email.split("@")[0];
		// Get invited user id
		if (invited_user_id != null) {
			DomainUser domainUser = DomainUserUtil.getDomainUser(invited_user_id);
			if (domainUser != null)
				domainUserName = domainUser.name;
		}

		System.out.println("domainuser name = " + domainUserName);
		if (this.verification_code == null)
			this.verification_code = System.currentTimeMillis() + "";

		boolean isNewOne = (this.id == null);

		dao.put(this);

		// Send invitation Email
		if (isNewOne)
			SendMail.sendMail(email, SendMail.INVITED_USER_SUBJECT, SendMail.INVITED_USER, this);

	}

}