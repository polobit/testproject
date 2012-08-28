package com.agilecrm.core;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import com.agilecrm.core.api.JSAPI;
import com.agilecrm.core.api.calendar.TasksAPI;
import com.agilecrm.core.api.campaigns.WorkflowsAPI;

public class JerseyApplication extends Application
{
	public Set<Class<?>> getClasses()
	{
		Set<Class<?>> s = new HashSet<Class<?>>();
		s.add(WorkflowsAPI.class);
		s.add(TasksAPI.class);
		
		s.add(JSAPI.class);
		return s;
	}
}
