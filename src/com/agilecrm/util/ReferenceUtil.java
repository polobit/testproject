package com.agilecrm.util;

import java.util.List;

import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;

public class ReferenceUtil
{

    /**
     * 
     * @param count
     *            previous referrel count
     * @return updated referral count
     */

    public static int getUpdatedReferralCount(int count)
    {
	int reference_count = count + 1;

	return reference_count;
    }

    /**
     * 
     * @param reference_domain
     * @return true if reference domain exists
     */
    public static boolean checkReferenceDomainExistance(String reference_domain)
    {
System.out.println(reference_domain+"in reference util refernce domain");
	DomainUser domainuser = DomainUserUtil.getDomainOwner(reference_domain);

	System.out.println(domainuser + "in reference util checking reference domain status");

	if (domainuser != null)
	    return true;

	return false;
    }

    /**
     * @param reference_domain
     *            updates the referrel count for reference domain
     */
    public static void updateReferralCount(String reference_domain)
    {

	DomainUser domainuser = DomainUserUtil.getDomainOwner(reference_domain);

	if (domainuser != null)
	{

	    domainuser.referer.referral_count = getUpdatedReferralCount(domainuser.referer.referral_count);
	    try
	    {
		domainuser.save();
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	}

    }

    /**
     * 
     * @param refernce_domain
     * @return based on reference domain get all users referenced by this domain
     */

    public static List<DomainUser> getAllReferrals(String refernce_domain)
    {

	List<DomainUser> referencedByMe = DomainUserUtil.getAllDomainUsersBasedOnReferenceDomain(refernce_domain);
	if (referencedByMe != null)
	{

	    return referencedByMe;

	}

	return null;
    }

}
