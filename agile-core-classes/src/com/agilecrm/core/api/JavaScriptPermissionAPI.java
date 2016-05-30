package com.agilecrm.core.api;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;

@Path("/api/jspermission/")
public class JavaScriptPermissionAPI {

    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser getCurrentUser() {
	try
	{
		// Fetches current domain user based on user info set in thread
		return DomainUserUtil.getCurrentDomainUser();
	}
	catch (Exception e)
	{
		e.printStackTrace();
		return null;
	}
    }

    /**
     * Updates the existing user
     * 
     * @param domainUser
     *            user to be updated
     * @return updated user
     */
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DomainUser updateDomainUser(DomainUser domainUser) {
	try {
	    System.out.println("User == "+ domainUser.id);
	    DomainUser user = null;
	    if (domainUser.id == null) {
		throw new WebApplicationException(Response
			.status(Response.Status.BAD_REQUEST)
			.entity("Invalid User").build());
	    }
	    user = DomainUserUtil.getDomainUser(domainUser.id);
	    System.out.println("User == "+ user);
	    user.jsrestricted_propertiess = domainUser.jsrestricted_propertiess;
	    user.jsrestricted_scopes = domainUser.jsrestricted_scopes;
	    user.save();
	    System.out.println("User == " + user);
	    return user;
	} catch (Exception e) {
	    System.out.println("error is here");
	    System.out.println(e);
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }
}