package com.agilecrm.core.api.prefs;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.util.SocialPrefsUtil;

/**
 * <code>SocialPrefsAPI</code> includes REST calls to interact with
 * {@link SocialPrefs} class. It is called to get SocialPrefs with respect to
 * type and deletes existing SocialPrefs associated with type.
 * 
 * @author Manohar
 * 
 */
@Path("/api/social-prefs")
public class SocialPrefsAPI
{
	/**
	 * Returns SocialPrefs associated with current AgileUser and given type.
	 * 
	 * @param type
	 *            - SocialPrefs type.
	 * @return SocialPrefs.
	 */
	@Path("{type}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public SocialPrefs getSocialPrefs(@PathParam("type") String type)
	{
		try
		{
			Type socialPrefsTypeEnum = Type.valueOf(type);
			if (socialPrefsTypeEnum == null)
				return null;

			return SocialPrefsUtil.getPrefs(AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);
		}
		catch (Exception e)
		{
			return null;
		}
	}

	/**
	 * Deletes SocialPrefs associated with current AgileUser and given type.
	 * 
	 * @param type
	 *            - SocialPrefs type.
	 */
	@Path("{type}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteSocialPrefs(@PathParam("type") String type)
	{
		try
		{
			Type socialPrefsTypeEnum = Type.valueOf(type);
			if (socialPrefsTypeEnum == null)
				return;

			SocialPrefs prefs = SocialPrefsUtil.getPrefs(AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);
			prefs.delete();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}