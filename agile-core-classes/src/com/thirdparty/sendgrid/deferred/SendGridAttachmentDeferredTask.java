package com.thirdparty.sendgrid.deferred;

import java.io.IOException;

import com.agilecrm.file.readers.IFileInputStream;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.sendgrid.lib.SendGridLib;

public class SendGridAttachmentDeferredTask implements DeferredTask
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 6872153126313434939L;
	
	private String username = null;
	private String password = null;
	private SendGridLib.Email email = null;
	private IFileInputStream inputStream = null;
	
	public SendGridAttachmentDeferredTask(String username, String password, SendGridLib.Email email, IFileInputStream inputStream)
	{
		this.username = username;
		this.password = password;
		this.email = email;
		this.inputStream = inputStream;
	}
	
	@Override
	public void run()
	{
		SendGridLib sendgrid = new SendGridLib(username, password);
		try
		{
			email.addAttachment(inputStream.getFileName(), inputStream.getInputStream());
		}
		catch (IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		sendgrid.send(email);
	}
}

