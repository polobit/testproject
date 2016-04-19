package com.agilecrm.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.account.util.APIKeyUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.js.JSContact;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

public class JSAPIUtil
{
    public static enum Errors
    {
	UNAUTHORIZED("Invalid API key"), CONTACT_MISSING("Contact not found"), INVALID_PARAMETERS("Invalid parameter"), API_KEY_MISSING(
	        "API key missing"), DUPLICATE_CONTACT("Duplicate found for \"%s\""), CONTACT_LIMIT_REACHED(
	        "Contacts limit reached"), PROPERTY_MISSING("Property not found for contact"), INVALID_TAGS(
	        "Invalid tags"), ID_NOT_FOUND("ID missing in \"%s\" data"), ENTITY_NOT_FOUND("\"%s\" not found with ID");

	String errorMessage;

	Errors(String errorMessage)
	{
	    this.errorMessage = errorMessage;
	}

	public String getErrorMessage()
	{
	    return this.errorMessage;
	}
    }

    public static String generateBasicErrorMessage()
    {
	JSONObject object = new JSONObject();
	try
	{
	    object.put("error", -1);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return object.toString();
    }

    public static String generateJSONErrorResponse(Errors error, String... parameters)
    {
	JSONObject object = new JSONObject();
	try
	{
	    if (parameters.length > 0)
		object.put("error", String.format(error.getErrorMessage(), parameters));
	    else
		object.put("error", error.getErrorMessage());
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return object.toString();
    }

    public static String generateContactMissingError()
    {
	return generateJSONErrorResponse(Errors.CONTACT_MISSING);
    }

    public static Key<DomainUser> getDomainUserKeyFromInputKey(String key)
    {
    return APIKeyUtil.getAPIKeyDomainOwnerKey(key);
    }

    public static void subscribeCampaigns(String campaignIds, Contact contact)
    {
	String[] campaignIdsArr = campaignIds.split(",");
	for (int i = 0; i < campaignIdsArr.length; i++)
	{
	    WorkflowSubscribeUtil.subscribe(contact, Long.parseLong(campaignIdsArr[i]));
	}
    }
    
    public static boolean isRequestFromOurDomain()
    {
    String domain = NamespaceManager.get();
    if(!StringUtils.isEmpty(domain) && domain.equalsIgnoreCase("our"))
    	return true;
    
    return false;
    }
    
    public static boolean isRequestFromSecurityLevelDomain()
    {
    String domain = NamespaceManager.get();
    List<String> whiteList = new ArrayList<String>();
    whiteList.add("retest");
    whiteList.add("daparthi");
    whiteList.add("pjb98341");
    whiteList.add("fenopix");
    whiteList.add("twoprimes");
    whiteList.add("our");
    
    if(!StringUtils.isEmpty(domain) && whiteList.contains(domain))
    	return true;
    
    return false;
    }
    
    public static String limitPropertiesInContactForJSAPI(Contact contact) throws Exception
    {
		if(contact == null)
			  return null;
		
		ObjectMapper mapper = new ObjectMapper();
	    String contactStr =  mapper.writeValueAsString(contact);
	    
        if(!JSAPIUtil.isRequestFromSecurityLevelDomain())
        	  return contactStr;
        
    	JSContact jsContact = mapper.readValue(contactStr, JSContact.class);
    	
		List<String> propertyNames = new ArrayList<String>(); 
		propertyNames.add("first_name");
		propertyNames.add("last_name");
		propertyNames.add("email");
		propertyNames.add("name");
		
		List<ContactField> fields = jsContact.properties;
		List<ContactField> limitedFields = new ArrayList();
		for (Iterator<ContactField> iterator = fields.iterator(); iterator.hasNext(); ) {
			ContactField contactField = iterator.next();
			
			if(contactField.type == FieldType.SYSTEM && !propertyNames.contains(contactField.name.toLowerCase())){
				continue;
			}
			
			limitedFields.add(contactField);
		}
		
		jsContact.properties = limitedFields;
		
		return mapper.writeValueAsString(jsContact);
		
    }
    
}