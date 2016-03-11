package com.agilecrm.ipaccess;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.appengine.api.NamespaceManager;

@Path("/api/allowedips")
public class IpAccessAPI {
	
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public  IpAccess getIPAccess(){
		 String domainName = NamespaceManager.get();
		 return IpAccessUtil.getIPListByDomainName(domainName);
	}
	
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public IpAccess createIPAccess(IpAccess ipAccess){
		try {
			ipAccess.Save();
			return ipAccess;
		} catch (Exception e) {
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
				    .entity(e.getMessage()).build());
		}
	}
	
	
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public IpAccess updateIPAccess(IpAccess ipAccess){
		try {
			ipAccess.Save();
			return ipAccess;
		} catch (Exception e) {
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
				    .entity(e.getMessage()).build());
		}
		
	}

}
