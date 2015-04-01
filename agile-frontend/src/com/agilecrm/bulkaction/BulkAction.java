package com.agilecrm.bulkaction;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;

public class BulkAction
{
    private int contactsCount = 0;
    private int companiesCount = 0;
    private ContactFilterResultFetcher fetcher = null;
    private JSONArray contact_ids = null;
    private String form_data;
    private Long domainUserId;

    private BulkAction()
    {

    }

    public BulkAction(String condition, String contact_id, String form_data, Long current_id)
    {
	this.form_data = form_data;
	domainUserId = current_id;

	if (!StringUtils.isEmpty(condition))
	    fetcher = new ContactFilterResultFetcher(condition, null, 200, null, current_id);
	else
	    try
	    {
		contact_ids = new JSONArray(contact_ids);
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
    }

    private void sendNotification(BulkActionNotifications.BulkAction notificationType)
    {
	String message = "contacts " + (companiesCount > 0 ? "and " + companiesCount + " companies" : "");

	BulkActionNotifications.publishconfirmation(notificationType, String.valueOf(contactsCount), message);

    }

    public void deleteContacts()
    {
	int count = 0;
	if (fetcher != null)
	{
	    while (fetcher.hasNext())
	    {
		Contact contact = fetcher.next();

		contact.delete(false);
		if (contact.type == Type.PERSON)
		    contactsCount++;
		else
		    companiesCount++;
	    }
	    count += fetcher.getTotalFetchedCount();
	}

	else if (contact_ids != null)
	{
	    List<Contact> contacts_list = ContactUtil.getContactsBulk(contact_ids);

	    ContactUtil.deleteContactsbyListSupressNotification(contacts_list);
	    count += contacts_list.size();
	}
    }

    public void addTags()
    {

    }
}
