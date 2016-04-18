package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.Referer;
import com.agilecrm.user.Referer.ReferTypes;
import com.agilecrm.user.util.ReferUtil;

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
    	if(referer.usedReferTypes.contains(ReferTypes.facebook_share)){
    		BillingRestriction restriction = BillingRestrictionUtil.getBillingRestrictionFromDB();
    		restriction.incrementEmailCreditsCount(500);
    		restriction.save();
    		referer.usedReferTypes.add(ReferTypes.facebook_share);
    		referer.save();
    	}
    }
}
