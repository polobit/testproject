package com.agilecrm.workflows.unsubscribe;

/**
 * <code>Unsubscribe</code> is the base class that represents Unsubscribe option
 * of a workflow. It holds action and tag to unsubscribe when Unsubscribe link
 * is clicked in email sent through campaign.
 * <p>
 * It is embedded class for Workflow. CRUD operations are done along with
 * Workflow.
 * </p>
 * 
 * @author Naresh
 * 
 */
public class Unsubscribe
{

    /**
     * To show respective content in unsubscribe page based on action
     * 
     */
    public enum Action
    {
	UNSUBSCRIBE_FROM_THIS_CAMPAIGN, UNSUBSCRIBE_FROM_ALL, ASK_USER
    }

    public Action action = null;

    /**
     * Tag to be added to subscriber, when subscriber confirms Unsubscribe
     */
    public String tag = null;
    
    /**
     * From email of unsubscribe confirmation email 
     */
    public String unsubscribe_email = null;
    

    /**
     * Default Unsubscribe
     */
    public Unsubscribe()
    {
    }

    /**
     * Constructs a new {@link Unsubscribe} with action and tag.
     * 
     * @param action
     *            - Type of action to be taken when unsubscribe link is clicked.
     * @param tag
     *            - Tag to be added for unsubscribed subscriber.
     * 
     */
    public Unsubscribe(String tag, Action action)
    {
	this.tag = tag;
	this.action = action;
    }

}
