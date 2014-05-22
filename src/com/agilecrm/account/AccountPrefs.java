package com.agilecrm.account;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>AccountPrefs</code> is the base class for Account Preferences of Admin
 * Settings. User can upload Company logo and specify Company name. The
 * subscription plan is shown for a user. Company name and logo can be changed
 * anytime. Saves AccountPrefs in data store.
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
@Cached
public class AccountPrefs
{
    /**
     * AccountPrefs Id.
     */
    @Id
    public Long id;

    /**
     * Company logo.
     */
    @NotSaved(IfDefault.class)
    public String logo = null;

    /**
     * Company name.
     */
    @NotSaved(IfDefault.class)
    public String company_name = "";

    /**
     * AccountPrefs Dao.
     */
    private static ObjectifyGenericDao<AccountPrefs> dao = new ObjectifyGenericDao<AccountPrefs>(AccountPrefs.class);

    /**
     * Default AccountPrefs.
     */
    AccountPrefs()
    {

    }

    /**
     * Constructs a new {@link AccountPrefs}.
     * 
     * @param companyName
     *            - Company Name.
     */
    public AccountPrefs(String companyName)
    {
	this.company_name = companyName;
    }

    /**
     * Returns subscription plan if exists, otherwise null.
     * 
     * @return Subscription plan.
     */
    @XmlElement(name = "subscription_plan")
    public Plan getPlan()
    {
	if (Subscription.getSubscription() != null)
	    return Subscription.getSubscription().plan;

	return null;
    }

    /**
     * Saves AccountPrefs.
     */
    public void save()
    {
	dao.put(this);
    }
}
