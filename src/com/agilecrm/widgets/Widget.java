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
		"LinkedIn is a free business social networking site that allows users who register to create a professional profile visible to others. Through the site, individuals can then maintain a list of known business contacts, known as Connections. LinkedIn users can also invite anyone to join their list of connections. LinkedIn offers an effective way by which people can develop an extensive list of contacts, as your network consists of your own connections.",
		"/widgets/linkedin.js", "/img/plugins/linkedin.png",
		"/widgets/linkedin-logo-small.png", null));
	widgets.add(new Widget(
		"Twitter",
		"Twitter is an information network that brings people closer to what’s important to them. Millions of people turn to Twitter to connect to their interests and find out what's happening in the world right now. Anyone can read, write and share messages. Businesses can influence and participate in real-time conversations on Twitter to drive consumer action with integrated paid, earned and owned campaigns, delivering results throughout the marketing funnel.",
		"/widgets/twitter.js", "/img/plugins/twitter.jpg",
		"/widgets/twitter-logo-small.png", null));
	widgets.add(new Widget(
		"Rapleaf",
		"Rapleaf helps our business clients develop better relationships with their customers. We believe in the power of transparency, choice, and control when it comes to personal information online. We view privacy and security as fundamental design requirements in our technologies and services and core to our business practices and operations. OUR MISSION is to make it incredibly easy for marketers to access the data they need to personalize content for their customers.",
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
