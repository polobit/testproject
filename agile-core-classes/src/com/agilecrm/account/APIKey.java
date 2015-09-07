package com.agilecrm.account;

import java.math.BigInteger;
import java.security.SecureRandom;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

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
    private Key<DomainUser> owner = null;

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
     * Returns api key with respect to domain id of that session.
     * 
     * @return api key.
     */
    public static APIKey getAPIKey()
    {
	APIKey apiKey = getAPIKeyRelatedToUser(SessionManager.get().getDomainId());
	if (apiKey == null)
	{
	    // Generate API key and save
	    return generateAPIKey();
	}

	return apiKey;
    }

    /**
     * Returns generated apikey. Generates apikey and save in datastore.
     * 
     * @return random apikey.
     */
    private static APIKey generateAPIKey()
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
	APIKey apiKey = getAPIKey();

	// Set new Random Number
	apiKey.api_key = generateRandom();

	dao.put(apiKey);
	return apiKey;
    }

    // Regenerate JS API Key
    public static APIKey regenerateJSAPIKey()
    {
	APIKey apiKey = getAPIKey();

	// Set new Random Number
	apiKey.js_api_key = generateRandom();

	dao.put(apiKey);
	return apiKey;
    }

    /**
     * Fetches the APIKey related to domain user. This method takes domainUsers
     * id to get APIKey related to domain user. It is used when verifying the
     * domain user and respective APIKey
     * 
     * @param domainUserId
     * @return
     */
    public static APIKey getAPIKeyRelatedToUser(Long domainUserId)
    {
	// Creates a domain user key from the id parameter
	Key<DomainUser> currentUserKey = new Key<DomainUser>(DomainUser.class, domainUserId);

	// Queries to get APIKey entity related to domain user key
	return dao.ofy().query(APIKey.class).filter("owner", currentUserKey).get();

    }

    /**
     * Checks whether api is related to this domain, used while verifying JsAPI
     * request in JsAPiFilter
     * 
     * @param key
     *            APIKey to be verified
     * @return {@link Boolean} Returns true if APIKey exists in current domain
     *         and vice-versa
     */
    public static Boolean isPresent(String key)
    {
	// Queries APIKey entities with the apikey parameter
	APIKey apiKey = dao.ofy().query(APIKey.class).filter("api_key", key).get();

	// Returns true if key exists
	if (apiKey != null)
	    return true;

	return false;
    }

    /**
     * Returns Domain User key with respect to api key.
     * 
     * @param apiKey
     *            - api key of domain user
     * @return Domain user key
     */
    public static Key<DomainUser> getDomainUserKeyRelatedToAPIKey(String apiKey)
    {
	// Get API Object
	APIKey apiKeyObject = dao.ofy().query(APIKey.class).filter("api_key", apiKey).get();
	if (apiKeyObject == null)
	    return null;

	return apiKeyObject.owner;
    }

    /**
     * Returns domain user related ot API key. Domain user key is stored in
     * APIKey entity. Queries with APIKey and fetches domain user based on key
     * saved in owner field
     * 
     * @param apiKey
     * @return
     */
    public static DomainUser getDomainUserRelatedToAPIKey(String apiKey)
    {
	// Fetches APIKey object and returns domain user key.
	Key<DomainUser> userKey = dao.ofy().query(APIKey.class).filter("api_key", apiKey).get().owner;

	if (userKey == null)
	    return null;

	// Fetches domain user based on domainUser id
	return DomainUserUtil.getDomainUser(userKey.getId());

    }

    /**
     * Returns Agile User key with respect to apikey. Gets domain user from api
     * key and then gets agile user from domain user id.
     * 
     * @param apiKey
     *            - api key.
     * @return AgileUser
     */
    public static AgileUser getAgileUserRelatedToAPIKey(String apiKey)
    {
	APIKey key = dao.ofy().query(APIKey.class).filter("api_key", apiKey).get();

	if (key == null)
	    return null;

	Key<DomainUser> domainUserKey = key.owner;

	return AgileUser.getCurrentAgileUserFromDomainUser(domainUserKey.getId());
    }

    /**
     * Returns Api key of Domain Owner. Domain Owner is the domain user having
     * is_account_owner 'true'.
     * 
     * @param domain
     *            - required domain.
     * @return api key of domain owner
     */
    public static APIKey getAPIKeyRelatedToDomain(String domain)
    {
	DomainUser domainUser = DomainUserUtil.getDomainOwner(domain);

	if (domainUser == null)
	    return null;

	return getAPIKeyRelatedToUser(domainUser.id);
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

    /**
     * Returns Agile User key with respect to api key. Gets domain user from js
     * api key and then gets agile user from domain user id.
     * 
     * @param apiKey
     * @return
     */
    public static AgileUser getAgileUserRelatedToJSAPIKey(String apiKey)
    {
	APIKey key = dao.ofy().query(APIKey.class).filter("js_api_key", apiKey).get();

	if (key == null)
	    return null;

	Key<DomainUser> domainUserKey = key.owner;
	return AgileUser.getCurrentAgileUserFromDomainUser(domainUserKey.getId());
    }

    /**
     * Returns domain user related to JSAPI Key. Domain user key is stored in
     * APIKey entity. Queries with JSAPIKey and fetches domain user based on key
     * saved in owner field
     * 
     * @param apiKey
     * @return
     */
    public static DomainUser getDomainUserRelatedToJSAPIKey(String apiKey)
    {
	Key<DomainUser> userKey = dao.ofy().query(APIKey.class).filter("js_api_key", apiKey).get().owner;
	if (userKey == null)
	    return null;
	return DomainUserUtil.getDomainUser(userKey.getId());
    }

    /**
     * Returns Domain User Key with respect to JSAPI key
     * 
     * @param apiKey
     *            - api key of domain user
     * @return Domain user key
     */
    public static Key<DomainUser> getDomainUserKeyRelatedToJSAPIKey(String apiKey)
    {
	APIKey apiKeyObject = dao.ofy().query(APIKey.class).filter("js_api_key", apiKey).get();
	if (apiKeyObject == null)
	    return null;
	return apiKeyObject.owner;
    }

    /**
     * Checks whether api is related to this domain, used while verifying JSAPI
     * request in JSAPI filter
     * 
     * @param key
     *            APIKey to be verified
     * @return {@link Boolean} returns true if JSAPI Key exists in current
     *         domain and vice-versa
     */
    public static Boolean isValidJSKey(String key)
    {
	APIKey apiKey = dao.ofy().query(APIKey.class).filter("js_api_key", key).get();

	if (apiKey != null)
	    return true;
	return false;
    }

    /**
     * Updates the allowed_domains field of APIKey object
     * 
     * @param apiKey
     * @return
     */
    public static APIKey updateAllowedDomains(String allowedDomains)
    {
	APIKey key = getAPIKey();
	key.allowed_domains = allowedDomains;
	dao.put(key);
	return key;
    }

    /**
     * Get allowed_domains field of APIKey Object
     * 
     * @return
     */
    public static String getAllowedDomains()
    {
	APIKey key = getAPIKey();
	return key.allowed_domains;
    }
    
    /**
     * Update blocked ips of APIKey Object
     */
    public static APIKey updateBlockedIps(String blockedIps)
    {
	APIKey key = getAPIKey();
	key.blocked_ips = blockedIps;
	dao.put(key);
	return key;
    }
}