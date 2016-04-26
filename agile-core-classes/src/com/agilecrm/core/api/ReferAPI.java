package com.agilecrm.core.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.fasterxml.jackson.databind.ObjectMapper;
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
	    public List<Map<String, Object>> getReferedDomains()
	    {
			List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
			Referer referer = ReferUtil.getReferrer();
			if(referer.referedDomains.size()!=0){
				String oldNamespace = NamespaceManager.get();
				try{
					for(String domain : referer.referedDomains){
						NamespaceManager.set("");
						DomainUser user = DomainUserUtil.getDomainOwner(domain);
						if(user != null){
							Map<String, Object> map = new HashMap<String, Object>();
							NamespaceManager.set(domain);
							Subscription subscription = SubscriptionUtil.getSubscription();
							try {
								map.put("user", user);
								map.put("plan", subscription.plan);
								list.add(map);
							} catch (Exception e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
						}
						
					}
				}finally{
					NamespaceManager.set(oldNamespace);
				}
				
					
			}
			return list;
			
			
			/*//String domain = NamespaceManager.get();
			// Gets the users and update the password to the masked one
			String domain = NamespaceManager.get();
			List<DomainUser> users = DomainUserUtil.getUsers(domain);
			
			for(DomainUser user : users){
				if( user == null )	System.out.println("user is null");
				Map<String, Object> map = new HashMap<String, Object>();
				try {
					map.put("user", user);
					map.put("plan", SubscriptionUtil.getSubscription().plan);
					if( SubscriptionUtil.getSubscription().plan == null )	System.out.println("Plan is null");
					
					System.out.println("I am in. Putting now ");
					list.add(map);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			
			}
			
			System.out.println("dvhsbkdbvss");
			
			
			return list;
*/
}	
}
