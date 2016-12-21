package com.agilecrm.visitors;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * 
 * @author Ramesh Rudra
 * 
 *         This class responsible for building results for visitors LHS filters.
 *         This class intelligently builds response whether client applied only
 *         web filters or including contact filters also.
 * 
 *         This class builds response as per the requirement
 *         (ContactFilter/WebFilter) The response includes contacts, cursor,
 *         pageSize , scannedUpto timestamps. We can use above parameters
 */
public class VisitorResponseBuilder
{
    private JSONArray contacts	  = null;
    private String    scannedUpto       = null;
    private boolean   contactFilter     = false;
    private int       cursor	    = 0;
    private int       totalContactCount = 0;
    private int       pageSize;
    private boolean   hasEmails = true;
    
    public boolean isHasEmails()
    {
        return hasEmails;
    }

    public void setHasEmails(boolean hasEmails)
    {
        this.hasEmails = hasEmails;
    }

    public VisitorResponseBuilder(JSONArray contacts, boolean contactFilter, String scannedUpto)
    {
	this.contacts = contacts;
	this.contactFilter = contactFilter;
	this.scannedUpto = scannedUpto;
    }
    
    public void setScannedUpto(String scannedUpto)
    {
	this.scannedUpto = scannedUpto;
    }
    
    public void setCursor(int cursor)
    {
	this.cursor = cursor;
    }
    
    public void setPageSize(int pageSize)
    {
	this.pageSize = pageSize;
    }
    
    public void setTotalContactCount(int totalContactCount)
    {
	this.totalContactCount = totalContactCount;
    }
    
    public JSONArray getResponse()
    {
	JSONArray contacts = null;
	if (contactFilter)
	    contacts = getContactFilterResponse();
	else
	    contacts = getWebFilterResponse();
	return contacts;
    }
    
    /**
     * Builds response for visitor LHS web filters.
     * 
     * @return
     */
    private JSONArray getWebFilterResponse()
    {
	try
	{
	    JSONObject contact = new JSONObject();
	    contact.put("is_info_model", true);
	    contact.put("has_emails", hasEmails);
	    if (contacts == null || contacts.length() == 0)
	    {
		contacts = new JSONArray();
		contact.put("count", "0");
	    }
	    else
	    {
		JSONObject finalContact = contacts.getJSONObject(contacts.length() - 1);
		if (contacts.length() == pageSize)
		{
		    cursor = cursor + pageSize;
		    finalContact.put("cursor", cursor);
		    contact.put("cursor", cursor);
		}
		contact.put("count", totalContactCount);
	    }
	    contact.put("is_web_filter", true);
	    contacts.put(contact);
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	}
	return contacts;
    }
    
    /**
     * Builds response for visitor LHS filters , filters are including both
     * contact and web filters
     * 
     * @return
     */
    private JSONArray getContactFilterResponse()
    {
	JSONObject contact = null;
	contact = new JSONObject();
	try
	{
	    contact.put("is_info_model", true);
	    contact.put("cursor", "0");
	    contact.put("scannedUpto", scannedUpto);
	    contact.put("is_web_filter", false);
	    contact.put("has_emails", hasEmails);
	    if (contacts == null || contacts.length() == 0)
	    {
		contact.put("count", 0);
		contact.put("has_results", false);
		contacts = new JSONArray();
	    }
	    else
	    {
		contact.put("count", contacts.length());
		contacts.getJSONObject(contacts.length()-1).put("is_old_model", true);
		contact.put("has_results", true);
		JSONObject oldContact = contacts.getJSONObject(contacts.length()-1);
		oldContact.put("is_old_model", true);
	    }
	    contacts.put(contact);
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	}
	return contacts;
    }
}
