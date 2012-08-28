package com.agilecrm.core.api.prefs;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.AccountPrefs;

@Path("/api/account-prefs")
public class AccountPrefsAPI {

	// Preferences
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public AccountPrefs getAccountPrefs() {
		return AccountPrefs.getAccountPrefs();
	}

	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public AccountPrefs updateAccountPrefs(AccountPrefs prefs) {
		prefs.save();
		return prefs;
	}

}