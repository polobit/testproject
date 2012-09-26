package com.agilecrm.core.api;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;

@Provider
public class ObjectMapperProvider implements ContextResolver<ObjectMapper>
{
    ObjectMapper mapper;

    public ObjectMapperProvider()
    {
	mapper = new ObjectMapper();
	mapper.configure(
		DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);

	mapper.configure(SerializationConfig.Feature.WRITE_NULL_PROPERTIES,
		false);
	mapper.configure(SerializationConfig.Feature.WRITE_NULL_MAP_VALUES,
		false);

    }

    @Override
    public ObjectMapper getContext(Class<?> type)
    {
	return mapper;
    }
}
