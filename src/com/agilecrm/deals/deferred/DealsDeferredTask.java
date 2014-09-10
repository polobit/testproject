package com.agilecrm.deals.deferred;

import java.util.Set;

import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>DealsDeferredTask</code> add default pipelineId to all the deals in the
 * namespace.
 * 
 * Task is initialized from {@link DealsDeferServlet}, which is called by cron
 * with duration query parameter in URL
 * 
 * @author Saikiran
 * 
 */
@SuppressWarnings("serial")
public class DealsDeferredTask implements DeferredTask
{

    @Override
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	int count = 0;
	try
	{
	    Set<String> namespaces = NamespaceUtil.getAllNamespaces();
	    System.out.println("Total namespaces - " + namespaces.size());
	   // for (String domain : NamespaceUtil.getAllNamespaces())
	   // {
	   	String domain = "prabathk";
		NamespaceManager.set(domain);
		System.out.println("Domain name is " + domain);
		Milestone milestone = MilestoneUtil.getMilestones();
		milestone.name = "Default";
		milestone.save();
		Long pipelineId = milestone.id;
		System.out.println("Default pipeline " + pipelineId);
		// Util function fetches reports based on duration, generates
		// reports and sends report
		for (Opportunity deal : OpportunityUtil.getOpportunities())
		{
		    try
		    {
			deal.pipeline_id = pipelineId;
			deal.save();
			System.out.println(deal.pipeline_id);
		    }
		    catch (Exception e)
		    {
			System.out.println(e.getMessage());
		    }
		}
		count++;
		System.out.println("Present count " + count);
	   // }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	    System.out.println("Final count " + count);
	}

    }
}
