/**
 * 
 */
package com.agilecrm.addon;

import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * @author Santhosh
 * For extra addons 
 * 1. Allow ACL's for Regular plans
 * 2. Extra Campaigns
 * 3. Extra triggers
 *
 */
@XmlRootElement
@Cached
public class AddOn implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	public Long id;
	
	/**
	 * Set of user ID's for extra ACL permissions 
	 */
	@NotSaved(IfDefault.class)
	public Set<Long> aclUsers = new HashSet<Long>();
	
	/**
	 * Acl addon extra information
	 */
	@Embedded
	@NotSaved(IfDefault.class)
	public AddOnInfo aclInfo;
	
	/**
	 * campaign addon extra information
	 */
	@Embedded
	@NotSaved(IfDefault.class)
	public AddOnInfo campaignInfo;
	
	/**
	 * trigger addon extra information
	 */
	@Embedded
	@NotSaved(IfDefault.class)
	public AddOnInfo triggerInfo;
	
	/**
	 * Default constructor
	 * 
	 */
	public AddOn(){
		this.aclInfo = new AddOnInfo();
		this.campaignInfo = new AddOnInfo();
		this.triggerInfo = new AddOnInfo();
	}
	
	/**
	 * @return the aclUsers
	 */
	public Set<Long> getAclUsers() {
		return aclUsers;
	}

	/**
	 * @param aclUsers the aclUsers to set
	 */
	public void setAclUsers(Set<Long> aclUsers) {
		this.aclUsers = aclUsers;
	}

	/*
	 * DAO
	 */
	static ObjectifyGenericDao<AddOn> dao = new ObjectifyGenericDao<AddOn>(AddOn.class);
	
	/**
	 * XMLElement to get all domain users list
	 */
	@XmlElement(name="users")
	public Set<Map<String, Object>> getUsers(){
		List<DomainUser> users = DomainUserUtil.getUsers(NamespaceManager.get());
		Set<Map<String, Object>> set = new HashSet<Map<String, Object>>();
		for(DomainUser user : users){
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("email", user.email);
			map.put("name", user.name);
			map.put("id", user.id);
			set.add(map);
		}
		return set;
	}
	
	/**
	 * prepersist
	 */
	@PrePersist
	private void prePersist(){
		this.aclInfo.quantity = this.aclUsers.size();
	}
	
	@PostLoad
	private void postLoad(){
		if(campaignInfo == null)
			campaignInfo = new AddOnInfo();
		if(triggerInfo == null)
			triggerInfo = new AddOnInfo();
		if(aclInfo == null)
			aclInfo = new AddOnInfo();
	}
	
	public void save(){
		dao.put(this);
		try{
			CacheUtil.deleteCache(getCacheKey());
		}catch(Exception e){
			e.printStackTrace();
		}
	}

	/**
	 * Cachee key for addOn
	 * @return
	 */
	public static String getCacheKey(){
		if(NamespaceManager.get() != null)
			return "__agile_addon_cache_key_" + NamespaceManager.get();
		return "__agile_addon_cache_key_[default]";
	}

}
