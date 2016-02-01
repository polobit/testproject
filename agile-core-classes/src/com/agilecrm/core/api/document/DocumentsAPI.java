package com.agilecrm.core.api.document;

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

import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;

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
    public List<Document> getAllDocuments(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
    {
	if (count != null)
	{
	    return DocumentUtil.getDocuments((Integer.parseInt(count)), cursor);
	}
	return DocumentUtil.getDocuments();
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
	try
	{
	    Document document = DocumentUtil.getDocument(id);
	    if (document != null)
		document.delete();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
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
    	if(document!=null && document.network_type!=null && document.network_type.equals("GOOGLE"))
    		document.size = 0L;
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
    public void deleteDocuments(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray documentsJSONArray = new JSONArray(model_ids);
	ActivitySave.createLogForBulkDeletes(EntityType.DOCUMENT, documentsJSONArray,
		String.valueOf(documentsJSONArray.length()), "documents deleted");

	Document.dao.deleteBulkByIds(documentsJSONArray);
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
