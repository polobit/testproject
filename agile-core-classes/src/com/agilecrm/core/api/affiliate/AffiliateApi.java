/**
 * 
 */
package com.agilecrm.core.api.affiliate;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.Globals;
import com.agilecrm.affiliate.Affiliate;
import com.agilecrm.affiliate.util.AffiliateUtil;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;

/**
 * @author Santhosh
 *
 */
@Path("/api/affiliate")
public class AffiliateApi {
	
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public List<Affiliate> getAffiliates(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count, @QueryParam("userId") Long userId, @QueryParam("startTime") Long startTime, @QueryParam("endTime") Long endTime){
		List<Affiliate> affiliates = AffiliateUtil.getAffiliates(userId, startTime, endTime, (Integer.parseInt(count)), cursor);
		return affiliates;
	}
	
	@Path("total")
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public String getTotalcommisionAmount(@QueryParam("userId") Long userId, @QueryParam("startTime") Long startTime, @QueryParam("endTime") Long endTime){
		try{
			return AffiliateUtil.getTotalCommisionAmount(userId, startTime, endTime);
		}catch (Exception e) {
			e.printStackTrace();
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Set affiliates
	 */
	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Affiliate createAffiliate(@QueryParam("am") int amount){
		return AffiliateUtil.createAffiliate(amount);
	}
	@Path("/test")
	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public void createTestAffiliate(){
		createTestAffiliate(1);
		createTestAffiliate(2);
		createTestAffiliate(3);
		createTestAffiliate(4);
		createTestAffiliate(5);
		createTestAffiliate(6);
		createTestAffiliate(7);
		createTestAffiliate(8);
	}
	public Affiliate createTestAffiliate(int i){
		Affiliate affiliate = new Affiliate();
		affiliate.setDomain("test"+i);
		affiliate.setEmail("test@yopmail.com"+i);
		affiliate.setPlan(PlanType.STARTER_MONTHLY);
		affiliate.setUsersCount(i);
		affiliate.setRelatedUserId(123123213L);
		affiliate.setAmount(723*i);
		affiliate.setCommission(Globals.AFFILIATE_COMMISION);
		affiliate.save();
		return affiliate;
	}
}
