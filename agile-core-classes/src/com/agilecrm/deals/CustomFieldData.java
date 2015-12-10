package com.agilecrm.deals;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@SuppressWarnings("serial")
@XmlRootElement
public class CustomFieldData implements Serializable
{
    public String name = null;
    public String value = null;

    public CustomFieldData()
    {

    }

    public void updateField(CustomFieldData dealField)
    {
	name = dealField.name;
	value = dealField.value;
    }
}
