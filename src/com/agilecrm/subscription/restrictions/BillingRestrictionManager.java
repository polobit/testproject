package com.agilecrm.subscription.restrictions;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;

public interface BillingRestrictionManager
{

    public boolean isNew();

    public void save() throws PlanRestrictedException;

    public void checkLimits() throws PlanRestrictedException;

    @JsonIgnore
    public ObjectifyGenericDao getDao() throws PlanRestrictedException;
}
