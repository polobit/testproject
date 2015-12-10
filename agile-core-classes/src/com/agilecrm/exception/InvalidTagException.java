package com.agilecrm.exception;

public class InvalidTagException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidTagException() {
		super("Tags should not contain any special characters other than underscore, space and hypen");
	}

	public InvalidTagException(String message) {
		super(message);
	}

}
