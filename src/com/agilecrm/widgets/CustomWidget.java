package com.agilecrm.widgets;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
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
	dao.put(this);
    }

    /**
     * Deletes the widget
     */
    public void delete()
    {
	dao.delete(this);
    }

}
