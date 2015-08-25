package com.agilecrm.widgets;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;

/**
 * <code>CustomWidget</code> class
 * 
 */
@XmlRootElement
@Cached
public class CustomWidget extends Widget
{
    // Dao
    public static ObjectifyGenericDao<CustomWidget> dao = new ObjectifyGenericDao<CustomWidget>(CustomWidget.class);

    public void save()
    {
    	this.widget_type = WidgetType.CUSTOM;
    	this.isForAll = this.custom_isForAll;
    	super.save();
    }
    
    public static List<CustomWidget> getCurrentWidgets(){
    	// Creates Current AgileUser key
    	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);

    	return dao.ofy().query(CustomWidget.class).ancestor(userKey).list();
    }

    /**
     * Deletes the widget
     */
    public void delete()
    {
	dao.delete(this);
    }

}
