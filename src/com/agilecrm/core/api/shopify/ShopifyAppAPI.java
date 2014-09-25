package com.agilecrm.core.api.shopify;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import com.agilecrm.shopify.util.ShopifyAppUtil;
import com.google.appengine.api.NamespaceManager;

@Path("shopifyapp")
public class ShopifyAppAPI
{
    @GET
    @Produces("text/plain")
    public String getDomainByShopURL(@QueryParam("shop") String shopURL)
    {
	return ShopifyAppUtil.getDomainByShop(shopURL);
    }

    @POST
    public void setDomainAndShopURL(@QueryParam("shop") String shopURL)
    {
	ShopifyAppUtil.setShopifyAppPrefs(shopURL, NamespaceManager.get());
	return;
    }
}
