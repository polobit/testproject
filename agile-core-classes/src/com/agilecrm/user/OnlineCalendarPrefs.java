package com.agilecrm.user;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.json.JSONArray;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.OnlineCalendarUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Unindexed
@Cached
public class OnlineCalendarPrefs
{
	@Id
	@Indexed
	public Long id;

	/**
	 * online calendar id is the scheduleid
	 */
	@NotSaved(IfDefault.class)
	@Indexed
	public String schedule_id = null;

	/**
	 * meeting types
	 */
	@NotSaved(IfDefault.class)
	public String meeting_types = "In Person, Phone, Skype, Google Hangouts";

	/**
	 * according to user timings businesshours will be displayed in scheduling
	 * page
	 */
	@NotSaved(IfDefault.class)
	public String business_hours = getDefaultBusinessHours();

	/**
	 * based On buffer time we show slots in online calendar page
	 */
	@NotSaved(IfDefault.class)
	public int bufferTime = 0;

	/**
	 * based On buffer time Units(minutes or hours) we show slots in online
	 * calendar page
	 */
	@NotSaved(IfDefault.class)
	public String bufferTimeUnit = null;

	
	/**
	 * user enters his own text. which shows in online calendar page heading
	 */
	@NotSaved(IfDefault.class)
	public String user_calendar_title = "Welcome to my scheduling page. Please follow the instructions to book an appointment.";
 
	/**
	 * default meeting names and slot is meeting durations
	 */
	@NotSaved(IfDefault.class)
	public String meeting_durations = "{\"15mins\":\"say hi\",\"30mins\":\"let's keep it short\",\"60mins\":\"let's chat\"}";

	/**
	 * DomainUser Key.
	 */
	@Indexed
	@JsonIgnore
	public Key<DomainUser> user;

	/**
	 * UserPrefs Dao.
	 */
	public static ObjectifyGenericDao<OnlineCalendarPrefs> dao = new ObjectifyGenericDao<OnlineCalendarPrefs>(
			OnlineCalendarPrefs.class);

	/**
	 * default constructor
	 */
	public OnlineCalendarPrefs()
	{

	}

	/**
	 * 
	 * @param schedule_id
	 *            is online calendar id
	 * @param meeting_types
	 *            is a json object
	 * @param business_hours
	 * @param meeting_durations
	 * @param calendar_url
	 * @param user
	 */
	public OnlineCalendarPrefs(String schedule_id, String meeting_types, String business_hours,
			String meeting_durations, Long userid)
	{

		this.schedule_id = schedule_id;
		this.meeting_types = meeting_types;
		this.business_hours = business_hours;
		this.meeting_durations = meeting_durations;
		this.user = new Key<DomainUser>(DomainUser.class, userid);
	}

	/**
	 * calls this when new user creation
	 * 
	 * @param schedule_id
	 * @param userid
	 */
	public OnlineCalendarPrefs(String schedule_id, Long userid)
	{

		this.schedule_id = schedule_id;
		this.user = new Key<DomainUser>(DomainUser.class, userid);

	}

	/**
	 */
	@PrePersist
	private void PrePersist()
	{
		if (this.id != null)
		{
			JSONArray array;
			try
			{
				array = new JSONArray(this.business_hours);
				this.business_hours = array.toString();
			}
			catch (Exception e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		if (this.user == null)
		{
			DomainUser d_user = DomainUserUtil.getCurrentDomainUser();
			if (d_user != null)
				this.user = new Key<DomainUser>(DomainUser.class, d_user.id);
		}
		if (StringUtils.isNotBlank(this.schedule_id))
			this.schedule_id = this.schedule_id.toLowerCase();
	}

	@JsonIgnore
	public Key<DomainUser> getDomainOwnerKey()
	{
		return user;
	}

	/**
	 * Saves OnlineCalendar prefs.
	 */
	public void save()
	{
		try
		{
			OnlineCalendarUtil.saveScheduleIdInDomainUser(this);
			dao.put(this);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

	}

	/**
	 * 
	 * @return default business hours
	 */
	private String getDefaultBusinessHours()
	{

		String str = "[{\"isActive\":true,\"timeTill\":\"18:00\",\"timeFrom\":\"09:00\"},{\"isActive\":true,\"timeTill\":\"18:00\",\"timeFrom\":\"09:00\"},{\"isActive\":true,\"timeTill\":\"18:00\",\"timeFrom\":\"09:00\"},{\"isActive\":true,\"timeTill\":\"18:00\",\"timeFrom\":\"09:00\"},{\"isActive\":true,\"timeTill\":\"18:00\",\"timeFrom\":\"09:00\"},{\"isActive\":false,\"timeTill\":null,\"timeFrom\":null},{\"isActive\":false,\"timeTill\":null,\"timeFrom\":null}]";
		return str;
	}

	@Override
	public String toString()
	{
		return "OnlineCalendarPrefs [id=" + id + ", schedule_id=" + schedule_id + ", meeting_types=" + meeting_types
				+ ", business_hours=" + business_hours + ", meeting_durations=" + meeting_durations + ", user=" + user
				+ "]";
	}

}
