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
    // dao
    private static ObjectifyGenericDao<NavSetting> dao = new ObjectifyGenericDao<NavSetting>(NavSetting.class);

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
    public boolean cases = true;

    /**
     * State of Deals tab in Navbar. <code>true</code> implies visible in
     * Navbar.
     */
    @NotSaved(IfDefault.class)
    public boolean deals = true;

    @NotSaved(IfDefault.class)
    public boolean social = true;

    /**
     * State of Calendar tab in Navbar. <code>true</code> implies visible in
     * Navbar.
     */
    @NotSaved(IfDefault.class)
    public boolean calendar = true;

    /**
     * State of Campaign tab in Navbar. <code>true</code> implies visible in
     * Navbar.
     */
    @NotSaved(IfDefault.class)
    public boolean campaign = true;

    /**
     * State of Reports tab in Navbar. <code>true</code> implies visible in
     * Navbar.
     */
    @NotSaved(IfDefault.class)
    public boolean reports = true;

    /**
     * Deafult - <br/>
     * Cases - not visible, Rest of the tabs - visible
     */
    public void setDefault()
    {
	cases = false;
	deals = calendar = campaign = reports = true;
    }

    public NavSetting()
    {
    }

    /**
     * Save this entity in Datastore
     */
    @JsonIgnore
    public void save()
    {
	dao.put(this);
    }
}
