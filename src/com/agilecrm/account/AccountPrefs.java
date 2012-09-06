package com.agilecrm.account;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
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

    @NotSaved(IfDefault.class)
    public String plan = null;

    // Dao
    private static ObjectifyGenericDao<AccountPrefs> dao = new ObjectifyGenericDao<AccountPrefs>(
	    AccountPrefs.class);

    AccountPrefs(String companyName, String plan)
    {
	this.company_name = companyName;
	this.plan = plan;
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
	AccountPrefs prefs = new AccountPrefs("My company", "Plan 1");

	dao.put(prefs);
	return prefs;
    }

    public void save()
    {
	dao.put(this);
    }

}
