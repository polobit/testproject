package com.agilecrm.user;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class ProfileStatus
{
    @Id
    public Long id;

    public static enum Field
    {

	WIDGETS(10), EMAIL(15), USER_INVITED(10);

	int value;

	Field(int value)
	{
	    this.value = value;
	}

	public int getValue()
	{
	    return value;
	}
    }


    // @Unindexed
    @NotSaved(IfDefault.class)
    public String stats = null;

    @NotSaved
    public Integer defaultStatus = 65;

    private Key<DomainUser> user_key = null;

    // Dao
    public static ObjectifyGenericDao<ProfileStatus> dao = new ObjectifyGenericDao<ProfileStatus>(
	    ProfileStatus.class);

    public static ProfileStatus getUserProfileStatus()
    {
	Map<String, Object> queryMap = new HashMap<String, Object>();
	queryMap.put("user_key", new Key<DomainUser>(DomainUser.class,
		SessionManager.get().getDomainId()));

	ProfileStatus status = dao.getByProperty(queryMap);

	if (status != null)
	    return status;

	return new ProfileStatus();
    }

    public void save()
    {
	dao.put(this);
    }

    @PrePersist
    void prePersist()
    {
	user_key = new Key<DomainUser>(DomainUser.class, SessionManager.get()
		.getDomainId());
    }

    public void setStatus(Field field, boolean is_configured)
    {
	JSONObject statsJSON = new JSONObject();

	try
	{
	    if (!StringUtils.isEmpty(stats))
		statsJSON = new JSONObject(stats);

	    if (statsJSON.has(field.toString())
		    && statsJSON.getBoolean(field.toString()) == is_configured)
		return;

	    stats = statsJSON.put(field.toString(), is_configured).toString();

	    save();
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    public String getStats() throws JSONException
    {
	int total = 0;
	JSONObject statsJSON = new JSONObject();
	if (!StringUtils.isEmpty(stats))
	{
	    statsJSON = new JSONObject(stats);
		Iterator<String> iterator = statsJSON.keys();

		while(iterator.hasNext())
		{
		    total = total + Field.valueOf(iterator.next()).getValue();
		}
	}

	for (Field field : Field.values())
	{
	    if (!statsJSON.has(field.toString()))
		statsJSON.put(field.toString(), false);
	}
	
	return statsJSON.put("total", defaultStatus + total).toString();
    }
}
