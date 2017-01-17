package com.agilecrm.core.api.document;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.UpdateRelatedEntitiesUtil;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.googlecode.objectify.Key;

/**
 * <code>DocumentsAPI</code> includes REST calls to interact with
 * {@link Document} class to initiate Document CRUD operations
 * <p>
 * It is called from client side to add, updates, fetch and delete the
 * documents. It also interacts with {@link DocumentUtil} class to fetch the
 * data of Document class from database.
 * </p>
 */
@Path("/api/documents")
public class DocumentsAPI
{

    /**
     * Returns list of documents. This method is called if TEXT_PLAIN is
     * request.
     * 
     * @return list of documents.
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Document> getAllDocuments(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count ,@QueryParam("global_sort_key") String fieldName )
    {
        List<Document> documents = null;
    	if (count != null)
    	{
    		documents = DocumentUtil.getDocuments((Integer.parseInt(count)), cursor, fieldName);
    	}else {
    		documents = DocumentUtil.getDocuments();
    	}
    	
    	for(Document d : documents){
    		if(d.url != null && d.url.contains("?id=uploadDocumentForm"))
    			urlEncode(d);
    	}
    	
    	return documents;
        }
    // encoding url, encode file name with space or special character in file name.
    
    private void urlEncode(Document d){
    	try{
    	String s = d.url;
    	String st = s.substring(0,s.lastIndexOf("/")+1) ;
    	String en = s.substring(s.lastIndexOf(".")) ;
    	String filename = s.replace(st, "").replace(en, "");
    	d.url = st+URLEncoder.encode(filename, "UTF-8")+en;
    	} catch(Exception e){}
    }

    /**
     * Gets a document based on id
     * 
     * @param id
     *            unique id of document
     * @return {@link Document}
     */
    @Path("{document-id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Document getDocument(@PathParam("document-id") Long id)
    {
	Document document = DocumentUtil.getDocument(id);
	return document;
    }

    /**
     * Deletes a document based on id
     * 
     * @param id
     *            unique id of document
     */
    @Path("{document-id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteDocument(@PathParam("document-id") Long id)
    {
    Document document = null;
    try 
    {
    	document = DocumentUtil.getDocument(id);
	} 
    catch (Exception e) 
    {
		e.printStackTrace();
	}
    if(document != null)
    {
    	List<String> conIds = document.getContact_ids();
    	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    	{
    		throw new AccessDeniedException("Document cannot be detached because you do not have permission to update associated contact.");
    	}
    	
    	List<String> dealIds = document.getDeal_ids();
    	List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
    	if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
    	{
    		throw new AccessDeniedException("Document cannot be detached because you do not have permission to update associated deal.");
    	}
    	
    	try
    	{
    		if(!(document.relatedDealKeys()).isEmpty())
    		{
    			for(Key<Opportunity> key : document.relatedDealKeys()) 
    			{
    				Opportunity opp = Opportunity.dao.get(key);
    				opp.save();
    			} 
    		}
    	}
    	catch (Exception e) 
    	{
				// TODO Auto-generated catch block
				e.printStackTrace();
    	}
    	document.delete();
    }
    }

    /**
     * Saves new document
     * 
     * @param document
     *            {@link Document}
     * @return {@link Document}
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Document createDocument(Document document)
    {
	List<String> conIds = document.getContact_ids();
    List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    {
    	throw new AccessDeniedException("Document cannot be attached because you do not have permission to update associated contact(s).");
    }
    
    List<String> dealIds = document.getDeal_ids();
	List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
	if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
	{
		throw new AccessDeniedException("Document cannot be attached because you do not have permission to update associated deal(s).");
	}
    
    document.save();

	try
	{
	    ActivitySave.createDocumentAddActivity(document);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	UpdateRelatedEntitiesUtil.updateRelatedDeals(document.relatedDeals(), dealIds);
	
	UpdateRelatedEntitiesUtil.updateRelatedContacts(document.relatedContacts(), conIds);
	
	return document;
    }

    /**
     * Updates the existing document
     * 
     * @param document
     *            {@link Document}
     * @return {@link Document}
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Document updateDocument(Document document)
    {
    Document oldDocument = null;
    List<String> oldConIds = new ArrayList<String>();
    List<String> oldDealIds = new ArrayList<String>();
    try 
    {
    	oldDocument = DocumentUtil.getDocument(document.id);
	} 
    catch (Exception e) 
    {
		e.printStackTrace();
	}
    if(oldDocument != null)
    {
    	List<String> conIds = oldDocument.getContact_ids();
    	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    	{
    		throw new AccessDeniedException("Document cannot be attached because you do not have permission to update associated contact(s).");
    	}
    	
    	List<String> dealIds = oldDocument.getDeal_ids();
    	List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
    	if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
    	{
    		throw new AccessDeniedException("Document cannot be attached because you do not have permission to update associated deal(s).");
    	}
    	oldConIds.addAll(conIds);
    	oldDealIds.addAll(dealIds);
    }
	List<String> conIds = document.getContact_ids();
	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
	{
		throw new AccessDeniedException("Document cannot be attached because you do not have permission to update associated contact(s).");
	}
	
	List<String> dealIds = document.getDeal_ids();
	List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
	if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
	{
		throw new AccessDeniedException("Document cannot be attached because you do not have permission to update associated deal(s).");
	}
    	
	try
	{
	    ActivitySave.createDocumentUpdateActivity(document);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	
	if(document.network_type.equals("GOOGLE"))
		document.size = 0L;
	document.save();
	
	List<Contact> relatedContactsOldList = oldDocument.relatedContacts();
	List<Contact> relatedContactsList = document.relatedContacts();
	
	List<Opportunity> relatedDealsOldList = oldDocument.relatedDeals();
	List<Opportunity> relatedDealsList = document.relatedDeals();
	
	if(relatedContactsOldList != null && relatedContactsOldList.size() > 0 && relatedContactsList != null)
	{
		relatedContactsList.addAll(relatedContactsOldList);
	}
	if(relatedDealsOldList != null && relatedDealsOldList.size() > 0 && relatedDealsList != null)
	{
		relatedDealsList.addAll(relatedDealsOldList);
	}
	List<String> conIdList = new ArrayList<String>();
	if(oldConIds != null && oldConIds.size() > 0)
	{
		conIdList.addAll(oldConIds);
	}
	if(conIds != null && conIds.size() > 0)
	{
		conIdList.addAll(conIds);
	}
	List<String> dealIdList = new ArrayList<String>();
	if(oldDealIds != null && oldDealIds.size() > 0)
	{
		dealIdList.addAll(oldDealIds);
	}
	if(dealIds != null && dealIds.size() > 0)
	{
		dealIdList.addAll(dealIds);
	}
	
	UpdateRelatedEntitiesUtil.updateRelatedContacts(relatedContactsList, conIdList);
	
	UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIdList);
	
	return document;
    }

    /**
     * Deletes documents bulk
     * 
     * @param model_ids
     *            document ids, read as form parameter from request url
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_JSON })
    public List<String> deleteDocuments(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray documentsJSONArray = new JSONArray(model_ids);
	JSONArray docsJSONArray = new JSONArray();
	List<String> contactIdsList = new ArrayList<String>();
	if(documentsJSONArray!=null && documentsJSONArray.length()>0){
		for (int i = 0; i < documentsJSONArray.length(); i++) {
			try{
				
				DocumentUtil.deleteDocumentNotes(documentsJSONArray.getString(i));
			}
			catch (Exception e)
		    {
				e.printStackTrace();
		    }
			try
			   {
				
				String eventId =  documentsJSONArray.getString(i);
				Document doc = DocumentUtil.getDocument(Long.parseLong(eventId));
				
				List<String> conIds = doc.getContact_ids();
		    	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
		    	if(conIds == null || modifiedConIds == null || conIds.size() == modifiedConIds.size())
		    	{
		    		docsJSONArray.put(documentsJSONArray.getString(i));
		    		contactIdsList.addAll(modifiedConIds);
		    	}
				
		    	UpdateRelatedEntitiesUtil.updateRelatedDeals(doc.relatedDeals(), doc.getDeal_ids());
		    	
		    	UpdateRelatedEntitiesUtil.updateRelatedContacts(doc.relatedContacts(), doc.getContact_ids());
		    	
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
         }
	  }
	ActivitySave.createLogForBulkDeletes(EntityType.DOCUMENT, docsJSONArray,
		String.valueOf(docsJSONArray.length()), "documents deleted");

	Document.dao.deleteBulkByIds(docsJSONArray);
	return contactIdsList;
    }

    /**
     * Documents of a contact, when in contact detail view
     * 
     * @param id
     *            id of contact
     * @return list of documents related to a contact
     */
    @Path("/contact/{contact-id}/docs")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Document> getDocumentsByContactID(@PathParam("contact-id") Long id)
    {
	try
	{
	    return DocumentUtil.getContactDocuments(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    @Path("/{contact-id}/docs")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Document> getContactDocument(@PathParam("contact-id") Long id)
    {
	try
	{
	    return DocumentUtil.getContactDocuments(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Documents of a case
     * 
     * @param id
     *            id of case
     * @return list of documents related to a case
     */
    @Path("/{case-id}/docs")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Document> getCaseDocument(@PathParam("case-id") Long id)
    {
	try
	{
	    return DocumentUtil.getCaseDocuments(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Documents of a deal
     * 
     * @param id
     *            id of deal
     * @return list of documents related to a deal
     */
    @Path("/{deal-id}/docs")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Document> getCurrentContactDocument(@PathParam("deal-id") Long id)
    {
	try
	{
	    return DocumentUtil.getDealDocuments(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Documents of a deal
     * 
     * @param id
     *            id of deal
     * @return list of documents related to a deal
     */
    @Path("/opportunity/{deal-id}/docs")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Document> getCurrentOpportunityDocument(@PathParam("deal-id") Long id)
    {
	try
	{
	    return DocumentUtil.getDealDocuments(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

}