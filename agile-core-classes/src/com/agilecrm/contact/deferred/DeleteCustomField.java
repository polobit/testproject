package com.agilecrm.contact.deferred;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.util.ContactUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>DeleteCustomField</code> add name for the company if not added in the
 * namespace.
 * 
 * Task is initialized from {@link CustomFieldDeletionServlet}, which is called by cron
 * with domain andd customfield name query parameter in URL
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
			deleteCustomField(domain,customField);
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
    
    public static void deleteCustomField(String namespace,String customField)
    {
    	 NamespaceManager.set(namespace);
    	 Map<String, Object> searchMap = new HashMap<String, Object>();
    		searchMap.put("properties.name", customField);
		ContactFilterResultFetcher fetcher= new ContactFilterResultFetcher(searchMap,"",0,200);
    	// contacts = ContactUtil.getAllContacts(200,null);
		//fetcher.fetchNextSet();
		System.out.println("Fetcher"+ fetcher.getTotalFetchedCount());
		do
		{
				List<Contact> contacts = fetcher.nextSet();
				for(Contact contact :contacts){
				ContactField contactField= contact.getContactField(customField);
					if(contactField!=null)
    				{
						contact.properties.remove(contactField);
						
						contact.save();
    				}
				}
			}while (fetcher.hasNextSet());
    }
    
}
