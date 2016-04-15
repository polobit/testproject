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

	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @return the username
	 */
	public String getUsername() {
		return username;
	}

	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @return the serverUrl
	 */
	public String getServerUrl() {
		return serverUrl;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @param username
	 *            the username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @param serverUrl
	 *            the serverUrl to set
	 */
	public void setServerUrl(String serverUrl) {
		this.serverUrl = serverUrl;
	}

}
