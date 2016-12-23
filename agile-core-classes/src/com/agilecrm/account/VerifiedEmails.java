package com.agilecrm.account;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.util.email.SendMail;
import com.agilecrm.util.language.LanguageUtil;
import com.google.appengine.api.NamespaceManager;
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
	@JsonIgnore
	private String token = null;
	
   private static ObjectifyGenericDao<VerifiedEmails> sss = new ObjectifyGenericDao<VerifiedEmails>(VerifiedEmails.class);
	
	 VerifiedEmails(){}
	
	public  VerifiedEmails(String email, String token)
	{
		this.email = email;
		this.token = token;
	}
	
	public void setToken(String token)
	{
		this.token = token;
	}
	
	@JsonIgnore
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
	
	public void sendEmail()
	{
		Map<String, String> data = new HashMap<String, String>();
    	
    	try
		{
			data.put("verify_link", VersioningUtil.getHostURLByApp(AliasDomainUtil.getCachedAliasDomainName(NamespaceManager.get()))+"verify-email?tid="+ URLEncoder.encode(token, "UTF-8"));
		}
		catch (UnsupportedEncodingException e)
		{
			e.printStackTrace();
		}
    	
    	// Get user prefs language
    	String language = LanguageUtil.getUserLanguageFromSession();
    	
    	SendMail.sendMail(email, SendMail.FROM_VERIFICATION_EMAIL_SUBJECT, SendMail.FROM_VERIFICATION_EMAIL, data, language);
	}
	
	public void save()
	{
		sss.put(this);
	}
	
	@PrePersist
	public void prePersist()
	{
		if(email != null)
			email = email.toLowerCase();
	}
}
