package com.thirdparty.mandrill;

public class EmailContentLengthLimitExceededException extends Exception
{
	/**
	 * @author Ramesh
	 */
	private static final long serialVersionUID = 7520383230708814907L;
	private String message = null;

	public EmailContentLengthLimitExceededException()
	{
		super();
	}

	public EmailContentLengthLimitExceededException(String message)
	{
		super(message);
		this.message = message;
	}

	public EmailContentLengthLimitExceededException(Throwable cause)
	{
		super(cause);
	}

	@Override
	public String toString()
	{
		return message;
	}

	@Override
	public String getMessage()
	{
		return message;
	}
}
