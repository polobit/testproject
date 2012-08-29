package com.agilecrm.account;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

@XmlRootElement
public class Milestone {

	// Key
	@Id
	public Long id;

	public String milestones;

	private static ObjectifyGenericDao<Milestone> dao = new ObjectifyGenericDao<Milestone>(
			Milestone.class);

	Milestone() {

	}

	Milestone(String milestones) {
		this.milestones = milestones;
	}

	public void save() {
		dao.put(this);
	}

	public static Milestone getMilestones() {
		Objectify ofy = ObjectifyService.begin();
		return ofy.query(Milestone.class).get();
		// return null;
	}
}
