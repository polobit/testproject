package com.agilecrm.account;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class VerifiedEmails
{

	@Id
	public Long id;
	
	@NotSaved(IfDefault.class)
	private String email = null;

	public enum Verified
	{
		YES, NO
	};
	
	@NotSaved(IfDefault.class)
	public Verified verified = Verified.NO;
	
	@NotSaved(IfDefault.class)
	private String token = null;
	
   private static ObjectifyGenericDao<VerifiedEmails> sss = new ObjectifyGenericDao<VerifiedEmails>(VerifiedEmails.class);
	
	public VerifiedEmails(){}
	
	public void setToken(String token)
	{
		this.token = token;
	}
	
	public String getToken()
	{
		return token;
	}
	
	public void setEmail(String email)
	{
		this.email = email;
	}
	
	public String getEmail()
	{
		return email;
	}
	
	public void save()
	{
		sss.put(this);
	}
}
