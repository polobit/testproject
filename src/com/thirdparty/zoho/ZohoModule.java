/**
 * 
 */
package com.thirdparty.zoho;

/**
 * @author jitendra
 *
 */
public enum ZohoModule {
	CONTACTS("Contacts"),
	LEADS("Leads"),
	ACCOUNTS("Accounts"),
	CASES("Cases"),
	EVENTS("Events"),
	TASKS("Tasks");
	
	private String value;
	
	private  ZohoModule(String module){
		this.value = module;
	}
	
	public String getValue(){
		return this.value;
	}
	
	
	
	
	

}
