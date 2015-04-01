package com.agilecrm.account;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

@Unindexed
@Cached
public class AccountEmailStats
{

    @Id
    public Long id;

    @Indexed
    @NotSaved(IfDefault.class)
    public String subaccount = null;

    @NotSaved(IfDefault.class)
    public int count = 0;

    @NotSaved(IfDefault.class)
    public long created_time = 0L;

    @NotSaved(IfDefault.class)
    public long updated_time = 0L;

    private static ObjectifyGenericDao<AccountEmailStats> dao = new ObjectifyGenericDao<AccountEmailStats>(
	    AccountEmailStats.class);

    AccountEmailStats()
    {
    }

    public AccountEmailStats(String subaccount, int count)
    {
	this.subaccount = subaccount;
	this.count = count;
    }

    public void save()
    {
	dao.put(this);
    }

    @PrePersist
    private void prePersist()
    {
	if (created_time == 0L && id == null)
	{
	    created_time = System.currentTimeMillis() / 1000;
	}
	else
	{
	    updated_time = System.currentTimeMillis() / 1000;
	}
    }
}
