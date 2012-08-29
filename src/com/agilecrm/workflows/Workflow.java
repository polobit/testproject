package com.agilecrm.workflows;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Unindexed
public class Workflow {
	// Key
	@Id
	public Long id;

	public String name;

	@NotSaved(IfDefault.class)
	public String rules = null;

	@NotSaved(IfDefault.class)
	private Key<AgileUser> creator_key = null;

	// Dao
	private static ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(
			Workflow.class);

	Workflow() {

	}

	public Workflow(String name, String rules) {
		this.name = name;
		this.rules = rules;
	}

	public void save() {
		AgileUser agileUser = AgileUser.getCurrentAgileUser();
		creator_key = new Key<AgileUser>(AgileUser.class, agileUser.id);

		dao.put(this);
	}

	public void delete() {
		dao.delete(this);
	}

	public static Workflow getWorkflow(Long id) {
		try {
			return dao.get(id);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static List<Workflow> getAllWorkflows() {
		Objectify ofy = ObjectifyService.begin();
		return ofy.query(Workflow.class).list();
	}

	public String toString() {
		return "Name: " + name + " Rules: " + rules;
	}

	@XmlElement(name = "creator")
	public String getCreatorName() throws Exception {
		Objectify ofy = ObjectifyService.begin();

		if (creator_key != null) 
		{	
			UserPrefs userPrefs = ofy.query(UserPrefs.class).ancestor(creator_key).get();
			if (userPrefs != null)
				return userPrefs.name;
		}

		return "";
	}
}