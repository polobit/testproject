package com.agilecrm.widgets;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.json.JSONObject;

import com.agilecrm.ScribeServlet;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Widget</code> class represents informations about the widgets
 * (Linkedin, Twitter, Rapleaf). It include basic information about the widgets
 * i.e., name, logo, description, url (To load the widget script), prefs (Tokens
 * to connect to widgets). This class includes the position of the widget, since
 * widgets are sortable at client side and position of the widget is saved in
 * the <code>widget</code> in position variable as Integer.
 * 
 * <p>
 * <code>Widget</code>class provides Linkedin, Twitter and Rapleaf as default
 * widgets, User can store custom widget information. Widgets are stored are
 * related to AgileUser. It includes methods to get widgets related to current
 * {@link AgileUser}, widget by Id, Save, delete, setting prefs.
 * </p>
 * <p>
 * <code>Widget</code> class is called from {@link WidgetsAPI}, to provide rest
 * calls to get(default/saved), add, delete to modify widget data. It also
 * called from {@link ScribeServlet} to save prefs(Access tokens\secret keys for
 * widgets)
 * </p>
 */
@XmlRootElement
public class Widget
{
    // Key
    @Id
    public Long id;

    /**
     * Represents the name of the widget
     */
    public String name = null;

    /**
     * Description, represents description about the widget which is shown at
     * the client side as widget description
     */
    public String description = null;

    // URL
    /**
     * Url specifies the path of the widget script
     */
    public String url = null;

    // Logo
    public String logo_url = null;

    // Fav Ico
    public String fav_ico_url = null;

    // Mini Logo
    public String mini_logo_url = null;

    /**
     * Prefs are access token and secret key to connect to linkedin/twitter.
     * Prefs represent JSON string contains access tokens, saved from
     * {@link ScribeServlet}
     */
    @NotSaved(IfDefault.class)
    public String prefs = null;

    /**
     * Since widgets are sortable at the client position of the widget is stored
     * in position variable
     */
    public int position = 0;

    public boolean is_minimized = false;

    // Dao
    private static ObjectifyGenericDao<Widget> dao = new ObjectifyGenericDao<Widget>(
	    Widget.class);

    /**
     * Represents user related to the widget, for each {@link AgileUser} widgets
     * are saved with the prefs provided by user
     */
    @Parent
    private Key<AgileUser> user;

    @NotSaved
    public boolean is_added = true;

    Widget()
    {

    }

    public Widget(String name, String description, String url, String logo,
	    String mini_logo, String fav_ico)
    {

	this.name = name;
	this.description = description;
	this.url = url;
	this.logo_url = logo;
	this.fav_ico_url = fav_ico;
	this.mini_logo_url = mini_logo;
	this.user = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);
    }

    /**
     * Sets the position of the widget
     * 
     * @param position
     *            {@link Integer}
     */
    public void setPosition(int position)
    {
	this.position = position;
    }

    /**
     * Deletes the widget
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Saves the widget, While saving widget current is user key is set, to
     * differentiate widgets based on {@link AgileUser}
     */
    public void save()
    {
	this.user = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);
	dao.put(this);
    }

    /**
     * Sets prefs to the widget, set from {@link ScribeServlet}
     * 
     * @param propertyName
     *            {@link String}
     * @param value
     *            {@link String}
     */
    public void addProperty(String propertyName, String value)
    {

	try
	{
	    // Creates a new JSONOjbect to represent prefs
	    JSONObject propertyJSON = new JSONObject();

	    // If Prefs are null for the current widget then creates json object
	    // with prefs
	    if (prefs != null)
		propertyJSON = new JSONObject(prefs);

	    propertyJSON.put(propertyName, value);

	    // Sets prefs as string to save
	    prefs = propertyJSON.toString();
	}
	catch (Exception e)
	{

	}

    }

    /**
     * Gets prefs from the from the current widget.
     * 
     * @param propertyName
     *            {@link String}
     * @return returns prefs as string {@link String}
     */
    public String getProperty(String propertyName)
    {

	// If prefs are null then return null
	if (prefs == null)
	    return null;

	try
	{
	    // Creates a JSONObject from the prefs(prefs is JSONObject saved as
	    // string while saving a widget)
	    JSONObject propertyJSON = new JSONObject(prefs);

	    // Returns token of secret from the prefs JSON
	    if (propertyJSON.has(propertyName))
		return propertyJSON.getString(propertyName);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return null;
    }

    public String toString()
    {
	return "Name: " + name + " Description: " + description;
    }
}
