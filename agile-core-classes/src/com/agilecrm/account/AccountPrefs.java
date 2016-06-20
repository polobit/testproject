package com.agilecrm.account;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.AliasDomain;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.user.util.UserPrefsUtil;
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
public class AccountPrefs implements Serializable
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

	public String timezone = "UTC";

	public Boolean tagsPermission = true;
	
	/**
	 * Type of Currency.
	 */
	@NotSaved(IfDefault.class)
	public String currency_admin = null;

	/**
	 * AccountPrefs Dao.
	 */
	private static ObjectifyGenericDao<AccountPrefs> dao = new ObjectifyGenericDao<AccountPrefs>(AccountPrefs.class);

	/**
	 * States if the workflows have been updated with the new "is_disabled"
	 * property
	 */
	public boolean workflows_updated = false;

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
		return SubscriptionUtil.getSubscription().plan;
	}
	
	/**
	 * Returns alias names if exists, otherwise null.
	 * 
	 * @return List<String>.
	 */
	@XmlElement(name = "aliase")
	public List<String> getAliasNames()
	{
		AliasDomain aliasDomain = AliasDomainUtil.getAliasDomain();
		if(aliasDomain == null)
			return null;
		return aliasDomain.getAlias();
	}
	
	/**
	 * Returns currency if exists, otherwise null.
	 * 
	 * @return currency.
	 */
	@XmlElement(name = "currency_admin")
	public String  getAdminCurrency()
	{
		return UserPrefsUtil.getCurrentUserPrefs().currency;
	}

	public void saveCurrency(){
		
		String user_currency= UserPrefsUtil.getCurrentUserPrefs().currency;
		if(user_currency != null){			
			List<UserPrefs> userprefs = UserPrefsUtil.getAllUserPrefs();
			AgileUser agileUser = AgileUser.getCurrentAgileUser();
		    UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
		    userPrefs.currency = currency_admin;
		    userPrefs.save();				
		}
	}
	


	/**
	 * Saves AccountPrefs.
	 */
	public void save()
	{
		dao.put(this);
	}
}
