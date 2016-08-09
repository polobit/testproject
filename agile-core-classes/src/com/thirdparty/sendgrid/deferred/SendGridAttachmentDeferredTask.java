package com.thirdparty.sendgrid.deferred;

import java.io.IOException;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.file.readers.BlobFileInputStream;
import com.agilecrm.file.readers.DocumentFileInputStream;
import com.agilecrm.file.readers.IFileInputStream;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreInputStream.ClosedStreamException;
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
		
		try
		{
			SendGridLib sendgrid = new SendGridLib(username, password);
			email.addAttachment(inputStream.getFileName(), inputStream.getInputStream());
			
			try
			{
				sendgrid.send(email);
			}
			catch(IOException ex)
			{
				System.out.println(ex.getMessage());
				// If stream got closed, get again
				if(inputStream != null)
				{
					email.addAttachment(inputStream.getFileName(), inputStream.getInputStream());
					
					try
					{
						sendgrid.send(email);
					}
					catch (Exception e)
					{
						System.out.println("Exception occured in ClosedStreamException handler...");
						System.out.println(ExceptionUtils.getFullStackTrace(e));
					}
				}
				
			}
			catch (Exception e)
			{
				System.out.println("Exception occured while sending email...");
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}
			
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		finally
		{
			if(inputStream != null)
				inputStream.closeResources();
		}
	}
}

