package com.agilecrm.account;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class AccountPrefs
{
    // Key
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String logo = null;

    @NotSaved(IfDefault.class)
    public String company_name = null;

    // Dao
    private static ObjectifyGenericDao<AccountPrefs> dao = new ObjectifyGenericDao<AccountPrefs>(
	    AccountPrefs.class);

    AccountPrefs(String companyName)
    {
	this.company_name = companyName;
    }

    AccountPrefs()
    {

    }

    public static AccountPrefs getAccountPrefs()
    {
	Objectify ofy = ObjectifyService.begin();
	AccountPrefs prefs = ofy.query(AccountPrefs.class).get();
	if (prefs == null)
	{
	    return getDefaultPrefs();
	}

	return prefs;
    }

    private static AccountPrefs getDefaultPrefs()
    {
	AccountPrefs prefs = new AccountPrefs("My company");

	dao.put(prefs);
	return prefs;
    }

    // Contacts related with deals Author : Yaswanth 08-24-2012
    @XmlElement(name = "subscription_plan")
    public Plan getPlan()
    {
	if (Subscription.getSubscription() != null)
	    return Subscription.getSubscription().plan;

	return null;
    }

    public void save()
    {
	dao.put(this);
    }

}
