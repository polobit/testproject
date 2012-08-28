package com.agilecrm.user;
import java.util.List;
import java.util.Map;

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
public class SocialPrefs
{
	
	// Key
	@Id 
	public Long id;
	
	// Type - LinkedIn, Twitter, Facebook, Dummy etc.
	public enum Type
	{
		LINKEDIN, TWITTER, FACEBOOK, GMAIL, DUMMY
	};

	public Type type;
	
	@Parent
	private Key<AgileUser> agileUser;
	
	// Token & Secret
	public String token, secret;	
	
	// Name, UserId etc.
	@NotSaved(IfDefault.class)
	public String socialId = null, picture = null, name = null, email = null;
	
	// Dao
	private static ObjectifyGenericDao<SocialPrefs> dao = new ObjectifyGenericDao<SocialPrefs>(SocialPrefs.class);
	
	SocialPrefs()
	{	
	}
	
	public SocialPrefs(AgileUser agileUser, Type type, String token, String secret, Map<String, String>  properties)
	{
		this.token  = token;
		this.agileUser = new Key<AgileUser>(AgileUser.class, agileUser.id);
		this.secret = secret;
		this.type = type;
		
		this.socialId = properties.get("id");
		this.picture = properties.get("pic");
		this.name = properties.get("name");
		
		if(properties.containsKey("email"))
			this.email = properties.get("email");
		
		System.out.println(properties);
		
	}
	
	// Get Prefs
	public static SocialPrefs getPrefs(AgileUser user, Type type)
	{
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

		return ofy.query(SocialPrefs.class).ancestor(agileUserKey).filter("type", type).get();
	}
	
	// Get Prefs
	public static List<SocialPrefs> getPrefs(AgileUser user)
	{
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> agileUserKey = new Key<AgileUser>(AgileUser.class, user.id);

		return ofy.query(SocialPrefs.class).ancestor(agileUserKey).list();
	}
	
	public static SocialPrefs getSocialPrefs(Long id)
	{		
		try
		{
			return dao.get(id);
		} catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	
	
	
	@Override
	public String toString()
	{
		return "Social - " + type + " Token: " + token + " " + secret;		
	}
	
	public void save()
	{				
		dao.put(this);
	}
	
	public void delete()
	{			
		dao.delete(this);
	}
}