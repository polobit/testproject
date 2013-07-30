package com.agilecrm.account;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;

@XmlRootElement
public class NavSetting
{
	@Id
	public Long id=null;
	public boolean input_cases,input_deals,input_calendar,input_campaign;  // status of various navtabs
	
	public void setDefault()
	{
		input_cases=false;
		input_deals=input_calendar=input_campaign=true;
	}
	
	public NavSetting(){}

	private static ObjectifyGenericDao<NavSetting> dao=new ObjectifyGenericDao<NavSetting>(NavSetting.class);
	
	@JsonIgnore
	public void save()
	{
		dao.put(this);
	}
	
}


