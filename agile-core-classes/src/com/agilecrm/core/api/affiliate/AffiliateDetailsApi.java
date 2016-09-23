/**
 * 
 */
package com.agilecrm.core.api.affiliate;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.affiliate.Affiliate;
import com.agilecrm.affiliate.AffiliateDetails;
import com.agilecrm.affiliate.util.AffiliateDetailsUtil;
import com.agilecrm.affiliate.util.AffiliateUtil;
import com.agilecrm.user.util.DomainUserUtil;

/**
 * @author Santhosh
 *
 */
@Path("/api/affiliate_details")
public class AffiliateDetailsApi {
	
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
	
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public List<AffiliateDetails> getAffiliateDetailsList(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count, @QueryParam("startTime") Long startTime, @QueryParam("endTime") Long endTime, @QueryParam("global_sort_key") String sortFieldName){
		if(sortFieldName == null)
			sortFieldName = "-createdTime";
		List<Affiliate> affiliates = AffiliateUtil.getAffiliates(userId, startTime, endTime, (Integer.parseInt(count)), cursor, sortFieldName);
		return affiliates;
	}
	
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public AffiliateDetails createAffiliateDetails(AffiliateDetails affiliateDetails){
		try {
			affiliateDetails.setUserId(DomainUserUtil.getCurrentDomainUser().id);
			AffiliateDetailsUtil.save(affiliateDetails);
			return affiliateDetails;
		} catch (Exception e) {
			e.printStackTrace();
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public AffiliateDetails updateAffiliateDetails(AffiliateDetails affiliateDetails){
		try {
			affiliateDetails.setUserId(DomainUserUtil.getCurrentDomainUser().id);
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
