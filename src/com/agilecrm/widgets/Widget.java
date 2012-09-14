package com.agilecrm.widgets;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class Widget
{
    // Key
    @Id
    public Long id;

    // Name
    public String name = null;

    // Description
    public String description = null;

    // URL
    public String url = null;

    // Logo
    public String logo_url = null;

    // Fav Ico
    public String fav_ico_url = null;

    // Mini Logo
    public String mini_logo_url = null;

    // Prefs
    @NotSaved(IfDefault.class)
    public String prefs = null;

    // Position (start from 0)
    public int position = 0;

    // Dao
    private static ObjectifyGenericDao<Widget> dao = new ObjectifyGenericDao<Widget>(
	    Widget.class);

    // Private Agile User
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

    private static List<Widget> getDefaultWidgets()
    {

	List<Widget> widgets = new ArrayList<Widget>();
	widgets.add(new Widget(
		"Linkedin",
		"Linked For one year, in 1906, Felix Feneon re-wrote the news for a column in the French newspaper Le Matin, 'Novellas in three lines.' In a sparse sentence or two - only three lines in a single newspaper column - he captured the march of industrialization, the scourge of rural disease and the randomness of death. He showed acts of violence and charity throughout France.",
		"/widgets/linkedin.js", "/img/plugins/linkedin.png",
		"/widgets/linkedin-logo-small.png", null));
	widgets.add(new Widget(
		"Twitter",
		"Twitter For one year, in 1906, Felix Feneon re-wrote the news for a column in the French newspaper Le Matin, 'Novellas in three lines.' In a sparse sentence or two - only three lines in a single newspaper column - he captured the march of industrialization, the scourge of rural disease and the randomness of death. He showed acts of violence and charity throughout France.",
		"/widgets/twitter.js", "/img/plugins/twitter.jpg",
		"/widgets/twitter-logo-small.png", null));
	widgets.add(new Widget(
		"Rapleaf",
		"Rapleaf For one year, in 1906, Felix Feneon re-wrote the news for a column in the French newspaper Le Matin, 'Novellas in three lines.' In a sparse sentence or two - only three lines in a single newspaper column - he captured the march of industrialization, the scourge of rural disease and the randomness of death. He showed acts of violence and charity throughout France.",
		"/widgets/rapleaf.js", "/img/plugins/rapleaf.jpeg",
		"/widgets/rapleaf-logo-small.jpeg", null));

	return widgets;

    }

    public static List<Widget> getAvailableWidgets()
    {
	List<Widget> availableWidgets = getDefaultWidgets();

	// Populate Widgets if they have already been added
	for (Widget widget : availableWidgets)
	{
	    // Check if it is already added
	    Widget currentWidget = getWidget(widget.name);

	    if (currentWidget == null)
		widget.is_added = false;
	}

	return availableWidgets;
    }

    public static List<Widget> getWidgetsForCurrentUser()
    {

	Objectify ofy = ObjectifyService.begin();

	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);

	return ofy.query(Widget.class).ancestor(userKey).list();
    }

    public static Widget getWidget(Long id)
    {
	try
	{
	    Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		    AgileUser.getCurrentAgileUser().id);
	    Key<Widget> widgetKey = new Key<Widget>(userKey, Widget.class, id);

	    return dao.get(widgetKey);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static Widget getWidget(String name)
    {
	try
	{
	    Objectify ofy = ObjectifyService.begin();

	    Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		    AgileUser.getCurrentAgileUser().id);

	    return ofy.query(Widget.class).ancestor(userKey)
		    .filter("name", name).get();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public void setPosition(int position)
    {
	this.position = position;
    }

    // Delete Contact
    public void delete()
    {
	dao.delete(this);
    }

    public void save()
    {
	this.user = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);
	dao.put(this);
    }

    // Add Property
    public void addProperty(String propertyName, String value)
    {

	try
	{
	    JSONObject propertyJSON = new JSONObject();
	    if (prefs != null)
		propertyJSON = new JSONObject(prefs);

	    propertyJSON.put(propertyName, value);

	    prefs = propertyJSON.toString();
	}
	catch (Exception e)
	{

	}

    }

    // Get Property
    public String getProperty(String propertyName)
    {

	if (prefs == null)
	    return null;

	try
	{
	    JSONObject propertyJSON = new JSONObject(prefs);

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
