package com.agilecrm.contact;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * <code>ContactField</code> class is embedded to {@link Contact} class to store
 * its information like name, email, address and etc.. as ContactField objects
 * in its "properties" attribute.
 * <p>
 * ContactField objects could be of type system or custom, along with type each
 * field has its name and value attributes, also subtype if necessary.
 * </p>
 * 
 * @author
 * 
 */
@SuppressWarnings("serial")
@XmlRootElement
public class ContactField
{

    /*
     * Cannot use Notsaved within embedded
     */
    /**
     * Type of ContactField - System/Custom
     */
    public static enum FieldType
    {
	SYSTEM, CUSTOM
    };

    /**
     * Specifies the type of ContactField
     */
    public FieldType type = FieldType.SYSTEM;

    /**
     * Field Name - Eg: email, phone, first_name etc.
     * 
     */
    public String name = null;

    /**
     * Field Sub Name - work, email etc. - can be null
     * 
     */
    public String subtype = null;

    /**
     * Value of the field
     */
    public String value = null;

    /**
     * Default constructor
     */
    public ContactField()
    {

    }

    /**
     * Creates a ContactField object with System field values
     * 
     * @param name
     *            name of the field (name, email etc..)
     * @param subtype
     *            subtype of the field (work, home etc..)
     * @param value
     *            value of the field
     */
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

    @Override
    public boolean equals(Object o)
    {
	ContactField field = (ContactField) o;

	if (!this.name.equals(field.name) || !this.value.equals(field.value))
	    return false;
	
	if ((this.subtype != null && !this.subtype.equals(field.subtype))
		|| (this.type != null && !this.type.equals(field.type)))
	    return false;

	return true;
    }

}