package com.agilecrm.contact.deferred;

import java.util.Set;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.TagUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>TagsDeferredTask</code> creates a deferred task, which saves tags of
 * each contact in Tag objectify database (validates duplicates on tag name).
 * 
 * It is accessed from {@link Contact} class to create deferred task with set of
 * tags.
 * 
 * @author
 * 
 */
@SuppressWarnings("serial")
public class TagsDeferredTask implements DeferredTask
{

    /**
     * Represents set of tags of a contact
     */
    private Set<String> tags;

    /**
     * Constructor to initialize tags
     * 
     * @param tags
     *            set of tags to create deferred task
     */
    public TagsDeferredTask(Set<String> tags)
    {
	this.tags = tags;
    }

    @Override
    public void run()
    {
	TagUtil.updateTags(tags);
    }
}