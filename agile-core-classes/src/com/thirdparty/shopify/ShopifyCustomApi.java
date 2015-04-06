package com.thirdparty.shopify;

import org.scribe.extractors.AccessTokenExtractor;
import org.scribe.extractors.TokenExtractor20Impl;
import org.scribe.model.OAuthConfig;
import org.scribe.model.Verb;

public  abstract class ShopifyCustomApi implements Api
{

   
    /**
     * Returns the access token extractor.
     * 
     * @return access token extractor
     */
    public AccessTokenExtractor getAccessTokenExtractor()
    {
      return new TokenExtractor20Impl();
    }
  	
    /**
     * Returns the verb for the access token endpoint (defaults to GET)
     * 
     * @return access token endpoint verb
     */
    public Verb getAccessTokenVerb()
    {
      return Verb.GET;
    }
  	
    /**
     * Returns the URL that receives the access token requests.
     * 
     * @return access token URL
     */
    public  abstract String getAccessTokenEndpoint();
  	
    /**
     * Returns the URL where you should redirect your users to authenticate
     * your application.
     *
     * @param config OAuth 2.0 configuration param object
     * @return the URL where you should redirect your users
     */
    public abstract String getAuthorizationUrl(OAuthConfig config ,String param);
	

    public OAuthCustomService createService(OAuthConfig config)
    {
      return new OAuthCustomServiceImpl(this, config);
    }
    


}
