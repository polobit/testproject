package com.agilecrm.thirdparty.levenshteindistance;

@SuppressWarnings("serial")
public class NullStringObjectException extends RuntimeException
{
    public NullStringObjectException()
    {
	super("The String Object you gave points to nowhere. All Strings Variables should be initialized.");
    }

}
