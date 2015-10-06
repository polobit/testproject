package com.agilecrm.ticket.macros;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.apphosting.api.ApiProxy;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>TicketMacros</code> is the base class for all the TicketMacros created
 * at client-side. Each TicketMacros object consists of macro-id(generated),
 * macro name, created time, updated time, rules and name of creator. The
 * actions in macro is a String object that takes entire macro diagram in json.
 * <p>
 * TicketMacros inherits {@link Cursor} to include Cursor class variables within
 * this class. TicketMacros class uses {@link DomainUser} to create key and to
 * store the key as the TicketMacros's owner.
 * </p>
 * <p>
 * The <code>TicketMacros</code> class provides methods to create, update,
 * delete and get the TicketMacros.
 * </p>
 * 
 * @author Vaishnavi
 * 
 */
@XmlRootElement
@Unindexed
public class TicketMacros extends Cursor
{
	/**
	 * Id of a TicketMacros. Each macro has its own and unique id.
	 */
	@Id
	public Long id;

	/**
	 * Macro Name.
	 */
	@Indexed
	public String name;

	/**
	 * Macro created time (in epoch).
	 */
	@Indexed
	public Long created_time = 0L;

	/**
	 * Macro updated time (in epoch).
	 */
	@NotSaved(IfDefault.class)
	public Long updated_time = 0L;

	/**
	 * Complete macro diagram as json string.
	 */
	@NotSaved(IfDefault.class)
	public String actions = null;

	/**
	 * Creator of Macro (to be specific which domain user created).
	 */
	@NotSaved(IfDefault.class)
	@Indexed
	private Key<DomainUser> creator_key = null;

	/**
	 * Round Robin owner key
	 */
	@NotSaved(IfDefault.class)
	private Key<DomainUser> round_robin_owner_key = null;

	/**
	 * Round robin owner id
	 */
	@NotSaved
	public Long round_robin_owner_id = null;

	/**
	 * Initialize DataAccessObject.
	 */
	public static ObjectifyGenericDao<TicketMacros> dao = new ObjectifyGenericDao<TicketMacros>(TicketMacros.class);

	/**
	 * Default macro.
	 */
	TicketMacros()
	{
	}

	/**
	 * Constructs new {@link TicketMacros} with name and rules.
	 * 
	 * @param name
	 *            Name of macro.
	 * @param rules
	 *            macro actions.
	 */
	public TicketMacros(String name, String actions)
	{
		this.name = name;
		this.actions = actions;
	}

	/**
	 * Returns domain user id from DomainUser Key
	 * 
	 * @return domain user id
	 */
	public Long getDomainUserId()
	{
		if (this.creator_key == null)
			return null;

		return this.creator_key.getId();
	}

	public void setRoundRobinKey(Key<DomainUser> roundRobinKey)
	{
		this.round_robin_owner_key = roundRobinKey;
	}

	@JsonIgnore
	public Key<DomainUser> getRoundRobinKey()
	{
		return round_robin_owner_key;
	}

	/**
	 * Returns domain user name as an xml element who creates macro.
	 * 
	 * @return Respective name of domain user who creates macro.
	 * @throws Exception
	 *             when domain user doesn't exist with that id.
	 */
	@XmlElement(name = "creator")
	public String getCreatorName() throws Exception
	{
		if (creator_key == null)
			return "";

		DomainUser domainUser = null;

		try
		{
			domainUser = DomainUserUtil.getDomainUser(creator_key.getId());
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		if (domainUser != null)
			return domainUser.name;

		return "";
	}

	/**
	 * Saves the macro object. But before saving, verifies for duplicate names.
	 * If given name already exists, it throws exception.
	 */
	public void save() throws WebApplicationException
	{

		// Verifies for duplicate macro name before save
		checkForDuplicateName();

		try
		{
			dao.put(this);
		}
		catch (ApiProxy.RequestTooLargeException e)
		{
			try
			{
				JSONObject obj = new JSONObject();
				obj.put("title", "Ticket Macro Alert");
				obj.put("message", "TBD - too large exception");

				throw new WebApplicationException(Response.status(Status.BAD_REQUEST)
						.entity("Unable to save the macro as it exceeds the limit of 1MB.").build());
			}
			catch (JSONException e1)
			{
				System.out.println("Exception while saving a macro" + e.getMessage());
			}
		}
	}

	/**
	 * Removes the macro object.
	 */
	public void delete()
	{
		dao.delete(this);
	}

	/**
	 * Verifies whether given name is equivalent to any one of the existing
	 * ticket macros names. If names are equal, it throws exception.
	 * <p>
	 * For edit ticket macros , two cases exist. 1. If name is updated - should
	 * verify with existing ones. 2. If name is not updated - no need of
	 * verification.
	 * </p>
	 * 
	 * @throws Exception
	 */
	private void checkForDuplicateName() throws WebApplicationException
	{

		// Consider as a new macro
		if (id == null)
		{
			if (TicketMacroUtil.getMacroNameCount(name) > 0)
				throw new WebApplicationException(Response.status(Status.BAD_REQUEST)
						.entity("Please change the given name. Same kind of name already exists.").build());

			return;
		}

		// to compare given name with existing ones.
		TicketMacros oldMacro = TicketMacroUtil.getMacro(id);

		// Verifies only when macro name updated
		if (!oldMacro.name.equals(name))
		{
			// throws exception for duplicate name
			if (TicketMacroUtil.getMacroNameCount(name) == 1)
				throw new WebApplicationException(Response.status(Status.BAD_REQUEST)
						.entity("Please change the given name. Same kind of name already exists.").build());
		}

	}

	/**
	 * Sets created time and updated time. PrePersist is called each time before
	 * object gets saved. Sets creator key when it is null.
	 */
	@PrePersist
	private void PrePersist()
	{
		// Set creator_key only when it is null
		if (creator_key == null)
		{
			// Set creator(current domain user)
			creator_key = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());
		}

		// Store Created and Last Updated Time
		if (created_time == 0L)
		{
			created_time = System.currentTimeMillis() / 1000;
		}

		else
		{
			if (round_robin_owner_key == null)
			{
				if (round_robin_owner_id != null)
					round_robin_owner_key = new Key<DomainUser>(DomainUser.class, round_robin_owner_id);

				updated_time = System.currentTimeMillis() / 1000;
			}
		}
	}

	@javax.persistence.PostLoad
	private void PostLoad()
	{
		if (round_robin_owner_key != null)
			round_robin_owner_id = round_robin_owner_key.getId();
	}

}