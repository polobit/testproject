package com.agilecrm.projectedpojos;

import java.util.List;

import com.google.appengine.api.datastore.Entity;

public class ProjectionEntityParse {
	 public ProjectionEntityParse(){}
	
     public Object parseEntity(Entity entity){
    	 return null;
     }
     
     public Object getPropertyValue(Entity entity, String propertyName){
    	if(entity.hasProperty(propertyName))
    		 return entity.getProperty(propertyName);
    	
    	return null;
     }
     
     public List postProcess(List list){
    	 return list;
     }
}
