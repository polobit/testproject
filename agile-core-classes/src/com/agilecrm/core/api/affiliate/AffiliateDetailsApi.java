/**
 * 
 */
package com.agilecrm.core.api.affiliate;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.affiliate.AffiliateDetails;
import com.agilecrm.affiliate.util.AffiliateDetailsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * @author Santhosh
 *
 */
@Path("/api/affiliate_details")
public class AffiliateDetailsApi {
	
	/**
	 * Fetch Current user affiliate details
	 * @return
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public AffiliateDetails getAffiliateDetails(){
		try {
			return AffiliateDetailsUtil.getAffiliateDetails();
		} catch (Exception e) {
			e.printStackTrace();
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Fetch affiliate Details with filters
	 * @param cursor
	 * @param userId
	 * @param count
	 * @param startTime
	 * @param endTime
	 * @param sortFieldName
	 * @param filterBy
	 * @return
	 */
	@Path("/list")
	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public List<AffiliateDetails> getAffiliateDetailsList(@FormParam("cursor") String cursor, @FormParam("page_size") String count, @FormParam("startTime") Long startTime, @FormParam("endTime") Long endTime, @FormParam("filter_by") String filterBy){
		String sortFieldName = null;
		if(filterBy != null)
			sortFieldName = "-"+filterBy;
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
		try{
			List<AffiliateDetails> affiliateDetailList = AffiliateDetailsUtil.getAffiliateDetailsList(startTime, endTime, (Integer.parseInt(count)), cursor, sortFieldName, filterBy);
			return affiliateDetailList;
		}finally{
			NamespaceManager.set(oldNamespace);
		}
	}
	
	/**
	 * Create Affiliate Details
	 * @param affiliateDetails
	 * @return
	 */
	@POST
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public AffiliateDetails createAffiliateDetails(AffiliateDetails affiliateDetails){
		try {
			if(affiliateDetails.getId() == null){
				DomainUser user = DomainUserUtil.getCurrentDomainUser();
				affiliateDetails.setUserId(user.id);
				affiliateDetails.setDomain(user.domain);
				affiliateDetails.setEmail(user.email);
			}
			affiliateDetails.setUpdatedTime(System.currentTimeMillis()/1000);
			AffiliateDetailsUtil.save(affiliateDetails);
			return affiliateDetails;
		} catch (Exception e) {
			e.printStackTrace();
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

}
