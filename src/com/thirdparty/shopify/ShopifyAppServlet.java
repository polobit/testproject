package com.thirdparty.shopify;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.shopifyapp.util.ShopifyAppUtil;
import com.google.appengine.api.NamespaceManager;

@SuppressWarnings("serial")
public class ShopifyAppServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response)
    {
	String shopUrl = request.getParameter("shop");
	String oldNameSpace = NamespaceManager.get();
	NamespaceManager.set("");
	ShopifyAppUtil.setShopifyAppPrefs(shopUrl, oldNameSpace);
	NamespaceManager.set(oldNameSpace);
    }
}
