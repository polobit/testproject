package com.agilecrm.shopify.util;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.shopify.ShopifyApp;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Query;

public class ShopifyAppUtil
{
    private static ObjectifyGenericDao<ShopifyApp> dao = new ObjectifyGenericDao<ShopifyApp>(ShopifyApp.class);

    public static String getDomainByShop(String shop)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Query<ShopifyApp> query = dao.ofy().query(ShopifyApp.class);
	    query.filter("shop", shop);
	    ShopifyApp shopifyApp = query.get();
	    if (shopifyApp.domain == null)
		return null;
	    else
		return shopifyApp.domain;
	}
	catch (Exception e)
	{
	    return null;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static void setShopifyAppPrefs(String shop, String domain)
    {
	ShopifyApp shopifyApp = new ShopifyApp(shop, domain);
	shopifyApp.save();
	return;
    }
}
