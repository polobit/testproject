package com.agilecrm.whitelist.util;

import java.util.List;

import com.agilecrm.whitelist.AccessDomain;

public class AccessDomainUtil
{
    public static List<AccessDomain> getDomainsWithAccess()
    {
	return AccessDomain.dao.fetchAll();
    }
}
