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
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.cases.Case;
import com.agilecrm.cases.util.CaseUtil;
import com.agilecrm.user.util.DomainUserUtil;

/**
 * <code>CasesAPI</code> includes REST calls to interact with {@link Case} class
 * to initiate User CRUD operations
 * <p>
 * It is called from client side to create, update, fetch and delete the cases.
 * It also interacts with {@link DomainUserUtil} class to fetch the data of
 * DomainUser class from database.
 * </p>
 * 
 * @author Chandan
 */

@Path("/api/cases")
public class CasesAPI {
	/**
	 * GET list of all cases
	 * 
	 * @return All Case as List
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Case> getAll() {
		return CaseUtil.getAllCase();
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
	public Case getCaseData(@PathParam("id") Long id) {
		return CaseUtil.getCase(id);
	}

	/**
	 * Adds new Case to database
	 * 
	 * @param caseData
	 *            - case which is to be added to db
	 * @return Case from db
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Case postCaseData(Case caseData) {
		return CaseUtil.save(caseData);
	}

	/**
	 * Update Case
	 * 
	 * @param caseData
	 *            - update with existing Id
	 * @return updated Case
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Case putCaseData(Case caseData) {

		return CaseUtil.save(caseData);
	}

	/**
	 * Delete a particular case
	 * 
	 * @param id
	 *            - id of Case to delete
	 */
	@DELETE
	@Path("/{id}")
	public void deleteCaseData(@PathParam("id") Long id) {
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
	public void deleteCaseDataBulk(@FormParam("ids") String ids)
			throws JSONException {
		System.out.println("Del Bulk");
		Case.dao.deleteBulkByIds(new JSONArray(ids));
	}
}
