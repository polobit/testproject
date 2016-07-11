package com.agilecrm;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.query.QueryDocument;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.search.ScoredDocument;
import com.agilecrm.search.document.ContactDocument;

public class DeleteContactsFromTextSearchServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
	{
		String domain = request.getParameter("domain");
		System.out.println("given domain is "+domain);
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
