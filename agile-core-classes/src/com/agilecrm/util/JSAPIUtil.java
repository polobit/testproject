package com.agilecrm.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.WebApplicationException;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
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
import com.agilecrm.contact.util.ContactUtil;
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
			"Contact cannot be created due to security"), CONTACT_UPDATE_RESTRICT("Contact cannot be updated due to security"), INVALID_BROWSER_ID("Contact cannot subscribe Push Notification");

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
    
    /**
     * 
     * @param contact1
     * @param json
     * @param request 
     * @param campaignIds 
     * @param apiKey 
     * @return contact
     */
    public static String updateContactPushNotification(Contact contact, String json, String campaignIds, HttpServletRequest request, String apiKey)
    {
	  try
		 {
		     ObjectMapper mapper = new ObjectMapper();
		     
		     String tags[] = new String[0];
		     JSONObject obj = new JSONObject(json);
		     
		     Iterator<?> keys = obj.keys();
		     while (keys.hasNext())
		     {
			    String key = (String) keys.next();
				 if (key.equals("tags"))
				  {
				      String tagString = obj.getString(key);
				      tagString = tagString.trim().replaceAll(" +", " ");
				      tagString = tagString.replaceAll(", ", ",");
				      tags = tagString.split(",");
				  }
				  else
				  {
				      JSONObject jobj = new JSONObject();
				      jobj.put("name", key);
				      jobj.put("value", obj.getString(key));
				      ContactField field = mapper.readValue(jobj.toString(), ContactField.class);
				      contact.addProperty(field);
				  }
		     }
		     
		     // Get Contact count by email
			  String email = contact.getContactFieldValue(Contact.EMAIL);
		     int count = ContactUtil.searchContactCountByEmail(email.toLowerCase());
			 System.out.println("count = " + count);
			 if (count != 0)
			    {
				 	return JSAPIUtil.generateJSONErrorResponse(Errors.DUPLICATE_CONTACT, email);
			    }

			 String address = contact.getContactFieldValue(Contact.ADDRESS);
			 System.out.println("Address = " + address);
			 
			 if (StringUtils.isBlank(address))
			    {
				 	System.out.println("Adding location");

				 	org.json.simple.JSONObject locJSON = GeoLocationUtil.getLocation(request);
				 	contact.addProperty(new ContactField(Contact.ADDRESS, locJSON.toString(), null));
			    }

			    // Sets owner key to contact before saving
			    contact.setContactOwner(JSAPIUtil.getDomainUserKeyFromInputKey(apiKey));

		   if (tags.length > 0)
		   {
			  try
				  {
				    contact.addTags(tags);
				   }
				  catch (WebApplicationException e) {
				      return JSAPIUtil.generateJSONErrorResponse(Errors.INVALID_TAGS);
				  }
			 }
			else
			  contact.save();
				
		  System.out.println("Browser Id  Contact :" + contact);
		  
		  return JSAPIUtil.limitPropertiesInContactForJSAPI(contact);
	    }
 catch (JsonGenerationException e) {
			e.printStackTrace();
			return null;
		} catch (JsonMappingException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		} catch (JSONException e) {
			e.printStackTrace();
			return null;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}