/**
 * 
 */
package com.agilecrm.core.api.affiliate;

import javax.ws.rs.Consumes;
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
	
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public AffiliateDetails createAffiliateDetails(AffiliateDetails affiliateDetails){
		try {
			affiliateDetails.save();
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
			affiliateDetails.save();
			return affiliateDetails;
		} catch (Exception e) {
			e.printStackTrace();
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

}
