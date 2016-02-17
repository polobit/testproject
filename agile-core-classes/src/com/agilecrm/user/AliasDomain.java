package com.agilecrm.user;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;

/**
 * <code>AliasDomain</code> class stores the users of agileCRM in database who is having alias, by
 * setting the name space to empty. 
 * region
 * 
 * @author
 * 
 */
@XmlRootElement
@Cached
public class AliasDomain {

	//key
	@Id
	public Long id;
	
	//Domain of the user
	public String domain;
	
	//Aliase of the domain
	public String alias;
	
	/**
	 * AliasDomain Dao.
	 */
	private static ObjectifyGenericDao<AliasDomain> dao = new ObjectifyGenericDao<AliasDomain>(AliasDomain.class);
	
	/**
	 * Default constructor
	 */
	public AliasDomain()
	{

	}
	
	/**
	 * Saves AliasDomain
	 */
	public void save(){
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
		try
		{
			dao.put(this);
		}finally{
			NamespaceManager.set(oldNamespace);
		}
	}
	
	/**
	 * Deletes AliasDomain
	 */
	public void delete(){
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
		try
		{
			dao.delete(this);
		}finally{
			NamespaceManager.set(oldNamespace);
		}
	}

}
