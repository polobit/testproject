package com.agilecrm.user;

public class Referer
{

    // @referral_count store the count of domains which are referred by same
    // domain

    public int referral_count = 0;
    public String reference_by_domain = null;

    /*
     * public Referer(String reference_code, Integer referaal_count, String
     * reference_by) { this.reference_code = reference_code; this.referral_count
     * = referaal_count; this.reference_by = reference_by; }
     */

    public Referer()
    {

    }

    @Override
    public String toString()
    {
	return "Referer [referral_count=" + referral_count + ", reference_by=" + reference_by_domain + "]";
    }

}
