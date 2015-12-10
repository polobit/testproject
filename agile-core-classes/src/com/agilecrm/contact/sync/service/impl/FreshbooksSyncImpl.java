/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.agilecrm.contact.sync.wrapper.impl.FreshbooksContactWrapper;
import com.agilecrm.contact.util.NoteUtil;
import com.thirdparty.freshbooks.FreshbooksDataService;

/**
 * @author jitendra
 * @since 2014
 */
public class FreshbooksSyncImpl extends OneWaySyncService
{
    private Integer CURRENT_PAGE = 1;
    private Integer TOTAL_PAGE = CURRENT_PAGE;

    @Override
    public Class<? extends IContactWrapper> getWrapperService()
    {
	return FreshbooksContactWrapper.class;
    }

    @Override
    public void initSync()
    {
	try
	{
	    FreshbooksDataService service = new FreshbooksDataService(prefs.token, prefs.othersParams);
	    System.out.println("freshbooks Service created");

	    TOTAL_PAGE = service.getTotalCount(prefs.lastSyncCheckPoint);

	    while (CURRENT_PAGE <= TOTAL_PAGE)
	    {
		JSONArray customers = service.getCustomers(CURRENT_PAGE, prefs.lastSyncCheckPoint);
		if (customers != null && customers.length() > 0)
		{
		    System.out.println("fetched customer :" + customers.length());
		    for (int i = 0; i < customers.length(); i++)
		    {
			JSONObject org = customers.getJSONObject(i);
			if (org.has("contacts"))
			{
			    JSONObject contact = org.getJSONObject("contacts");
			    if (contact != null && contact.length() > 0)
			    {
				JSONArray contacts = new JSONArray();
				if (contact.has("contact"))
				{
				    Object object = contact.get("contact");
				    if (object instanceof JSONObject)
				    {
					contacts.put(object);
				    }
				    else
				    {
					JSONArray obj = contact.getJSONArray("contact");
					for (int k = 0; k < obj.length(); k++)
					{
					    contacts.put(obj.get(k));
					}
				    }
				}

				// save main contacts
				Contact ctx = wrapContactToAgileSchemaAndSave(customers.get(i));
				saveInvoices(ctx, customers.get(i));
				ContactField organization = ctx.getContactFieldByName(Contact.COMPANY);

				// saves sub contacts withing organization
				for (int j = 0; j < contacts.length(); j++)
				{
				    Contact subContact = wrapContactToAgileSchemaAndSave(contacts.get(j));
				    // check if company already set in contact
				    subContact.properties.add(organization);

				    subContact.save();

				    saveInvoices(subContact, contacts.get(j));

				}

			    }
			    else
			    {
				Contact ctx = wrapContactToAgileSchemaAndSave(customers.get(i));
				saveInvoices(ctx, customers.get(i));
			    }
			}
		    }

		}

		CURRENT_PAGE = CURRENT_PAGE + 1;
	    }
	    sendNotification(prefs.type.getNotificationEmailSubject());
	    updateLastSyncedInPrefs();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    @Override
    protected void updateLastSyncedInPrefs()
    {

	try
	{
	    FreshbooksDataService service = new FreshbooksDataService(prefs.token, prefs.othersParams);

	    System.out.println("lastupdated time" + service.getLastUpdatedTime());
	    prefs.lastSyncCheckPoint = service.getLastUpdatedTime();
	    prefs.save();
	}
	catch (Exception e)
	{
	    System.out.println("Exception occurred during last updated time");
	}

    }

    /**
     * saves customer invoices and add product name as tag and item as note
     * 
     * @param contact
     * @param object
     * @throws Exception
     */
    private void saveInvoices(Contact contact, Object object)
    {
	JSONObject customer = (JSONObject) object;
	FreshbooksDataService service = new FreshbooksDataService(prefs.token, prefs.othersParams);
	Map<String, Note> notes = new HashMap<String, Note>();
	if (service != null)
	{
	    if (customer.has("client_id"))
	    {
		try
		{
		    JSONArray invoices = service.getInvoices((String) customer.get("client_id"));
		    for (int i = 0; i < invoices.length(); i++)
		    {
			JSONObject invoice = (JSONObject) invoices.get(i);
			JSONArray items = getLineItems(invoice);
			if (items != null && items.length() > 0)
			{
			    for (int j = 0; j < items.length(); j++)
			    {
				Note note = new Note();
				if (invoice.has("number"))
				{
				    note.subject = "Invoice #" + invoice.get("number");
				}
				JSONObject item = items.getJSONObject(j);

				if (notes.containsKey(note.subject))
				{

				    Note n = notes.get(note.subject);
				    StringBuilder sb = new StringBuilder(n.description);
				    if (!StringUtils.isEmpty(item.getString("name")))
				    {
					sb.append("\n").append(item.get("name") + " : ")
						.append(item.get("unit_cost") + "(")
						.append(invoice.get("currency_code") + ")");

					if (item.has("tax1_percent"))
					{
					    double tax = Double.parseDouble(item.getString("tax1_percent"));
					    if (tax > 0.0)
						sb.append("Tax : " + tax + "(" + invoice.get("currency_code") + ")");
					}

				    }
				    if (items.length() - 1 == j)
				    {
					sb.append("\nTotal Amount : " + invoice.get("amount") + "("
						+ invoice.get("currency_code") + ")");
				    }
				    n.description = sb.toString();
				    notes.put(n.subject, n);

				}
				else
				{
				    StringBuilder sb = new StringBuilder();
				    if (!StringUtils.isEmpty(item.getString("name")))
				    {
					sb.append(item.get("name") + " : ").append(item.get("unit_cost") + "(")
						.append(invoice.get("currency_code") + ")");
					if (item.has("tax1_percent"))
					{
					    double tax = Double.parseDouble(item.getString("tax1_percent"));
					    if (tax > 0.0)
						sb.append("Tax : " + tax + "(" + invoice.get("currency_code") + ")");
					}
				    }
				    note.description = sb.toString();

				}
				if (items.length() - 1 == j)
				{
				    note.description += "\nTotal Amounts : " + invoice.get("amount") + "("
					    + invoice.get("currency_code") + ")" + "";
				}

				note.addRelatedContacts(contact.id.toString());
				if (!notes.containsKey(note.subject))
				{
				    notes.put(note.subject, note);
				}
				if (!StringUtils.isEmpty(item.getString("name")))
				{
					if(item.get("name")!=null)
					{
						//Replacing special characters with underscore except space and underscore
						String tagName = item.get("name").toString().replaceAll("[^\\p{L}\\p{N} _]", "_").trim();
						if(tagName!=null){
							//if tag name start with _ we removed that _ until tag name starts with alphabet
							while(tagName.startsWith("_"))
								tagName = tagName.replaceFirst("_", "").trim();
							if(!tagName.isEmpty())
								contact.tags.add(tagName);
						}
					}
				}
				contact.save();

			    }
			}
		    }

		    // saving note
		    try
		    {
			List<Note> listNote = NoteUtil.getNotes(contact.id);
			for (Note n : listNote)
			{
			    notes.put(n.subject, n);
			}

			for (Entry<String, Note> map : notes.entrySet())
			{
			    Note orderNote = map.getValue();
			    orderNote.save();
			}
		    }
		    catch (Exception e)
		    {
			e.printStackTrace();
		    }
		}
		catch (Exception e)
		{
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		}
	    }
	}

    }

    /**
     * utility function return line items found in invoice
     * 
     * @param object
     * @return
     */
    private JSONArray getLineItems(Object object)
    {
	JSONObject invoice = (JSONObject) object;
	JSONArray items = null;
	if (invoice.has("lines"))
	{
	    try
	    {
		JSONObject lines = invoice.getJSONObject("lines");
		if (lines != null && lines.length() > 0)
		{
		    if (lines.has("line"))
		    {

			items = (JSONArray) lines.get("line");
		    }
		}
	    }
	    catch (JSONException e)
	    {

		e.printStackTrace();
	    }
	}
	return items;
    }

    private ContactField getOrganization(Object obj)
    {
	JSONObject customer = (JSONObject) obj;
	ContactField field = null;
	try
	{
	    if (customer.has("organization"))
	    {
		String organization = customer.getString("organization");
		if (!organization.isEmpty() && !organization.equals("undefined"))
		{
		    field = new ContactField(Contact.COMPANY, organization, "office");
		}

	    }
	}
	catch (NullPointerException | JSONException e)
	{
	    e.printStackTrace();
	}
	return field;
    }

}
