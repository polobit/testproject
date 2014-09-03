package com.agilecrm.deals.deferred;

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
	try
	{
	    for (String domain : NamespaceUtil.getAllNamespaces())
	    {
		NamespaceManager.set(domain);
		Milestone milestone = MilestoneUtil.getMilestones();
		milestone.name = "Default";
		milestone.save();
		Long pipelineId = milestone.id;
		// Util function fetches reports based on duration, generates
		// reports and sends report
		for (Opportunity deal : OpportunityUtil.getOpportunities())
		{
		    deal.pipeline_id = pipelineId;
		    deal.save();
		}
	    }

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }

}
