/**
 * 
 */
package com.thirdparty.zoho;

/**
 * <p> This file contains all zoho Modules that are available in zoho crm </p>
 * @author jitendra
 * 
 */
public enum ZohoModule
{
    CONTACTS("Contacts"), LEADS("Leads"), ACCOUNTS("Accounts"), CASES("Cases"), EVENTS("Events"), TASKS("Tasks");

    private String value;

    private ZohoModule(String module)
    {
	this.value = module;
    }

    public String getValue()
    {
	return this.value;
    }

}
