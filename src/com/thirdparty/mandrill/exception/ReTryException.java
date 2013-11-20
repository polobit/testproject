package com.thirdparty.mandrill.exception;

/**
 * <code>ReTryException</code> is a custom exception class to throw Retry
 * exception.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class ReTryException extends Exception
{
    public ReTryException(String message)
    {
	super(message);
    }
}
