package com.agilecrm.shopifyapp;

import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Indexed;

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
    public String shop = null;

    @Indexed
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
