package com.agilecrm.scribe.login.serviceproviders;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.DefaultApi10a;
import org.scribe.builder.api.DefaultApi20;
import org.scribe.model.OAuthConstants;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import com.agilecrm.scribe.api.GoogleApi;
import com.agilecrm.session.UserInfo;

/**
 * <code>OAuthLoginService</code> provides guidelines to impletement service
 * provider connector classes.
 * 
 * @author yaswanth
 * 
 */
public interface OAuthLoginService
{
    /**
     * Provides services object based on underlying provider class
     * 
     * @return ({@link OAuthService}
     */
    public OAuthService getService();

    /**
     * Generates token based on OAuth code. Used for OAuth 2 calls
     * 
     * @param code
     * @return
     */
    public Token getToken(String code);

    /**
     * Returns scopes of implemented provider class
     * 
     * @return
     */
    public String getScope();

    public String getCallback();

    /**
     * Provision to set callback it is required to set custom return types
     * sometimes
     * 
     * @param callback
     */
    public void setCallback(String callback);

    /**
     * Creates and Returns User info based on the response from endpoint
     * 
     * @return
     */
    public UserInfo getUserInfo();
}

/**
 * <code>LoginServerAdapter</code> class for login services using OAuth 1.0 and
 * 2.0.
 * 
 * Extending this class and defined secret and API keys will automatically
 * generate {@link OAuthService} and overrides few methods to add extra
 * parameters which are required by few service providers (ex: Google requires
 * extra parameters like "grant_type")
 * 
 * It Contains abstract method to force implemented classes to write wrapper to
 * wrap response form profile end point into {@link UserInfo}
 * 
 * @author Yaswanth
 * 
 */
abstract class OAuthLoginServiceAdapter implements OAuthLoginService
{

    /**
     * Preferences/configuration of service provider. Appropriate values should
     * be assigned in implemented classes
     */
    protected String scope = null;
    protected Class<? extends DefaultApi20> apiClassV20 = null;
    protected Class<? extends DefaultApi10a> apiClassV10a = null;
    protected String client_id = null;
    protected String client_secret = null;
    protected String callback = null;
    private OAuthRequest request;
    protected String userinfo_endpoint = "";

    // Provider service
    private OAuthService service;

    private DefaultApi20 providerOAuth2;

    private Token token;

    /**
     * Creates service object based on its implemented classes preferences.
     */
    @Override
    public OAuthService getService()
    {
	System.out.println("parent intance");
	Class<? extends Api> apiClass = apiClassV20 == null ? apiClassV10a : apiClassV20;

	// TODO Auto-generated method stub
	service = new ServiceBuilder().provider(apiClass).callback(getCallback()).apiKey(client_id)
		.apiSecret(client_secret).scope(getScope()).build();
	System.out.println(service);
	return service;
    }

    /**
     * 
     * @return
     */
    public UserInfo getUserInfo()
    {
	if (service == null)
	    return null;

	// Send OAuth Request to user info end point
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, userinfo_endpoint);
	service.signRequest(token, oAuthRequest);
	Response response = oAuthRequest.send();

	System.out.println(token);

