/**
 * 
 */
package com.thirdparty.shopify;

import org.scribe.utils.Preconditions;

/**
 * @author jitendra
 * 
 */
public class ShopifyAccessURLBuilder
{

    /** The shop name. */
    private String SHOP_NAME;

    /** The base access url. */
    private String ACCESS_URL = "https://%s/admin/oauth/access_token?client_id=%s&client_secret=%s&code=%s";

    /** The code. */
    private String code;

    /** The client id. */
    private String clientID;

    /** The client secret key. */
    private String clientSecretKey;

    public ShopifyAccessURLBuilder(String shopName)
    {
	this.SHOP_NAME = shopName;
    }

    /**
     * Code.
     * 
     * @param code
     *            the code
     * @return the shopify access url builder
     */
    public ShopifyAccessURLBuilder code(String code)
    {
	Preconditions.checkEmptyString(code, "Auth code can't be null or empty String");
	this.code = code;
	return this;
    }

    /**
     * Client id.
     * 
     * @param clientID
     *            the client id
     * @return the shopify access url builder
     */
    public ShopifyAccessURLBuilder clientKey(String clientID)
    {
	Preconditions.checkEmptyString(clientID, "ClientID Can't be be Empty String ");
	this.clientID = clientID;
	return this;
    }

    /**
     * Instantiates a new shopify access url builder.
     * 
     * @param clientSecret
     *            the client secret
     * @return
     */
    public ShopifyAccessURLBuilder scretKey(String clientSecret)
    {
	Preconditions.checkEmptyString(clientSecret, "client secret key Can't be be Empty String ");
	this.clientSecretKey = clientSecret;
	return this;
    }

    /**
     * Builds the access url.
     * 
     * @return the string
     */
    public String buildAccessUrl()
    {
	Preconditions.checkEmptyString(code, "Auth code can't be null or empty String");
	Preconditions.checkEmptyString(clientSecretKey, "client secret key Can't be be Empty String ");
	Preconditions.checkEmptyString(clientID, "ClientID Can't be be Empty String ");
	Preconditions.checkEmptyString(SHOP_NAME, "shop name can't be empty");
	return String.format(ACCESS_URL, SHOP_NAME, clientID, clientSecretKey, code);

    }

}
