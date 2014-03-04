package com.agilecrm.account.util;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.AccountEmailStats;
import com.agilecrm.db.ObjectifyGenericDao;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

/**
 * <code>AccountEmailStatsUtil</code> is the utility class for AccountEmailStats
 * 
 * @author Naresh
 * 
 */
public class AccountEmailStatsUtil
{
    private static ObjectifyGenericDao<AccountEmailStats> dao = new ObjectifyGenericDao<AccountEmailStats>(AccountEmailStats.class);

    public static AccountEmailStats getAccountEmailStats(String subAccount)
    {
	return dao.getByProperty("subaccount", subAccount);
    }

    public static void recordAccountEmailStats(String subAccount)
    {

	// if domain is empty
	if (StringUtils.isBlank(subAccount))
	    return;

	try
	{
	    AccountEmailStats as = getAccountEmailStats(subAccount);

	    // if null add AccountEmailStats
	    if (as == null)
	    {
		String info = MandrillSubAccounts.getSubAccountInfo(subAccount);

		// If subaccount doesn't exist, create new one
		if (StringUtils.contains(info, "Unknown_Subaccount"))
		    MandrillSubAccounts.createMandrillSubAccount(subAccount);

		as = new AccountEmailStats(subAccount, 0);
	    }

	    as.count++;
	    as.save();
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while recording account email stats... " + e.getMessage());
	    e.printStackTrace();
	}
    }
}
