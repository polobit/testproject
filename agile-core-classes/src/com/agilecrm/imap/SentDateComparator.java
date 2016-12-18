package com.agilecrm.imap;

import java.util.Comparator;

import javax.mail.Message;
import javax.mail.MessagingException;

import org.apache.commons.lang.StringUtils;

public class SentDateComparator implements Comparator<Message>
{

	@Override
	public int compare(Message msg1, Message msg2)
	{
		int result = 0;
		try
		{
			result = (msg1.getSentDate().compareTo(msg2.getSentDate()));
			return result;
		}
		catch (MessagingException e)
		{
			e.printStackTrace();
		}
		return result;
	}

}
