package com.agilecrm.scribe.login.serviceproviders;

import java.util.HashMap;
import java.util.Map;

import com.agilecrm.Globals;
import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.scribe.api.LinkedinAPI;
import com.agilecrm.session.UserInfo;

public class LinkedinLoginService extends OAuthLoginServiceAdapter
{
    {
	System.out.println("child intance");
	scope = "r_basicprofile r_emailaddress";
	apiClassV20 = LinkedinAPI.class;
	client_id = Globals.LINKED_IN_API_KEY;
	client_secret = Globals.LINKED_IN_SECRET_KEY;
	userinfo_endpoint = "https://www.linkedin.com/uas/oauth2/authorization?response_type=code";
	callback = GoogleApi.getRedirectURL();
	getService();
    }

    protected Map<String, String> getCustomOAuthParameters()
    {
	Map<String, String> map = new HashMap<String, String>();
	map.put("grant_type", "authorization_code");
	return map;
    }

    @Override
    public UserInfo wrapResponseToUserInfo(String response)
    {
	System.out.println(response);
	// TODO Auto-generated method stub
	return null;
    }

}
