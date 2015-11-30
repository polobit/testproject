package com.agilecrm.social;

import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;

import facebook4j.Facebook;
import facebook4j.FacebookFactory;
import facebook4j.ResponseList;
import facebook4j.User;
import facebook4j.auth.AccessToken;

/**
 * The <code>FacebookUtil</code> class acts as a Client to Facebook server
 * 
 * <code>FacebookUtil</code> class contains methods to retrieve Facebook profile
 * details details
 * 
 * @author Rajitha A
 * @since
 */
public class FacebookUtil {

	/** The field holds agent's Facebook account Application ID */
	private String facebookAppId;

	/** The field holds agent's Facebook account Application Secret */
	private String faceboookAppSecret;

	/** The field holds agent's Facebook account access token */
	private String accessToken;

	private static final String APIURL = "https://graph.facebook.com/v2.0/";

	Facebook facebook;

	/** Parameterized constructor for initializing the instance variables */
	public FacebookUtil(String facebookAppId, String faceboookAppSecret,
			String accessToken) {
		this.facebookAppId = facebookAppId;
		this.faceboookAppSecret = faceboookAppSecret;
		this.accessToken = accessToken;
		facebook = new FacebookFactory().getInstance();
		facebook.setOAuthAppId(facebookAppId, faceboookAppSecret);
		facebook.setOAuthAccessToken(new AccessToken(accessToken, null));

	}

	/**
	 * Get the facebook profiles from facebook api based on the name.
	 * 
	 * @param name
	 * @return
	 * @throws Exception
	 */
	public JSONObject searchContactsByName(String name) throws Exception {
		// removing special characters
		name = name.replaceAll("[()?:!.,;@]+", "");
		ResponseList<User> results = facebook.searchUsers(name);

		// Print response
		System.out.println("responseis" + results.size());

		int count = ((results.size() > 25) ? 25 : results.size());
		JSONArray userArr = new JSONArray();
		for (int i = 0; i < count; i++) {
			JSONObject user = new JSONObject();
			User temp = results.get(i);
			user.put("userId", temp.getId());
			URL pictureurl = null;
			if (temp.getId() != null) {
				pictureurl = facebook.getPictureURL(temp.getId());
				User u = facebook.getUser(temp.getId());

				user.put("userName", u.getName());
				user.put("userPicUrl", pictureurl.toString());
				user.put("email", u.getEmail());
				user.put("lacation", u.getLocation());
				user.put("weburl", u.getWebsite());
				user.put("fbpage", u.getLink());
				user.put("hometown", u.getHometown());
			}
			userArr.put(user);
		}
		return new JSONObject().put("profiles", userArr);

		/*
		 * String searchEndpoint =
		 * "search?q="+name.trim()+"&type=user&fields=id,name,picture&access_token="
		 * + accessToken; return HTTPUtil.accessURL(APIURL+searchEndpoint);
		 */

	}

	/**
	 * Gets the facebook profile based on the id.
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public JSONObject getFacebookProfileById(String id) throws Exception {
		JSONObject fbJson = new JSONObject();
		try {

			System.out.println("accessToken:" + accessToken);
			String res1 = HTTPUtil.accessURL(APIURL + id + "?access_token="
					+ accessToken);
			fbJson.put("user", new JSONObject(res1));
			String res3 = HTTPUtil.accessURL(APIURL + id
					+ "/picture?redirect=false" + "&access_token="
					+ accessToken);
			try {
				fbJson.getJSONObject("user").put(
						"image",
						new JSONObject(res3).getJSONObject("data").getString(
								"url"));
			} catch (Exception e) {
				e.printStackTrace();
			}
			String res2 = HTTPUtil.accessURL(APIURL + "me?access_token="
					+ accessToken);
			fbJson.put("me", new JSONObject(res2));

		} catch (Exception e) {
			e.printStackTrace();
		}
		return fbJson;
	}

	/**
	 * Get the current user facebook profile from facebook api.
	 * 
	 * @return
	 * @throws Exception
	 */
	public String getFacebookCurrentUser() throws Exception {

		return HTTPUtil
				.accessURL(APIURL
						+ "me?access_token="
						+ accessToken
						+ "&fields=picture,about,id,name,location,hometown,address,link");

	}
}