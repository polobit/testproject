package com.agilecrm.core.api.prefs;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.user.util.SMTPPrefsUtil;
import com.googlecode.objectify.Key;

/**
 * <code>SMTPAPI</code> includes REST calls to interact with {@link SMTPPrefs}
 * class. It handles CRUD operations for {@link SMTPPrefs}.
 * 
 * @author agileravi
 * 
 */
@Path("/api/smtp")
public class SMTPAPI {
	/**
	 * Gets SMTPPrefs of current agile user. This method is called if TEXT_PLAIN
	 * is request.
	 * 
	 * @return SMTPPrefs.
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<SMTPPrefs> getSMTPPrefs() {
		List<SMTPPrefs> prefsList = SMTPPrefsUtil.getSMTPPrefsList(AgileUser.getCurrentAgileUser());

		for(SMTPPrefs prefs : prefsList) {
			if(prefs != null)
				prefs.password = SMTPPrefs.MASKED_PASSWORD;
		}
		return prefsList;
	}

	/**
	 * Saves SMTPPrefs.
	 * 
	 * @param prefs
	 *            SMTPPrefs object to be saved.
	 * @return SMTPPrefs.
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public SMTPPrefs createSMTPPrefs(SMTPPrefs prefs) {
		/*int emailAccountLimitCount = BillingRestrictionUtil.getBillingRestriction(null, null)
				.getCurrentLimits().getEmailAccountLimit();
		int smtpPrefsCount = ContactEmailUtil.getSMTPPrefsCount();
		if(smtpPrefsCount < emailAccountLimitCount) { */
			prefs.setAgileUser(new Key<AgileUser>(AgileUser.class,
					AgileUser.getCurrentAgileUser().id));
			prefs.save();
			return prefs;
		/*} else
			return null;*/
	}

	/**
	 * Updates SMTPPrefs.
	 * 
	 * @param prefs
	 *            SMTPPrefs object to be updated and saved.
	 * @return SMTPPrefs.
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public SMTPPrefs updateSMTPPrefs(SMTPPrefs prefs) {
		prefs.setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));
		prefs.save();
		return prefs;
	}

	/**
	 * Deletes SMTPPrefs with respect to agile user.
	 */
	@Path("/delete/{id}")
	@DELETE
	public void deleteSMTPPrefs(@PathParam("id") String sid) {
		try {
			AgileUser user = AgileUser.getCurrentAgileUser();
			Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);
			if(StringUtils.isNotBlank(sid)) {
				Long id = Long.parseLong(sid);
				if(id != null) {
					SMTPPrefs prefs = SMTPPrefsUtil.getSMTPPrefs(id, agileUserKey);
					if(prefs != null)
						prefs.delete();
				}
			}
		} catch(Exception e) {
			throw new WebApplicationException(Response
					.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

}
