package com.agilecrm.ssologin;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class SingleSignOn {

    /**
     * Webhook Id
     */
    @Id
    public Long id;

    /**
     * Domain of the user
     */
    @NotSaved(IfDefault.class)
    public String domain;

    /**
     * Domain of the user
     */
    @NotSaved(IfDefault.class)
    public String secretKey = null;

    /**
     * URL of webhook, if null is the value don't save in the database
     */
    @NotSaved(IfDefault.class)
    public String url = null;

    // dao
    public static ObjectifyGenericDao<SingleSignOn> dao = new ObjectifyGenericDao<SingleSignOn>(
	    SingleSignOn.class);

    public SingleSignOn() {

    }

    public SingleSignOn(String domain, String secretKey, String url) {
	this.domain = domain;
	this.secretKey = secretKey;
	this.url = url;
    }

    /**
     * Saves a note in the database
     */
    public void save() {
	String currentNameSpace = NamespaceManager.get();
	NamespaceManager.set("");
	try {
	    dao.put(this);
	} finally {
	    NamespaceManager.set(currentNameSpace);
	}
    }

    @Override
    public String toString() {
	return "SingleSignOn [id=" + id + ", domain=" + domain + ", secretKey="
		+ secretKey + ", url=" + url + "]";
    }

}