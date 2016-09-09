package com.campaignio.servlets.deferred;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.cases.Case;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.document.Document;
import com.agilecrm.landingpages.LandingPage;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>EmailRepliedDeferredTask</code> is the deferred task that handles
 * campaign email Replied tasklet cron jobs.
 *
 * @author Govind
 * 
 */
@SuppressWarnings("serial")
public class EntityDeferredTask implements DeferredTask {

	public String domain;
	public String entity_name;

	public EntityDeferredTask(String domain, String entity_name) {
		this.domain = domain;
		this.entity_name = entity_name;
	}

	public void run() {

		try {

			if (StringUtils.isBlank(domain))
				return;
			NamespaceManager.set(domain);

			ObjectifyGenericDao dao = null;
			
			switch (entity_name) {
			case "cases":
				dao = new ObjectifyGenericDao<Case>(Case.class);
				updateCases(dao.fetchAll(), dao);
				break;
			case "documents":
				dao = new ObjectifyGenericDao<Document>(Document.class);
				updateDocuments(dao.fetchAll(), dao);
				break;
			case "landingpages":
				dao = new ObjectifyGenericDao<LandingPage>(LandingPage.class);
				updatePages(dao.fetchAll(), dao);
				break;
			case "workflows":
				break;
			case "domainusers":
				break;
			default:
				break;
			}

		} finally {
		}
	}
	
	void updateCases(List<Case> cases, ObjectifyGenericDao<Case> dao){
		System.out.println("cases = " + cases.size());
		for (Case caseItem : cases) {
			
			// Trim name and make dummy one to sore
			if(StringUtils.isNotBlank(caseItem.title))
				caseItem.dummy_title = caseItem.title.toLowerCase().trim();
			
			dao.put(caseItem, true);
		}
	}
	
	void updateDocuments(List<Document> documents, ObjectifyGenericDao<Document> dao){
		System.out.println("documents = " + documents.size());
		for (Document documentItem : documents) {
			
			// Trim name and make dummy one to sore
			if(StringUtils.isNotBlank(documentItem.name))
				documentItem.dummy_name = documentItem.name.toLowerCase().trim();
			
			dao.put(documentItem, true);
		}
	}
	
	
	void updatePages(List<LandingPage> pages, ObjectifyGenericDao<LandingPage> dao){
		System.out.println("pages = " + pages.size());
		for (LandingPage pageItem : pages) {
			
			// Trim name and make dummy one to sore
			if(StringUtils.isNotBlank(pageItem.name))
				pageItem.dummy_name = pageItem.name.toLowerCase().trim();
			
			dao.put(pageItem, true);
		}
	}
}
