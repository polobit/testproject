package com.agilecrm.thirdparty.levenshteindistance;

@SuppressWarnings("serial")
public class InsufficientParameterException extends RuntimeException
{

    public InsufficientParameterException()
    {
	super("Insufficient prameter. Atleast 2 required ");
    }

}
