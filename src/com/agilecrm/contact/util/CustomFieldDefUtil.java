package com.agilecrm.contact.util;

import java.util.List;

import com.agilecrm.contact.CustomFieldDef;
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
    public static List<CustomFieldDef> getAllCustomFields() throws Exception
    {
	return dao.fetchAll();
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
}
