package com.agilecrm.account.util;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.AccountEmailStats;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

/**
 * <code>AccountEmailStatsUtil</code> is the utility class for AccountEmailStats
 * 
 * @author Naresh
 * 
 */
public class AccountEmailStatsUtil
{
    private static ObjectifyGenericDao<AccountEmailStats> dao = new ObjectifyGenericDao<AccountEmailStats>(
	    AccountEmailStats.class);

    public static AccountEmailStats getAccountEmailStats(String subAccount)
    {
	return dao.getByProperty("subaccount", subAccount);
    }

    public static AccountEmailStats getAccountEmailStats()
    {
	Objectify ofy = ObjectifyService.begin();
	AccountEmailStats accountEmailStats = ofy.query(AccountEmailStats.class).get();

	// Saves AccountEmailStats if null
	if (accountEmailStats == null)
	    recordAccountEmailStats(NamespaceManager.get(), 0);

	return accountEmailStats;
    }

    public static void recordAccountEmailStats(String subAccount, int currentCount)
    {

	// if domain is empty
	if (StringUtils.isBlank(subAccount))
	    return;

	String oldNamespace = NamespaceManager.get();

	NamespaceManager.set(subAccount);

	try
	{
	    AccountEmailStats as = getAccountEmailStats(subAccount);

	    // if null add AccountEmailStats
	    if (as == null)
	    {
		String info = MandrillSubAccounts.getSubAccountInfo(subAccount, null);

		// If subaccount doesn't exist, create new one
		if (StringUtils.contains(info, "Unknown_Subaccount"))
		    MandrillSubAccounts.createMandrillSubAccount(subAccount, null);

		as = new AccountEmailStats(subAccount, 0);
	    }

	    as.count += currentCount;
	    as.save();

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while recording account email stats... " + e.getMessage());
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static int getEmailsTotal(String to, String cc, String bcc)
    {
	int total = 0;

	try
	{
	    if (StringUtils.isBlank(to) && StringUtils.isBlank(cc) && StringUtils.isBlank(bcc))
		return total;

	    if (!StringUtils.isBlank(to))
		total = ContactEmailUtil.getToEmailSet(to).size();

	    if (!StringUtils.isBlank(cc))
		total += ContactEmailUtil.getToEmailSet(cc).size();

	    if (!StringUtils.isBlank(bcc))
		total += ContactEmailUtil.getToEmailSet(bcc).size();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting emails total..." + e.getMessage());
	}

	return total;
    }

    public static void checkLimits() throws PlanRestrictedException
    {

    }
}
