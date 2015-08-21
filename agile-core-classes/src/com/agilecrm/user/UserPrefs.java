package com.agilecrm.user;

import java.util.Random;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
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
@Cached
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
     * date format
     */
    @NotSaved(IfDefault.class)
    public String dateFormat = "mm/dd/yyyy";


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
	 * event-reminder mail
	 */
	@NotSaved(IfDefault.class)
	public boolean event_reminder = true;

	/**
	 * Enable or disable keyboard shortcuts.
	 */
	@NotSaved(IfDefault.class)
	public boolean keyboard_shotcuts = false;

	// user theme settings start
	@NotSaved(IfDefault.class)
	public String menuPosition = "leftcol";

	@NotSaved(IfDefault.class)
	public String layout = "fluid";

	@NotSaved(IfDefault.class)
	public String theme = "1";

	@NotSaved(IfDefault.class)
	public boolean animations = true;
	// user theme settings end

	@NotSaved(IfDefault.class)
	public String calendar_wk_start_day = "0";
	/**
	 * UserPrefs Dao.
	 */
	private static ObjectifyGenericDao<UserPrefs> dao = new ObjectifyGenericDao<UserPrefs>(UserPrefs.class);

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
	 * @param keyboard_shotcuts
	 *            - Boolean value whether enable or not.
	 */
	public UserPrefs(Long userId, String name, String image, String template, String width, String signature,
			boolean task_reminder, boolean keyboard_shotcuts)
	{
		this.name = name;
		this.pic = image;
		this.template = template;
		this.width = width;
		this.signature = signature;
		this.task_reminder = task_reminder;
		this.keyboard_shotcuts = keyboard_shotcuts;

		this.user = new Key<AgileUser>(AgileUser.class, userId);
	}

	/**
	 * Returns current DomainUser Name.
	 * 
	 * @return name of current domainuser.
	 */
	public String getCurrentDomainUserName()
	{
		DomainUser currentDomainUser = DomainUserUtil.getCurrentDomainUser();
		System.out.println(currentDomainUser.email);
		System.out.println(currentDomainUser.name);
		if (currentDomainUser != null && currentDomainUser.name != null)
			return currentDomainUser.name;

		return "?";
	}

	/**
	 * Returns random gravatar url.
	 * 
	 * @return selected gravatar url
	 */
	public String chooseRandomAvatar()
	{
		String[] avatar = { "https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/86.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/72.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/17.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/5.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/3.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/64.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/62.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/36.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/79.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/73.png",
				"https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/75.png" };

		// Generate Random Number
		Random random = new Random(System.currentTimeMillis());
		int r = random.nextInt(avatar.length);
		return avatar[r];
	}

	/**
	 * Saves UserPrefs. Wraps DomainUser Name with UserPrefs name.
	 */
	public void save()
	{
		// Wrapping UserPrefs name to DomainUser name
		DomainUser currentDomainUser = DomainUserUtil.getCurrentDomainUser();

		// Assigning Random avatar
		if (pic == null)
			pic = chooseRandomAvatar();
		try
		{
			if ((currentDomainUser != null)
					&& (currentDomainUser.name == null || !currentDomainUser.name.equals(this.name)))
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