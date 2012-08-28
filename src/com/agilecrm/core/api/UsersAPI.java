package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.core.DomainUser;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.NotificationPrefs;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.UserPrefs;
import com.google.appengine.api.NamespaceManager;

@Path("/api/users")
public class UsersAPI {

	// Users
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<DomainUser> getUsers() {
		try {
			String domain = NamespaceManager.get();
			return DomainUser.getUsers(domain);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// Users
	@POST
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public DomainUser createDomainUser(DomainUser domainUser) {
		domainUser.save();
		return domainUser;
	}

	// Users
	@PUT
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public DomainUser updateDomainUser(DomainUser domainUser) {
		domainUser.save();
		return domainUser;
	}

	// Users
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteDomainUser(DomainUser domainUser) {

		AgileUser agileUser = AgileUser.getUser(domainUser.open_id_user
				.getUserId());

		// Delete UserPrefs
		UserPrefs userPrefs = UserPrefs.getCurrentUserPrefs();
		if (userPrefs != null)
			userPrefs.delete();

		// Delete Social Prefs
		List<SocialPrefs> socialPrefsList = SocialPrefs.getPrefs(agileUser);
		for (SocialPrefs socialPrefs : socialPrefsList) {
			socialPrefs.delete();
		}

		// Delete IMAP PRefs
		IMAPEmailPrefs imapPrefs = IMAPEmailPrefs.getIMAPPrefs(agileUser);
		if (imapPrefs != null)
			imapPrefs.delete();

		// Delete Notification Prefs
		NotificationPrefs notificationPrefs = NotificationPrefs
				.getCurrentUserNotificationPrefs();
		if (notificationPrefs != null)
			notificationPrefs.delete();

		// Get and Delete AgileUser
		if (agileUser != null)
			agileUser.delete();

		domainUser.delete();
	}

}