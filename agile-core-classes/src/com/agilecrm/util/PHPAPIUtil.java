package com.agilecrm.util;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.util.TagUtil;

public class PHPAPIUtil
{
    public static FieldType getFieldTypeFromName(String fieldName)
    {
	switch (fieldName)
	{
	case Contact.FIRST_NAME:
	case Contact.LAST_NAME:
	case Contact.ADDRESS:
	case Contact.COMPANY:
	case Contact.EMAIL:
	case Contact.IMAGE:
	case Contact.NAME:
	case Contact.PHONE:
	case Contact.TITLE:
	case Contact.WEBSITE:
	case Contact.URL:
	    return FieldType.SYSTEM;
	default:
	    return FieldType.CUSTOM;
	}
    }
}