package com.agilecrm.exception;

public class InvalidTagException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidTagException() {
		super("Tag name should start with an alphabet and cannot contain special characters other than underscore and space.");
	}

	public InvalidTagException(String message) {
		super(message);
	}

}
