package com.agilecrm.account;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * MenuSetting Entity <br/>
 * <br/>
 * Holds state of various tabs in Navbar.<code>true</code> implies enabled in
 * view.
 * 
 * @author Chandan
 * 
 */
@XmlRootElement
@Cached
public class MenuSetting
{
    // dao
    private static ObjectifyGenericDao<MenuSetting> dao = new ObjectifyGenericDao<MenuSetting>(MenuSetting.class);

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
     * State of Documents tab in Navbar. <code>true</code> implies visible in
     * Navbar.
     */
    @NotSaved(IfDefault.class)
    public boolean documents = true;

    /**
     * State of Documents tab in Navbar. <code>true</code> implies visible in
     * Navbar.
     */
    @NotSaved(IfDefault.class)
    public boolean web_rules = false;

    /**
     * Deafult - <br/>
     * Cases - not visible, Rest of the tabs - visible
     */
    public void setDefault()
    {
	cases = false;
	documents = false;
	social = false;
	deals = calendar = campaign = reports = true;
    }

    public MenuSetting()
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
