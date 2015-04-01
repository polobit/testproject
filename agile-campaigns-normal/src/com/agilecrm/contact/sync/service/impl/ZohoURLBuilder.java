/**
 * @auther jitendra
 * @since 2014
 */
package com.agilecrm.contact.sync.service.impl;

import org.scribe.utils.Preconditions;

/**
 * <code> ZohoURLBuilder<code> provides easy way to build Zoho URL with various param and path
 * Implementation of Builder design pattern
 */
public class ZohoURLBuilder
{

    /** set response type. */
    private String responseType = "json";

    /** Method to be executed of zoho API to get Result */
    private String method;

    /** token value */
    private String token;

    /** start index */
    private int fromIndex = -1;

    /** To index. */
    private int toIndex = 20;

    /** api format by default new format. */
    private int newFormat = 1;

    /** api version. */
    private int version = 1;

    /** module name */
    private String module;

    /** SCOPE of ZOHO CRM api */
    private static final String SCOPE = "crmapi";

    /** base url. */
    private static String BASE_URL = "https://crm.zoho.com/crm/private/";

    /**
     * Response type.
     * 
     * @param responseFormat
     *            the response format
     * @return the zoho url builder
     */
    public ZohoURLBuilder responseType(String responseFormat)
    {
	this.responseType = responseFormat;
	return this;
    }

    /**
     * Instantiates a new zoho url builder.
     * 
     * @param module
     *            the module
     */
    public ZohoURLBuilder(String module)
    {
	Preconditions.checkEmptyString(module, "module can't be empty");
	this.module = module;
    }

    /**
     * Api method.
     * 
     * @param method
     *            the method
     * @return the zoho url builder
     */
    public ZohoURLBuilder apiMethod(String method)
    {
	Preconditions.checkEmptyString(method, "method  can't be empty or null");
	this.method = method;
	return this;

    }

    /**
     * Auth token.
     * 
     * @param authToken
     *            the auth token
     * @return the zoho url builder
     */
    public ZohoURLBuilder authToken(String authToken)
    {
	Preconditions.checkEmptyString(authToken, "token can't be empty");
	this.token = authToken;
	return this;
    }

    /**
     * From index.
     * 
     * @param fromIndex
     *            the from index
     * @return the zoho url builder
     */
    public ZohoURLBuilder fromIndex(int fromIndex)
    {
	this.fromIndex = fromIndex;
	return this;
    }

    /**
     * To index.
     * 
     * @param toIndex
     *            the to index
     * @return the zoho url builder
     */
    public ZohoURLBuilder toIndex(int toIndex)
    {
	this.toIndex = toIndex;
	return this;
    }

    /**
     * New format.
     * 
     * @param newFormat
     *            the new format
     * @return the zoho url builder
     */
    public ZohoURLBuilder newFormat(int newFormat)
    {
	this.newFormat = newFormat;
	return this;
    }

    /**
     * Version.
     * 
     * @param apiVersion
     *            the api version
     * @return the zoho url builder
     */
    public ZohoURLBuilder version(int apiVersion)
    {
	this.version = apiVersion;
	return this;
    }

    /**
     * Builds construct URLBuilder Object and return URL as string.
     * 
     * @return the string
     */
    public String build()
    {
	Preconditions.checkEmptyString(module, "module can't be empty or blank");
	Preconditions.checkEmptyString(token, "Api token can't be empty");
	StringBuilder sb = new StringBuilder(BASE_URL);
	sb.append(responseType + "/").append(module + "/").append(method + "?").append("authtoken=" + token)
		.append("&fromIndex=" + fromIndex).append("&toIndex=" + toIndex).append("&version=" + version)
		.append("&scope=" + SCOPE).append("&newFormat=" + newFormat);

	return sb.toString();

    }

}
