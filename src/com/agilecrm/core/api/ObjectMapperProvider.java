package com.agilecrm.core.api;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;

@Provider
public class ObjectMapperProvider implements ContextResolver<ObjectMapper>
{
    ObjectMapper mapper;

    public ObjectMapperProvider()
    {
	mapper = new ObjectMapper();
	mapper.configure(
		DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    }

    @Override
    public ObjectMapper getContext(Class<?> type)
    {
	return mapper;
    }
}
