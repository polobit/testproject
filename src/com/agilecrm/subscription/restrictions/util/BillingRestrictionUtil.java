package com.agilecrm.subscription.restrictions.util;

import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.restrictions.BillingRestriction;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

@XmlRootElement
public class BillingRestrictionUtil
{

    /**
     * Error messages according to type of entity
     * 
     * @author yaswanth
     * 
     */
    public static enum ErrorMessages
    {
	CONTACT("Contacts limit reached"), WebRule("Web Rules limit reached"), Workflow("Campaigns limit reached");

	private String message;

	ErrorMessages(String message)
	{
	    this.message = message;
	}

	public String getMessage()
	{
	    return message;
	}
    }

    /**
     * Percentages where tag has to be added
     */
    private static Set<String> percentages = new HashSet<String>();
    static
    {
	percentages.add("75");
	percentages.add("85");
	percentages.add("90");
	percentages.add("100");
    }

    /**
     * Fetches billing restriction object from DB. If object is not created then
     * it will create new and return
     * 
     * @param planName
     * @param users
     * @return
     */
    public static BillingRestriction getBillingRestriction(String planName, Integer users)
    {
	Objectify ofy = ObjectifyService.begin();
	BillingRestriction restriction = ofy.query(BillingRestriction.class).get();

	if (restriction == null)
	    restriction = BillingRestriction.getInstance(planName, users);

	restriction.planLimitsEnum = BillingRestrictionUtil.getPlan(planName, users).getPlanLimits();

	return restriction;
    }

    /**
     * Creates/fetches billing restriction by setting plan and users. Reads plan
     * and users count from user info, it if is not defined then subscription
     * object is fetched
     * 
     * @param sendRemainder
     * @return
     */
    public static BillingRestriction getBillingRestriction(boolean sendRemainder)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	{
	    BillingRestriction restriction = getBillingRestriction(null, null);
	    restriction.sendRemainder = sendRemainder;
	    return restriction;
	}
	System.out.println(info.getPlan() + ", " + info.getUsersCount());
	BillingRestriction restriction = getBillingRestriction(info.getPlan(), info.getUsersCount());
	restriction.sendRemainder = sendRemainder;
	return restriction;
    }

    public static BillingRestriction getInstance(boolean sendRemainder)
    {
	BillingRestriction restriction = getInstance();
	restriction.sendRemainder = sendRemainder;
	return restriction;

    }

    public static BillingRestriction getInstance()
    {
	UserInfo info = SessionManager.get();
	return BillingRestriction.getInstance(info.getPlan(), info.getUsersCount());
    }

    public static Plan getPlan(String planName, Integer users)
    {
	Plan plan = null;
	if (!StringUtils.isEmpty(planName))
	    plan = new Plan(planName, users);
	else
	{
	    Subscription subscription = Subscription.getSubscription();
	    plan = subscription == null ? new Plan("FREE", 2) : subscription.plan;
	    UserInfo info = SessionManager.get();
	    info.setPlan(plan.plan_type.toString());
	    info.setUsersCount(plan.quantity);
	    SessionManager.set((UserInfo) null);
	    SessionManager.set(info);

	}
	return plan;
    }

    public static void sendRemainder(int allowedEntites, int existingEntities, String className)
    {
	Integer percentage = calculatePercentage(allowedEntites, existingEntities);
	if (percentage > 75)
	{

	}
	initializeSendRemainder(percentage);

    }

    public static Integer calculatePercentage(int allowedEntites, int existingEntities)
    {
	return existingEntities * 100 / allowedEntites;
    }

    public static void initializeSendRemainder(Integer percentage)
    {

    }

    public void setOurNamespaceToSaveTags()
    {

    }

    public static void addRestictionTagsInOurDomain(Set<String> tags, Contact contact)
    {
	boolean isUpdateRequired = false;

	for (String tag : tags)
	{
	    if (contact.tags.contains(tag))
		continue;

	    isUpdateRequired = true;

	    String tagFragments[] = tag.split("-");

	    String entityName = tagFragments[0];
	    String newPercentage = tagFragments[1];
	    for (String percentage : percentages)
	    {
		if (percentage.equals(newPercentage))
		    continue;

		contact.tags.remove(entityName + "-" + percentage);
	    }

	    contact.tags.add(tag);
	}

	if (isUpdateRequired)
	    contact.save(true);
    }

    public static void addRestictionTagsInOurDomain(Set<String> tags)
    {
	String namespace = NamespaceManager.get();
	NamespaceManager.set("our");
	try
	{
	    DomainUser user = DomainUserUtil.getDomainOwner(namespace);
	    Contact contact = ContactUtil.searchContactByEmail(user.email);
	    addRestictionTagsInOurDomain(tags, contact);
	}
	finally
	{
	    NamespaceManager.set(namespace);
	}
    }
}
