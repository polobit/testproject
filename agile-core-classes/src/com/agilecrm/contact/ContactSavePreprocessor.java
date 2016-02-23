package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.session.SessionManager;

/**
 * Actions that are performed before contact is saved
 * 
 * @author yaswanth
 *
 */
public class ContactSavePreprocessor
{
    private Contact newContact;
    private Contact oldContact;

    public ContactSavePreprocessor(Contact contact, Contact oldContact)
    {
	this.newContact = newContact;
	this.oldContact = oldContact;
    }

    public ContactSavePreprocessor(Contact contact)
    {
	this.newContact = contact;
	if (contact.id != null)
	{
	    oldContact = getOldContact();
	}

    }

    private void updateUpdatedTime()
    {
	// Updated time is updated only if particular fields are changed.
	if (oldContact != null && newContact.isDocumentUpdateRequired(oldContact))
	    newContact.updated_time = System.currentTimeMillis() / 1000;
	System.out.println("viewed time : " + newContact.viewed_time);
	if (newContact.viewed_time != 0L)
	{
	    System.out.println(newContact.viewed_time);
	    newContact.viewed.viewed_time = newContact.viewed_time;
	    newContact.viewed.viewer_id = SessionManager.get().getDomainId();
	}
    }

    /**
     * Performs all save preprocessing
     */
    public void preProcess(boolean... saveArgs)
    {
	if (getOldContact() != null || newContact.id != null)
	{
	    updateOldOwner();
	    tagsProcessing();
	    persistOldCreatedTime();
	}

	if (saveArgs == null || saveArgs.length < 2)
	{
	    validateTags();
	}

	checkDuplicate(oldContact);

	updateUpdatedTime();

	newContact.convertEmailToLower();

	updateTagsEntity();
	checkBounceStatus();
	checkCampaignStatus();
	checkLastContactedFields();

    }

    protected void checkDuplicate(Contact oldContact)
    {
	if (Type.PERSON != newContact.type)
	{
	    return;
	}

	ContactUtil.isDuplicateContact(newContact, oldContact, true);
    }

    private void persistOldCreatedTime()
    {
	newContact.created_time = oldContact.created_time;
    }

    private void tagsProcessing()
    {
	// Sets tags into tags, so they can be compared in
	// notifications/triggers with new tags
	oldContact.tags = oldContact.getContactTags();

	oldContact.bulkActionTracker = newContact.bulkActionTracker;
    }

    private void updateOldOwner()
    {
	if (newContact.getContactOwnerKey() == null)
	{
	    newContact.setContactOwner(oldContact.getContactOwnerKey());
	}
    }

    private void validateTags()
    {
	for (Tag tag : newContact.tagsWithTime)
	{
	    // Check whether tag already exists. Equals method is overridden
	    // in
	    // Tag class to use this contains functionality
	    if (oldContact != null && !oldContact.tagsWithTime.contains(tag))
	    {
		TagUtil.validateTag(tag.tag);
	    }
	}
    }

    /**
     * Verifies last contacted fields in both old and new objects. To update
     * contacted fields if not exists in updated contact
     * 
     * @param oldContact
     *            - old Contact from datastore
     * @param updatedContact
     *            - updated contact object ready to save
     */
    private void checkLastContactedFields()
    {
	try
	{
	    if (oldContact == null)
		return;

	    if (newContact.getLastContacted() == 0L || newContact.getLastContacted() == null)
		newContact.last_contacted = oldContact.last_contacted;

	    if (newContact.getLastCampaignEmailed() == 0L || newContact.getLastCampaignEmailed() == null)
		newContact.last_campaign_emaild = oldContact.last_campaign_emaild;

	    if (newContact.getLastEmailed() == 0L || newContact.getLastEmailed() == null)
		newContact.last_emailed = oldContact.last_emailed;

	    if (newContact.getLastCalled() == 0L || newContact.getLastCalled() == null)
		newContact.last_called = oldContact.last_called;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while verifying last contacted fields..." + e.getMessage());
	}

    }

