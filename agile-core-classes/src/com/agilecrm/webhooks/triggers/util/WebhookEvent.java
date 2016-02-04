package com.agilecrm.webhooks.triggers.util;

import javax.xml.bind.annotation.XmlRootElement;

import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class WebhookEvent
{

    /**
     * Domain of the user
     */
    @NotSaved(IfDefault.class)
    public String eventName;

    /**
     * Domain of the user
     */
    @NotSaved(IfDefault.class)
    public Object eventData;

    public WebhookEvent(String eventName, Object eventData)
    {
	this.eventName = eventName;
	this.eventData = eventData;
    }

    public WebhookEvent()
    {
    }

    @Override
    public String toString()
    {
	return "EventActionEn [eventName=" + eventName + ", eventData=" + eventData + "]";
    }

}