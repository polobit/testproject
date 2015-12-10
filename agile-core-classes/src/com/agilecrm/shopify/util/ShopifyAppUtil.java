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
	    if (shopifyApp == null)
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
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Query<ShopifyApp> query = dao.ofy().query(ShopifyApp.class);
	    query.filter("shop", shop);
	    ShopifyApp shopifyApp = query.get();
	    if (shopifyApp == null)
		shopifyApp = new ShopifyApp(shop, domain);
	    else
		shopifyApp.domain = domain;
	    shopifyApp.save();
	    return;
	}
	catch (Exception e)
	{
	    return;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static String getShopFromDomain(String domain)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Query<ShopifyApp> query = dao.ofy().query(ShopifyApp.class);
	    query.filter("domain", domain);
	    ShopifyApp shopifyApp = query.get();
	    if (shopifyApp == null)
		return null;
	    else
		return shopifyApp.shop;
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

    public static void deleteShopifyAppPrefs(String shop)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Query<ShopifyApp> query = dao.ofy().query(ShopifyApp.class);
	    query.filter("shop", shop);
	    ShopifyApp shopifyApp = query.get();
	    if (shopifyApp != null)
		dao.ofy().delete(shopifyApp);
	    return;
	}
	catch (Exception e)
	{
	    return;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
