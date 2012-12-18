package com.agilecrm.contact;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ContactField implements Serializable {

	/*
	 * Cannot use not saved within embedded
	 */

	// Constants
	public static enum FieldType {
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

	public ContactField() {

	}

	// System Field Values
	public ContactField(String name, String subtype, String value) {
		this.type = FieldType.SYSTEM;
		this.name = name;
		this.subtype = subtype;
		this.value = value;
	}

	public String toString() {
		return "[" + this.type + " " + this.name + " " + this.value + "] ";
	}
}