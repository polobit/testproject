package com.agilecrm.util;

import java.util.List;
import java.util.UUID;

import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;

//class used generate random referance code for each domain

public class ReferenceUtil
{

    public static String getReferanceNumber()
    {

	UUID idOne = UUID.randomUUID();

	String referencecode = idOne.toString();

	// @@reference code was generated or not will be checked here if is
	// avaliable agin generates reference code and returns that num
	if (checkReferenceCodeStatus(referencecode))
	{
	    String refercode = getReferanceNumber();
	    return refercode;

	}

	System.out.println(idOne.toString());
	return referencecode;
    }

    // increases count for referer domain

    public static int getUpdatedReferralCount(int count)
    {
	int reference_count = count + 1;

	return reference_count;
    }

    // checks weather referer_code entered in register.java valid or nor

    public static boolean checkReferenceCodeStatus(String referer_code)
    {

	DomainUser domainuser = DomainUserUtil.getDomainUser_To_Check_Reference_CodeStatus("referer.reference_code",
	        referer_code);

	System.out.println(domainuser + "in reference util checking reference code status");

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

    public static void update_referel_count_of_reference_domain(String referer_code)
    {

	DomainUser domainuser = DomainUserUtil.getDomainUser_To_Check_Reference_CodeStatus("referer.reference_code",
	        referer_code);

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

    // based on reference_code fetches the name of that domain owner

    public static DomainUser getDomainInfoBasedOnReferencecode(String referer_code)
    {

	DomainUser domainuser = DomainUserUtil.getDomainUser_To_Check_Reference_CodeStatus("referer.reference_code",
	        referer_code);
	if (domainuser != null)
	{

	    System.out.println(domainuser);
	    return domainuser;

	}

	return null;
    }

    //

    // based on reference_code fetches the domain owner entity
    // from that we caan get referenc code

    public static DomainUser getDomainReferenceCode()
    {

	DomainUser domainuser = DomainUserUtil.getDomainOwner(NamespaceManager.get());
	if (domainuser != null)
	{

	    return domainuser;

	}

	return null;
    }

    //

    // based on reference_code fetches the all the domain who used this refernce
    // code when they are logged in

    public static List<DomainUser> getAllReferel(String referencecode)
    {

	List<DomainUser> referencedByMe = DomainUserUtil.getAllDomainUsersBasedOnReferenceCode(referencecode);
	if (referencedByMe != null)
	{

	    return referencedByMe;

	}

	return null;
    }

    //

    // purely used to fetch domain reference code based on current domain

    public static String getCurrentDomainReferenceCode() throws Exception
    {

	DomainUser domainuser = DomainUserUtil.getDomainOwner(NamespaceManager.get());

	System.out.println("domainuser in getCurrentdomainReferenceCode");
	if (domainuser != null)
	{
	    String reference_code = domainuser.referer.reference_code;
	    System.out.println("referenceCode ===============" + reference_code);
	    if (reference_code != null)
	    {
		return reference_code;
	    }
	    /*
	     * else { System.out.println(
	     * "in else condition in creating domain reference code");
	     * domainuser.referer.reference_code = getReferanceNumber();
	     * domainuser.referer.referral_count = 0; domainuser.save(); return
	     * domainuser.referer.reference_code;
	     * 
	     * }
	     */
	}

	return null;
    }

}
