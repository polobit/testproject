package com.agilecrm.contact.deferred;

import com.agilecrm.contact.Tag;
import com.agilecrm.contact.TagManagement;
import com.google.appengine.api.taskqueue.DeferredTask;

public class TagManagementDeferredTask implements DeferredTask
{    
    Tag primaryTag = null;
    Tag newTag = null;
    
    public static enum Action
    {
	RENAME, DELETE, MERGE
    }
    
    Action action = null;
 
    TagManagementDeferredTask()
    {
	
    }
    
    public TagManagementDeferredTask(Tag primaryTag, Tag newTag, Action action)
    {
	this.primaryTag = primaryTag;
	this.newTag = newTag;
	this.action = action;
    }
    
    @Override
    public void run()
    {
        // TODO Auto-generated method stub
	if(action == null)
	    return;
	
	if(action == Action.RENAME)
	    TagManagement.renameTag(primaryTag.tag, newTag.tag);
	else if(action == Action.DELETE)
	    TagManagement.removeTag(primaryTag.tag);
	else if(action == Action.MERGE)
	    TagManagement.renameTag(primaryTag.tag, newTag.tag);
	    
    }
}
