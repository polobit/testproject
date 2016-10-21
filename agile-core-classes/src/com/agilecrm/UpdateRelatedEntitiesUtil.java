package com.agilecrm;

import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.BulkActionUtil.ActionType;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.search.document.OpportunityDocument;
import com.google.appengine.api.search.Document.Builder;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;



public class UpdateRelatedEntitiesUtil 
{
	private static final int UPDATE_ENTITIES_LIMIT = 10;
	
	public static void updateRelatedContacts(List<Contact> contactsList, List<String> contactIds)
	{	
		try 
		{
			if(contactsList != null && contactsList.size() > UPDATE_ENTITIES_LIMIT)
			{
				updateRelatedEntitiesBackend(contactIds, Contact.class);
			}
			else
			{
				// Enables to build "Document" search on current entity
				AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);

				ContactDocument contactDocuments = new ContactDocument();
				List<Builder> builderObjects = new ArrayList<Builder>();
				for (Contact contact : contactsList)
				{
					contact.forceSearch = true;
					contact.updated_time = System.currentTimeMillis() / 1000;
					builderObjects.add(contactDocuments.buildDocument(contact));
				}

				if (builderObjects.size() >= 1)
				{
					search.index.put(builderObjects.toArray(new Builder[builderObjects.size() - 1]));
				}

				Contact.dao.putAll(contactsList);
			}
		} 
		catch (Exception e) 
		{
			System.out.println("Exception occured in UpdateRelatedEntitiesUtil while updataing related contats");
			e.printStackTrace();
		}
	}
	
	public static void updateRelatedDeals(List<Opportunity> dealsList, List<String> dealIds)
	{	
		try 
		{
			if(dealsList != null && dealsList.size() > UPDATE_ENTITIES_LIMIT)
			{
				updateRelatedEntitiesBackend(dealIds, Opportunity.class);
			}
			else
			{
				// Enables to build "Document" search on current entity
				AppengineSearch<Opportunity> search = new AppengineSearch<Opportunity>(Opportunity.class);

				OpportunityDocument opportunityDocument = new OpportunityDocument();
				List<Builder> builderObjects = new ArrayList<Builder>();
				for (Opportunity opportunity : dealsList)
				{
					opportunity.updated_time = System.currentTimeMillis() / 1000;
					builderObjects.add(opportunityDocument.buildOpportunityDoc(opportunity));
				}

				if (builderObjects.size() >= 1)
				{
					search.index.put(builderObjects.toArray(new Builder[builderObjects.size() - 1]));
				}

				Opportunity.dao.putAll(dealsList);
			}
		} 
		catch (Exception e) 
		{
			System.out.println("Exception occured in UpdateRelatedEntitiesUtil while updataing related contats");
			e.printStackTrace();
		}
	}
	
	public static void updateRelatedEntitiesBackend(List<String> ids, Class<?> obj)
	{	
		try 
		{
			if(ids != null && ids.size() > 0)
			{
				JSONArray jsonArray = new JSONArray();
				jsonArray.addAll(ids);
				
				if(Contact.class.getSimpleName().equalsIgnoreCase(obj.getSimpleName()))
				{
					addRelatedEntitiesToQueue(ActionType.UPDATE.getUrl(), jsonArray.toString());
				}
				else if(Opportunity.class.getSimpleName().equalsIgnoreCase(obj.getSimpleName()))
				{
					addRelatedEntitiesToQueue(ActionType.DEALS_UPDATE.getUrl(), jsonArray.toString());
				}
			}
		} 
		catch (Exception e) 
		{
			System.out.println("Exception occured in UpdateRelatedEntitiesUtil while converting ids list to json array");
			e.printStackTrace();
		}
	}
	
	private static void addRelatedEntitiesToQueue(String url, String ids)
	{
		Queue queue = QueueFactory.getQueue(AgileQueues.BULK_ACTION_QUEUE);
		TaskOptions taskOptions = TaskOptions.Builder.withUrl(url).param("ids", ids).method(Method.POST);
		queue.addAsync(taskOptions);
	}
}
