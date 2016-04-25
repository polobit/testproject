package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.Referer;
import com.agilecrm.user.Referer.ReferTypes;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.ReferUtil;
import com.google.appengine.api.NamespaceManager;

@Path("/api/refer")
public class ReferAPI {

	@GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Referer getReferer()
    {
		return ReferUtil.getReferrer();
    }
	@Path("/share_on_fb")
    @POST
    public void shareOnFB(){
    	Referer referer = ReferUtil.getReferrer();
    	if(!referer.usedReferTypes.contains(ReferTypes.facebook_share)){
    		BillingRestriction restriction = BillingRestrictionUtil.getBillingRestrictionFromDB();
    		restriction.incrementEmailCreditsCount(500);
    		restriction.save();
    		referer.usedReferTypes.add(ReferTypes.facebook_share);
    		referer.save();
    	}
    }
	// Gets all refered domains
		@Path("/refered_domains")
		@GET
	    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	    public JSONArray getReferedDomains()
	    {
		/*	JSONArray jsonArray = new JSONArray();
			Referer referer = ReferUtil.getReferrer();
			if(referer.referedDomains.size()!=0){
				String oldNamespace = NamespaceManager.get();
				try{
					for(String domain : referer.referedDomains){
						NamespaceManager.set("");
						JSONObject json = new JSONObject();
						DomainUser user = DomainUserUtil.getDomainOwner(domain);
						if(user != null){
							NamespaceManager.set(domain);
							Subscription subscription = SubscriptionUtil.getSubscription();
							try {
								json.put("user", user);
								json.put("plan", subscription.plan);
								jsonArray.put(json);
							} catch (JSONException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
						}
						
					}
				}finally{
					NamespaceManager.set(oldNamespace);
				}
					
			}*/
			JSONArray jsonArray = new JSONArray();
			//String domain = NamespaceManager.get();
			// Gets the users and update the password to the masked one
			List<DomainUser> users = DomainUserUtil.getUsers("");
			for(DomainUser user : users){
				JSONObject json = new JSONObject();
		
				try {
					json.put("user", user);
					json.put("plan", SubscriptionUtil.getSubscription().plan);
					jsonArray.put(json);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			
	    }
			System.out.println(jsonArray.toString());
			System.out.println("dvhsbkdbvss");
			System.out.println(jsonArray.length());
			return jsonArray;
}
		
}
