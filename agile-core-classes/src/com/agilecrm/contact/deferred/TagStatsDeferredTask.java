package com.agilecrm.contact.deferred;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

public class TagStatsDeferredTask implements DeferredTask
{
    Cursor cursor = null;
    int availableTags = 0;

    public TagStatsDeferredTask(Cursor cursor, int availableTags)
    {
	cursor = this.cursor;
	availableTags = this.availableTags;
    }

    @Override
    public void run()
    {
	String tags = (String) CacheUtil.getCache(NamespaceManager.get() + "_tag_stats");

	System.out.println("tags elements  : " + tags);
	System.out.println("namespacee : " + NamespaceManager.get() + "_tag_stats");
	JSONObject object = new JSONObject();
	if (!StringUtils.isEmpty(tags))
	{
	    try
	    {
		object = new JSONObject(tags);
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	    updateTagStats(object, cursor);
	    return;
	}

	updateTagStats(object, cursor);
    }

    public void updateTagStats(JSONObject object, Cursor cursor)
    {

	List<Tag> tags = cursor != null && !StringUtils.isEmpty(cursor.cursor) ? TagUtil.getTags(availableTags,
		cursor.cursor) : TagUtil.getTags();

	for (Tag tag : tags)
	{
	    int count = ContactUtil.getContactsCountForTag(tag.tag);
	    try
	    {
		object.put(tag.tag, count);
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}

	CacheUtil.setCache(NamespaceManager.get() + "_tag_stats", object.toString(), 2 * 60 * 60 * 1000);
    }
}