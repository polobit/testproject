package com.agilecrm.core.api;

import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.AccountDeleteUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;

@Path("/api")
public class API
{

	// This method is called if TEXT_PLAIN is request
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String sayPlainTextHello()
	{
		return "Invalid Path";
	}

	// Logs User Prefs - Register
	@Path("domain-availability/{domain}")
	@POST
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Map<String, String> register(@PathParam("email") String domain)
	{
		if (DomainUserUtil.count(domain) != 0)
		{
			Hashtable<String, String> result = new Hashtable<String, String>();
			result.put("error", "domain does not exist");
			return result;
		}

		Hashtable<String, String> result = new Hashtable<String, String>();
		result.put("success", "domain available");

		// Set the session variable to register
		return result;
	}

	// API Key
	// This method is called if TEXT_PLAIN is request
	@Path("api-key")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public APIKey getAPIKey()
	{
		return APIKey.getAPIKey();
	}

	// Get Agile Users
	@Path("agileusers")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public List<AgileUser> getAgileUsers()
	{
		return AgileUser.getUsers();
	}

	// Get Stats
	@Path("stats2")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public JSONObject getStats()
	{
		return NamespaceUtil.getNamespaceCount();
	}

	// Get Stats
	@Path("namespace-stats")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getNamespaceStats()
	{
		return NamespaceUtil.getNamespaceStats().toString();
	}

	/**
	 * Delete subscription object of the domain and deletes related customer
	 */
	@Path("delete/account")
	@DELETE
	public void deleteAccount()
	{
		try
		{
			AccountDeleteUtil.deleteNamespace(NamespaceManager.get());
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}
