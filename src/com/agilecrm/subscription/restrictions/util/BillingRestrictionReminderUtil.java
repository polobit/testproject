package com.agilecrm.subscription.restrictions.util;

import java.util.HashSet;
import java.util.Set;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.limits.cron.deferred.OurDomainSyncDeferredTask;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

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
	NamespaceManager.set("our");
	try
	{
	    // Fetches contact form our domain
	    Contact contact = ContactUtil.searchContactByEmail(user.email);
	    BillingRestrictionReminderUtil.addRestictionTagsInOurDomain(tags, contact);
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
	for (String tag : tags)
	{
	    System.out.println(tag);
	    // If tag already exits it continues
	    if (contact.tags.contains(tag))
		continue;

	    isUpdateRequired = true;

	    // Splits at "-" which returns fragments; entity name and percentage
	    String tagFragments[] = tag.split("-");

	    String entityName = tagFragments[0];
	    String newPercentage = tagFragments[1];

	    // Checks for tag with same entity name and different percentage
	    // (possibly added with different percentage)
	    for (String percentage : BillingRestrictionUtil.percentages)
	    {
		if (percentage.equals(newPercentage))
		    continue;

		// Removes if any tag exists with same class name and different
		// percentage
		contact.tags.remove(entityName + "-" + percentage);
	    }

	    // Adds tag
	    contact.tags.add(tag);
	}

	// If any tag is altered then contact is updated
	if (isUpdateRequired)
	    contact.save(true);
    }

    public static Integer calculatePercentage(int allowedEntites, int existingEntities)
    {
	if (allowedEntites == 0 || existingEntities == 0)
	    return 0;
	return existingEntities * 100 / allowedEntites;
    }

    @JsonIgnore
    public static String getTag(int count, int allowedCount, String className)
    {

	Integer percentage = calculatePercentage(allowedCount, count);
	if (percentage >= 75 && percentage < 85)
	    return className + "-75";
	if (percentage >= 85 && percentage < 90)
	    return className + "-85";
	if (percentage >= 90 && percentage < 100)
	    return className + "-90";
	if (percentage >= 100)
	    return className + "-100";

	return null;
    }

}
