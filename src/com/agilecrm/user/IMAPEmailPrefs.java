package com.agilecrm.user;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class IMAPEmailPrefs
{
    // Key
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String email = null;

    @NotSaved(IfDefault.class)
    public String server_name = null;

    @NotSaved(IfDefault.class)
    public String user_name = null;

    @NotSaved(IfDefault.class)
    public String password = null;

    public boolean is_secure = false;

    public String smtp_host;
    public String smtp_port;

    @Parent
    private Key<AgileUser> agileUser;

    // Dao
    private static ObjectifyGenericDao<IMAPEmailPrefs> dao = new ObjectifyGenericDao<IMAPEmailPrefs>(
	    IMAPEmailPrefs.class);

    IMAPEmailPrefs(String email, String serverName, String userName,
	    String password, boolean isSecure, String smtpHost, String smtpPort)
    {
	this.email = email;
	this.server_name = serverName;
	this.user_name = userName;
	this.password = password;
	this.smtp_host = smtpHost;
	this.smtp_port = smtpPort;
	this.is_secure = isSecure;

	System.out.println("Agile user id is "
		+ AgileUser.getCurrentAgileUser().id);
	this.agileUser = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);

    }

    IMAPEmailPrefs()
    {

    }

    public static IMAPEmailPrefs getIMAPPrefs(AgileUser user)
    {
	System.out.println("Retrieving Userid " + user.id);

	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class,
		user.id);

	System.out.println("Count "
		+ ofy.query(IMAPEmailPrefs.class).ancestor(agileUserKey)
			.count());
	return ofy.query(IMAPEmailPrefs.class).ancestor(agileUserKey).get();
    }

    public void save()
    {
	dao.put(this);
    }

    public void delete()
    {
	dao.delete(this);
    }

    public String toString()
    {
	return "Email: " + email + " User name: " + user_name + " Server "
		+ server_name;
    }

    public Key<AgileUser> getAgileUser()
    {
	return agileUser;
    }

    public void setAgileUser(Key<AgileUser> agileUser)
    {
	this.agileUser = agileUser;
    }

}
