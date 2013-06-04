package com.agilecrm.user;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>UserPrefs</code> is the base class for user preferences. User can set
 * own properties like name, picture, template, width, signature, currency and
 * task-reminder. The preferences can be changed any time by an user. The
 * preferences set by an user affects entire AgileCRM.
 * <p>
 * The name given in UserPrefs is wrapped to DomainUser name. User can upload a
 * picture. Template is like a theme that can be chosen from given options. The
 * width is related to bootstrap fixed and fluid layout. Currency to be used
 * within the AgileCRM can be chosen. Task Reminder if set sends email regarding
 * due tasks.
 * </p>
 * <p>
 * <code>@JsonIgnoreProperties(ignoreUnknown=true)</code> annotation is used to
 * ignore properties that aren't used.
 * </p>
 * 
 */
@XmlRootElement
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserPrefs
{
    /**
     * UserPrefs Id.
     */
    @Id
    public Long id;

    /**
     * Name of User which is same as DomainUser name.
     **/
    @NotSaved
    public String name = null;

    /**
     * User picture that is uploaded.
     */
    @NotSaved(IfDefault.class)
    public String pic = null;

    /**
     * Default template.
     */
    @NotSaved(IfDefault.class)
    public String template = "pink";

    /**
     * Fixed or Fluid layout.
     */
    @NotSaved(IfDefault.class)
    public String width = "";

    /**
     * AgileUser Key.
     */
    @Parent
    private Key<AgileUser> user;

    /**
     * AgileUser.
     */
    @NotSaved
    public AgileUser agile_user = null;

    /**
     * Time-zone.
     */
    @NotSaved(IfDefault.class)
    public String timezone = null;

    /**
     * Type of Currency.
     */
    @NotSaved(IfDefault.class)
    public String currency = null;

    /**
     * Signature.
     */
    @NotSaved(IfDefault.class)
    public String signature = null;

    /**
     * Reminder for Due Tasks.
     */
    @NotSaved(IfDefault.class)
    public boolean task_reminder = true;

    /**
     * UserPrefs Dao.
     */
    private static ObjectifyGenericDao<UserPrefs> dao = new ObjectifyGenericDao<UserPrefs>(
	    UserPrefs.class);

    /**
     * Default UserPrefs.
     */
    UserPrefs()
    {

    }

    /**
     * Constructs a new {@link UserPrefs}.
     * 
     * @param userId
     *            - User Id.
     * @param name
     *            - User Name.
     * @param image
     *            - User picture.
     * @param template
     *            - Template.
     * @param width
     *            - Fixed or Fluid layout.
     * @param signature
     *            - Signature.
     * @param task_reminder
     *            - Boolean value whether set or not.
     */
    public UserPrefs(Long userId, String name, String image, String template,
	    String width, String signature, boolean task_reminder)
    {
	this.name = name;
	this.pic = image;
	this.template = template;
	this.width = width;
	this.signature = signature;
	this.task_reminder = task_reminder;

	this.user = new Key<AgileUser>(AgileUser.class, userId);
    }

    /**
     * Returns current DomainUser Name.
     * 
     * @return name of current domainuser.
     */
    public String getCurrentDomainUserName()
    {
	DomainUser currentDomainUser = DomainUserUtil.getDomainCurrentUser();
	System.out.println(currentDomainUser.email);
	System.out.println(currentDomainUser.name);
	if (currentDomainUser != null && currentDomainUser.name != null)
	    return currentDomainUser.name;

	return "?";
    }

    /**
     * Saves UserPrefs. Wraps DomainUser Name with UserPrefs name.
     */
    public void save()
    {
	// Wrapping UserPrefs name to DomainUser name
	DomainUser currentDomainUser = DomainUserUtil.getDomainCurrentUser();

	try
	{
	    if ((currentDomainUser != null)
		    && (currentDomainUser.name == null || !currentDomainUser.name
			    .equals(this.name)))
	    {
		currentDomainUser.name = this.name;
		currentDomainUser.save();
		this.name = null;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	dao.put(this);
    }

    /**
     * Deletes UserPrefs.
     */
    public void delete()
    {
	dao.delete(this);
    }
}
