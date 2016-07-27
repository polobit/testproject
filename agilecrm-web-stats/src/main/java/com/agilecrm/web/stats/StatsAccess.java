package com.agilecrm.web.stats;

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
@Cache
public class StatsAccess
{
    @Index
    public String domain;
    public String blocked_ips;
    
    @Id
    public Long id;
    
    public StatsAccess()
    {
	
    }
    
    public StatsAccess(String domain, String blocked_ips)
    {
	this.domain = domain;
	this.blocked_ips = blocked_ips;
    }
}
