package com.agilecrm.core.api.account;

import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import com.agilecrm.util.AccountDeleteUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code> {@link AccountDeleteUtil}</code> include method to delete account.
 * 
 * @author Yaswanth
 * 
 */
@Path("/api/delete")
public class AccountDeletionAPI
{
	/**
	 * Delete subscription object of the domain and deletes related customer
	 */
	@Path("/account")
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
