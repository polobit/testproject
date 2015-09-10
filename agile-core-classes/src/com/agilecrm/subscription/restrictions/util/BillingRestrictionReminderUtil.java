package com.agilecrm.subscription.restrictions.util;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.limits.cron.deferred.OurDomainSyncDeferredTask;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

/**
 * <code>BillingRestrictionReminderUtil</code> adds tags to our domain with
 * percentage of usage
 * 
 * @author Yaswanth
 * 
 */
public class BillingRestrictionReminderUtil
{

    /**
     * Initiates task to add tag in our odmain
     * 
     * @param tag
     */
    public static void addRestictionTagsInOurDomain(String tag)
    {
	Set<String> tags = new HashSet<String>();
	tags.add(tag);
	OurDomainSyncDeferredTask task = new OurDomainSyncDeferredTask(tags);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(task));
    }

    /**
     * Overloaded method takes list of tags and initiates task to add tags in
     * our domain. Fetches owner of current domain and finds contact in our
     * domain and add tags
     * 
     * @param tags
     */
    public static void addRestictionTagsInOurDomain(Set<String> tags)
    {
	String namespace = NamespaceManager.get();
	DomainUser user = DomainUserUtil.getDomainOwner(namespace);

	if (user == null)
	{
	    System.out.println("domain user null for domain : " + namespace);
	    return;
	}
	NamespaceManager.set("our");
	try
	{

	    System.out.println(NamespaceManager.get());
	    // Fetches contact form our domain
	    Contact contact = ContactUtil.searchContactByEmail(user.email);
	    System.out.println(contact != null ? contact.id : "null");

	    BillingRestrictionReminderUtil.addRestictionTagsInOurDomain(tags, contact);
	}
	finally
	{
	    NamespaceManager.set(namespace);
	}
    }

    // Works only from admin panel to remove any tags in our domain
    public static void removeRestictionTagsInOurDomain(String domain, Set<String> tags)
    {
	String namespace = NamespaceManager.get();
	List<DomainUser> users = DomainUserUtil.getAllAdminUsers(domain);
	NamespaceManager.set("our");
	try
	{
	    for (DomainUser user : users)
	    {
		if (user == null)
		{
		    System.out.println("domain user null for domain : " + domain);
		    return;
		}

		// Fetches contact form our domain
		Contact contact = ContactUtil.searchContactByEmail(user.email);
		System.out.println(contact != null ? contact.id : "null");
		contact.removeTags(tags.toArray(new String[tags.size()]));

	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while removing tags..." + e.getMessage());
	}

	finally
	{
	    NamespaceManager.set(namespace);
	}
    }

    public static void addTagsToAdminsInOurDomain(Set<String> tags)
    {
	String namespace = NamespaceManager.get();

	List<DomainUser> adminUsers = DomainUserUtil.getAllAdminUsers(namespace);

	System.out.println("Getting Admin users of namespace " + namespace);

	if (adminUsers == null)
	{
	    System.out.println("Admin users are null for domain : " + namespace);
	    return;
	}

	System.out.println("Admin users size is " + adminUsers.size());

	NamespaceManager.set("our");

	try
	{

	    for (DomainUser user : adminUsers)
	    {
		// Fetches contact form our domain
		Contact contact = ContactUtil.searchContactByEmail(user.email);

		System.out.println("Contact is " + contact);

		BillingRestrictionReminderUtil.addRestictionTagsInOurDomain(tags, contact);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while adding tags to our domain..." + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(namespace);
	}
    }

    /**
     * Takes list of tags and contact from our domain. While adding tags, it
     * checks in existing tags for different percentages and removes before
     * adding
     * 
     * @param tags
     * @param contact
     */
    public static void addRestictionTagsInOurDomain(Set<String> tags, Contact contact)
    {
	// Flag to decide whether to save contact. It is changed if new tag is
	// added or any existing tag is removed
	boolean isUpdateRequired = false;

	if (contact == null)
	    return;

	// subaccount paused Tag
	if (tags != null && tags.contains(MandrillSubAccounts.MANDRILL_SUBACCOUNT_PAUSED_TAG))
	{
	    try
	    {
		System.out.println("Adding subacount paused tag in our...");

		contact.addTags(tags.toArray(new String[tags.size()]));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		System.err.println("Exception occured while adding tags to our..." + e.getMessage());
	    }

	    return;
	}

	contact.tags.clear();

	for (String tag : tags)
	{
	    System.out.println(tag);
	    // If tag already exits it continues
	    if (contact.tags.contains(tag))
		continue;

	    // Splits at "_" which returns fragments; entity name and percentage
	    String tagFragments[] = tag.split("_");

	    String entityName = tagFragments[0];
	    String newPercentage = tagFragments[1];

	    // Gets current percentage in tag
	    int percentage = Integer.parseInt(newPercentage);

	    System.out.println("entity : " + entityName + " ,Percentage = " + percentage);

	    // Checks for tag with same entity name and different percentage
	    // (possibly added with different percentage)
	    for (String percentageString : BillingRestrictionUtil.percentages)
	    {
		if (percentageString.equals(newPercentage))
		    continue;

		Tag tagObject = new Tag(entityName + "_" + percentageString);
		// Removes if any tag exists with same class name and
		// different
		// percentage
		if (isUpdateRequired)
		    contact.tagsWithTime.remove(tagObject);
		else
		    isUpdateRequired = contact.tagsWithTime.remove(tagObject);
	    }

	    // If tag is less than 75% then existing tags are removed and tag is
	    // not added
	    if (percentage < 75)
	    {
		System.out.println(contact.tags);
		System.out.println(isUpdateRequired);
		continue;
	    }

	    // Adds tag
	    isUpdateRequired = contact.tags.add(tag);
	}

	// If any tag is altered then contact is updated
	if (isUpdateRequired)
	{
	    System.out.println("saving contact");
	    contact.save(true);
	    System.out.println(contact.tags);
	}
    }

    public static Integer calculatePercentage(int allowedEntites, int existingEntities)
    {
	if (allowedEntites == 0 || existingEntities == 0)
	    return 0;
	return existingEntities * 100 / allowedEntites;
    }

    /**
     * Hardload to send request to update tags even if percentage is less that
     * 75%. It is required to remove tags if user falls back into limits
     * 
     * @param count
     * @param allowedCount
     * @param className
     * @param hardLoad
     * @return
     */
    @JsonIgnore
    public static String getTag(int count, int allowedCount, String className, boolean hardLoad)
    {

	Integer percentage = calculatePercentage(allowedCount, count);
	if (percentage >= 75 && percentage < 85)
	    return className + "_75";
	if (percentage >= 85 && percentage < 90)
	    return className + "_85";
	if (percentage >= 90 && percentage < 100)
	    return className + "_90";
	if (percentage >= 100)
	    return className + "_100";

	if (!hardLoad)
	    return null;

	return className + "_" + percentage;
    }

}
