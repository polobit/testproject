package com.agilecrm.core.api.shopifyapp;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import com.agilecrm.shopifyapp.util.ShopifyAppUtil;

@Path("shopifyapp/installed-domain")
public class ShopifyAppAPI
{
    @GET
    @Produces("text/plain")
    public String getDomainByShopURL(@QueryParam("shop") String shopURL)
    {
	return ShopifyAppUtil.getDomainByShop(shopURL);
    }

    @POST
    public void setDomainAndShopURL(@QueryParam("shop") String shopURL, @QueryParam("domain") String agileDomain)
    {
	System.out.println("hitting");
	ShopifyAppUtil.setShopifyAppPrefs(shopURL, agileDomain);
	return;
    }
}
