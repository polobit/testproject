package com.agilecrm.scribe.login.serviceproviders;

import java.util.HashMap;
import java.util.Map;

import com.agilecrm.Globals;
import com.agilecrm.scribe.ScribeServlet;
import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.session.UserInfo;

public class GoogleLoginService extends OAuthLoginServiceAdapter
{
    {
	System.out.println("child intance");
	scope = ScribeServlet.GOOGLE_OAUTH2_SCOPE;
	apiClassV20 = GoogleApi.class;
	client_id = Globals.GOOGLE_CLIENT_ID;
	client_secret = Globals.GOOGLE_SECRET_KEY;
	callback = GoogleApi.getRedirectURL();

	userinfo_endpoint = "https://www.googleapis.com/plus/v1/people/me/openIdConnect";
	getService();
    }

    public GoogleLoginService()
    {

    }

    protected Map<String, String> getCustomOAuthParameters()
    {
	Map<String, String> map = new HashMap<String, String>();
	map.put("grant_type", "authorization_code");
	return map;
    }

    // {
    // "picture":
    // "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",
    // "kind": "plus#personOpenIdConnect",
    // "sub": "107348711145732582731",
    // "family_name": "Praveen",
    // "locale": "en",
    // "email_verified": "true",
    // "given_name": "Yaswanth",
    // "email": "praveen@invox.com",
    // "hd": "invox.com",
    // "name": "Yaswanth Praveen"
    // }
    //
    @Override
    public UserInfo wrapResponseToUserInfo(String response)
    {

	// Creates HashMap from response JSON string
	Map<String, String> properties = convertResponseStringToMap(response);
	if (properties.get("email") != null)
	    return new UserInfo(null, properties.get("email"), properties.get("name"));

	return null;

    }
}
