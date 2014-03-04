package com.thirdparty.google.calendar;

import java.io.IOException;
import java.util.HashMap;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;
import com.thirdparty.google.GoogleServiceUtil;

@XmlRootElement
public class GoogleCalenderPrefs
{
    @Id
    public Long id;

    /**
     * Refresh token. Annotated with JSON Ignore to avoid sending refresh_token
     * to client.
     */
    @JsonIgnore
    @NotSaved(IfDefault.class)
    public String refresh_token = null;

    /**
     * Expiry time of access token
     */
    // Expiry time in milliseconds
    @NotSaved
    public Long expires_at = 0l;

    /**
     * Access token is generated based on refresh token.
     */
    @NotSaved
    public String access_token = null;

    // domain user key
    @JsonIgnore
    private Key<DomainUser> domainUserKey = null;

    public static ObjectifyGenericDao<GoogleCalenderPrefs> dao = new ObjectifyGenericDao<GoogleCalenderPrefs>(
	    GoogleCalenderPrefs.class);

    public GoogleCalenderPrefs()
    {

    }

    public GoogleCalenderPrefs(String refresh_token, String access_token)
    {
	this.refresh_token = refresh_token;
	this.access_token = access_token;
    }

    /**
     * Sets expiry time according to expires in attribute set when access token
     * is fetched using refresh token/
     * 
     * @param time
     */
    @JsonIgnore
    public void setExpiryTime(Integer time)
    {
	expires_at = System.currentTimeMillis() + (time - 120) * 1000;
    }

    /**
     * After expiry of existing token new token is fetched us
     * 
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     */
    public void refreshToken() throws JsonParseException, JsonMappingException, IOException
    {

	if (refresh_token == null)
	    return;

	String response = GoogleServiceUtil.refreshTokenInGoogleForCalendar(refresh_token);

	// Creates HashMap from response JSON string
	HashMap<String, Object> properties = new ObjectMapper().readValue(response,
		new TypeReference<HashMap<String, Object>>()
		{
		});
	System.out.println(properties.toString());

	if (properties.containsKey("access_token"))
	{
	    access_token = String.valueOf(properties.get("access_token"));
	    setExpiryTime(Integer.parseInt(String.valueOf(properties.get("expires_in"))));
	    save();
	}
    }

    @PostLoad
    void postLoad()
    {
	if (System.currentTimeMillis() >= expires_at)
	    try
	    {
		refreshToken();
	    }
	    catch (IOException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
    }

    @PrePersist
    void prePersist()
    {
	if (domainUserKey == null)
	    domainUserKey = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());

    }

    public void save()
    {
	dao.put(this);
    }

    public void delete()
    {
	dao.delete(this);
    }

}
