package com.agilecrm.contact;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Indexed;

@XmlRootElement
public class CustomFieldDef
{
    // Key
    @Id
    public Long id;

    public enum Type
    {
	TEXT, DATE, LIST, CHECK_BOX
    };

    // Field Type - List, TxtField, DropDown etc.
    public String field_type;

    // Field Label
    @Indexed
    public String field_label;

    // Field Description
    public String field_description;

    // Field Data - useful for list and other custom types
    public String field_data;

    // Scope - People/Organization, ....
    public enum SCOPE
    {
	PERSON_COMPANY, PERSON, COMPANY, DEAL
    };

    // Dao
    public static ObjectifyGenericDao<CustomFieldDef> dao = new ObjectifyGenericDao<CustomFieldDef>(
	    CustomFieldDef.class);

    public CustomFieldDef()
    {

    }

    public CustomFieldDef(String fieldType, String fieldLabel,
	    String fieldDescription, String fieldData)
    {
	this.field_data = fieldData;
	this.field_description = fieldDescription;
	this.field_type = fieldType;
	this.field_label = fieldLabel;
    }

    public static List<CustomFieldDef> getCustomFields() throws Exception
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(CustomFieldDef.class).list();
    }

    public void save() throws Exception
    {
	CustomFieldDef custom_field = dao.ofy().query(CustomFieldDef.class)
		.filter("field_label", field_label).get();

	// Fetch all custom fields to check label duplicates
	for (CustomFieldDef customField : dao.fetchAll())
	{
	    if (customField.field_label.equalsIgnoreCase(this.field_label)
		    && custom_field.id != this.id)
		throw new Exception();
	}

	dao.put(this);
    }

    @Override
    public String toString()
    {
	return "CustomFieldDef: {id: " + id + ", field_type: " + field_type
		+ ", field_label: " + field_label + ", field_description: "
		+ field_description + ", field_data: " + field_data + "}";
    }

    public static CustomFieldDef get(Long id)
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

    // Delete Contact
    public void delete()
    {
	dao.delete(this);
    }

}
