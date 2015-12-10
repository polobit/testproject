/**
 * 
 */
package com.thirdparty.zoho;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

/**
 * <code>This class implements {@link ZohoAgileMapping}. It maps all Accounts ,Leads,and Contacts in 
 * agile {@link Contact}</code>
 * 
 * @author jitendra
 * 
 */
public class ZohoAgileMappingImpl implements ZohoAgileMapping
{

    /**
     * mapping zoho Accounts into Agile contact
     */

    @Override
    public void saveAccounts(JSONArray zohoData, Key<DomainUser> key)
    {
	List<Map<String, String>> list = getMapList(zohoData, ZohoModule.ACCOUNTS.getValue());
	Iterator<Map<String, String>> it = list.iterator();
	int counter = 0;
	while (it.hasNext())
	{
	    HashMap<String, String> dataMap = (HashMap<String, String>) it.next();

	    Contact contact = new Contact();
	    List<ContactField> fields = new ArrayList<ContactField>();

	    if (dataMap.containsKey("Account Name"))
		fields.add(new ContactField(Contact.NAME, dataMap.get("Account Name"), null));

	    if (dataMap.containsKey("Website"))
		fields.add(new ContactField(Contact.WEBSITE, dataMap.get("Website"), "url"));

	    if (dataMap.containsKey("Phone"))
		fields.add(new ContactField(Contact.PHONE, dataMap.get("Phone"), "main"));

	    if (dataMap.containsKey("Mobile"))
		fields.add(new ContactField("Mobile", dataMap.get("Mobile"), "home"));

	    if (dataMap.containsKey("Fax"))
		fields.add(new ContactField("Fax", dataMap.get("Fax"), "home fax"));

	    JSONObject shippingAddress = new JSONObject();
	    try
	    {

		if (dataMap.containsKey("Shipping Street"))
		    shippingAddress.put("Street", dataMap.get("Shipping Street"));

		if (dataMap.containsKey("Shipping State"))
		    shippingAddress.put("State", dataMap.get("Shipping State"));

		if (dataMap.containsKey("Shipping Code"))
		    shippingAddress.put("Code", dataMap.get("Shipping Code"));

		if (dataMap.containsKey("Shipping Country"))
		    shippingAddress.put("Country", dataMap.get("Shipping Country"));
		if (shippingAddress != null && shippingAddress.length() > 1)
		    fields.add(new ContactField(Contact.ADDRESS, shippingAddress.toString(), "Home"));

		JSONObject billingAddress = new JSONObject();

		if (dataMap.containsKey("Billing Street"))
		    billingAddress.put("Street", dataMap.get("Billing Street"));

		if (dataMap.containsKey("Billing State"))
		    billingAddress.put("State", dataMap.get("Billing State"));

		if (dataMap.containsKey("Billing Code"))
		    billingAddress.put("Code", dataMap.get("Billing Code"));

		if (dataMap.containsKey("Billing Country"))
		    billingAddress.put("Country", dataMap.get("Billing Country"));

		if (billingAddress != null && billingAddress.length() > 1)
		    fields.add(new ContactField(Contact.ADDRESS, billingAddress.toString(), "Work"));

		contact.properties = fields;
		contact.setContactOwner(key);
		contact.type = Type.COMPANY;
		contact.save();

		if (dataMap.containsKey("Industry"))
		{
		    Note note = new Note();
		    note.subject = "Industry";
		    note.description = dataMap.get("Industry");
		    note.addContactIds(contact.id.toString());
		    note.save();
		}

		if (dataMap.containsKey("Description"))
		{
		    Note note = new Note();
		    note.subject = "Description";
		    note.description = dataMap.get("Description");
		    note.addContactIds(String.valueOf(contact.id));
		    note.save();
		}

		if (dataMap.containsKey("Employees"))
		{
		    Note note = new Note();
		    note.subject = "Number of Employees";
		    note.description = dataMap.get("Employees");
		    note.addContactIds(String.valueOf(contact.id));
		    note.save();
		}

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	    counter++;
	}
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, String.valueOf(counter)
		+ " Accounts imported from Zoho");

    }

    /**
     * mapping zoho leads into agile contacts and saving into agile contacts
     */

