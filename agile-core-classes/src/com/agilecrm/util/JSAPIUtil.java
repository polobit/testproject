package com.agilecrm.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.account.util.APIKeyUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.js.JSContact;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
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
	        "Invalid tags"), ID_NOT_FOUND("ID missing in \"%s\" data"), ENTITY_NOT_FOUND("\"%s\" not found with ID"),CONTACT_CREATE_RESTRICT(
			"Contact cannot be created due to security"), CONTACT_UPDATE_RESTRICT("Contact cannot be updated due to security");

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
    whiteList.add("docmosis");
    whiteList.add("beam-dev");
    // whiteList.add("our");
    
    if(!StringUtils.isEmpty(domain) && whiteList.contains(domain))
    	return true;
    
    return false;
    }
    
    public static String limitPropertiesInContactForJSAPI(Contact contact) throws Exception
    {
	if (contact == null)
	    return null;
	ObjectMapper mapper = new ObjectMapper();
	String contactStr = mapper.writeValueAsString(contact);
	UserInfo userInfo = SessionManager.get();

	System.out.println("properties = "+userInfo.getJsrestricted_propertiess());
	System.out.println("scopes = "+userInfo.getJsrestricted_scopes());

	HashSet<String> js_properties = userInfo.getJsrestricted_propertiess();
	HashSet<String> js_scopes = userInfo.getJsrestricted_scopes();

	JSONObject contacttester = new JSONObject();
	// Create a contact JSON
	JSONObject contactJSON = new JSONObject(contactStr);
	String[] contactAllowVaraibles = new String[] { "properties",
		"lead_score", "owner", "id", "type", "star_value", "tags" };
	
	List<String> contactAllowList = Arrays.asList(contactAllowVaraibles);

	Iterator<?> keys = contactJSON.keys();

	while (keys.hasNext()) {
	    String type = (String) keys.next();
	    if(type.equalsIgnoreCase("tags") && !js_properties.contains(type))
		continue;
	    if(type.equalsIgnoreCase("owner") && !js_properties.contains(type))
		continue;
	    if (contactAllowList.contains(type))
		contacttester.put(type, contactJSON.get(type));
	}
	
	List<String> allpropertyNames = new ArrayList<String>(js_properties);
	List<String> propertyNames = new ArrayList<String>();
	for (String apn : allpropertyNames) {
	    if (apn.equalsIgnoreCase("tags")
		    || apn.equalsIgnoreCase("custom_field"))
		continue;
	    propertyNames.add(apn);
	}

	try {
	    JSONArray fields = (JSONArray) contacttester.get("properties");
	    JSONArray limitedFields = new JSONArray();
	    for (int i = 0; i < fields.length(); i++) {
		JSONObject fieldJSON = fields.getJSONObject(i);
		String fieldName = fieldJSON.getString("name").toLowerCase();
		String fieldType = fieldJSON.getString("type");
		if (fieldType.equalsIgnoreCase(FieldType.CUSTOM.toString())) {
		    if (!allpropertyNames.contains("custom_field"))
			continue;
		} else {
		    if (fieldType.equalsIgnoreCase(FieldType.SYSTEM.toString())
			    && !propertyNames.contains(fieldName)) {
			continue;
		    }
		}

		limitedFields.put(fieldJSON);
	    }
	    contacttester.put("properties", limitedFields);
	} catch (Exception e) {
	    System.out.println(e);
	    e.printStackTrace();
	}
	
	return contacttester.toString();
    }

    public static boolean checkAllowedDomain() {
	
	String domain = NamespaceManager.get();
	    List<String> whiteList = new ArrayList<String>();
	    whiteList.add("ghanshyam");
	    whiteList.add("debunc");
	    
	    if(!StringUtils.isEmpty(domain) && whiteList.contains(domain))
	    	return true;
	    
	    return false;
    }

}