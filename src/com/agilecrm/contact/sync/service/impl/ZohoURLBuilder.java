package com.agilecrm.contact.sync.service.impl;

import org.scribe.utils.Preconditions;

public class ZohoURLBuilder
{
    private String responseType = "json";
    private String method;
    private String token;
    private int fromIndex = -1;
    private int toIndex = 20;
    private int newFormat = 1;
    private int version = 1;
    private String module;
    private static final String SCOPE = "crmapi";

    private static String BASE_URL = "https://crm.zoho.com/crm/private/";

    public ZohoURLBuilder responseType(String responseFormat)
    {
	this.responseType = responseFormat;
	return this;
    }

    public ZohoURLBuilder(String module)
    {
	Preconditions.checkEmptyString(module, "module can't be empty");
	this.module = module;
    }

    public ZohoURLBuilder apiMethod(String method)
    {
	Preconditions.checkEmptyString(method, "method  can't be empty or null");
	this.method = method;
	return this;

    }

    public ZohoURLBuilder authToken(String authToken)
    {
	Preconditions.checkEmptyString(authToken, "token can't be empty");
	this.token = authToken;
	return this;
    }

    public ZohoURLBuilder fromIndex(int fromIndex)
    {
	this.fromIndex = fromIndex;
	return this;
    }

    public ZohoURLBuilder toIndex(int toIndex)
    {
	this.toIndex = toIndex;
	return this;
    }

    public ZohoURLBuilder newFormat(int newFormat)
    {
	this.newFormat = newFormat;
	return this;
    }

    public ZohoURLBuilder version(int apiVersion)
    {
	this.version = apiVersion;
	return this;
    }

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
