package com.agilecrm.util;

import java.util.List;

import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;

public class ReferenceUtil
{

    // increases count for referer domain

    public static int getUpdatedReferralCount(int count)
    {
	int reference_count = count + 1;

	return reference_count;
    }

    // checks weather referer_domain entered in registerservlet.java valid or
    // not

    public static boolean check_reference_domain_status(String reference_domain)
    {

	DomainUser domainuser = DomainUserUtil.getDomainOwner(reference_domain);

	System.out.println(domainuser + "in reference util checking reference domain status");

	if (domainuser != null)
	{

	    return true;
	}

	return false;
    }

    //

    // this method is called to update count of the reference domain only when
    // the user is created. it will be
    // called from register servlet only after creation of domainuser

    public static void update_referel_count_of_reference_domain(String reference_domain)
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

    //

    // based on reference_code fetches the all the domain who used this refernce
    // code when they are logged in

    public static List<DomainUser> getAllReferel(String refernce_domain)
    {

	List<DomainUser> referencedByMe = DomainUserUtil.getAllDomainUsersBasedOnReferenceDomain(refernce_domain);
	if (referencedByMe != null)
	{

	    return referencedByMe;

	}

	return null;
    }

}
