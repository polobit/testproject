/**
 * 
 */
package com.agilecrm.core.api.addon;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.addon.AddOn;
import com.agilecrm.addon.AddOnInfo.AddOnStatus;
import com.agilecrm.addon.AddOnUtil;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.stripe.model.Invoice;

/**
 * Extra payment addons for users
 * @author Santhosh
 *
 */
@Path("/api/addon")
public class AddOnAPI implements Serializable{
	
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * Get acl addon from cache if not available fetch from DB
	 * @return
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Path("/acl")
	public AddOn getAclAddOn(){
		return AddOnUtil.getAddOn();
	}
	
	/**
	 * Get campaign addon from cache if not available fetch from DB
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Path("/campaign")
	public AddOn getCampaignAddOn(){
		return AddOnUtil.getAddOn();
	}
	
	/**
	 * Get trigger addon from cache if not available fetch from DB
	 * @return
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Path("/trigger")
	public AddOn getTriggerAddOn(){
		return AddOnUtil.getAddOn();
	}
	
	/**
	 * Create or Edit the acl addon
	 * @param addOn
	 * @return
	 */
	@POST
	@Path("/acl")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public AddOn setAclAddOn(AddOn addOn){
		try{
			AddOnUtil.checkForPriviliges();
			AddOnUtil.checkForCreditCard();
			AddOn dbAddOn = AddOnUtil.getAddOn();
			if(addOn.getAclUsers().size() == 0)
				throw new Exception("Sorry, Can not process your request with 0 quantity");
			if(dbAddOn.getAclUsers().size() != addOn.getAclUsers().size()){
				boolean proration = true;
				if(addOn.aclInfo.quantity < dbAddOn.aclInfo.quantity)
					proration = false;
				com.stripe.model.Subscription subscription = StripeUtil.updateAddOnSubscription("addon-acl-12", addOn.getAclUsers().size(), dbAddOn.aclInfo.subscriptionId, proration);
				dbAddOn.aclInfo.planId = "addon-acl-12";
				dbAddOn.aclInfo.subscriptionId = subscription.getId();
			}
			Set<Long> modifiedUsers = new HashSet<Long>();
			for(Long id : dbAddOn.getAclUsers()){
				if(!addOn.getAclUsers().contains(id))
					modifiedUsers.add(id);
			}
			AddOnUtil.setDefaultAcls(modifiedUsers);
			dbAddOn.setAclUsers(addOn.getAclUsers());
			dbAddOn.aclInfo.status = AddOnStatus.SUCCESS;
			dbAddOn.save();
			return dbAddOn;
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Create or edit campaign addon
	 * @param addOn
	 * @return
	 */
	@POST
	@Path("/campaign")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public AddOn setCampaignAddOn(AddOn addOn){
		try{
			AddOnUtil.checkForPriviliges();
			AddOnUtil.checkForCreditCard();
			AddOn dbAddOn = AddOnUtil.getAddOn();
			if(addOn.campaignInfo.quantity == 0)
				throw new Exception("Sorry, Can not process your request with 0 quantity");
			
			if(dbAddOn.campaignInfo.quantity != addOn.campaignInfo.quantity){
				boolean proration = true;
				if(addOn.campaignInfo.quantity < dbAddOn.campaignInfo.quantity)
					proration = false;
				com.stripe.model.Subscription subscription = StripeUtil.updateAddOnSubscription(addOn.campaignInfo.planId, addOn.campaignInfo.quantity, dbAddOn.campaignInfo.subscriptionId, proration);
				dbAddOn.campaignInfo.subscriptionId = subscription.getId();
				dbAddOn.campaignInfo.planId = addOn.campaignInfo.planId;
			}
			dbAddOn.campaignInfo.quantity = addOn.campaignInfo.quantity;
			dbAddOn.campaignInfo.status = AddOnStatus.SUCCESS;
			dbAddOn.save();
			return dbAddOn;
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Create or edit trigger addon
	 * @param addOn
	 * @return
	 */
	@POST
	@Path("/trigger")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public AddOn setTriggerAddOn(AddOn addOn){
		try{
			AddOnUtil.checkForPriviliges();
			AddOnUtil.checkForCreditCard();
			AddOn dbAddOn = AddOnUtil.getAddOn();
			if(addOn.triggerInfo.quantity == 0)
				throw new Exception("Sorry, Can not process your request with 0 quantity");
			if(dbAddOn.triggerInfo.quantity != addOn.triggerInfo.quantity){
				boolean proration = true;
				if(addOn.triggerInfo.quantity < dbAddOn.triggerInfo.quantity)
					proration = false;
				com.stripe.model.Subscription subscription = StripeUtil.updateAddOnSubscription(addOn.triggerInfo.planId, addOn.triggerInfo.quantity, dbAddOn.triggerInfo.subscriptionId,proration);
				dbAddOn.triggerInfo.subscriptionId = subscription.getId();
				dbAddOn.triggerInfo.planId = addOn.triggerInfo.planId;
			}
			dbAddOn.triggerInfo.quantity = addOn.triggerInfo.quantity;
			dbAddOn.triggerInfo.status = AddOnStatus.SUCCESS;
			dbAddOn.save();
			return dbAddOn;
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Delete acl addon subscription from stripe reset acls to defaults
	 * @param addOn
	 */
	@DELETE
	@Path("/acl")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteAclAddOn(){
		try{
			AddOnUtil.checkForPriviliges();
			AddOn dbAddOn = AddOnUtil.getAddOn();
			if(dbAddOn.aclInfo.subscriptionId != null)
				StripeUtil.cancelAddOnSubscription(dbAddOn.aclInfo.subscriptionId);
			AddOnUtil.setDefaultAcls(dbAddOn.getAclUsers());
			dbAddOn.setAclUsers(new HashSet<Long>());
			dbAddOn.aclInfo.quantity = 0;
			dbAddOn.aclInfo.subscriptionId = null;
			dbAddOn.save();
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Delete campaign addon subscription from stripe and set campaignCount to '0'
	 * @param addOn
	 */
	@DELETE
	@Path("/campaign")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteCampaignAddOn(){
		try{
			AddOnUtil.checkForPriviliges();
			AddOn dbAddOn = AddOnUtil.getAddOn();
			if(!AddOnUtil.canDowngradeCampaigns(0))
				throw new Exception("Sorry, we are unable to process your request for canceling your Campaigns Add-on subscription. Delete extra campaigns from your account & try again.");
			if(dbAddOn.campaignInfo.subscriptionId != null)
				StripeUtil.cancelAddOnSubscription(dbAddOn.campaignInfo.subscriptionId);
			dbAddOn.campaignInfo.quantity = 0;
			dbAddOn.campaignInfo.subscriptionId = null;
			dbAddOn.save();
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Delete campaign addon subscription from stripe and set triggerCount to '0'
	 * @param addOn
	 */
	@DELETE
	@Path("/trigger")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteTriggerAddOn(){
		try{
			AddOnUtil.checkForPriviliges();
			AddOn dbAddOn = AddOnUtil.getAddOn();
			if(!AddOnUtil.canDowngradeCampaigns(0))
				throw new Exception("Sorry, we are unable to process your request for canceling your Triggers Add-on subscription. Delete extra triggers from your account & try again.");
			if(dbAddOn.triggerInfo.subscriptionId != null)
				StripeUtil.cancelAddOnSubscription(dbAddOn.triggerInfo.subscriptionId);
			dbAddOn.triggerInfo.quantity = 0;
			dbAddOn.triggerInfo.subscriptionId = null;
			dbAddOn.save();
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Check downgrade conditions and if everything fine fetch the upcoming invoice for proration amount 
	 * @param addOn
	 * @return Invoice
	 */
	@POST
	@Path("/aclRestriction")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Invoice checkAclRestriction(AddOn addOn){
		try{
			AddOnUtil.checkForPriviliges();
			AddOnUtil.checkForCreditCard();
			AddOn dbAddOn = AddOnUtil.getAddOn();
			
			if(addOn.aclInfo.quantity == 0)
				throw new Exception("Sorry, Can not process your request with 0 quantity");
				
			if(dbAddOn.aclInfo.subscriptionId == null)
				return null;
			
			Invoice invoice = StripeUtil.getupcomingInvoice(addOn.aclInfo, dbAddOn.aclInfo);
			System.out.println("invoice Object for proration:::" +invoice);
			return invoice;
			
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Check downgrade conditions and if everything fine fetch the upcoming invoice for proration amount 
	 * @param addOn
	 * @return Invoice
	 */
	@POST
	@Path("/campaignRestriction")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Invoice checkCampaignRestriction(AddOn addOn){
		try{
			AddOnUtil.checkForPriviliges();
			AddOnUtil.checkForCreditCard();
			AddOn dbAddOn = AddOnUtil.getAddOn();
			
			if(addOn.campaignInfo.quantity == 0)
				throw new Exception("Sorry, Can not process your request with 0 quantity");
			
			if(addOn.campaignInfo.quantity < dbAddOn.campaignInfo.quantity && !AddOnUtil.canDowngradeCampaigns(addOn.campaignInfo.quantity))
					throw new Exception("Sorry, we are unable to process your request for downgrading your Campaigns Add-on subscription. Delete extra campaigns from your account & try again.");
			
			if(dbAddOn.campaignInfo.subscriptionId == null)
				return null;
			
			Invoice invoice = StripeUtil.getupcomingInvoice(addOn.campaignInfo, dbAddOn.campaignInfo);
			System.out.println("invoice Object for proration:::" +invoice);
			return invoice;
			
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Check downgrade conditions and if everything fine fetch the upcoming invoice for proration amount 
	 * @param addOn
	 * @return Invoice
	 */
	@POST
	@Path("/triggerRestriction")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Invoice checkTriggerRestriction(AddOn addOn){
		try{
			AddOnUtil.checkForPriviliges();
			AddOnUtil.checkForCreditCard();
			AddOn dbAddOn = AddOnUtil.getAddOn();
			
			if(addOn.triggerInfo.quantity == 0)
				throw new Exception("Sorry, Can not process your request with 0 quantity");
			
			if(addOn.triggerInfo.quantity < dbAddOn.triggerInfo.quantity && !AddOnUtil.canDowngradeTriggers(addOn.triggerInfo.quantity))
					throw new Exception("Sorry, we are unable to process your request for canceling your Triggers Add-on subscription. Delete extra triggers from your account & try again.");
			
			if(dbAddOn.triggerInfo.subscriptionId == null)
				return null;
			
			Invoice invoice = StripeUtil.getupcomingInvoice(addOn.triggerInfo, dbAddOn.triggerInfo);
			System.out.println("invoice Object for proration:::" +invoice);
			return invoice;
			
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
}
