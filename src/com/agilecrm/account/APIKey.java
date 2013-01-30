package com.agilecrm.account;

import java.math.BigInteger;
import java.security.SecureRandom;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class APIKey
{

    // Key
    @Id
    public Long id;

    // Api Key
    public String api_key;

    @NotSaved(IfDefault.class)
    private Key<DomainUser> owner = null;

    // Dao
    private static ObjectifyGenericDao<APIKey> dao = new ObjectifyGenericDao<APIKey>(
	    APIKey.class);

    APIKey()
    {

    }

    APIKey(String randomNumber)
    {
	this.api_key = randomNumber;
    }

    // Get API Key
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

    // Generate API Key
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

    public static Key<DomainUser> getDomainUserIdRelatedToAPIKey(String apiKey)
    {
    	return dao.ofy().query(APIKey.class).filter("api_key", apiKey).get().owner;
    }
    
    public static AgileUser getAgileUserRelatedToAPIKey(String apiKey)
    {
    	Key<DomainUser> domainUserKey =  dao.ofy().query(APIKey.class).filter("api_key", apiKey).get().owner;
    	return AgileUser.getCurrentAgileUserFromDomainUser(domainUserKey.getId());
    }

    @PrePersist
    void prePersist()
    {
	owner = new Key<DomainUser>(DomainUser.class, SessionManager.get()
		.getDomainId());
    }

}
