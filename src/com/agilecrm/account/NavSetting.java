package com.agilecrm.account;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * NavSetting Entity <br/>
 * <br/>
 * Holds state of various tabs in Navbar.<code>true</code> implies enabled in
 * view.
 * 
 * @author Chandan
 * 
 */
@XmlRootElement
public class NavSetting
{
	/**
	 * Id of the entity
	 */
	@Id
	public Long id = null;

	/**
	 * State of Cases tab in Navbar. <code>true</code> implies visible in
	 * Navbar.
	 */
	@NotSaved(IfDefault.class)
	public boolean input_cases = true;

	/**
	 * State of Deals tab in Navbar. <code>true</code> implies visible in
	 * Navbar.
	 */
	@NotSaved(IfDefault.class)
	public boolean input_deals = true;

	/**
	 * State of Calendar tab in Navbar. <code>true</code> implies visible in
	 * Navbar.
	 */
	@NotSaved(IfDefault.class)
	public boolean input_calendar = true;

	/**
	 * State of Campaign tab in Navbar. <code>true</code> implies visible in
	 * Navbar.
	 */
	@NotSaved(IfDefault.class)
	public boolean input_campaign = true;

	/**
	 * Deafult - <br/>
	 * Cases - not visible, Rest of the tabs - visible
	 */
	public void setDefault()
	{
		input_cases = false;
		input_deals = input_calendar = input_campaign = true;
	}

	public NavSetting()
	{
	}

	// dao
	private static ObjectifyGenericDao<NavSetting> dao = new ObjectifyGenericDao<NavSetting>(NavSetting.class);

	/**
	 * Save this entity in Datastore
	 */
	@JsonIgnore
	public void save()
	{
		dao.put(this);
	}
}
