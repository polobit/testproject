package com.agilecrm.exception;

public class InvalidTagException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidTagException() {
		super("Tags should not start with numbers and should not contain special characters except space and underscore.");
	}

	public InvalidTagException(String message) {
		super(message);
	}

}
