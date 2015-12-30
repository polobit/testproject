package com.agilecrm.scribe.api;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConfig;
import org.scribe.model.OAuthConstants;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;
import org.scribe.utils.OAuthEncoder;

import com.agilecrm.Globals;
import com.google.api.client.util.Base64;

public class Paypal2Api extends DefaultApi20 {

	// "https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/authorize?client_id=%s&response_type=code&redirect_uri=%s&scope=%s";
	static String AUTHORIZE_URL = "https://www.paypal.com/webapps/auth/protocol/openidconnect/v1/authorize?client_id=%s&response_type=code&redirect_uri=%s&scope=%s";

	private static String GRANT_TYPE = "grant_type";
	private static String AUTHORIZATION_CODE = "authorization_code";

	public static String REDIRECT_URL = "https://phanisbox-dot-sandbox-dot-agilecrmbeta.appspot.com/paypalScribe";

	public static String SCOPE = "openid profile email address phone https://uri.paypal.com/services/invoicing";

	// "https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/tokenservice";
	private static String ACCESS_TOKEN_URL = "https://www.paypal.com/webapps/auth/protocol/openidconnect/v1/tokenservice";

	public String getAccessTokenEndpoint() {
		// TODO Auto-generated method stub
		return ACCESS_TOKEN_URL;
	}

	public String getAuthorizationUrl(OAuthConfig config) {
		// TODO Auto-generated method stub

		return String.format(AUTHORIZE_URL, config.getApiKey(),
				OAuthEncoder.encode(config.getCallback()),
				OAuthEncoder.encode(config.getScope()));

	}

	public Verb getAccessTokenVerb() {
		return Verb.POST;
	}

	public String getAccessToken(String code) {

		Paypal2Api pt = new Paypal2Api();
		OAuthRequest request = new OAuthRequest(pt.getAccessTokenVerb(),
				pt.getAccessTokenEndpoint());

		String data = Globals.PAYPAL_CLIENT_ID + ":" + Globals.PAYPAL_SECRET_ID;
		String encoding = Base64.encodeBase64String(data.getBytes());

		// System.out.println(encoding);
		request.addHeader("Authorization", "Basic " + encoding);
		request.addHeader("Content-Type", "application/x-www-form-urlencoded");

		request.addQuerystringParameter("client_id", Globals.PAYPAL_CLIENT_ID);
		request.addQuerystringParameter("secret", Globals.PAYPAL_SECRET_ID);
		request.addQuerystringParameter(OAuthConstants.CODE, code);
		request.addQuerystringParameter(OAuthConstants.REDIRECT_URI,
				Paypal2Api.REDIRECT_URL);
		request.addQuerystringParameter(Paypal2Api.GRANT_TYPE,
				Paypal2Api.AUTHORIZATION_CODE);

		Response response = request.send();

		return response.getBody();
	}

	public static void main(String[] args) {
		OAuthService service = new ServiceBuilder().provider(Paypal2Api.class)
				.apiKey(Globals.PAYPAL_CLIENT_ID)
				.apiSecret(Globals.PAYPAL_SECRET_ID).scope(SCOPE)
				.callback(REDIRECT_URL).build();

		System.out.println(service.getAuthorizationUrl(null));
	}
}