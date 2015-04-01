package com.thirdparty.mandrill.exception;

/**
 * <code>RetryException</code> is a custom exception class to throw Retry
 * exception.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class RetryException extends Exception
{
    public RetryException(String message)
    {
	super(message);
    }
}