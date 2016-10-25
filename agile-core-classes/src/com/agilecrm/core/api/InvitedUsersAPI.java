package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;

import com.agilecrm.user.InvitedUser;
import com.agilecrm.user.util.DomainUserUtil;

@Path("/api/invited-user-emails")
public class InvitedUsersAPI {

	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void createdEmailList(List<InvitedUser> inviteUsers) throws JSONException {

		try {
			
			Long userId = DomainUserUtil.getCurentUserId();
			
			// Validate users
			for (InvitedUser invitedUser : inviteUsers) {
				if (invitedUser == null || StringUtils.isBlank(invitedUser.email))
					continue;

				if (DomainUserUtil.getDomainUserCountFromEmail(invitedUser.email) > 0)
					throw new Exception("User with this email address " + invitedUser.email + " already exists.");
			}

			// String reference_domain = getReferenceDomainFromCookie(request);
			// Save all invited users
			for (InvitedUser invitedUser : inviteUsers) {
				if (invitedUser == null || StringUtils.isBlank(invitedUser.email))
					continue;

				invitedUser.invited_user_id = userId;
				
				// Generate new password
				invitedUser.save();

			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
			throw new WebApplicationException(
					Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build());
		}

	}

}