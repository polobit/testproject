package com.agilecrm.user.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AliasDomain;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PropertyProjection;

/**
 * <code>AliasDomainUtil</code> is utility class used to process data of
 * {@link AliasDomain} class, It processes only when fetching the data from
 * <code>AliasDomain<code> class.
 * <p>
 * Sets the name space manager to empty to fetch data. Once fetching is done 
 * sets back to old name space
 * </p>
 * <p>
 * This utility class includes methods needed to return the users based on 
 * alias name of the domain.  
 * </p>
 * 
 * @author
 * 
 */

public class AliasDomainUtil {

	// Dao
    public static ObjectifyGenericDao<AliasDomain> dao = new ObjectifyGenericDao<AliasDomain>(AliasDomain.class);
    
    public static AliasDomain getAliasDomain(){

    	    return getAliasDomain(NamespaceManager.get());
    }
    
    public static AliasDomain getAliasDomainById(Long id){

	    return dao.getByProperty("id", id);
    }
    
    public static AliasDomain getAliasDomain(String domain){
    	String oldNamespace = NamespaceManager.get();
    	NamespaceManager.set("");

    	try
    	{
    	    AliasDomain aliasDomain =  dao.getByProperty("domain", domain);
    	    System.out.println(aliasDomain);
    	    return aliasDomain;
    	}
    	finally
    	{
    	    NamespaceManager.set(oldNamespace);
    	}
    }
    
    public static AliasDomain getAliasDomainByAlias(String alias){
    	String oldNamespace = NamespaceManager.get();
    	NamespaceManager.set("");

    	try
    	{
    	    AliasDomain aliasDomain =  dao.getByProperty("alias", alias);
    	    System.out.println(aliasDomain);
    	    return aliasDomain;
    	}
    	finally
    	{
    	    NamespaceManager.set(oldNamespace);
    	}
    }
    
	public static String getDomainByAlias(String alias){
    	String domain = null;
    	List<Entity> aliaseNames = getAliasNames(alias);
    	if(aliaseNames == null)
    		return null;
    	for (Entity aliaseName : aliaseNames) {
    		domain = (String)aliaseName.getProperty("domain");
    	}
    	return domain;
    }
	
	public static boolean checkForAlias(){
		return checkForAlias(NamespaceManager.get());
	}
	
	public static boolean checkForAlias(String alias){
    	List<Entity> aliaseNames = getAliasNames(alias);
    	if(aliaseNames == null)
    		return false;
    	if(aliaseNames.size() > 0)
    		return true;
    	return false;
	}
	
	public static String getActualDomain(String alias){
		String domain = getDomainByAlias(alias);
		if(domain == null || StringUtils.isEmpty(domain))
			return alias;
		return domain;
	}
	
	public static List<Entity> getAliasNames(String alias){
		if(alias != null && StringUtils.isEmpty(alias))
			return null;
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
		try {
			DatastoreService dataStore = DatastoreServiceFactory.getDatastoreService();
	    	com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AliasDomain");
	    	
	    	query.addProjection(new PropertyProjection("domain", String.class));
	    	query.setFilter(com.google.appengine.api.datastore.Query.FilterOperator.EQUAL.of("alias", alias));
	    	List<Entity> aliaseNames = dataStore.prepare(query).asList(FetchOptions.Builder.withLimit(1));
	    	return aliaseNames;
			
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getMessage(e));
			return null;
		}
		finally{
			NamespaceManager.set(oldNamespace);
		}
	}

}
