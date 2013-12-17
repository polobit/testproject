package com.agilecrm.UploadDocument;

import java.util.List;

import com.agilecrm.activities.Event;
import com.agilecrm.cases.Case;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.googlecode.objectify.Key;

/**
 * <code>DocumentUtil</code> is utility class used to process data of
 * {@link Document} class.
 * <p>
 * This utility class includes methods needed to return the documents based on
 * contacts, deals, cases. Event utility methods return all documents, document
 * tracked by an id and documents based on contacts, deals, cases.
 * </p>
 */
public class DocumentUtil
{
    /**
     * ObjectifyDao of Document.
     */
    public static ObjectifyGenericDao<Document> dao = new ObjectifyGenericDao<Document>(Document.class);

    /**
     * Returns Document based on Id. If no Document is present with that id,
     * returns null.
     * 
     * @param id
     *            Id of an Document
     * @return {@link Document} related to the id
     */
    public static Document getDocument(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fetches all the Documents with out any filtering
     * 
     * @return all the existing Documents list
     */
    public static List<Document> getDocuments()
    {
	try
	{
	    return dao.fetchAll();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets documents related to a particular contact
     * 
     * @param contactId
     *            contact id to get the documents related to a contact
     * @return List of documents related to a contact
     * @throws Exception
     */
    public static List<Document> getContactDocuments(Long contactId) throws Exception
    {
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);
	return dao.listByProperty("related_contacts = ", contactKey);
    }

    /**
     * Gets documents related to a particular case
     * 
     * @param caseId
     *            case id to get the documents related to a case
     * @return List of documents related to a case
     * @throws Exception
     */
    public static List<Document> getCaseDocuments(Long caseId) throws Exception
    {
	Key<Case> caseKey = new Key<Case>(Case.class, caseId);
	return dao.listByProperty("related_cases = ", caseKey);
    }

    /**
     * Gets documents related to a particular deal
     * 
     * @param dealId
     *            deal id to get the documents related to a deal
     * @return List of documents related to a deal
     * @throws Exception
     */
    public static List<Document> getDealDocuments(Long dealId) throws Exception
    {
	Key<Opportunity> dealKey = new Key<Opportunity>(Opportunity.class, dealId);
	return dao.listByProperty("related_deals = ", dealKey);
    }
}
