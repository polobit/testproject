package com.agilecrm.projectedpojos;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PropertyProjection;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.googlecode.objectify.cache.CachingDatastoreServiceFactory;

/**
 * Projection property dao
 * @author govindchunchula
 *
 * @param <T>
 */
public class PartialDAO<T extends ProjectionEntityParse> {

	/**
     * Stores class name with ".class" extension
     */
    protected Class<T> clazz;
    
    /**
     * We've got to get the associated domain class somehow
     * 
     * @param clazz
     */
    public PartialDAO(Class<T> clazz)
    {
	this.clazz = clazz;
    }

    public Class<T> getClazz()
    {
	return clazz;
    }
    
    /**
     * We got actual db name
     * @return
     */
    private String getActualDAOClassName(){
    	return this.clazz.getSimpleName().replace("Partial", "");
    }
    
    /**
     * Gets native datastore singleton reference
     * @return
     */
    private DatastoreService getDataStore(){
    	return CachingDatastoreServiceFactory.getDatastoreService();
    }
    
    /**
     * Partial Object with given type id
     * @param id
     * @return
     */
    public T get(Long id){
    	// Create a basic query
    	Query query = new Query(getActualDAOClassName(), KeyFactory.createKey(getActualDAOClassName(), id));
    	
    	// Add projection props
    	query = addProjectionFields(query);
    	
    	try {
    		// Process Query
    		Entity entity = getDataStore().prepare(query).asSingleEntity();
    		return (T) this.clazz.newInstance().parseEntity(entity);
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
    	
    	return null;
    	
    }
    /**
     * List of objects with conditional base
     * @param map
     * @return
     */
    public List<T> listByProperty(Map<String, Object> map)
    {
    	Query query = new Query(getActualDAOClassName());
    	
    	// Add conditions
    	query = addQueryFields(query, map);
    	// Add projection props
	    query = addProjectionFields(query);
    	
    	List<T> list = new ArrayList<T>();
    	
    	try {
    		// Process query
    		Iterator<Entity> entities = getDataStore().prepare(query).asIterable().iterator();
        	while (entities.hasNext()) {
    			list.add((T) this.clazz.newInstance().parseEntity(entities.next()));
    		}
        	
        	return this.clazz.newInstance().postProcess(list);
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
    	
    	return null;
    	
    }
    
    /**
     * Add projection properties to query
     * @param query
     * @return
     */
    private Query addProjectionFields(Query query){
    	for(Field f : this.clazz.getFields()) {
      	   if(f.getName().equals("id") || f.getName().equalsIgnoreCase("properties"))
      		    continue;
      	   
      	  query.addProjection(new PropertyProjection(f.getName(), f.getType()));
      	}
    	
    	return query;
    }
    
    /**
     * Add filter conditions to query 
     * @param query
     * @param map
     * @return
     */
    private Query addQueryFields(Query query, Map<String, Object> map){
    	
    	for (String propName : map.keySet())
		{
    		String actualPropName = propName;
	        FilterOperator condition = FilterOperator.EQUAL;
	    	if(propName.contains(" IN"))
	    	{
	    		propName = propName.replace(" IN", "").trim();
	    		condition = FilterOperator.IN;
	    	}
	    	query.addFilter(propName, condition, map.get(actualPropName));
		}
    	
    	return query;
    }
    
}
