package com.agilecrm.user;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;


import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;
@XmlRootElement
@Cached
public class Referer
{
	@Id
	public Long id;
	
	/** This {@link Enum} Type represents types of Referring */
	public static enum ReferTypes{
		facebook_share, twitter_tweet, twitter_follow
	}

	/**
     * referral_count to store referralcount reference_by_domain to store
     * referenced domain
     */
    public Integer referral_count = 0;
    
    @NotSaved(IfDefault.class)
    public String reference_by_domain = null;
    
    @NotSaved(IfDefault.class)
	public Set<Referer.ReferTypes> usedReferTypes= new HashSet<Referer.ReferTypes>();
    
    @NotSaved(IfDefault.class)
	public Set<String> referedDomains = new HashSet<String>();
    
    public Referer()
    {

    }
    
    /**
	 * Referer Dao
	 */
	private static ObjectifyGenericDao<Referer> dao = new ObjectifyGenericDao<Referer>(Referer.class);
	

    @Override
    public String toString()
    {
	return "Referer [referral_count=" + referral_count + ", reference_by_domain=" + reference_by_domain + "]";
    }
    
    /**
	 * save Refer
	 */
    public void save(){
    	dao.put(this);
    }
}
