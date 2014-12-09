package com.agilecrm.user;

import java.util.List;

import org.json.JSONObject;

public class EmailPrefs
{
    private String agileUserName;

    public String getAgileUserName()
    {
	return agileUserName;
    }

    public void setAgileUserName(String agileUserName)
    {
	this.agileUserName = agileUserName;
    }

    private String imapUserName;
    private String exchangeUserName;
    private String gmailUserName;
    private List<String> sharedImapUserNames;
    private List<String> sharedGmailUserNames;
    private List<String> sharedExchangeUserNames;

    public EmailPrefs()
    {

    }

    public String getEmailPrefs()
    {
	JSONObject emailPrefs = new JSONObject();
	try
	{
	    emailPrefs.put("imapUserName", imapUserName);
	    emailPrefs.put("gmailUserName", gmailUserName);
	    emailPrefs.put("exchangeUserName", exchangeUserName);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return emailPrefs.toString();

    }

    public String getImapUserName()
    {
	return imapUserName;
    }

    public void setImapUserName(String imapUserName)
    {
	this.imapUserName = imapUserName;
    }

    public String getExchangeUserName()
    {
	return exchangeUserName;
    }

    public void setExchangeUserName(String exchangeUserName)
    {
	this.exchangeUserName = exchangeUserName;
    }

    public String getGmailUserName()
    {
	return gmailUserName;
    }

    public void setGmailUserName(String gmailUserName)
    {
	this.gmailUserName = gmailUserName;
    }

    public List<String> getSharedImapUserNames()
    {
	return sharedImapUserNames;
    }

    public void setSharedImapUserNames(List<String> sharedImapUserNames)
    {
	this.sharedImapUserNames = sharedImapUserNames;
    }

    public List<String> getSharedGmailUserNames()
    {
	return sharedGmailUserNames;
    }

    public void setSharedGmailUserNames(List<String> sharedGmailUserNames)
    {
	this.sharedGmailUserNames = sharedGmailUserNames;
    }

    public List<String> getSharedExchangeUserNames()
    {
	return sharedExchangeUserNames;
    }

    public void setSharedExchangeUserNames(List<String> sharedExchangeUserNames)
    {
	this.sharedExchangeUserNames = sharedExchangeUserNames;
    }

}
