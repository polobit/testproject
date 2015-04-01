package com.agilecrm.core;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;

import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;

@Path("backend/register")
public class RegisterAPI
{

    @Path("check-domain")
    @POST
    public void check(@QueryParam("company") String domain, @QueryParam("email") String email) throws Exception
    {
	if (DomainUserUtil.count(domain) > 0)
	    throw new Exception("Domain '" + domain
		    + "' already exists. If you already have an account, you can login <a href='https://" + domain
		    + ".agilecrm.com/login" + "'>here</a>.");

	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
	if (domainUser != null)
	{

	    throw new Exception("User with same email address already exists in our system for " + domainUser.domain
		    + " domain");
	}

    }
}
