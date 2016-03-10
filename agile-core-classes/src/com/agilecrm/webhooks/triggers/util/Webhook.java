package com.agilecrm.webhooks.triggers.util;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class Webhook
{
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
     * Name of webhook, if null is the value don't save in the database
     */
    @NotSaved(IfDefault.class)
    public String name = "Webhook_Sample";

    /**
     * URL of webhook, if null is the value don't save in the database
     */
    @NotSaved(IfDefault.class)
    public String url = null;

    /**
     * Module of webhook, if null is the value don't save in the database Ex:
     * Contact,Deall
     */
    @NotSaved(IfDefault.class)
    public List<String> modules = new ArrayList<String>();

    // dao
    public static ObjectifyGenericDao<Webhook> dao = new ObjectifyGenericDao<Webhook>(Webhook.class);

    public Webhook()
    {
    }

    public Webhook(String domain, String name_webhook, String url, List<String> modules)
    {
	this.domain = domain;
	this.name = name_webhook;
	this.url = url;
	this.modules = modules;
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
	}
	finally
	{
	    NamespaceManager.set(currentNameSpace);
	}
    }

    @Override
    public String toString()
    {
	return "Webhooks [id=" + id + ", domain=" + domain + ", name_webhook=" + name + ", url=" + url + ", modules="
		+ modules + "]";
    }

}
