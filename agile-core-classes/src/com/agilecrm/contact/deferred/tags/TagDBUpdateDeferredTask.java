package com.agilecrm.contact.deferred.tags;

import java.util.HashSet;
import java.util.Set;

import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.TagUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class TagDBUpdateDeferredTask implements DeferredTask
{

    Tag tag = null;

    public TagDBUpdateDeferredTask(Tag tag, String tracker)
    {
	this.tag = tag;
    }

    @Override
    public void run()
    {
	Set<String> tags = new HashSet<String>();
	tags.add(tag.tag);
	try
	{

	    // TODO Auto-generated method stub
	    TagUtil.updateTags(tags);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

}
