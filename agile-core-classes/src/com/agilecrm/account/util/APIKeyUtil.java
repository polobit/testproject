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
    	
    	return (getDataStore().prepare(validJSOrRestAPIKeyQuery(apiKey)).countEntities() > 0);
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
    	
    	return (Key<DomainUser>) entity.getProperty("owner");
    	
    }
    
    /**
     * Gets native datastore singleton reference
     * @return
     */
    private static DatastoreService getDataStore(){
    	return CachingDatastoreServiceFactory.getDatastoreService();
    }
}