package com.campaignio.tasklets.agile;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

import java.util.Collections;

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

    /**
     * Sets contact owner and add log.
     * 
     * @param campaignJSON
     *            - complete workflow json
     * @param subscriberJSON
     *            - contact json
     * @param data
     *            - intermittent data json within workflow
     * @param nodeJSON
     *            - current node json i.e, Set Owner json
     **/
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	// Get OwnerId
	String ownerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);

	try
	{

		 List<String> ownerIds = AgileTaskletUtil.getListOfCampaignIDs(nodeJSON, subscriberJSON, campaignJSON, OWNER_ID); 
		  
		 if(ownerIds.size() > 1 || ownerIds.contains("ALL"))
			 ownerId = getNextOwnerUsingRoundRobin(AgileTaskletUtil.getId(campaignJSON), ownerIds, ownerIds.contains("ALL"));
			 
	    // If Round Robin Assignment
	    if (StringUtils.equals(ownerId, "round_robin"))
	    	ownerId = getNextOwnerUsingRoundRobin(AgileTaskletUtil.getId(campaignJSON), null, true);
	    
	    // Execute Next One in Loop
	    if(ownerId == null)
	    {
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		return;
	    }
	    
	    // Sets contact owner
	    Contact updatedContact = setOwner(subscriberJSON, ownerId);

	    // Update subscriberJSON
	    subscriberJSON = AgileTaskletUtil.getUpdatedSubscriberJSON(updatedContact, subscriberJSON);

	    DomainUser newContactOwner = updatedContact.getContactOwner();

	    // Owner is not updating sometimes, so updating subscriberJSON
	    if (newContactOwner != null && subscriberJSON.has("data")
		    && subscriberJSON.getJSONObject("data").has("owner"))
	    {
		JSONObject owner = subscriberJSON.getJSONObject("data").getJSONObject("owner");

		if (!(owner.getString("id").equals(newContactOwner.id.toString())))
		{
		    owner.put("id", newContactOwner.id);
		    owner.put("name", newContactOwner.name);
		    owner.put("email", newContactOwner.email);
		}
	    }

	    // Creates log for SetOwner
	    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
		    "Owner set to <b>" + newContactOwner.name + "</b>", LogType.SET_OWNER.toString());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occurred while setting owner in SetOwner " + e.getMessage());
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }

    /**
     * Returns next owner from the users list using Round Robin.
     * 
     * @param campaignJSON
     * @return
     * 
     */
    private String getNextOwnerUsingRoundRobin(String campaignId, List<String> ownerIds, boolean isAll)
    {
	// Fetch keys by default in keys order
	List<Key<DomainUser>> userKeys = null;
	
	if(isAll)
		userKeys = DomainUserUtil.getDomainUserKeys(NamespaceManager.get());
	else
		userKeys = getKeysFromIds(ownerIds);

	// Get previous Owner key assigned
	Workflow workflow = WorkflowUtil.getWorkflow(Long.parseLong(campaignId));
	Key<DomainUser> previousUserKey = workflow.getRoundRobinKey();

	
	System.out.println("Previous user key saved in workflow is... " + previousUserKey);
	
	Key<DomainUser> nextUserKey = null;

	// Campaign executing first time, so assign first User to first Contact
	if (previousUserKey == null)
	    nextUserKey = userKeys.get(0);
	else
	    nextUserKey = getNextKeyFromList(userKeys, previousUserKey);

	System.out.println("Next user key getting saved into workflow is... " + nextUserKey);
	
	// Save next key
	workflow.setRoundRobinKey(nextUserKey);
	workflow.save();

	return (nextUserKey == null ? null : String.valueOf(nextUserKey.getId()));
    }

    /**
     * Returns next user key from the list in Round Robin way. If previous user
     * key is last one, it again returns first one
     * 
     * @param userKeys
     *            - List of Domain User keys
     * @param previousUserKey
     *            - previous assigned key
     * @return Key<DomainUser>
     */
    private Key<DomainUser> getNextKeyFromList(List<Key<DomainUser>> userKeys, Key<DomainUser> previousUserKey)
    {
	// Index of previous user key in the list
	int index = userKeys.indexOf(previousUserKey);

	System.out.println("Index of previous key is " + index);
	
	// Returns 0 if last, otherwise next index
	int nextIndex = (index == userKeys.size() - 1) ? 0 : index + 1;

	System.out.println("Next index is " + nextIndex);
	
	return userKeys.get(nextIndex);
    }

    /**
     * Sets owner of the subscribed contact
     * 
     * @param subscriberJSON
     *            - subscriberJSON
     * @param ownerId
     *            - given owner id
     */
    public static Contact setOwner(JSONObject subscriberJSON, String ownerId)
    {
	// Get ownerKey from domain user id.
	Key<DomainUser> newOwnerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

	// Sets owner key to contact subscribed
	Contact contact = ContactUtil.getContact(Long.parseLong(AgileTaskletUtil.getId(subscriberJSON)));
	contact.setContactOwner(newOwnerKey);
	contact.save();

	return contact;
    }
    
    private static List<Key<DomainUser>> getKeysFromIds(List<String> ids)
    {
    	List<Key<DomainUser>> keys = new ArrayList<Key<DomainUser>>();
    	
    	for(String id: ids)
    	{
    	    Key<DomainUser> key = new Key<DomainUser>(DomainUser.class, Long.valueOf(id));	
    	    keys.add(key);
    	}
    	
    	Collections.sort(keys);
    	
    	return keys;
    }
}
