package com.agilecrm.core.api;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.user.AliasDomain;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.user.util.DomainUserUtil;

public class AliasDomainAPI {
	
	// Send Current User Info
    @Path("/api/alias")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public AliasDomain getAliasDomain()
    {
    	try{
    		AliasDomain aliasDomain = AliasDomainUtil.getAliasDomain();
    		if(aliasDomain == null || aliasDomain.alias == null || aliasDomain.domain == null){
    			return null;
    		}
    		return aliasDomain;
    	}catch(Exception e){
    		System.out.println(ExceptionUtils.getMessage(e));
    		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
    			    .build());
    	}
    }
    
    /**
     * Saves new Alias into database, if any exception is raised throws
     * webApplication exception.
     * 
     * @param  aliasDomain
     *            alias to be saved into database
     * @return saved aliasDomain
     */
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public AliasDomain createAliasDomain(AliasDomain aliasDomain)
    {
    	try{
    	if(aliasDomain == null || aliasDomain.domain == null || aliasDomain.alias == null)
    		throw new Exception("Please provide valid details");
    	if(AliasDomainUtil.getAliasDomainByAlias(aliasDomain.alias) != null && DomainUserUtil.count(aliasDomain.alias)>0)
    		throw new Exception("Alias name exists. Please choose another name.");
    	aliasDomain.save();
    	return aliasDomain;
    	}catch(Exception e){
			System.out.println(ExceptionUtils.getMessage(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
				    .build());
		}
    }
    
    /**
     * Updates  Alias into database, if any exception is raised throws
     * webApplication exception.
     * 
     * @param  aliasDomain
     *            alias to be saved into database
     * @return saved aliasDomain
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public AliasDomain updateAliasDomain(AliasDomain aliasDomain)
    {
    	try{
    	if(aliasDomain == null || aliasDomain.id == null || aliasDomain.domain == null || aliasDomain.alias == null)
    		throw new Exception("Please provide valid details");
    	if(AliasDomainUtil.getAliasDomainByAlias(aliasDomain.alias) != null && DomainUserUtil.count(aliasDomain.alias)>0)
    		throw new Exception("Alias name exists. Please choose another name.");
    	aliasDomain.save();
    	return aliasDomain;
    	}catch(Exception e){
			System.out.println(ExceptionUtils.getMessage(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
				    .build());
		}
    }
    
    /**
     * Deletes an alias from database.
     * 
     * @param String domain
     *            alias to be deleted
     */
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteDomainUser(DomainUser domainUser){
		try{
			AliasDomain aliasDomain = AliasDomainUtil.getAliasDomain();
			aliasDomain.delete();
		}catch(Exception e){
			System.out.println(ExceptionUtils.getMessage(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
				    .build());
		}
	
    }
}
