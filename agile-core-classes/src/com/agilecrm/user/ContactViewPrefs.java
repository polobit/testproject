package com.agilecrm.user;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>ContactViewPrefs</code> is the base class for user's contact view
 * preferences. User can select properties properties from contacts that will be
 * shown on user's contact view page. The preferences can be changed any time by
 * an user. </p>
 * <p>
 * <code>@JsonIgnoreProperties(ignoreUnknown=true)</code> annotation is used to
 * ignore properties that aren't used.
 * </p>
 * 
 */
@XmlRootElement
@JsonIgnoreProperties(ignoreUnknown = true)
@Cached
public class ContactViewPrefs
{
    /**
     * UserPrefs Id.
     */
    @Id
    public Long id;

    /** List of fields, LinkedHashSet to preserve the order of the fields */
    @NotSaved(IfDefault.class)
    public LinkedHashSet<String> fields_set = new LinkedHashSet<String>();
    /**
     * AgileUser Key.
     */
    @Parent
    private Key<AgileUser> user;

    /**
     * Specifies the scope of the custom field should be added
     */
    public static enum Type
    {
	PERSON, COMPANY
    };

    @NotSaved(IfDefault.class)
    public Type type = Type.PERSON;

    /**
     * UserPrefs Dao.
     */
    private static ObjectifyGenericDao<ContactViewPrefs> dao = new ObjectifyGenericDao<ContactViewPrefs>(
	    ContactViewPrefs.class);

    /**
     * Default UserPrefs.
     */
    ContactViewPrefs()
    {

    }

    /**
     * @param userId
     * @param fields_set
     */
    public ContactViewPrefs(Long userId, LinkedHashSet<String> fields_set)
    {
	this.fields_set = fields_set;
	this.user = new Key<AgileUser>(AgileUser.class, userId);
    }

    /**
     * Saves UserPrefs. Wraps DomainUser Name with UserPrefs name.
     */
    public void save()
    {
	dao.put(this);
    }
    /*
	 * method for removing the basic info in the field set
	 */
    @PostLoad
    public  void postLoad()
    { 
    	/*List<String> list = new ArrayList<String>(fields_set);
    	if(this.type == Type.PERSON)
    	{
        	if(list.contains("basic_info"))
        	{
        		list.add(list.indexOf("basic_info"), "first_name");
        		list.add(list.indexOf("first_name")+1,"last_name");
        		list.add(list.indexOf("last_name")+1,"email");
        		list.remove("basic_info");
        	}
        	
    	}
    	else
    	{
    		if(list.contains("basic_info"))
        	{
        		list.add(list.indexOf("basic_info"), "name");
        		list.add(list.indexOf("name")+1,"url");
        		list.remove("basic_info");
        	}
    	}
    	this.fields_set = new LinkedHashSet<String>(list);
    	*/
    }

    /**
     * Deletes UserPrefs.
     */
    public void delete()
    {
	dao.delete(this);
    }
}