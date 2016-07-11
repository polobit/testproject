package com.agilecrm.contact.deferred;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.taskqueue.DeferredTask;

public class DeleteTextSearchContactsDeferredTask  implements DeferredTask{
	
	String domain;

	public DeleteTextSearchContactsDeferredTask(String domain)
	{
		this.domain = domain;
	}
	@Override
	public void run()
	{
		if(!domain.isEmpty() && !domain.equalsIgnoreCase(null) && !domain.equalsIgnoreCase("null")){
			NamespaceManager.set(domain);
			AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);
			QueryDocument<Contact> q = new QueryDocument<Contact>(search.index, Contact.class);
			ContactFilter cf = new ContactFilter();
			SearchRule rule = new SearchRule();
			rule.LHS = "type";
			rule.CONDITION = SearchRule.RuleCondition.EQUALS;
			rule.RHS = "PERSON";
			cf.rules.add(rule);
			String query = QueryDocumentUtil.constructFilterQuery(cf);
			List <ScoredDocument> scoredDocs = q.getDocuments(query, null);
			if(scoredDocs != null && scoredDocs.size() > 0)
			{
				for(ScoredDocument sd : scoredDocs)
				{
					search.delete(sd.getId());
				}
			}
		}
	}

}
