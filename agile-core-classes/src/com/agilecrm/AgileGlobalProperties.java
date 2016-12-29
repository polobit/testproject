package com.agilecrm;

import java.io.Serializable;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.AgileGlobalPropertiesUtil;
import com.agilecrm.util.CacheUtil;
import com.campaignio.urlshortener.util.Rot13;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Unindexed;

@Cached
@Unindexed
public class AgileGlobalProperties implements Serializable
{

	private static final long serialVersionUID = 6097656365913033504L;

	@Id
	public Long id;

	private String sendgridSubUserPwd = null;
	
	private Long created_time = 0l;
	private Long updated_time = 0l;
	
	public enum SendGridIpPools
	{
		INTERNAL("internal"), BULK("bulk"), TRANSACTIONAL("transactional");
		
		String name = "internal";
		
		SendGridIpPools(String name)
		{
			this.name = name;
		}
		
		public String getPoolName()
		{
			return name;
		}
	}

	public static ObjectifyGenericDao<AgileGlobalProperties> dao = new ObjectifyGenericDao<AgileGlobalProperties>(
			AgileGlobalProperties.class);

	public AgileGlobalProperties()
	{

	}

	public String getSendgridSubUserPwd()
	{
		return sendgridSubUserPwd;
	}

	public void setSendgridSubUserPwd(String sendgridSubUserPwd)
	{
		this.sendgridSubUserPwd = sendgridSubUserPwd;
	}

	public void save()
	{
		String oldNamespace = NamespaceManager.get();

		try
		{
			NamespaceManager.set("");
			dao.put(this);
			
			if(this != null)
				CacheUtil.setCache(AgileGlobalPropertiesUtil.AGILE_GLOBAL_PROPS, this);
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	@PrePersist
	private void prePersist()
	{
		if(id == null)
			created_time = System.currentTimeMillis()/1000;
		else
			updated_time = System.currentTimeMillis()/1000;
	}

	public void delete()
	{
		String oldNamespace = NamespaceManager.get();

		try
		{
			NamespaceManager.set("");
			dao.delete(this);
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
}
