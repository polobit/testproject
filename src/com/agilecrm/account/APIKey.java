package com.agilecrm.account;

import java.math.BigInteger;
import java.security.SecureRandom;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>APIKey</code> is the class that generates unique random key for each
 * domain user. Assigns domain user key to api key in prepersist.
 * 
 */
@XmlRootElement
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

    /**
     * Domain User Key
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> owner = null;

    /**
     * Dao
     */
    private static ObjectifyGenericDao<APIKey> dao = new ObjectifyGenericDao<APIKey>(
	    APIKey.class);

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
    APIKey(String randomNumber)
    {
	this.api_key = randomNumber;
    }

    /**
     * Returns api key with respect to domain id of that session.
     * 
     * @return api key.
     */
    public static APIKey getAPIKey()
    {
	APIKey apiKey = getAPIKeyRelatedToUser(SessionManager.get()
		.getDomainId());
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
	SecureRandom random = new SecureRandom();
	String randomNumber = new BigInteger(130, random).toString(32);

	APIKey apiKey = new APIKey(randomNumber);

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
	Key<DomainUser> currentUserKey = new Key<DomainUser>(DomainUser.class,
		domainUserId);

	// Queries to get APIKey entity related to domain user key
	return dao.ofy().query(APIKey.class).filter("owner", currentUserKey)
		.get();

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
	APIKey apiKey = dao.ofy().query(APIKey.class).filter("api_key", key)
		.get();

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
	return dao.ofy().query(APIKey.class).filter("api_key", apiKey).get().owner;
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
	Key<DomainUser> domainUserKey = dao.ofy().query(APIKey.class)
		.filter("api_key", apiKey).get().owner;
	return AgileUser.getCurrentAgileUserFromDomainUser(domainUserKey
		.getId());
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
     * Returns api key of domain user who created campaign. Used to get apikey
     * in tasklets of campaign.
     * 
     * @param campaignJSON
     *            - Campaign JSONObject
     * @return api key
     */
    public static String getAPIKeyFromCampaignJSON(JSONObject campaignJSON)
    {
	String domainId = null;
	try
	{
	    domainId = campaignJSON.getString("domainUserId");
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	APIKey apiKey = APIKey.getAPIKeyRelatedToUser(Long.parseLong(domainId));

	if (apiKey == null)
	    return null;

	return apiKey.api_key;
    }

    /**
     * Assigns owner key to api-key before saving into data store. Gets domain
     * id from session and then creates domain user key.
     */
    @PrePersist
    void prePersist()
    {
	owner = new Key<DomainUser>(DomainUser.class, SessionManager.get()
		.getDomainId());
    }
}
