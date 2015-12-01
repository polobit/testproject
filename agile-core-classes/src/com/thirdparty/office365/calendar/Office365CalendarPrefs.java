package com.thirdparty.office365.calendar;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;

@XmlRootElement
@Cached
public class Office365CalendarPrefs {
	@Id
	public Long id;

	public String username;
	public String password;
	public String serverUrl;
	public String widgetName = "office365Cal";

	public Office365CalendarPrefs() {

	}

	public Office365CalendarPrefs(String username, String password,
			String serverUrl) {
		this.username = username;
		this.password = password;
		this.serverUrl = serverUrl;
	}

	public static ObjectifyGenericDao<Office365CalendarPrefs> dao = new ObjectifyGenericDao<Office365CalendarPrefs>(
			Office365CalendarPrefs.class);

	/**
	 * Fetch all custom widgets in admin account
	 */
	public static List<Office365CalendarPrefs> getOfficeCalenderDetails() {

		return Office365CalendarPrefs.dao.fetchAll();
	}

	public void save() {
		dao.put(this);
	}

	public void delete() {
		dao.delete(this);
	}

}
