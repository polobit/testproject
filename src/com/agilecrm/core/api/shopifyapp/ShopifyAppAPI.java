package com.agilecrm.core.api.shopifyapp;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import com.agilecrm.shopifyapp.util.ShopifyAppUtil;

@Path("shopifyapp/installed-domain")
public class ShopifyAppAPI
{
    @GET
    @Produces()
    public String getDomainByShopURL(@QueryParam("shop") String shopURL)
    {
	return ShopifyAppUtil.getDomainByShop(shopURL);
    }
}
