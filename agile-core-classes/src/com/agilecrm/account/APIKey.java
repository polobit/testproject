package com.agilecrm.account;

import java.math.BigInteger;
import java.security.SecureRandom;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.account.util.APIKeyUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>APIKey</code> is the class that generates unique random key for each
 * domain user. Assigns domain user key to api key in prepersist.
 * 
 */
@XmlRootElement
@Cached
public class APIKey
{

    /**
     * Id of APIKey
     */
    @Id
    public Long id;

    /**
     * Api key that is generated
     */
    public String api_key;

    // JS API Key
    public String js_api_key;

    // Allowed Domains
    public String allowed_domains = "localhost, *";

    // Blocked IP Addresses String
    public String blocked_ips = null;

    /**
     * Domain User Key
     */
    @NotSaved(IfDefault.class)
    public Key<DomainUser> owner = null;

    /**
     * Dao
     */
    private static ObjectifyGenericDao<APIKey> dao = new ObjectifyGenericDao<APIKey>(APIKey.class);

    /**
     * Default APIKey.
     */
    APIKey()
    {

    }

    /**
     * Constructs a new {@link APIKey} with apikey generated.
     * 
     * @param randomNumber
     *            - Random Number generated.
     */
    APIKey(String apiKey, String jsAPIKey)
    {
	this.api_key = apiKey;
	this.js_api_key = jsAPIKey;
    }

    /**
     * Returns generated apikey. Generates apikey and save in datastore.
     * 
     * @return random apikey.
     */
    public static APIKey generateAPIKey()
    {
	// Generate two randoms for API Key and JS API Key
	APIKey apiKeyObject = new APIKey(generateRandom(), generateRandom());
	dao.put(apiKeyObject);
	return apiKeyObject;
    }

    // Generate Random Number
    private static String generateRandom()
    {
	SecureRandom random = new SecureRandom();
	return new BigInteger(130, random).toString(32);
    }

    // Regenerate API Key
    public static APIKey regenerateAPIKey()
    {
	APIKey apiKey = APIKeyUtil.getAPIKey();

	// Set new Random Number
	apiKey.api_key = generateRandom();

	dao.put(apiKey);
	return apiKey;
    }

    // Regenerate JS API Key
    public static APIKey regenerateJSAPIKey()
    {
	APIKey apiKey = APIKeyUtil.getAPIKey();

	// Set new Random Number
	apiKey.js_api_key = generateRandom();

	dao.put(apiKey);
	return apiKey;
    }

    /**
     * Assigns owner key to api-key before saving into data store. Gets domain
     * id from session and then creates domain user key.
     */
    @PrePersist
    void prePersist()
    {
	owner = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());
    }

    // Load JS API Key for the first time for old users
    @PostLoad
    void setJSAPIKey()
    {
	// Set JS API Key to API Key for the old users
	if (js_api_key == null)
	    js_api_key = api_key;
    }

}