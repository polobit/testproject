package com.agilecrm.core.api;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;

/**
 * <code>ObjectMapperProvider</code> it ensures that it does not fail on unknown
 * properties. By default {@link ObjectMapper} tries to find all the fields in
 * the XML class, if there are any fields missing/any extra fields in json
 * object fails mapping conversions.
 * 
 * @author Manohar
 * 
 */
@Provider
public class ObjectMapperProvider implements ContextResolver<ObjectMapper>
{
    ObjectMapper mapper;

    // Creates object mapper with custom configuration.
    public ObjectMapperProvider()
    {
	mapper = new ObjectMapper();
	mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);

	mapper.configure(SerializationConfig.Feature.WRITE_NULL_PROPERTIES, false);
	mapper.configure(SerializationConfig.Feature.WRITE_NULL_MAP_VALUES, false);

    }

    /**
     * Returns mapper which will not fail if fields are not available in class.
     */
    @Override
    public ObjectMapper getContext(Class<?> type)
    {
	return mapper;
    }
}
