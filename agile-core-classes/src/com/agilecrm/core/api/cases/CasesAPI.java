package com.agilecrm.core.api.cases;

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

import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.cases.Case;
import com.agilecrm.cases.util.CaseUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.util.DomainUserUtil;

/**
 * <code>CasesAPI</code> includes REST calls to interact with {@link Case} class
 * to initiate User CRUD operations.
 * <p>
 * It is called from client side to create, update, fetch and delete the
 * cases.Uses {@link CaseUtil} for actual work. It also interacts with
 * {@link DomainUserUtil} class to fetch the data of DomainUser class from
 * database.<br/>
 * Bulk delete support is also present via path suffix "/bulk".
 * </p>
 * 
 * @author Chandan
 */

@Path("/api/cases")
public class CasesAPI
{
    /**
     * GET list of all cases
     * 
     * @return All Case as List
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Case> getAllCases(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count,
	    @QueryParam("order_by") String fieldName)
    {
	if (count != null)
	{
	    return CaseUtil.getCases((Integer.parseInt(count)), cursor, fieldName);
	}
	return CaseUtil.getCases();
    }

    /**
     * Gets map of Status : Count of Case Entities.
     * 
     * @return - JSON String containing the map
     */
    @GET
    @Path("/stats/count")
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getStatusCount()
    {
	return CaseUtil.getStatusCount().toString();
    }

    /**
     * Get a specific based on id
     * 
     * @param id
     * @return Case with id = id
     */
    @Path("/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Case getCase(@PathParam("id") Long id)
    {
	return CaseUtil.getCase(id);
    }

    /**
     * Adds new Case to database
     * 
     * @param newCase
     *            - case which is to be added to db
     * @return Case from db
     */
    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Case createCase(Case newCase)
    {
	newCase.save();
	try {
		if(newCase.relatedContacts() != null && newCase.relatedContacts().size() > 0){
			for(Contact con : newCase.relatedContacts()){
				con.forceSearch = true;
				con.save();
			}
		}
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	return newCase;
    }

    /**
     * Update Case
     * 
     * @param newCase
     *            - update with existing Id
     * @return updated Case
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Case updateCase(Case newCase)
    {
	Case oldCase = CaseUtil.getCase(newCase.id);
	try {
		if(oldCase.relatedContacts() != null && oldCase.relatedContacts().size() > 0){
			for(Contact con : oldCase.relatedContacts()){
				con.forceSearch = true ;
				con.save();
			}
		}
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	newCase.save();
	try {
		if(newCase.relatedContacts() != null && newCase.relatedContacts().size() > 0){
			for(Contact con : newCase.relatedContacts()){
				con.forceSearch = true ;
				con.save();
			}
		}
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	return newCase;
    }

    /**
     * Delete a particular case
     * 
     * @param id
     *            - id of Case to delete
     */
    @DELETE
    @Path("/{id}")
    public void deleteCase(@PathParam("id") Long id)
    {
    Case c = CaseUtil.getCase(id);
    try {
		if(c.relatedContacts() != null && c.relatedContacts().size() > 0){
			for(Contact con : c.relatedContacts()){
				con.forceSearch = true ;
				con.save();
			}
		}
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	CaseUtil.delete(id);
    }

    /**
     * Bulk delete multiple Cases
     * 
     * @param ids
     *            - id(s) of cases to delete
     * @throws JSONException
     */
    @POST
    @Path("/bulk")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteMultipleCases(@FormParam("ids") String ids) throws JSONException
    {
    	JSONArray caseJSONArray = new JSONArray(ids);    	 
		try {
			for (int i = 0; i < caseJSONArray.length(); i++) {
				 String caseId = caseJSONArray.getString(i);
				 Case c = CaseUtil.getCase(Long.parseLong(caseId));
				 if(c != null && c.relatedContacts() != null && c.relatedContacts().size() > 0){
					 for(Contact con : c.relatedContacts()){
						 con.forceSearch = true;
						 con.save();
					 }
				 }
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	Case.dao.deleteBulkByIds(new JSONArray(ids));
    }

}
