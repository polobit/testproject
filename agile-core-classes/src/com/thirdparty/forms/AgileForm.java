package com.thirdparty.forms;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.security.acl.Owner;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.SetUtils;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.forms.Form;
import com.agilecrm.forms.util.FormUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.campaignio.servlets.util.TrackClickUtil;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.datanucleus.annotations.Owned;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

public class AgileForm extends HttpServlet
{
    public static String[] authDetails = { "_agile_form_name", "_agile_domain", "_agile_api", "_agile_redirect_url" };

    public static Set<String> systemContactProperties = new HashSet<String>(Arrays.asList(new String[] {
	    Contact.FIRST_NAME, Contact.LAST_NAME, Contact.EMAIL, Contact.COMPANY, Contact.TITLE, Contact.WEBSITE,
	    Contact.URL, Contact.NAME, Contact.IMAGE, Contact.PHONE }));

    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	try
	{
	    Map<String, String[]> formMap = request.getParameterMap();
	    org.json.JSONObject formJson = convertFormMap(formMap);

	    if (!validAuthDetails(formJson))
	    {
		response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid auth details");
		return;
	    }

	    String apiKey = formJson.getString("_agile_api");
	    String agileDomain = formJson.getString("_agile_domain");
	    String agileRedirectURL = formJson.getString("_agile_redirect_url");
	    String agileFormName = formJson.getString("_agile_form_name");
	    com.googlecode.objectify.Key<DomainUser> owner = getDomainUserKeyFromInputKey(apiKey);

	    org.json.JSONObject reqFormJson = getReqFormJson(formJson);

	    Contact contact = getAgileContact(reqFormJson);
	    Boolean newContact = isNewContact(contact);

	    contact.properties = getAgileContactProperties(contact, reqFormJson);

	    contact.setContactOwner(owner);
	    String[] tags = getContactTags(formJson);
	    if (!ArrayUtils.isEmpty(tags))
		contact.addTags(tags);
	    else
		contact.save();

	    addNotesToContact(contact, owner, formJson);

	    Form form = FormUtil.getFormByName(agileFormName);
	    if (form == null)
	    {
		response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Form with name does not exist");
		return;
	    }

	    runFormTrigger(contact, newContact, form, formJson);
	    response.sendRedirect(getNormalizedRedirectURL(agileRedirectURL, contact, request));
	    return;
	}
	catch (org.json.JSONException e)
	{
	    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unable to read form data or trigger campaign");
	    return;
	}
    }

    public static void runFormTrigger(Contact contact, Boolean newContact, Form form, org.json.JSONObject formJson)
	    throws org.json.JSONException
    {
	List<Trigger> triggers = TriggerUtil.getAllTriggers();
	for (Trigger trigger : triggers)
	{
	    if (StringUtils.equals(trigger.type.toString(), "FORM_SUBMIT")
		    && (newContact || !TriggerUtil.getTriggerRunStatus(trigger)))
	    {
		if (StringUtils.equals(trigger.trigger_form_event, form.id.toString()))
		{
		    WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
			    new org.json.JSONObject().put("form", formJson));
		}
	    }
	}
    }

    public static String[] getContactTags(org.json.JSONObject formJson) throws org.json.JSONException
    {

	if (formJson.has("tags") && StringUtils.isNotBlank(formJson.getString("tags")))
	{
	    String[] tags = formJson.getString("tags").split(",");
	    List<String> validTags = new ArrayList<String>();

	    for (int i = 0; i < tags.length; i++)
	    {
		String validTag = null;
		if (StringUtils.isNotBlank(tags[i]))
		    validTag = TagUtil.getValidTag(tags[i].trim());

		if (validTag != null)
		    validTags.add(TagUtil.getValidTag(tags[i]));
	    }
	    return validTags.toArray(new String[validTags.size()]);
	}
	return null;
    }

    public static void addNotesToContact(Contact contact, com.googlecode.objectify.Key<DomainUser> owner,
	    org.json.JSONObject formJson) throws org.json.JSONException
    {

	if (formJson.has("note") && StringUtils.isNotBlank(formJson.getString("note")))
	{
	    String[] noteDescriptions = formJson.getString("note").split(",");

	    for (int i = 0; i < noteDescriptions.length; i++)
	    {
		Note note = new Note("form note " + i, noteDescriptions[i].trim());
		note.setOwner(new com.googlecode.objectify.Key<AgileUser>(AgileUser.class, owner.getId()));
		note.addRelatedContacts(contact.id.toString());
		note.created_time = System.currentTimeMillis() / 1000;
		note.save();
	    }
	}
    }

    public List<ContactField> getAgileContactProperties(Contact contact, org.json.JSONObject formJson)
    {
	Iterator i = formJson.keys();

	List<ContactField> properties = new ArrayList<ContactField>();
	org.json.JSONObject addressJson = new org.json.JSONObject();

	while (i.hasNext())
	{
	    String key = (String) i.next();

	    if (isNotContactProperty(key))
		continue;

	    String value;
	    try
	    {
		value = formJson.getString(key);

		if (isAddressField(key))
		    addressJson.put(key, value);
		else
		    properties.add(new ContactField(key, value, null));
	    }
	    catch (org.json.JSONException e)
	    {
		continue;
	    }
	}
	if (addressJson.length() != 0)
	    properties.add(new ContactField(Contact.ADDRESS, addressJson.toString(), null));

	return updateContactPropList(contact.properties, properties);
    }

    public Boolean isNotContactProperty(String key)
    {
	return ((StringUtils.indexOf("tags note", key) != -1) || (isNotSystemContactProperty(key)
	        && !isAddressField(key) && isNotCustomContactProperty(key)));
    }

    public Boolean isNotCustomContactProperty(String key)
    {
	List<CustomFieldDef> contactCustomFields = CustomFieldDefUtil.getAllContactCustomField();
	for (CustomFieldDef customFieldDef : contactCustomFields)
	{
	    if (StringUtils.equals(key, customFieldDef.field_label))
	    {
		return false;
	    }
	}
	return true;
    }

    public Boolean isNotSystemContactProperty(String key)
    {
	return !systemContactProperties.contains(key);
    }

    public Boolean isAddressField(String key)
    {
	return (StringUtils.indexOf("address city state country zip", key) != -1);
    }

    public List<ContactField> updateContactPropList(List<ContactField> oldProperties, List<ContactField> newProperties)
    {
	List<ContactField> outDatedProperties = new ArrayList<ContactField>();

	for (ContactField oldProperty : oldProperties)
	    for (ContactField newProperty : newProperties)
		if (StringUtils.equals(oldProperty.name, newProperty.name)
		        && StringUtils.equals(oldProperty.subtype, newProperty.subtype))
		    outDatedProperties.add(oldProperty);
	oldProperties.removeAll(outDatedProperties);
	newProperties.addAll(oldProperties);
	return newProperties;
    }

    public Boolean isNewContact(Contact contact)
    {
	return (contact.properties.isEmpty());
    }

    public Contact getAgileContact(org.json.JSONObject formJson)
    {
	try
	{
	    if (formJson.has(Contact.EMAIL) && StringUtils.isNotBlank(formJson.getString(Contact.EMAIL)))
	    {
		Contact contact = ContactUtil.searchContactByEmail(formJson.getString(Contact.EMAIL));
		if (contact != null)
		    return contact;
	    }
	    return new Contact();
	}
	catch (org.json.JSONException e)
	{
	    return new Contact();
	}

    }

    public org.json.JSONObject getReqFormJson(org.json.JSONObject formJson)
    {

	for (String column : authDetails)
	{
	    formJson.remove(column);
	}
	return formJson;
    }

    public Boolean validAuthDetails(org.json.JSONObject formJson)
    {

	Boolean result = true;

	for (int i = 0; i < authDetails.length; i++)
	{
	    result = result && isValidAuthDetail(formJson, authDetails[i]);
	}
	if (result)
	{
	    try
	    {
		com.googlecode.objectify.Key<DomainUser> owner = getDomainUserKeyFromInputKey(formJson.getString("_agile_api"));
		if (owner != null)
		    return result;
	    }
	    catch (org.json.JSONException e)
	    {
		return !result;
	    }
	}
	return result;
    }

    public Boolean isValidAuthDetail(org.json.JSONObject formJson, String key)
    {
	try
	{
	    return (formJson != null && formJson.has(key) && StringUtils.isNotBlank(formJson.getString(key)));
	}
	catch (org.json.JSONException e)
	{
	    return false;
	}
    }

    public org.json.JSONObject convertFormMap(Map<String, String[]> formMap)
    {
	org.json.JSONObject resultJson = new org.json.JSONObject();

	Set formSet = formMap.entrySet();
	Iterator i = formSet.iterator();

	while (i.hasNext())
	{
	    Map.Entry<String, String[]> e = (Entry<String, String[]>) i.next();
	    String key = e.getKey();
	    String[] values = e.getValue();
	    String value = null;

	    for (int j = 0; j < values.length; j++)
	    {
		String currentValue = values[j];
		if (StringUtils.isNotBlank(currentValue))
		    value = (value == null) ? currentValue : value + ", " + currentValue;
	    }
	    try
	    {
		if (StringUtils.isNotBlank(value))
		    resultJson.put(key, value);
	    }
	    catch (org.json.JSONException e1)
	    {
		continue;
	    }
	}
	if (resultJson.length() != 0)
	    return resultJson;
	else
	    return null;
    }

    public String getNormalizedRedirectURL(String agileRedirectURL, Contact contact, HttpServletRequest request)
    {
	Boolean externalRedirect = StringUtils.equals(agileRedirectURL, "#") ? false : true;

	String normalizedRedirectURL = externalRedirect ? agileRedirectURL.trim().replaceAll("\r", "")
	        .replaceAll("\n", "") : request.getRequestURL().toString()
	        .replaceAll("formsubmit", "agileform_thankyou.jsp");

	String params = "?fwd=cd";
	if (StringUtils.contains(normalizedRedirectURL, "?"))
	    params = "&fwd=cd";

	params = params + TrackClickUtil.appendContactPropertiesToParams(contact);

	return normalizedRedirectURL + params;
    }

    public static com.googlecode.objectify.Key<DomainUser> getDomainUserKeyFromInputKey(String key)
    {
	if (APIKey.isPresent(key))
	    return APIKey.getDomainUserKeyRelatedToAPIKey(key);
	else if (APIKey.isValidJSKey(key))
	    return APIKey.getDomainUserKeyRelatedToJSAPIKey(key);
	return null;
    }
}