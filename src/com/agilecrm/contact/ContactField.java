package com.agilecrm.contact;

import javax.xml.bind.annotation.XmlRootElement;

import com.googlecode.objectify.Key;

@XmlRootElement
public class ContactField
{

    /*
     * Cannot use Notsaved within embedded
     */

    // Constants
    public static enum FieldType
    {
	SYSTEM, CUSTOM
    };

    // Contact Type - Person/Company
    public FieldType type = FieldType.SYSTEM;

    // Field Name - Eg: Email, Phone, First Name etc.
    public String name = null;

    // Field Sub Name - Work, email etc. - can be null
    public String subtype = null;

    // Value
    public String value = null;

    // Custom Field Id
    public Key<CustomFieldDef> custom_field_id = null;

    public ContactField()
    {

    }

    // System Field Values
    public ContactField(String name, String subtype, String value)
    {
	this.type = FieldType.SYSTEM;
	this.name = name;
	this.subtype = subtype;
	this.value = value;
    }

    public String toString()
    {
	return "[" + this.type + " " + this.name + " " + this.value + "] ";
    }

    // Custom Field
    public ContactField(CustomFieldDef customFieldDef, String value)
    {
	this.type = FieldType.CUSTOM;
	this.custom_field_id = new Key<CustomFieldDef>(CustomFieldDef.class,
		customFieldDef.id);
	this.value = value;
    }

}