    /**
     * Verifies CampaignStatus in both old and new contact objects. To update
     * campaign statuses if not exists in updated contact
     * 
     * @param oldContact
     *            - oldContact from datastore
     * @param updatedContact
     *            - updated contact object ready to save
     */
    private void checkCampaignStatus()
    {
	try
	{

	    // For New contact
	    if (oldContact == null || oldContact.campaignStatus == null)
		return;

	    System.out.println("Old CampaignStatus: " + oldContact.campaignStatus + " New campaignStatus: "
		    + newContact.campaignStatus);

	    // If no change return
	    if (newContact.campaignStatus != null
		    && oldContact.campaignStatus.size() == newContact.campaignStatus.size())
		return;

	    // Updated Campaign Status in new contact
	    if (newContact.campaignStatus == null || newContact.campaignStatus.size() == 0
		    || newContact.campaignStatus.size() < oldContact.campaignStatus.size())
		newContact.campaignStatus = oldContact.campaignStatus;

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while checking CampaignStatus in Contact..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Verifies BounceStatus in both old and new contact objects. To update
     * bounce statuses if not exists in updated contact
     * 
     * @param oldContact
     *            - oldContact from datastore
     * @param updatedContact
     *            - updated contact object ready to save
     */
    private void checkBounceStatus()
    {
	try
	{

	    // For New contact
	    if (oldContact == null || oldContact.emailBounceStatus == null)
		return;

	    // If no change return
	    if (newContact.emailBounceStatus != null
		    && oldContact.emailBounceStatus.size() == newContact.emailBounceStatus.size())
		return;

	    // Updated Bounce Status in new contact
	    if (newContact.emailBounceStatus == null || newContact.emailBounceStatus.size() == 0
		    || newContact.emailBounceStatus.size() < oldContact.emailBounceStatus.size())
		newContact.emailBounceStatus = oldContact.emailBounceStatus;

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while checking Bounce Status in Contact..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Updates any new tag w.r.t domain
     * 
     * @param oldContact
     *            - Contact entity before save
     * @param updatedContact
     *            - Current contact
     */
    private void updateTagsEntity()
    {
	try
	{
	    // If tags are not empty, considering they are simple tags and adds
	    // them
	    // to tagsWithTime
	    if (!newContact.tags.isEmpty())
	    {
		for (String tag : newContact.tags)
		{

		    Tag tagObject = new Tag(tag);
		    if (!newContact.tagsWithTime.contains(tagObject) && oldContact != null
			    && oldContact.tagsWithTime.contains(tagObject))
		    {
			newContact.tagsWithTime.add(oldContact.tagsWithTime.get(oldContact.tagsWithTime
				.indexOf(tagObject)));
		    }
		    else if (!newContact.tagsWithTime.contains(tagObject))
		    {
			TagUtil.validateTag(tag);
			newContact.tagsWithTime.add(tagObject);
		    }
		}
	    }

	    List<Tag> newTags = new ArrayList<Tag>();
	    for (Tag tag : newContact.tagsWithTime)
	    {
		// Check if it is null, it can be null tag is created using
		// developers api
		if (tag.createdTime == null || tag.createdTime == 0L)
		{
		    tag.createdTime = System.currentTimeMillis();
		    newTags.add(tag);
		}
	    }

	    LinkedHashSet<String> oldTags = null;

	    if (oldContact != null)
		oldTags = oldContact.getContactTags();

	    newContact.tags = newContact.getContactTags();

	    if (newContact.tags.equals(oldTags))
		return;

	    System.out.println("Tag entity need to update...." + newContact.bulkActionTracker);

	    TagUtil.runUpdateDeferedTask(newTags, newContact.bulkActionTracker);
	}
	catch (WebApplicationException e)
	{
	    System.out.println("Exception in tags - " + e.getResponse().getEntity());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity(e.getResponse().getEntity().toString()).build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in updateTagsEntity..." + e.getMessage());
	}
    }

    public Contact getOldContact()
    {
	if (oldContact != null)
	    return oldContact;

	if (newContact.id == null)
	    return oldContact;

	return oldContact = ContactUtil.getContact(newContact.id);
    }
}
