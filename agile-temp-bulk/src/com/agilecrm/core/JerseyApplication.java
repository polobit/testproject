package com.agilecrm.core;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

public class JerseyApplication extends Application
{
    @Override
    public Set<Class<?>> getClasses()
    {
	Set<Class<?>> s = new HashSet<Class<?>>();

	s.add(org.codehaus.jackson.jaxrs.JacksonJaxbJsonProvider.class);
	s.add(org.codehaus.jackson.jaxrs.JacksonJsonProvider.class);
	s.add(org.codehaus.jackson.jaxrs.JsonParseExceptionMapper.class);
	s.add(org.codehaus.jackson.jaxrs.JsonMappingExceptionMapper.class);
	s.add(com.agilecrm.core.api.ObjectMapperProvider.class);
	s.add(com.agilecrm.core.api.JSAPI.class);
	s.add(com.agilecrm.core.api.PHPAPI.class);
	return s;
    }
}