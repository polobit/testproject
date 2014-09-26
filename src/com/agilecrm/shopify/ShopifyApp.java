package com.agilecrm.shopify;

import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public class ShopifyApp
{
    public ShopifyApp()
    {
    }

    public ShopifyApp(String shop, String domain)
    {
	this.domain = domain;
	this.shop = shop;
    }

    @Id
    public Long id;

    @Indexed
    @NotSaved(IfDefault.class)
    public String shop = null;

    @Indexed
    @NotSaved(IfDefault.class)
    public String domain = null;

    private static ObjectifyGenericDao<ShopifyApp> dao = new ObjectifyGenericDao<ShopifyApp>(ShopifyApp.class);

    public void save()
    {
	String oldNameSpace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    dao.put(this);
	}
	finally
	{
	    NamespaceManager.set(oldNameSpace);
	}
    }
}
