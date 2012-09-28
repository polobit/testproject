package com.agilecrm.company;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.ContactField;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Unindexed
public class Company
{
    // Key
    @Id
    public Long id;

    // Constants
    public static enum Type
    {
	PERSON, COMPANY
    };

    // Contact Type - Person/Company
    @Indexed
    public Type type = Type.COMPANY;

    // Created/Updated Time
    @Indexed
    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    public Long updated_time = 0L;

    // Creator
    public String creator = "";

    // Dao
    private static ObjectifyGenericDao<Company> dao = new ObjectifyGenericDao<Company>(
	    Company.class);

    // Properties
    // @XmlElementWrapper(name = "properties")
    @XmlElement(name = "properties")
    @NotSaved(IfDefault.class)
    @Embedded
    @Indexed
    List<ContactField> properties = new ArrayList<ContactField>();

    @NotSaved(IfDefault.class)
    public String widget_properties = null;

    public static final String COMPANY_NAME = "company_name";
    public static final String URL = "url";
    public static final String EMAIL = "email";

    public Company()
    {

    }

    public Company(Type type, String creator, List<ContactField> properties)
    {
	this.type = type;
	this.creator = creator;

	this.properties = properties;

    }

    public String toString()
    {
	return "id: " + id + " created_time: " + created_time + " updated_time"
		+ updated_time + " type: " + type + " creator:" + creator
		+ " properties: " + properties;
    }

    /* @XmlElement(name="properties2") */
    public List<ContactField> getProperties()
    {
	return properties;
    }

    @PrePersist
    private void PrePersist()
    {
	// Store Created and Last Updated Time
	if (created_time == 0L)
	{
	    System.out.println("New Entity");
	    created_time = System.currentTimeMillis() / 1000;

	}
	else
	    updated_time = System.currentTimeMillis() / 1000;
    }

    // Delete Contact
    public void delete()
    {

	dao.delete(this);

    }

    public void save()
    {

	dao.put(this);

    }

    public static Company getCompany(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static List<Company> getAllCompanies()
    {

	return dao.fetchAll();

    }

    public ContactField getCompanyField(String name)
    {
	for (ContactField property : properties)
	{
	    if (name.equalsIgnoreCase(property.name))
		return property;
	}
	return null;
    }

    public String getCompanyFieldValue(String name)
    {

	ContactField companyField = getCompanyField(name);
	if (companyField != null)
	    return companyField.value;

	return null;
    }

    // Get Company by Email
    public static Company searchCompaniesByEmail(String email)
    {

	if (email == null)
	    return null;

	// Look in the property Class
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Company.class).filter("properties.name = ", EMAIL)
		.filter("properties.value = ", email).get();
    }

    public static int searchCompanyCountByEmail(String email)
    {
	// Look in the property Class
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Company.class).filter("properties.name = ", EMAIL)
		.filter("properties.value = ", email).count();
    }
}
