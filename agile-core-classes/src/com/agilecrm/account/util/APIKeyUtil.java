package com.agilecrm.account.util;

import java.math.BigInteger;
import java.security.SecureRandom;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.APIKey;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.cache.CachingDatastoreServiceFactory;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>APIKey</code> is the class that generates unique random key for each
 * domain user. Assigns domain user key to api key in prepersist.
 * 
 */
public class APIKeyUtil
{
	
	 /**
     * Dao
     */
    private static ObjectifyGenericDao<APIKey> dao = new ObjectifyGenericDao<APIKey>(APIKey.class);
    
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
	return dao.ofy().query(APIKey.class).filter("api_key", key).count() > 0;	
    }
    
    /**
     * Checks whether JS api is related to this domain, used while verifying JsAPI
     * request in JsAPiFilter
     * 
     * @param key
     *            APIKey to be verified
     * @return {@link Boolean} Returns true if APIKey exists in current domain
     *         and vice-versa
     */
    public static Boolean isJSAPIKeyPresent(String key)
    {
	// Queries APIKey entities with the apikey parameter
	return dao.ofy().query(APIKey.class).filter("js_api_key", key).count() > 0;	
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

	return apiKeyObject.apiKeyOwner();
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
	Key<DomainUser> userKey = getDomainUserKeyRelatedToAPIKey(apiKey);

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
    public static Key<AgileUser> getAgileUserRelatedToAPIKey(String apiKey)
    {
    // Fetches APIKey object and returns domain user key.
    Key<DomainUser> userKey = getDomainUserKeyRelatedToAPIKey(apiKey);

	if (userKey == null)
	    return null;

	return AgileUser.getCurrentAgileUserKeyFromDomainUser(userKey.getId());
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
    private static Query validJSOrRestAPIKeyQuery(String apiKey)
    {
    	Filter filter = CompositeFilterOperator.or(
   	         FilterOperator.EQUAL.of("js_api_key", apiKey),
   	         FilterOperator.EQUAL.of("api_key", apiKey));
    	
    	return new Query("APIKey").setFilter(filter);
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
    public static Boolean isValidJSOrRestAPIKey(String apiKey)
    {
    	if(StringUtils.isBlank(apiKey))
    		  return false;
    	
    	if(isPresent(apiKey) || isJSAPIKeyPresent(apiKey))
    		  return true;
    	
    	return false;
    	// return (getDataStore().prepare(validJSOrRestAPIKeyQuery(apiKey)).countEntities() > 0);
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
    public static DomainUserPartial getAPIKeyDomainUser(String apiKey)
    {
    	
    	Key<DomainUser> owner = getAPIKeyDomainOwnerKey(apiKey);
    	if(owner != null)
    		return DomainUserUtil.getPartialDomainUser(owner.getId());
    	
    	return null;
    	
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
    public static Key<DomainUser> getAPIKeyDomainOwnerKey(String apiKey)
    {
    	if(StringUtils.isBlank(apiKey))
    		 return null;
    	
    	Entity entity = getDataStore().prepare(validJSOrRestAPIKeyQuery(apiKey)).asSingleEntity();
    	if(entity == null || !entity.hasProperty("owner"))
    		  return null;
    	
    	com.google.appengine.api.datastore.Key domainUserKey = (com.google.appengine.api.datastore.Key) entity.getProperty("owner");
    	return new Key<DomainUser>(DomainUser.class, domainUserKey.getId());
    }
    
    /**
     * Gets native datastore singleton reference
     * @return
     */
    private static DatastoreService getDataStore(){
    	return CachingDatastoreServiceFactory.getDatastoreService();
    }
}