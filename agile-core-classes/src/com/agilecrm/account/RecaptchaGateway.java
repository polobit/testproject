package com.agilecrm.account;

import java.io.Serializable;

/**
 * <code>RecaptchaGateway</code> is the core class for Agile Form Recaptcha Gateways. It is
 * the wrapper class for gateways that are store in widget as prefs
 * 
 * @author Priyanka
 * 
 */
@SuppressWarnings("serial")
public class RecaptchaGateway implements Serializable
{
    /**
     * API Key - Google Recaptcha public api key
     */
    public String api_key;

    /**
     * Site key -  Google Recaptcha data site key
     */
    public String site_key;

    /**
     * Recaptcha API types
     * 
     */
    public enum RECAPTCHA_API
    {
	 RECAPTCHA
    };

    public RECAPTCHA_API recaptcha_api = RECAPTCHA_API.RECAPTCHA;

    /**
     * Constructs default {@link RecaptchaGateway}
     */
    RecaptchaGateway()
    {
    }

    /**
     * Constructs {@link RecaptchaGateway}
     * 
     * @param apikey
     *            - api key
     * @param siteKey
     *            - site key
     * @param recaptchaApi
     *            - Recaptcha API type
     */
    public RecaptchaGateway(String apikey, String siteKey, RECAPTCHA_API recaptchaApi)
    {
	this.api_key = apikey;
	this.site_key = siteKey;
	this.recaptcha_api = recaptchaApi;
    }
}
