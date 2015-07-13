package com.agilecrm.core.api.prefs;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.VerifiedEmails;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.account.util.VerifiedEmailsUtil;

/**
 * <code>AccountPrefsAPI</code> includes REST calls to interact with
 * {@link AccountPrefs} class. It is called to get account preferences and
 * update existing account preferences.
 * 
 * @author Manohar
 * 
 */
@Path("/api/account-prefs")
public class AccountPrefsAPI
{
    /**
     * Gets AccountPrefs
     * 
     * @return AccountPrefs
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public AccountPrefs getAccountPrefs()
    {
	return AccountPrefsUtil.getAccountPrefs();
    }

    /**
     * Updates AccountPrefs.
     * 
     * @param prefs
     *            - AccountPrefs to be updated.
     * @return Updated AccountPrefs.
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public AccountPrefs updateAccountPrefs(AccountPrefs prefs)
    {
	prefs.save();
	return prefs;
    }
    
    @Path("/verified-emails/all")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<VerifiedEmails> getVerifiedEmails()
    {
	return VerifiedEmailsUtil.getAllEmails();
    }
}