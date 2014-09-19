package com.agilecrm.shopifyapp.util;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.shopifyapp.ShopifyApp;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Query;

public class ShopifyAppUtil
{
    private static ObjectifyGenericDao<ShopifyApp> dao = new ObjectifyGenericDao<ShopifyApp>(ShopifyApp.class);

    public static String getDomainByShop(String shop)
    {
	// String oldNameSpace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Query<ShopifyApp> query = dao.ofy().query(ShopifyApp.class);
	    query.filter("shop", shop);
	    ShopifyApp shopifyApp = query.get();
	    if (shopifyApp.domain == null)
		return "";
	    else
		return shopifyApp.domain;
	}
	catch (Exception e)
	{
	    return "";
	}
	finally
	{
	    // NamespaceManager.set(oldNameSpace);
	}
    }

    public static void setShopifyAppPrefs(String shop, String domain)
    {
	ShopifyApp shopifyApp = new ShopifyApp(shop, domain);
	shopifyApp.save();
    }
}
