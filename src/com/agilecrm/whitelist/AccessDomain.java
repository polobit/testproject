package com.agilecrm.whitelist;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class AccessDomain
{
    public AccessDomain()
    {

    }

    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String accessDomains = null;

    public static ObjectifyGenericDao<AccessDomain> dao = new ObjectifyGenericDao<AccessDomain>(AccessDomain.class);

    public void save()
    {
	dao.put(this);
    }
}
