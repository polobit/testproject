package com.campaignio.servlets.deferred;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.cases.Case;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.document.Document;
import com.agilecrm.landingpages.LandingPage;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.sendgrid.SendGrid;

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
			case "getLanguage":
				dao = new ObjectifyGenericDao<UserPrefs>(UserPrefs.class);
				getLanguage(dao.fetchAll(), dao);
				break;
			case "getPrefcurrency":
				dao = new ObjectifyGenericDao<UserPrefs>(UserPrefs.class);
				getprefCurrency(dao.fetchAll(), dao);
				break;
			default:
				break;
			}

		} finally {
		}
	}

	void getLanguage(List<UserPrefs> userPrefs, ObjectifyGenericDao<UserPrefs> dao) {
		System.out.println("userPrefs = " + userPrefs.size());
		int noofChanged = 0;
		for (UserPrefs prefItem : userPrefs) {

			// Trim name and make dummy one to sore
			if (StringUtils.isNotBlank(prefItem.language) && !StringUtils.equalsIgnoreCase(prefItem.language, "en")) {
				noofChanged++;
			}

		}

		if (noofChanged < 1)
			return;

		{
			String text = "Domain : " + NamespaceManager.get() + " : " + noofChanged;
			try {
				SendGrid.sendMail(null, null, "govind@invox.com", "Govind", "govind@invox.com", null, null, "Lan", null,
						text, text, null, new String[]{});
			} catch (Exception e) {
				// TODO: handle exception
			}
			
		}

	}

	void updateCases(List<Case> cases, ObjectifyGenericDao<Case> dao) {
		System.out.println("cases = " + cases.size());
		for (Case caseItem : cases) {

			// Trim name and make dummy one to sore
			if (StringUtils.isNotBlank(caseItem.title))
				caseItem.dummy_title = caseItem.title.toLowerCase().trim();

			dao.put(caseItem, true);
		}
	}

	void updateDocuments(List<Document> documents, ObjectifyGenericDao<Document> dao) {
		System.out.println("documents = " + documents.size());
		for (Document documentItem : documents) {

			// Trim name and make dummy one to sore
			if (StringUtils.isNotBlank(documentItem.name))
				documentItem.dummy_name = documentItem.name.toLowerCase().trim();

			dao.put(documentItem, true);
		}
	}

	void updatePages(List<LandingPage> pages, ObjectifyGenericDao<LandingPage> dao) {
		System.out.println("pages = " + pages.size());
		for (LandingPage pageItem : pages) {

			// Trim name and make dummy one to sore
			if (StringUtils.isNotBlank(pageItem.name))
				pageItem.dummy_name = pageItem.name.toLowerCase().trim();

			dao.put(pageItem, true);
		}
	}
	void getprefCurrency(List<UserPrefs> userPrefs, ObjectifyGenericDao<UserPrefs> dao) {
		System.out.println("userPrefs = " + userPrefs.size());
		int noofChanged = 0;
		for (UserPrefs prefItem : userPrefs) {
			

			// Trim name and make dummy one to sore
			if (StringUtils.isNotBlank(prefItem.currency) && (StringUtils.equalsIgnoreCase(prefItem.currency.substring(0, 3), "GBP") || StringUtils.equalsIgnoreCase(prefItem.currency.substring(0, 3), "SKK"))) {
				noofChanged++;
			}

		}

		if (noofChanged < 1)
			return;

		{
			String text = "Domain : " + NamespaceManager.get() + " : " + noofChanged;
			try {
				SendGrid.sendMail(null, null, "sankar@agilecrm.com", "Sankar", "sankar@agilecrm.com", null, null, "Lan", null,
						text, text, null, new String[]{});
			} catch (Exception e) {
				// TODO: handle exception
			}
			
		}

	}
}
