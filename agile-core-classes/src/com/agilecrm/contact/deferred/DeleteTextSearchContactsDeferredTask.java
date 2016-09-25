package com.agilecrm.contact.deferred;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.search.document.OpportunityDocument;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.taskqueue.DeferredTask;

public class DeleteTextSearchContactsDeferredTask  implements DeferredTask{
	
	String domain;
	String type ; 

	public DeleteTextSearchContactsDeferredTask(String domain,String type)
	{
		this.domain = domain;
		this.type = type;
		
	}
	@Override
	public void run()
	{
		if(!domain.isEmpty() && !domain.equalsIgnoreCase(null) && !domain.equalsIgnoreCase("null") && !type.isEmpty() && !type.equalsIgnoreCase(null) && !type.equalsIgnoreCase("null") ){
			NamespaceManager.set(domain);String cursor = null;
			AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);
			List<String> totalDocs = new ArrayList<String>();
			List<ScoredDocument> scoredDocs = new ArrayList<ScoredDocument>();
			ContactFilter cf = new ContactFilter();
			SearchRule rule = new SearchRule();
			rule.LHS = "type";
			rule.CONDITION = SearchRule.RuleCondition.EQUALS;
			rule.RHS = type ;
			cf.rules.add(rule);
			if(type.equals("PERSON") || type.equals("COMPANY")){
				QueryDocument<Contact> queryInstace = new QueryDocument<Contact>(new ContactDocument().getIndex(), Contact.class);
				scoredDocs = queryInstace.advancedSearchOnlyIds(cf, 50, cursor, null);
				while(scoredDocs != null && scoredDocs.size() > 0){
					for(ScoredDocument s: scoredDocs){
						totalDocs.add(s.getId());
					}
					ScoredDocument doc = scoredDocs.get(scoredDocs.size() - 1);
					cursor = doc.getCursor().toWebSafeString();
					scoredDocs.clear();
					search.bulkDelete(totalDocs.toArray(new String[scoredDocs.size()]));
					totalDocs.clear();
					scoredDocs = queryInstace.advancedSearchOnlyIds(cf, 50, cursor, null); 
					try {
						Thread.sleep(1000);
					} catch (Exception e){
						System.out.println("in thread exception in delete text search");
						e.printStackTrace();
					}
				 }
			}
			else {			
				QueryDocument<Opportunity> queryInstace = new QueryDocument<Opportunity>(new OpportunityDocument().getIndex(), Opportunity.class);
				scoredDocs = queryInstace.advancedSearchOnlyIds(cf, 100, cursor, null);
				while(scoredDocs != null && scoredDocs.size() > 0){
					for(ScoredDocument s: scoredDocs){
						totalDocs.add(s.getId());
					}
					ScoredDocument doc = scoredDocs.get(scoredDocs.size() - 1);
					cursor = doc.getCursor().toWebSafeString();
					scoredDocs.clear();
					search.bulkDelete(totalDocs.toArray(new String[scoredDocs.size()]));
					totalDocs.clear();
					scoredDocs = queryInstace.advancedSearchOnlyIds(cf, 100, cursor, null);
					try {
						Thread.sleep(1000);
					} catch (Exception e){
						System.out.println("in thread exception in delete text search");
						e.printStackTrace();
					}
				}
			}	
		}
	}

}