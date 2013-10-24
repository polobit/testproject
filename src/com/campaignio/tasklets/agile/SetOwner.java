package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.googlecode.objectify.Key;

/**
 * <code>SetOwner</code> class represents Set Owner node of campaigns. It sets
 * sets selected owner to the contact subscribed to Campaign.
 * 
 * @author Naresh
 * 
 */
public class SetOwner extends TaskletAdapter
{
    // Owner Id
    public static String OWNER_ID = "owner_id";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get OwnerId
	String ownerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);

	try
	{
	    // Get ownerKey from domain user id.
	    Key<DomainUser> newOwnerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

	    // Sets owner key to contact subscribed
	    Contact contact = ContactUtil.getContact(Long.parseLong(AgileTaskletUtil.getId(subscriberJSON)));
	    contact.setContactOwner(newOwnerKey);
	    contact.save();

	    DomainUser domainUser = DomainUserUtil.getDomainUser(Long.parseLong(ownerId));

	    // Creates log for SetOwner
	    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Owner is set to " + domainUser.name + " for "
		    + contact.getContactFieldValue(Contact.FIRST_NAME), LogType.SET_OWNER.toString());
	}
	catch (Exception e)
	{
	    System.err.println("Exception occurred while setting owner in SetOwner " + e.getMessage());
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }
}
