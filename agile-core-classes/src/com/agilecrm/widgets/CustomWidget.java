package com.agilecrm.widgets;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.util.WidgetUtil;
import com.google.appengine.api.NamespaceManager;
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
		// System.out.println("Is For All : "+ this.isForAll);
		if (this.custom_isForAll) {
			String domain = NamespaceManager.get();
			System.out.println("*** domain " + domain);
			List<DomainUser> users = DomainUserUtil.getUsers(domain);
			for (DomainUser domainUser : users) {
				System.out.println("*** In For Loop " + domainUser.id);
				// System.out.println("widiget data "+ this.name+ " "+
				// AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id).id
				// );
				AgileUser agileUsr = AgileUser
						.getCurrentAgileUserFromDomainUser(domainUser.id);
				if (agileUsr != null) {
					System.out.println("agile usr " + agileUsr.id);
					Widget widget = WidgetUtil.getCustomWidget(this.name,
							agileUsr.id);
					if (widget == null) {
						this.id = null;
						System.out.println("widget is null *****");
						// System.out.println("user id : "+AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id).id);
						this.user = new Key<AgileUser>(AgileUser.class,
								agileUsr.id);
						dao.put(this);
					}
				}
			}
		} else {
			if (user == null) {
				user = new Key<AgileUser>(AgileUser.class,
						AgileUser.getCurrentAgileUser().id);
			}
			dao.put(this);
		}
	}

	public static List<CustomWidget> getCurrentWidgets() {
		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
				AgileUser.getCurrentAgileUser().id);

		return dao.ofy().query(CustomWidget.class).ancestor(userKey).list();
	}

	public static void deleteCustomWidget(String widgetName) {
		// Creates Current AgileUser key
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
				AgileUser.getCurrentAgileUser().id);

		CustomWidget csWidget = (CustomWidget) dao.ofy()
				.query(CustomWidget.class).ancestor(userKey)
				.filter("name", widgetName);

		csWidget.delete();
	}

	/**
	 * Deletes the widget
	 */
	public void delete() {
		dao.delete(this);
	}

}
