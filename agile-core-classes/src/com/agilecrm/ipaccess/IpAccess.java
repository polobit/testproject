package com.agilecrm.ipaccess;

import java.util.Calendar;
import java.util.List;
import java.util.Set;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;

/**
 * 
 * @author agile
 *
 */
@XmlRootElement
@Cached
public class IpAccess {
	
	@Id
    public Long id;
	
	public String domain;
	public Set<String> ipList;
	
	public Long created_time;

	private static ObjectifyGenericDao<IpAccess> dao = new ObjectifyGenericDao<IpAccess>(IpAccess.class);

	public IpAccess() {
	}

	public IpAccess(String domain, Set<String> ipList) {
		this.domain = domain;
		this.ipList =  ipList;
	}

	public void save() {

		if(this.created_time == null)
			   this.created_time = Calendar.getInstance().getTimeInMillis() / 1000;
		
		domain = NamespaceManager.get();
		
		String oldNamespace = NamespaceManager.get();
		try {
			NamespaceManager.set("");

			dao.put(this);

		} finally {
			NamespaceManager.set(oldNamespace);
		}
	}
	
	public void delete(){
		dao.delete(this);
	}

	
	
}
