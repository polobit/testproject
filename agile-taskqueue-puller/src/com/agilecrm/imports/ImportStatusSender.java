package com.agilecrm.imports;

import com.agilecrm.contact.upload.blob.status.specifications.StatusProcessor;
import com.agilecrm.contact.upload.blob.status.specifications.StatusSender;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.email.SendMail;

public class ImportStatusSender implements StatusSender
{

    @Override
    public void sendEmail(DomainUser domainUser, StatusProcessor<?> processor)
    {
	if (!processor.shouldSendDelayMessage())
	{
	    return;
	}

	// TODO Auto-generated method stub
	System.out.println("Email to be sent to email");
	SendMail.sendMail(domainUser.email, "CSV Contacts Import Delay", SendMail.CSV_IMPORT_DELAY_NOTIFICATION,
		new Object[] { domainUser });
    }
}
