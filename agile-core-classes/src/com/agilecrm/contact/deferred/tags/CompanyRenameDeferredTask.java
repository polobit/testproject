package com.agilecrm.contact.deferred.tags;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.deferred.company.CompanyUpdate;
import com.agilecrm.search.document.ContactDocument;
import com.google.appengine.api.search.Document.Builder;

/**
 * Updates related contacts on company rename
 * 
 * @author yaswanth
 *
 */
public class CompanyRenameDeferredTask extends CompanyUpdate
{
    private static final long serialVersionUID = 5907411857829633488L;

    public CompanyRenameDeferredTask(Long contactKey, String domain)
    {
	super(contactKey, domain);
	// TODO Auto-generated constructor stub
    }

    @Override
    protected void processContacts(List<Contact> contacts)
    {
	if (contacts.size() == 0)
	    return;

	// TODO Auto-generated method stub
	ContactDocument document = new ContactDocument();

	List<Builder> builderObjects = new ArrayList<Builder>();
	for (Contact contact : contacts)
	{
	    Builder builder = document.buildDocument(contact);

	    builderObjects.add(builder);
	}

	document.index.putAsync(builderObjects.toArray(new Builder[builderObjects.size()]));
    }

}
