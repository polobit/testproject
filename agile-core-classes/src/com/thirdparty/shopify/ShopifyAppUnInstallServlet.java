package com.thirdparty.shopify;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.shopify.util.ShopifyAppUtil;

@SuppressWarnings("serial")
public class ShopifyAppUnInstallServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response)
    {
	String shopUrl = request.getParameter("shop");
	ShopifyAppUtil.deleteShopifyAppPrefs(shopUrl);
	return;
    }
}
