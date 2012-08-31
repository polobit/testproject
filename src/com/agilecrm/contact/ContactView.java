package com.agilecrm.contact;

import java.util.LinkedHashSet;
import java.util.List;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Unindexed
public class ContactView {

	// Key
	@Id
	public Long id;

	// Name of view
	@NotSaved(IfDefault.class)
	public String name = null;

	// List of fields
	@NotSaved(IfDefault.class)
	public LinkedHashSet<String> fields_set = new LinkedHashSet<String> ();
	
	// Dao
	private static ObjectifyGenericDao<ContactView> dao = new ObjectifyGenericDao<ContactView> (
			ContactView.class);


	public ContactView()  {

	}

	public ContactView(String view_name, LinkedHashSet<String> fields_set)  {

		this.name = view_name;
		this.fields_set = fields_set;

	}

	// Get list of contact views
	public static List<ContactView> getContactViewList()  {
		System.out.println(dao.fetchAll());
		return dao.fetchAll();
	}

	// Get contact view by id
	public static ContactView getContactView(Long id) {
		try  {
			 return dao.get(id);
		}  catch (Exception e)  {
			e.printStackTrace();
			return null;
		}
	}
	
	public String toString()  {
		return "id: " +  id + " fields_set: " +  fields_set  +  " view_name"  +  name;
	}

	public void save()  {
		System.out.println(this);
		dao.put(this);
	}

}
