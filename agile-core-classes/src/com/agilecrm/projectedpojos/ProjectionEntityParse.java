package com.agilecrm.projectedpojos;

import java.util.List;

import com.google.appengine.api.datastore.Entity;

/**
 * Entity methods to convert type of View Object prefs. 
 * Overridden methods should have implementation
 * @author govindchunchula
 *
 */
public class ProjectionEntityParse {
	/**
	 * 
	 */
	 public ProjectionEntityParse(){}
	
	 /**
	  * Parser 
	  * @param entity
	  * @return
	  */
     public Object parseEntity(Entity entity){
    	 return null;
     }
     
     /**
      * Get entity property value
      * @param entity
      * @param propertyName
      * @return
      */
     public Object getPropertyValue(Entity entity, String propertyName){
    	if(entity.hasProperty(propertyName))
    		 return entity.getProperty(propertyName);
    	
    	return null;
     }
     
     /**
      * Post process action for list of returned results
      * @param list
      * @return
      */
     public List postProcess(List list){
    	 return list;
     }
}
