package com.agilecrm.contact.deferred;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>DeleteDuplicateMilestone</code> 
 * 
 * Task is initialized from {@link DeleteDuplicateMilestone}, which is called by cron
 * with duration query parameter in URL
 * 
 * @author nidhi
 * 
 */
@SuppressWarnings("serial")
public class DeleteDuplicateMilestone implements DeferredTask
{

    private String domain;

    public DeleteDuplicateMilestone(String domain)
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
			deleteDuplicateMilestone(domain);
		}
		else if (StringUtils.isNotEmpty(domain) && domain.equals("all"))
		{
			Set<String> domains = NamespaceUtil.getAllNamespaces();
			for (String namespace : domains)
			{
				deleteDuplicateMilestone(namespace);
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
    
    public void deleteDuplicateMilestone(String namespace)
    {
    	
    	 NamespaceManager.set(namespace);
    	 	//MilestoneUtil.getDefaultMilestones();
    	 List<Milestone> milestone=MilestoneUtil.getMilestonesList("Default");
    	 if(milestone.size()>1)
    	 {
    		 System.out.println("Duplicate milestone domain:"+namespace);
    		 for(Milestone mile:milestone){
    			 int dealsCount=OpportunityUtil.getDealsbyMilestone(mile.id);
    			 if(dealsCount<=0)
    			 {
    				 System.out.println("Deleting Duplicate milestone domain:"+namespace);
    				 mile.delete();
    				 break;
    			 }
    		 }
    	 }
 }
		
}

