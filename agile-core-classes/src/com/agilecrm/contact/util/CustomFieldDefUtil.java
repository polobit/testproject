package com.agilecrm.contact.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.activities.Event;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.CustomFieldDef.Type;
import com.agilecrm.db.ObjectifyGenericDao;

/**
 * <code>CustomFieldDefUtil</code> is a utility class used to process data of
 * {@link CustomFieldDef} class. Its processed only when fetching the data from
 * <code>Event<code> class
 * <p>
 * This utility class includes methods need to return different types of custom fields.
 * Its methods return all custom fields, custom field tracked by an id and
 * custom field by its label name.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
public class CustomFieldDefUtil
{
    // Dao
    private static ObjectifyGenericDao<CustomFieldDef> dao = new ObjectifyGenericDao<CustomFieldDef>(
	    CustomFieldDef.class);

    /**
     * Fetches all the custom fields
     * 
     * @return List of custom fields
     * @throws Exception
     */
    public static List<CustomFieldDef> getAllCustomFields()
    {
	return dao.fetchAll();
    }

    public static List<CustomFieldDef> getAllCustomFields(SCOPE scope)
    {
	if (scope == null)
	    return getAllCustomFields();

	if (scope == SCOPE.PERSON || scope == SCOPE.CONTACT)
	    return getAllContactCustomField();
	System.out.println("scope : " + scope);
	return dao.listByProperty("scope", scope);
    }

    public static List<CustomFieldDef> getAllContactCustomField()
    {
	List<CustomFieldDef> contactCustomFields = new ArrayList<CustomFieldDef>();
	for (CustomFieldDef field : dao.fetchAll())
	{
	    if (field.scope == null || field.scope == SCOPE.CONTACT || field.scope == SCOPE.PERSON)
		contactCustomFields.add(field);
	}

	return contactCustomFields;
    }

    public static List<CustomFieldDef> getCustomFields(boolean isSearchable)
    {
	return dao.listByProperty("searchable", isSearchable);
    }

    public static List<CustomFieldDef> getSearchableCustomFields()
    {
	return getCustomFields(true);
    }

    public static List<CustomFieldDef> getSearchableCustomFieldsByScope(SCOPE scope)
    {
    List<CustomFieldDef> contactCustomFieldsList = new ArrayList<CustomFieldDef>();
    if(scope!=null && (scope==SCOPE.CONTACT || scope==SCOPE.PERSON)){
    	Map<String, Object> map = new HashMap<String, Object>();
    	map.put("searchable", true);
		List<CustomFieldDef> customFieldsList = dao.listByProperty(map);;
		for(CustomFieldDef cfd : customFieldsList){
			if(cfd.scope==SCOPE.CONTACT || cfd.scope==SCOPE.PERSON || cfd.scope==null)
				contactCustomFieldsList.add(cfd);
		}
		return contactCustomFieldsList;
    }
	Map<String, Object> map = new HashMap<String, Object>();
	map.put("searchable", true);
	map.put("scope", scope);
	return dao.listByProperty(map);
    }
    
    public static List<CustomFieldDef> getAllRequiredCustomFields(boolean isRequired)
    {
	return dao.listByProperty("is_required", isRequired);
    }

    public static List<CustomFieldDef> getRequiredCustomFields()
    {
	return getAllRequiredCustomFields(true);
    }

    public static List<CustomFieldDef> getRequiredCustomFieldsByScope(SCOPE scope)
    {
    List<CustomFieldDef> contactCustomFieldsList = new ArrayList<CustomFieldDef>();
    if(scope!=null && (scope==SCOPE.CONTACT || scope==SCOPE.PERSON)){
    	Map<String, Object> map = new HashMap<String, Object>();
    	map.put("is_required", true);
		List<CustomFieldDef> customFieldsList = dao.listByProperty(map);;
		for(CustomFieldDef cfd : customFieldsList){
			if(cfd.scope==SCOPE.CONTACT || cfd.scope==SCOPE.PERSON || cfd.scope==null)
				contactCustomFieldsList.add(cfd);
		}
		return contactCustomFieldsList;
    }
	Map<String, Object> map = new HashMap<String, Object>();
	map.put("is_required", true);
	map.put("scope", scope);
	return dao.listByProperty(map);
    }
    
    public static List<CustomFieldDef> getCustomFieldsByScope(SCOPE scope)
    {
	Map<String, Object> map = new HashMap<String, Object>();
	map.put("scope", scope);
	return dao.listByProperty(map);
    }

    public static List<CustomFieldDef> getCustomFieldsByScopeAndType(SCOPE scope, String type)
    {
	Map<String, Object> map = new HashMap<String, Object>();
	map.put("field_type", CustomFieldDef.Type.valueOf(type.toUpperCase()));
	map.put("scope", scope);
	return dao.listByProperty(map);
    }

    /**
     * Fetches a custom field based on the id
     * 
     * @param id
     *            unique id of the custom field
     * @return {@link CustomFieldDef} related to the id
     */
    public static CustomFieldDef getCustomField(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fetches custom field based on the label name
     * 
     * @param field_label
     * @return
     */
    public static CustomFieldDef getFieldByName(String field_label)
    {
	return dao.getByProperty("field_label", field_label);
    }

    public static CustomFieldDef getFieldByName(String field_label, SCOPE scope)
    {
	Map<String, Object> query = new HashMap<String, Object>();
	query.put("field_label", field_label);
	query.put("scope", scope);
	return dao.getByProperty(query);
    }

    public static List<CustomFieldDef> getFieldByType(String type)
    {
	return dao.listByProperty("field_type", CustomFieldDef.Type.valueOf(type.toUpperCase()));
    }

    public static List<String> getFieldLabelsByType(SCOPE scope, Type type)
    {
	List<String> customFieldLabels = new ArrayList<String>();

	try
	{
	    List<CustomFieldDef> contactCustomFields = CustomFieldDefUtil.getCustomFieldsByScopeAndType(scope,
		    String.valueOf(type));

	    // Add labels to list
	    for (CustomFieldDef customField : contactCustomFields)
		customFieldLabels.add(customField.field_label);

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in AgileTaskletUtil static block..." + e.getMessage());
	    e.printStackTrace();
	}

	return customFieldLabels;
    }
    public static  List<CustomFieldDef> getAllScopesOfCustomFields(){
    	List<CustomFieldDef> scopesList=new ArrayList<CustomFieldDef>();
    	List<SCOPE> scList=new ArrayList<SCOPE>();
    	try {
    		scList.add(SCOPE.CONTACT);
    		scList.add(SCOPE.COMPANY);
    		scList.add(SCOPE.DEAL);
    		scList.add(SCOPE.CASE);
    		for(SCOPE sc : scList){
    			CustomFieldDef cfd = new CustomFieldDef();
				cfd.scope=sc;
				scopesList.add(cfd);
    		}
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return scopesList;
    }
    public static List<CustomFieldDef> getCustomFieldsByScopeAndPosition(SCOPE scope){
    	List<CustomFieldDef> customFieldsList = new ArrayList<CustomFieldDef>();
    	List<CustomFieldDef> customFieldsListWithoutPosition = new ArrayList<CustomFieldDef>();
    	List<CustomFieldDef> customFieldsListWithPosition = new ArrayList<CustomFieldDef>();
    	try {
    		if(scope!=null && (scope==SCOPE.CONTACT || scope==SCOPE.PERSON)){
    			
    			//For new custom fields position column is existed in DB so get them with position order
        		customFieldsListWithPosition = dao.ofy().query(CustomFieldDef.class).order("position").list();
        		
        		//For old custom fields position column is not existed in DB so get them without position order
        		customFieldsListWithoutPosition = dao.ofy().query(CustomFieldDef.class).list();
        		
        		for(CustomFieldDef cfd : customFieldsListWithoutPosition){
        			if(cfd.position==0 && (cfd.scope==SCOPE.CONTACT || cfd.scope==SCOPE.PERSON || cfd.scope==null))
        				customFieldsList.add(cfd);
        		}
        		
        		for(CustomFieldDef cfd : customFieldsListWithPosition){
        			if(cfd.scope==SCOPE.CONTACT || cfd.scope==SCOPE.PERSON || cfd.scope==null)
        				customFieldsList.add(cfd);
        		}
    		}else{
    			//For new custom fields position column is existed in DB so get them with position order
        		customFieldsListWithPosition = dao.ofy().query(CustomFieldDef.class).filter("scope", scope).order("position").list();
        		
        		//For old custom fields position column is not existed in DB so get them without position order
        		customFieldsListWithoutPosition = dao.ofy().query(CustomFieldDef.class).filter("scope", scope).list();
        		for(CustomFieldDef cfd : customFieldsListWithoutPosition){
        			if(cfd.position==0)
        				customFieldsList.add(cfd);
        		}
        		for(CustomFieldDef cfd : customFieldsListWithPosition){
        			customFieldsList.add(cfd);
        		}
    		}
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return customFieldsList;
    }
    public static List<CustomFieldDef> getCustomFieldsByPosition(){
    	List<CustomFieldDef> customFieldsList = new ArrayList<CustomFieldDef>();
    	List<CustomFieldDef> customFieldsListWithoutPosition = new ArrayList<CustomFieldDef>();
    	List<CustomFieldDef> customFieldsListWithPosition = new ArrayList<CustomFieldDef>();
    	try {
    		//For new custom fields position column is existed in DB so get them with position order
    		customFieldsListWithPosition = dao.ofy().query(CustomFieldDef.class).order("position").list();
    		
    		//For old custom fields position column is not existed in DB so get them without position order
    		customFieldsListWithoutPosition = dao.ofy().query(CustomFieldDef.class).list();
    		for(CustomFieldDef cfd : customFieldsListWithoutPosition){
    			if(cfd.position==0)
    				customFieldsList.add(cfd);
    		}
    		for(CustomFieldDef cfd : customFieldsListWithPosition){
    			customFieldsList.add(cfd);
    		}
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return customFieldsList;
    }

}
