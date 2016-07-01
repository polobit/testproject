package com.agilecrm.widgets;

import java.util.ArrayList;
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
public class CustomWidget extends Widget {
	// Dao
	public static ObjectifyGenericDao<CustomWidget> dao = new ObjectifyGenericDao<CustomWidget>(
			CustomWidget.class);

	public void save() {
		this.widget_type = WidgetType.CUSTOM;
		this.save();
	}

	public static List<Widget> getCurrentWidgets() {
		// Creates Current AgileUser key
		List<Widget> widgets = new ArrayList<Widget>();
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
				AgileUser.getCurrentAgileUser().id);
		widgets.addAll(dao.ofy().query(Widget.class).ancestor(userKey)
				.filter("widget_type", WidgetType.CUSTOM).list());
		widgets.addAll(dao.ofy().query(CustomWidget.class).ancestor(userKey)
				.list());
		return widgets;
	}

	public static void deleteCustomWidget(String widgetName) {
		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
				AgileUser.getCurrentAgileUser().id);

		CustomWidget csWidget = dao.ofy().query(CustomWidget.class)
				.ancestor(userKey).filter("name", widgetName).get();

		csWidget.delete();
	}
	
	public static void deleteCustomWidgetByUserID(String userID, String widgetName) {
		// Creates Current AgileUser key
		if(userID != null){
			Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, Long.parseLong(userID));
			CustomWidget csWidget = dao.ofy().query(CustomWidget.class)
				.ancestor(userKey).filter("name", widgetName).get();
			if(csWidget != null){
				csWidget.delete();
			}		
		}
	}

	/**
	 * Deletes the widget
	 */
	public void delete() {
		dao.delete(this);
	}

}
