package com.agilecrm.contact.customview;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>ContactView</code> represents the contact view, It store the list of
 * fields in fields_set element as ordered set, it is used to customize the view
 * at client side, based on the fields_set.
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
@Unindexed
@Cached
public class CustomView implements Comparable<CustomView>
{

    // Key
    @Id
    public Long id;

    /** Name of the contact custom view */
    @Indexed
    @NotSaved(IfDefault.class)
    public String name = null;

    /** List of fields, LinkedHashSet to preserve the order of the fields */
    @NotSaved(IfDefault.class)
    public LinkedHashSet<String> fields_set = new LinkedHashSet<String>();

    // Dao
    public static ObjectifyGenericDao<CustomView> dao = new ObjectifyGenericDao<CustomView>(CustomView.class);

    public CustomView()
    {

    }

    public CustomView(String view_name, LinkedHashSet<String> fields_set)
    {

	this.name = view_name;
	this.fields_set = fields_set;

    }

    // Get list of contact views
    /**
     * Gets all the views
     * 
     * @return {@link List} of {@link CustomView}
     */
    public static List<CustomView> getContactViewList()
    {

    	// Fetches all the Views
    	List<CustomView> customViews = dao.fetchAll();
    	if(customViews == null || customViews.isEmpty()) {
			return customViews;
		}
    	Collections.sort(customViews);
    	return customViews;
    }

    // Get contact view by id
    /**
     * Fetches view based on the id, whenever a view is selected it is fetched
     * based on id and returned
     * 
     * @param id
     *            {@link Long} Id of the entity
     * @return {@link CustomView}
     */
    public static CustomView getContactView(Long id)
    {

	// Fetch view by id, entity is not found returns null
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
     * Saves current instance of {@link CustomView}
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * To String implementation of {@link CustomView}
     */
    public String toString()
    {
	return "id: " + id + " fields_set: " + fields_set + " view_name" + name;
    }

	@Override
	public int compareTo(CustomView customView) {
		if(this.name == null && customView.name != null) {
			return -1;
		} else if(this.name != null && customView.name == null) {
			return 1;
		} else if(this.name == null && customView.name == null) {
			return 0;
		}
		return this.name.compareToIgnoreCase(customView.name);
	}

}
