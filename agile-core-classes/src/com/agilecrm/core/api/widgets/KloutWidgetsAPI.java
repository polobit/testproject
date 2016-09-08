package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

@Path("/api/widgets/klout")
public class KloutWidgetsAPI {
	@Path("byusername/{twitterName}")
	@GET
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public String getKloutScore(@PathParam("twitterName") String twitterName)
			throws Exception {
		if (twitterName != null) {
			KloutAPI klout = new KloutAPI();
			JSONObject resultobject = klout.getIdentity(twitterName,
					KloutAPI.TWITTER_SCREEN_NAME);
			if (resultobject != null) {
				String kloutID = resultobject.getString("id");
				KloutUser kloutUser = klout.getUser(kloutID);
				JSONObject userObject = new JSONObject();
				userObject.put("score", kloutUser.score());
				userObject.put("nickName", kloutUser.nick());
				return userObject.toString();
			}
		}
		return null;
	}
}