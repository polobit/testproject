package com.agilecrm.deals.deferred;

import java.util.List;

import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.util.MilestoneUtil;
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

    /**
     * Serial version id.
     */
    private static final long serialVersionUID = 8225965474422062021L;

    private String domain;

    public DealsDeferredTask(String domain)
    {
	this.domain = domain;
    }

    @Override
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	int count = 0;
	try
	{
	    NamespaceManager.set(domain);
	    System.out.println("Domain name is " + domain);
	    List<Milestone> milestones = MilestoneUtil.getMilestonesList();
	    int defCount = 0;
	    for (Milestone milestone : milestones)
	    {
		if (milestone.name.equals("Default"))
		{
		    milestone.isDefault = true;
		    defCount++;
		}
		milestone.save();
	    }
	    System.out.println("Total default tracks - " + defCount);
	    // Util function fetches reports based on duration, generates
	    // reports and sends report
	    /*
	     * for (Opportunity deal : OpportunityUtil.getOpportunities()) { try
	     * { deal.save(); System.out.println(deal.archived); } catch
	     * (Exception e) { System.out.println(e.getMessage()); } }
	     */
	    count++;
	    System.out.println("Present count " + count);

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
