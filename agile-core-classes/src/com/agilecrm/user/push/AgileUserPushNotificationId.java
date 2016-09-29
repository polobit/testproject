package com.agilecrm.user.push;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;

/**
 * <code>AgileUser</code> class stores agileUser entities with domain user id as
 * its attribute.
 * <p>
 * Agile user associated to a domain user is created(using its parameterized
 * constructor), when only the domain user logged in for the very first time.
 * <p>
 * 
 * @author
 * 
 */
@XmlRootElement
@Cached
public class AgileUserPushNotificationId {

	// Key
	@Id
	public Long id;

	// Registration Id
	public String registrationId;

	/**
	 * Associate outer domain user Id and domain name
	 */
	public Long domainUserId;
	public String domain;

	// Dao
	private static ObjectifyGenericDao<AgileUserPushNotificationId> dao = new ObjectifyGenericDao<AgileUserPushNotificationId>(
			AgileUserPushNotificationId.class);

	/**
	 * Creates a push notification identifier with the details
	 * 
	 * @param domainUserId
	 * @param registrationId
	 * @param domain
	 */
	public AgileUserPushNotificationId(Long domainUserId, String registrationId, String domain) {
		this.registrationId = registrationId;
		this.domainUserId = domainUserId;
		this.domain = domain;
	}

	/**
	 * Gets agileuser from registraion id
	 * 
	 * @param registrationId
	 * @return
	 */
	public static AgileUserPushNotificationId getNotifier(String registrationId) {
		String oldDomainName = NamespaceManager.get();
		NamespaceManager.set("");
		try {
			return dao.getByProperty("registrationId", registrationId);
		} catch (Exception e) {
			// TODO: handle exception
		} finally {
			NamespaceManager.set(oldDomainName);
		}
		return null;
	}
	
	/**
	 * Gets list from registraion id
	 * 
	 * @param registrationId
	 * @return
	 */
	public static List<AgileUserPushNotificationId> getNotifiers(String domainName) {
		String oldDomainName = NamespaceManager.get();
		NamespaceManager.set("");
		try {
			return dao.listByProperty("domain", domainName);
		} catch (Exception e) {
			// TODO: handle exception
		} finally {
			NamespaceManager.set(oldDomainName);
		}
		return null;
	}

	/**
	 * Stores an agile user in database
	 */
	public void save() {

		String oldDomainName = NamespaceManager.get();
		NamespaceManager.set("");
		try {
			// Remove older one
			AgileUserPushNotificationId notifier = getNotifier(registrationId);
			if (notifier != null)
				dao.delete(notifier);

			dao.put(this);
		} catch (Exception e) {
			// TODO: handle exception
		} finally {
			NamespaceManager.set(oldDomainName);
		}

	}

}