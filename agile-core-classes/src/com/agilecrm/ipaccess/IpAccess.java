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

	public void Save() {

		if(this.created_time == null)
			   this.created_time = Calendar.getInstance().getTimeInMillis() / 1000;
		
		domain = IpAccessUtil.getPanelIpAccessNamespaceName();
		
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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public Set<String> getIpList() {
		return this.ipList;
	}

	public void setIpList(Set<String> ipList) {
		this.ipList = ipList;
	}
	
}
