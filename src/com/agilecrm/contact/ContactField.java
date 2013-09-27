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

    public static enum SystemFields
    {
	FIRST_NAME(Contact.FIRST_NAME), LAST_NAME(Contact.LAST_NAME), EMAIL(Contact.EMAIL), COMPANY(Contact.COMPANY), TITLE(
		Contact.TITLE), NAME(Contact.NAME), URL(Contact.URL), WEBSITE(Contact.WEBSITE), ADDRESS(Contact.ADDRESS);
	String value;

	private SystemFields(String value)
	{
	    this.value = value;
	}

	public String getName()
	{
	    return value;
	}
    }

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
    public ContactField(String name, String value, String subtype)
    {
	this.type = FieldType.SYSTEM;
	this.name = name;
	this.subtype = subtype;
	this.value = value;
    }

    public void updateField(ContactField field)
    {
	name = field.name;
	subtype = field.subtype;
	value = field.value;
	if (SystemFields.valueOf(field.name) != null)
	{
	    type = FieldType.SYSTEM;
	    return;
	}
	field.type = FieldType.CUSTOM;
    }

    @Override
    public String toString()
    {
	return "[" + this.type + " " + this.name + " " + this.value + "] ";
    }

    /**
     * Equals method to check contact Field duplication
     */
    @Override
    public boolean equals(Object o)
    {
	ContactField field = (ContactField) o;

	if (this.name != null && this.value != null && this.name.equals(field.name) && this.value.equals(field.value))
	{
	    // Both name and value must be equal & not null,
	    // Additional check to prevent any chance of null pointer
	    // exception.
	    // Checking subtype & type now.

	    if ((this.subtype != null && !this.subtype.equals(field.subtype))
		    || (this.type != null && !this.type.equals(field.type)))
		return false;

	    return true;
	}
	return false; // if any of name or value is null, this entry might be
		      // erroneous entry from client
    }

}