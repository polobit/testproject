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
import org.json.JSONObject;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.GmailSendPrefs;
import com.agilecrm.user.util.GmailSendPrefsUtil;
import com.agilecrm.util.SMTPBulkEmailUtil;
import com.googlecode.objectify.Key;

/**
 * <code>GmailSendAPI</code> includes REST calls to interact with {@link GmailSendPrefs}
 * class. It handles CRUD operations for {@link GmailSendPrefs}.
 * 
 * @author agileravi
 * 
 */
@Path("/api/email-send")
public class GmailSendAPI {
	
	/**
	 * Final variable for bulk email
	 */
	public static final String BULK_EMAIL = "bulk_email";
	
	/**
	 * Final variable for per day email max limit
	 */
	public static final String MAX_EMAIL_LIMIT = "max_email_limit";
	
	/**
	 * Gets GmailSendPrefs of current agile user. This method is called if TEXT_PLAIN
	 * is request.
	 * 
	 * @return GmailSendPrefs.
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<GmailSendPrefs> getGmailSendPrefs() {
		List<GmailSendPrefs> prefsList = GmailSendPrefsUtil.getPrefsList(AgileUser.getCurrentAgileUser());
		
		//Append email sent Count to Gmail Prefs
		if(prefsList !=null){
			Object count = SMTPBulkEmailUtil.getCache(prefsList.get(0).email + SMTPBulkEmailUtil.GPREFS_COUNT_MEMCACHE_KEY);
			if(count != null)
				prefsList.get(0).email_sent_count =  (long)count;
		}
		
		return prefsList;
	}

	/**
	 * Updates GmailSendPrefs.
	 * 
	 * @param prefs
	 *            GmailSendPrefs object to be updated and saved.
	 * @return GmailSendPrefs.
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public GmailSendPrefs updateGmailSendPrefs(GmailSendPrefs prefs) {
		prefs.setAgileUser(new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id));
		prefs.save();		
		return prefs;
	}

	/**
	 * Deletes GmailSendPrefs with respect to agile user.
	 */
	@Path("/delete/{id}")
	@DELETE
	public void deleteGmailSendPrefs(@PathParam("id") String sid) {
		try {
			AgileUser user = AgileUser.getCurrentAgileUser();
			Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);
			if(StringUtils.isNotBlank(sid)) {
				Long id = Long.parseLong(sid);
				if(id != null) {
					GmailSendPrefs prefs = GmailSendPrefsUtil.getPrefs(id, agileUserKey);
					if(prefs != null){
						prefs.delete();
					}
				}
			}
		} catch(Exception e) {
			throw new WebApplicationException(Response
					.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Setting GmailSendPrefs with respect to agile user.
	 */
	@Path("/setting/{id}")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public void settingGmailSendPrefs(@PathParam("id") String sid, String gmailSetting) {
		try {
			System.out.println("Gmail auth json for ulk email setting : " + gmailSetting);
			
			JSONObject gmailSettingJSON = new JSONObject(gmailSetting);
			AgileUser user = AgileUser.getCurrentAgileUser();
			Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);
			if(StringUtils.isNotBlank(sid)) {
				Long id = Long.parseLong(sid);
				if(id != null) {
					GmailSendPrefs prefs = GmailSendPrefsUtil.getPrefs(id, agileUserKey);
					if(prefs != null){
						prefs.bulk_email=gmailSettingJSON.getBoolean(BULK_EMAIL);
						prefs.max_email_limit=gmailSettingJSON.getLong(MAX_EMAIL_LIMIT);
					    prefs.save();	
					}
				}
			}
		} catch(Exception e) {
			throw new WebApplicationException(Response
					.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}


}