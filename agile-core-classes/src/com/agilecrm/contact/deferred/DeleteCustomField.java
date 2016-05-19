package com.agilecrm.contact.deferred;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>CompanyNameUpdateServlet</code> add name for the company if not added in the
 * namespace.
 * 
 * Task is initialized from {@link CompanyNameUpdateServlet}, which is called by cron
 * with duration query parameter in URL
 * 
 * @author nidhi
 * 
 */
@SuppressWarnings("serial")
public class DeleteCustomField implements DeferredTask
{

    private String domain;
    private String customField;

    public DeleteCustomField(String domain,String customField)
    {
	this.domain = domain;
	this.customField=customField;
    }

    @Override
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	
	try
	{
		if (StringUtils.isNotEmpty(domain) && !domain.equals("all"))
		{
			saveCompanywithName(domain);
		}

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	    System.out.println("finally block");
	}

    }
    
    public void saveCompanywithName(String namespace)
    {
    	List<Contact> contacts; 
    	 NamespaceManager.set(namespace);
    	 contacts = ContactUtil.getAllContacts();
			for (Contact contact : contacts)
			{
				ContactField contactField= contact.getContactField(customField);
					if(contactField!=null)
    				{
						contact.properties.remove(contactField);
    				}
			}
    }
}
