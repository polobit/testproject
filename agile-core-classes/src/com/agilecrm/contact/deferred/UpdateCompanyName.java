package com.agilecrm.contact.deferred;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.util.NamespaceUtil;
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
public class UpdateCompanyName implements DeferredTask
{

    private String domain;

    public UpdateCompanyName(String domain)
    {
	this.domain = domain;
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
		else if (StringUtils.isNotEmpty(domain) && domain.equals("all"))
		{
			Set<String> domains = NamespaceUtil.getAllNamespaces();
			for (String namespace : domains)
			{
				saveCompanywithName(namespace);
			}
			
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
    	List<Contact> companies; 
    	 NamespaceManager.set(namespace);
		 companies = ContactUtil.getAllCompaniesByOrder("name");
			for (Contact company : companies)
			{
				if(company.name=="")
					{
					if(company.getContactField(Contact.NAME)!=null)
    				{
						company.name=StringUtils.lowerCase(company.getContactField(Contact.NAME).value);
						company.save();
    				}
					}
			}
    }
}
