package com.agilecrm.deals.deferred;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.deals.Opportunity;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.OpportunityDocument;
import com.google.appengine.api.search.Document.Builder;
import com.google.appengine.api.taskqueue.DeferredTask;

public class AddDealToSearchDeferredTask implements DeferredTask
{

    /**
     * Represents deals to be updated in docs.
     */
    private List<Opportunity> deals;

    /**
     * Constructor to initialize tags
     * 
     * @param tags
     *            set of tags to create deferred task
     */
    public AddDealToSearchDeferredTask(List<Opportunity> deals)
    {
	this.deals = deals;
    }

    @Override
    public void run()
    {
	// TODO Auto-generated method stub
	AppengineSearch<Opportunity> search = new AppengineSearch<Opportunity>(Opportunity.class);
	OpportunityDocument oppDocs = new OpportunityDocument();

	Double length = (double) deals.size();
	for (int i = 0; i < length / 150; i++)
	{
	    List<Opportunity> subList = deals.subList(i * 150, (Math.min((i + 1) * 150, length.intValue())) - 1);

	    // If contact is new then add it to document else edit document
	    List<Builder> builderObjects = new ArrayList<Builder>();
	    try
	    {
		for (Opportunity deal : subList)
		{
		    builderObjects.add(oppDocs.buildOpportunityDoc(deal));
		}
		search.index.putAsync(builderObjects.toArray(new Builder[deals.size() - 1]));
	    }
	    catch (Exception e)
	    {
		System.out.println("unable to update document ");
		for (Opportunity deal : subList)
		{
		    search.index.putAsync(oppDocs.buildOpportunityDoc(deal));
		}
	    }

	}

	return;

    }

}
