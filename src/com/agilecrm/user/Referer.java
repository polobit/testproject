package com.agilecrm.user;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Referer
{
    // reference code will be generated , in future if he wants to refer any new
    // person then he can use his @reference_code and count will be
    // increased to track referel count.

    // @referenced_by default is null, but if he refered by any one that domain
    // code will be stored here.

    public String reference_code = null;
    public Integer referral_count = null;
    public String reference_by = null;

    /*
     * public Referer(String reference_code,Integer referaal_count,String
     * reference_by) { this.reference_code = reference_code; this.referral_count
     * = referaal_count; this.reference_by = reference_by; }
     */

    public Referer()
    {

    }

    @Override
    public String toString()
    {
	return "Referer [reference_code=" + reference_code + ", referral_count=" + referral_count + ", reference_by="
	        + reference_by + "]";
    }

}
