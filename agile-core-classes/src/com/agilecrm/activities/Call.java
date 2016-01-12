package com.agilecrm.activities;

/**
 * 
 * This is a Wrapper class which includes all the String constants related
 * to calls activity.
 * 
 * @author Purushotham
 * @created 23-Dec-2014
 *
 */
public final class Call
{

	// Call service providers
	public static final String SERVICE_TWILIO = "twilio";

	// Call direction
	public static final String INBOUND = "incoming";
	public static final String OUTBOUND = "outgoing";

	// The incoming or outgoing call was answered and has ended normally.
	// (legacy value : completed)
	public static final String ANSWERED = "answered";
	// The incoming call was unanswered or missed. And outgoing call was
	// unanswered.
	public static final String NO_ANSWER = "no-answer";
	// The outgoing call is busy.
	public static final String BUSY = "busy";
	// The incoming or outgoing call failed due to error, when the phone number
	// was non-existent.
	public static final String FAILED = "failed";
	// voicemail is sent for incoming or outgoing call
	public static final String VOICEMAIL = "voicemail";
	public static final String Missed = "missed";

}