	// Wrap response in to user info object. Wraper functionality will be
	// implemented in respective child implementations
	return wrapResponseToUserInfo(response.getBody());
    }

    /**
     * Wraps user info response from service provider profile endpoint to Agile
     * UserInfo object. As it is abstract method child classes will be forced to
     * implement user info wrapper for its provider response
     * 
     * @param reposnse
     * @return
     */
    public abstract UserInfo wrapResponseToUserInfo(String reposnse);

    /**
     * Exchanges OAuth code for Access token. It gets token based on OAuth type.
     * 
     * If type of OAuth request is version 2.0, then OAuth request is made with
     * appropriate parameters and refresh token, access token are fetched and
     * token object is returned
     * 
     * @param code
     * @return
     */
    public Token getToken(String code)
    {
	String response;

	// Performs actions based on OAuth request version
	if (service.getVersion().equals("2.0"))
	{
	    // Creates OAuth request with standard parameters and custom
	    // parameters form provider subclases if any
	    response = createOAuthRequest(code).send().getBody();

	    /**
	     * Converts token response into map so it can be used to wrap
	     * response on token object. Existing wrapper in Scribe lib is
	     * wrapping it incorrectly for direct strings. (it is excepting
	     * "access_token= %s", where mostly results will be in json format
	     * "access_token:")
	     */
	    Map<String, String> tokenMap = convertResponseStringToMap(response);

	    // Creates a token object and returns
	    token = new Token(tokenMap.get(OAuthConstants.ACCESS_TOKEN), "", response);

	    return token;
	}

	// OAuth request version is 1, then token can be fetched using standard
	// function available
	token = service.getAccessToken(service.getRequestToken(), new Verifier(code));
	response = token.getRawResponse();

	return token;
    }

    /**
     * Custom OAuth parameters added while sending OAuth request. ex google need
     * some custom parameter to be sent login with request
     * 
     * @return
     */
    protected Map<String, String> getCustomOAuthParameters()
    {
	return new HashMap<String, String>();
    }

    @Override
    public String getScope()
    {
	// TODO Auto-generated method stub
	return scope;
    }

    /**
     * Creates OAuth request with preferences/permissions set in implemented
     * service provider classes
     * 
     * @param oauthToken
     * @return
     * @throws InstantiationException
     * @throws IllegalAccessException
     */
    protected OAuthRequest createOAuthRequest(String oauthToken)
    {

	// Creates provier class object
	try
	{
	    providerOAuth2 = apiClassV20.newInstance();
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return new OAuthRequest(null, null);
	}

	request = new OAuthRequest(providerOAuth2.getAccessTokenVerb(), providerOAuth2.getAccessTokenEndpoint());

	Map<String, String> params = new HashMap<String, String>();

	System.out.println(oauthToken);
	params.put(OAuthConstants.CLIENT_ID, client_id);
	params.put(OAuthConstants.CLIENT_SECRET, client_secret);
	params.put(OAuthConstants.CODE, oauthToken);
	params.put(OAuthConstants.REDIRECT_URI, GoogleApi.getRedirectURL());
	if (!org.apache.commons.lang.StringUtils.isEmpty(scope))
	    params.put(OAuthConstants.SCOPE, scope);
	params.putAll(getCustomOAuthParameters());

	// According to type of request, parameters are added either as body
	// parameters or query parameters
	if (request.getVerb() == Verb.POST)
	    addBodyParameters(params);
	else
	    addQueryParameters(params);

	return request;

    }

    /**
     * Adds all parameters as body parameters. Used when sending post request of
     * service provider
     * 
     * @param params
     */
    private void addBodyParameters(Map<String, String> params)
    {
	for (Entry<String, String> entry : params.entrySet())
	{
	    request.addBodyParameter(entry.getKey(), entry.getValue());
	}

    }

    /**
     * Adds all parameters as query parameters. Used when sending get request of
     * service provider
     * 
     * @param params
     */
    private void addQueryParameters(Map<String, String> params)
    {
	for (Entry<String, String> entry : params.entrySet())
	{
	    request.addQuerystringParameter(entry.getKey(), entry.getValue());
	}
    }

    @Override
    public String getCallback()
    {
	// TODO Auto-generated method stub
	return callback;
    }

    public void setCallback(String callback)
    {
	this.callback = callback;
    }

    /**
     * Convert response in to map object
     * 
     * @param response
     * @return
     */
    public static Map<String, String> convertResponseStringToMap(String response)
    {
	HashMap<String, String> properties;
	try
	{
	    System.out.println(response);
	    properties = new ObjectMapper().readValue(response, new TypeReference<HashMap<String, String>>()
	    {
	    });
	    return properties;
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    return new HashMap<String, String>();
	    // TODO Auto-generated catch block

	}
    }

}