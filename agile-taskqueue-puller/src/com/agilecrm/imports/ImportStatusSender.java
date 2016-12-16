package com.agilecrm.imports;

import java.util.HashMap;
import java.util.Map;

import com.agilecrm.contact.upload.blob.status.specifications.StatusProcessor;
import com.agilecrm.contact.upload.blob.status.specifications.StatusSender;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.util.email.SendMail;
import com.agilecrm.util.language.LanguageUtil;
import com.google.appengine.api.NamespaceManager;

public class ImportStatusSender implements StatusSender
{

    @Override
    public void sendEmail(DomainUser domainUser, StatusProcessor<?> processor)
    {
	if (!processor.shouldSendDelayMessage())
	{
	    return;
	}

	Map<String, String> extraParams = new HashMap<String, String>();

	extraParams.put("link", VersioningUtil.getHostURLByApp(NamespaceManager.get()) + "#import");

	// TODO Auto-generated method stub
	System.out.println("Email to be sent to email");
	String tempDomain = domainUser.domain;
	domainUser.domain = AliasDomainUtil.getCachedAliasDomainName(domainUser.domain);
	// Get user prefs language
	String language = LanguageUtil.getUserLanguageFromDomainUser(domainUser);
	SendMail.sendMail(domainUser.email, "CSV Import Delay", SendMail.CSV_IMPORT_DELAY_NOTIFICATION,
		new Object[] { domainUser },language);
	domainUser.domain = tempDomain;
    }
}