    @Override
    public void saveLeads(JSONArray arrayOfLeads, Key<DomainUser> ownerKey)
    {
	int counter = 0;
	List<Map<String, String>> list = getMapList(arrayOfLeads, ZohoModule.LEADS.getValue());
	Iterator<Map<String, String>> it = list.iterator();

	while (it.hasNext())
	{
	    Contact ctx = new Contact();
	    List<ContactField> contactFields = new ArrayList<ContactField>();
	    Map<String, String> objectField = (Map<String, String>) it.next();

	    if (objectField.containsKey("First Name"))
		contactFields.add(new ContactField(Contact.FIRST_NAME, objectField.get("First Name"), null));

	    if (objectField.containsKey("Last Name"))
		contactFields.add(new ContactField(Contact.LAST_NAME, objectField.get("Last Name"), null));

	    if (objectField.containsKey("Email"))
		contactFields.add(new ContactField(Contact.EMAIL, objectField.get("Email"), null));

	    if (objectField.containsKey("Company"))
		contactFields.add(new ContactField(Contact.COMPANY, objectField.get("Company"), null));

	    if (objectField.containsKey("Website"))
		contactFields.add(new ContactField(Contact.WEBSITE, objectField.get("Website"), "URL"));

	    if (objectField.containsKey("Phone"))
		contactFields.add(new ContactField(Contact.PHONE, objectField.get("Phone"), "Work"));

	    if (objectField.containsKey("Title"))
		contactFields.add(new ContactField(Contact.TITLE, objectField.get("Title"), null));

	    if (objectField.containsKey("Rating"))
		contactFields.add(new ContactField("star_value", objectField.get("Rating"), null));

	    if (objectField.containsKey("Mobile"))
		contactFields.add(new ContactField("Mobile", objectField.get("Mobile"), "Home"));

	    if (objectField.containsKey("Fax"))
		contactFields.add(new ContactField("Fax", objectField.get("Fax"), "Home Fax"));

	    if (objectField.containsKey("Skype ID"))
		contactFields.add(new ContactField("Skype ID", objectField.get("Skype ID"), null));
	    JSONObject address = new JSONObject();
	    try
	    {
		if (objectField.containsKey("Street"))
		    address.put("Street", objectField.get("Street"));
		if (objectField.containsKey("City"))
		    address.put("City", objectField.get("City"));
		if (objectField.containsKey("Zip Code"))
		    address.put("Zip Code", objectField.get("Zip Code"));
		if (objectField.containsKey("Country"))
		    address.put("Country", objectField.get("Country"));
		if (address != null && address.length() > 1)
		    contactFields.add(new ContactField(Contact.ADDRESS, address.toString(), "Work"));

		ctx.setContactOwner(ownerKey);
		ctx.properties = contactFields;
		ctx.type = Type.PERSON;
		ctx.save();
		counter++;
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT_MESSAGE, String.valueOf(counter)
		+ " leads imported from Zoho crm");

    }

    /**
     * Return JSONArray of Zoho response data
     * 
     * @param zohoData
     * @param module
     * @return
     */
    private JSONArray getRecords(JSONArray zohoData, String module)
    {
	JSONArray rows = null;
	try
	{
	    if (zohoData != null)
	    {

		JSONObject res = new JSONObject(zohoData.get(0).toString());
		JSONObject o = res.getJSONObject("response");

		if (o.has("result"))
		{
		    JSONObject data = new JSONObject(o.getJSONObject("result").toString()).getJSONObject(module);
		    Object jsonObject = data.get("row");

		    if (jsonObject instanceof JSONObject)
		    {
			rows = new JSONArray();
			rows.put(((JSONObject) jsonObject));
		    }
		    else
			rows = (JSONArray) jsonObject;
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return rows;
    }

    /**
     * This code will extract Fields data from zoho json response data and
     * create a map of each records
     * 
     * @param jsonData
     * @param module
     * @return list of map
     */
    private List<Map<String, String>> getMapList(JSONArray jsonData, String module)
    {

	List<Map<String, String>> list = new ArrayList<Map<String, String>>();

	JSONArray rows = getRecords(jsonData, module);
	if (rows != null && rows.length() > 0)
	{
	    try
	    {
		for (int i = 0; i < rows.length(); i++)
		{

		    JSONObject object = rows.getJSONObject(i);
		    JSONArray fields = object.getJSONArray("FL");

		    Map<String, String> objectField = new HashMap<String, String>();

		    for (int j = 0; j < fields.length(); j++)
		    {
			Map<String, String> map = new HashMap<String, String>();
			ObjectMapper mapper = new ObjectMapper();
			map = mapper.readValue(fields.getString(j), new TypeReference<HashMap<String, String>>()
			{
			});
			String arr[] = new String[2];
			int index = 0;
			for (Map.Entry<String, String> m : map.entrySet())
			{
			    arr[index] = m.getValue();
			    index++;
			}
			objectField.put(arr[1], arr[0]);
		    }
		    list.add(objectField);

		}
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return list;

    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.thirdparty.zoho.ZohoAgileMapping#saveCases(org.codehaus.jettison.
     * json.JSONArray, com.googlecode.objectify.Key)
     */
    @Override
    public void saveCases(JSONArray zohoData, Key<DomainUser> key)
    {
	// TODO:jitendra implemente later

    }

    /**
     * This code will maps all zoho contact field value into agile contact field
     * value and save into agile contact
     */
    @Override
    public void saveContact(JSONArray zohoData, Key<DomainUser> key)
    {
	int counter = 0;

	List<Map<String, String>> list = getMapList(zohoData, "Contacts");
	Iterator<Map<String, String>> it = list.iterator();

	while (it.hasNext())
	{
	    Contact ctx = new Contact();
	    List<ContactField> contactFields = new ArrayList<ContactField>();

	    HashMap<String, String> objectField = (HashMap<String, String>) it.next();

	    if (objectField.containsKey("First Name"))
		contactFields.add(new ContactField(Contact.FIRST_NAME, objectField.get("First Name"), null));

	    if (objectField.containsKey("Last Name"))
		contactFields.add(new ContactField(Contact.LAST_NAME, objectField.get("Last Name"), null));

	    if (objectField.containsKey("Email"))
		contactFields.add(new ContactField(Contact.EMAIL, objectField.get("Email"), null));

	    if (objectField.containsKey("Company"))
		contactFields.add(new ContactField(Contact.COMPANY, objectField.get("Company"), null));

	    if (objectField.containsKey("Website"))
		contactFields.add(new ContactField(Contact.WEBSITE, objectField.get("Website"), "URL"));

	    if (objectField.containsKey("Phone"))
		contactFields.add(new ContactField(Contact.PHONE, objectField.get("Phone"), "Work"));

	    if (objectField.containsKey("Title"))
		contactFields.add(new ContactField(Contact.TITLE, objectField.get("Title"), null));

	    if (objectField.containsKey("Rating"))
		contactFields.add(new ContactField("star_value", objectField.get("Rating"), null));

	    if (objectField.containsKey("Mobile"))
		contactFields.add(new ContactField("Mobile", objectField.get("Mobile"), "Home"));

	    if (objectField.containsKey("Fax"))
		contactFields.add(new ContactField("Fax", objectField.get("Fax"), "Home Fax"));

	    if (objectField.containsKey("Skype ID"))
		contactFields.add(new ContactField("Skype ID", objectField.get("Skype ID"), null));
	    JSONObject address = new JSONObject();
	    try
	    {
		if (objectField.containsKey("Street"))
		    address.put("Street", objectField.get("Street"));
		if (objectField.containsKey("City"))
		    address.put("City", objectField.get("City"));
		if (objectField.containsKey("Zip Code"))
		    address.put("Zip Code", objectField.get("Zip Code"));
		if (objectField.containsKey("Country"))
		    address.put("Country", objectField.get("Country"));
		if (address != null && address.length() > 1)
		    contactFields.add(new ContactField(Contact.ADDRESS, address.toString(), "Work"));

		ctx.setContactOwner(key);
		ctx.properties = contactFields;
		ctx.type = Type.PERSON;
		ctx.save();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
    }

    /**
     * This code will save all Zoho event into agile crm
     */
    @Override
    public void saveEvents(JSONArray zohoData, Key<DomainUser> key)
    {
	List<Map<String, String>> eventList = getMapList(zohoData, "Events");
	Iterator<Map<String, String>> it = eventList.iterator();

	while (it.hasNext())
	{
	    Event event = new Event();
	    Contact ctx = new Contact();
	    List<ContactField> fieldContact = new ArrayList<ContactField>();
	    HashMap<String, String> dataMap = (HashMap<String, String>) it.next();

	    if (dataMap.containsKey("Subject"))
		event.title = dataMap.get("Subject");

	    if (dataMap.containsKey("Start DateTime"))
		event.start = Long.valueOf(dataMap.get("Start DateTime"));
	    if (dataMap.containsKey("End DateTime"))
		event.end = Long.valueOf(dataMap.get("End DateTime"));
	    if (dataMap.containsKey("Contact Name"))
	    {
		ctx.type = Type.PERSON;
		fieldContact.add(new ContactField(Contact.FIRST_NAME, dataMap.get("Contact Name"), null));
		ctx.properties = fieldContact;
		ctx.save();
	    }
	    event.save();

	}
    }

    @Override
    public void saveTask(JSONArray zohoData, Key<DomainUser> key)
    {
	List<Map<String, String>> tasks = getMapList(zohoData, "Tasks");
	Iterator<Map<String, String>> it = tasks.iterator();

	while (it.hasNext())
	{
	    Event event = new Event();
	    Contact ctx = new Contact();
	    List<ContactField> fieldContact = new ArrayList<ContactField>();
	    HashMap<String, String> dataMap = (HashMap<String, String>) it.next();

	    if (dataMap.containsKey("Subject"))
		event.title = dataMap.get("Subject");

	    if (dataMap.containsKey("Start DateTime"))
		event.start = Long.valueOf(dataMap.get("Start DateTime"));
	    if (dataMap.containsKey("End DateTime"))
		event.end = Long.valueOf(dataMap.get("End DateTime"));
	    if (dataMap.containsKey("Contact Name"))
	    {
		ctx.type = Type.PERSON;
		fieldContact.add(new ContactField(Contact.FIRST_NAME, dataMap.get("Contact Name"), null));
		ctx.properties = fieldContact;
		ctx.save();
	    }
	    event.save();

	}

    }
}
