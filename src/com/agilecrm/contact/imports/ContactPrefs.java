package com.agilecrm.contact.imports;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class ContactPrefs implements Serializable
{
    // Key
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String token = null;

    @NotSaved(IfDefault.class)
    public String secret = null;

    @NotSaved(IfDefault.class)
    public String refreshToken = null;

    @NotSaved(IfDefault.class)
    public Long expires = 0L;

    @NotSaved(IfDefault.class)
    public Long createdAt = 0L;

    @NotSaved(IfDefault.class)
    public Long lastModifedAt = 0L;

    // domain user key
    @JsonIgnore
    private Key<DomainUser> domainUser;

    public static enum Type
    {
	GOOGLE, ZOHO, SUGAR, SALESFORCE
    }

    @NotSaved(IfDefault.class)
    public Type type = null;

    public ContactPrefs()
    {
    }

    public ContactPrefs(Type type, String token, String secret, Long expires,
	    String refreshToken)
    {
	this.type = type;
	this.token = token;
	this.secret = secret;
	this.refreshToken = refreshToken;
	this.expires = expires;
    }

    /**
     * ContactSyncerPrefs Dao.
     */
    private static ObjectifyGenericDao<ContactPrefs> dao = new ObjectifyGenericDao<ContactPrefs>(
	    ContactPrefs.class);

    /**
     * Saves ContactSyncerPrefs.
     */
    public void save()
    {

	dao.put(this);
    }

    @PrePersist
    public void prePersist()
    {

	createdAt = System.currentTimeMillis();
	expires = createdAt + expires * 1000;
	domainUser = new Key<DomainUser>(DomainUser.class, SessionManager.get()
		.getDomainId());
    }

    /**
     * Sets domianUser.
     * 
     * @param domianUser
     *            - domianUser Key.
     */
    public void setDomainUser(Key<DomainUser> domianUser)
    {
	this.domainUser = domianUser;
    }

    /**
     * Returns domianUser Key.
     * 
     * @return domianUser object
     */
    public Key<DomainUser> getDomainUser()
    {
	return domainUser;
    }

    /**
     * Deletes ContactSyncerPrefs.
     */
    public void delete()
    {
	dao.delete(this);
    }

    public static ContactPrefs get(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (EntityNotFoundException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}
    }

    public static ContactPrefs getPrefsByType(Type type)
    {

	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("type", type);
	searchMap.put("domainUser", new Key<DomainUser>(DomainUser.class,
		SessionManager.get().getDomainId()));
	return dao.getByProperty(searchMap);
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
	return "token: " + token + " secret: " + secret + "refreshToken: "
		+ refreshToken + " expires: " + expires;
    }
}
