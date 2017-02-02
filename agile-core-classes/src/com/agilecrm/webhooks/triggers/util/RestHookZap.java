package com.agilecrm.webhooks.triggers.util;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class RestHookZap
{
    /**
     * Rest hook Id
     */
    @Id
    public Long id;

    /**
     * Domain of the user
     */
    @NotSaved(IfDefault.class)
    public String domain;

    /**
     * Name of webhook, if null is the value don't save in the database
     */
    @NotSaved(IfDefault.class)
    public String event;

    /**
     * URL of webhook, if null is the value don't save in the database
     */
    @NotSaved(IfDefault.class)
    public String target_url = null;

    // dao
    public static ObjectifyGenericDao<RestHookZap> dao = new ObjectifyGenericDao<RestHookZap>(RestHookZap.class);
    
    // Constant for Cached Limit Key
    public static final String ZAPIER_DATA_CACHED_KEY = "_zapier_data_cached_key";

    public RestHookZap()
    {
    }

    public RestHookZap(String domain, String event, String target_url)
    {
	this.domain = domain;
	this.event = event;
	this.target_url = target_url;
    }

    /**
     * Saves a note in the database
     */
    public void save()
    {
	String currentNameSpace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    dao.put(this);
	    CacheUtil.setCache(currentNameSpace + ZAPIER_DATA_CACHED_KEY, this);
	}
	finally
	{
	    NamespaceManager.set(currentNameSpace);
	}
    }

    @Override
    public String toString()
    {
	return "RestHooks [id=" + id + ", domain=" + domain + ", event=" + event + ", target_url=" + target_url
		+ ", modules=" + 0 + "]";
    }

}
