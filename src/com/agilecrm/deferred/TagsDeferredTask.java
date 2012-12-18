package com.agilecrm.deferred;

import java.util.Set;

import com.agilecrm.contact.util.TagUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class TagsDeferredTask implements DeferredTask
{

    private Set<String> tags;

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