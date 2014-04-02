package com.agilecrm.subscription.limits;

import java.io.IOException;
import java.lang.reflect.Field;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

final class MySerializer extends JsonSerializer<PlanLimitsEnum>
{

    @Override
    public void serialize(PlanLimitsEnum arg0, JsonGenerator arg1, SerializerProvider arg2) throws IOException, JsonProcessingException
    {
	for (Field field : arg0.getClass().getDeclaredFields())
	{
	    System.out.println(field.getName());
	    if (field.isEnumConstant())
	    {
		System.out.println(field.getName());
		continue;
	    }
	    if (field.isAccessible())
	    {
		System.out.println(field.getName());
	    }
	}
	// TODO Auto-generated method stub

    }

    public static void main(String[] args)
    {

    }

    public void fields()
    {

    }
}