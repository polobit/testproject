package com.thirdparty.shopify;

import org.scribe.model.OAuthConfig;
import org.scribe.utils.OAuthEncoder;

public class ShopifyApi extends ShopifyCustomApi
{

    private static String SHOP_NAME;
    private static OAuthConfig config;
    /**
     * Access token of Shopify for OAuth 2.0
     */

    private static String ACCESS_TOKEN_URL = "https://"+SHOP_NAME+".myshopify.com/admin/oauth/access_token";

    @Override
    public String getAccessTokenEndpoint()
    {
	return ACCESS_TOKEN_URL;
    }

    @Override
    public String getAuthorizationUrl(OAuthConfig config, String param)
    {
	this.SHOP_NAME = param;
	this.config = config;
	return buildAuthUrl();

    }

    private String buildAuthUrl()
    {
	StringBuilder sb = new StringBuilder();
	sb.append("https://" + SHOP_NAME + ".myshopify.com/admin/oauth");
	sb.append("/authorize?").append(
		"client_id=" + config.getApiKey() + "&redirect_uri ="+config.getCallback()+"&scope=" + config.getScope());

	return sb.toString();
    }
}
