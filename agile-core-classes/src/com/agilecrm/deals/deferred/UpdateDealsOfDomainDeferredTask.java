package com.agilecrm.deals.deferred;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.OpportunitySchemaUpdateStats;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.OpportunityDocument;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.search.Document.Builder;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

@SuppressWarnings("serial")
public class UpdateDealsOfDomainDeferredTask implements DeferredTask 
{
	/**
	 * Domain of the account
	 */
	private String domain;

	private String cursor;

	private int count;

	public UpdateDealsOfDomainDeferredTask(String domain, String cursor, int count)
	{
		this.domain = domain;
		this.cursor = cursor;
		this.count = count;
	}

	@Override
	public void run()
	{
		System.out.println("Task started for domain: "+ domain);
		String oldNamespace = NamespaceManager.get();
		int currentCount = 0;
		String failedIds = "";

		NamespaceManager.set(domain);
		List<Opportunity> deals_list = null;
		List<Builder> builderObjects = new ArrayList<Builder>();
		String currentCursor = null;
		String previousCursor = null;
		try
		{
			OpportunitySchemaUpdateStats opportunitySchemaUpdateStats = getStats();
			if(opportunitySchemaUpdateStats != null) {
				count = opportunitySchemaUpdateStats.count;
				previousCursor = opportunitySchemaUpdateStats.cursor;
				failedIds = opportunitySchemaUpdateStats.failedIds;
				updateStats(previousCursor,failedIds, "RUNNING");
			}
			OpportunityDocument opportunityDocument = new OpportunityDocument();
			deals_list = Opportunity.dao.fetchAll(200, cursor, null);
			try {
				if(StringUtils.isEmpty(cursor) && count == 0 && currentCount == 0 && opportunitySchemaUpdateStats == null) {
					System.out.println("In UpdateDealsOfDomainDeferredTask run method-----");
					int total = Opportunity.dao.getCount(Opportunity.dao.ofy().query(Opportunity.class));
					System.out.println("In UpdateDealsOfDomainDeferredTask run method-----total-------"+total);
					createStats(total);
				}
			} catch(Exception e) {
				System.err.println("Exception while creating stats for domain: "+ domain);
				e.printStackTrace();
			}
			if(deals_list == null || deals_list.isEmpty()) {
				updateStats(null, failedIds, "COMPLETED");
				return;
			}
			AppengineSearch<Opportunity> search = new AppengineSearch<Opportunity>(Opportunity.class);
			do
			{
				currentCount += deals_list.size();

				previousCursor = deals_list.get(deals_list.size() - 1).cursor;
				
				for (Opportunity opportunity : deals_list)
				{
					try {
						search.index.putAsync(opportunityDocument.buildOpportunityDoc(opportunity));
					} catch(Exception e) {
						System.out.println("Exception while adding deal to text search: "+opportunity.id + e);
						failedIds = failedIds + ", " + opportunity.id;
					}
					/*if(builderObjects.size() >= 50) {
						search.index.putAsync(builderObjects.toArray(new Builder[builderObjects.size() - 1]));
						builderObjects.clear();
					}*/
				}
				Opportunity.dao.putAll(deals_list);

				if(builderObjects.size() > 0) {
					search.index.putAsync(builderObjects.toArray(new Builder[builderObjects.size() - 1]));
					builderObjects.clear();
				}
				
				System.out.println("Deals completed so far: "+ currentCount);

				
				//already saved 10000 so create new task.
				if(currentCount >= 10000) {
					count+=currentCount;
					if(previousCursor != null) {
						System.out.println("New task started for domain: "+ domain+" after completing "+count);
						//update stats with new count and cursor.
						updateStats(previousCursor,failedIds, "ANOTHER_TASK_CRAETED");
						UpdateDealsOfDomainDeferredTask updateDealsDeferredTask = new UpdateDealsOfDomainDeferredTask(
								domain, previousCursor, count);
						// Create Task and push it into Task Queue
					    TaskOptions taskOptions = TaskOptions.Builder.withPayload(updateDealsDeferredTask);
						
						
						// Add to queue
						Queue queue = QueueFactory.getQueue(AgileQueues.DEALS_SCHEMA_CHANGE_QUEUE);
						queue.addAsync(taskOptions);
					} else {
						//update stats to completion.
						updateStats(previousCursor,failedIds, "COMPLETED");
					}
					break;
				}

				if (!StringUtils.isEmpty(previousCursor))
				{
					deals_list = Opportunity.dao.fetchAll(200, previousCursor, null);
					
					currentCursor = deals_list.size() > 0 ? deals_list.get(deals_list.size() - 1).cursor
							: null;
					continue;
				}
				
				//update stats to completion.
				count+=currentCount;
				updateStats(previousCursor,failedIds, "COMPLETED");
				break;
			} while (deals_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor));
			

		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
	
	private void createStats(int total)
	{
		NamespaceManager.set("");
		try {
		 new OpportunitySchemaUpdateStats(domain, "STARTED", null, 0, total).save();
		} finally {
			NamespaceManager.set(domain);
		}
		
	}

	private OpportunitySchemaUpdateStats getStats()
	{
		NamespaceManager.set("");
		try {
			return OpportunitySchemaUpdateStats.getByDomain(domain);
		} finally {
			NamespaceManager.set(domain);
		}
	}

	private void updateStats(String previousCursor,String failedIds, String status) {
		NamespaceManager.set("");
		try {
			System.out.println("In UpdateDealsOfDomainDeferredTask updateStats method-----");
			OpportunitySchemaUpdateStats opportunitySchemaUpdateStats = OpportunitySchemaUpdateStats.get(domain);
			opportunitySchemaUpdateStats.count = count;
			opportunitySchemaUpdateStats.cursor = previousCursor;
			opportunitySchemaUpdateStats.status = status;
			opportunitySchemaUpdateStats.failedIds = failedIds;
			opportunitySchemaUpdateStats.save();
			System.out.println("In UpdateDealsOfDomainDeferredTask updateStats method-----count-------"+count);
		} catch(Exception e) {
			System.err.println("Exception while updating stats for domain: "+ domain);
			e.printStackTrace();
		} finally {
			NamespaceManager.set(domain);
		}
	}
}