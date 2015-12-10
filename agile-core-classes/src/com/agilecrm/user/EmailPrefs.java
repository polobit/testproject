package com.agilecrm.user;

import java.util.List;

public class EmailPrefs
{
    private String agileUserName;

    private boolean hasEmailAccountsConfigured;

    private boolean hasSharedEmailAccounts;

    private boolean emailAccountsLimitReached;
    
    private int emailAccountsCount;
    
    public int getEmailAccountsLimit()
    {
        return emailAccountsLimit;
    }

    public void setEmailAccountsLimit(int emailAccountsLimit)
    {
        this.emailAccountsLimit = emailAccountsLimit;
    }

    private int emailAccountsLimit;

    public int getEmailAccountsCount()
    {
        return emailAccountsCount;
    }

    public void setEmailAccountsCount(int emailAccountsCount)
    {
        this.emailAccountsCount = emailAccountsCount;
    }

    public List<String> getImapUserNames()
    {
	return imapUserNames;
    }

    public boolean isEmailAccountsLimitReached()
    {
	return emailAccountsLimitReached;
    }

    public void setEmailAccountsLimitReached(boolean emailAccountsLimitReached)
    {
	this.emailAccountsLimitReached = emailAccountsLimitReached;
    }

    public void setImapUserNames(List<String> imapUserNames)
    {
	this.imapUserNames = imapUserNames;
    }

    public List<String> getExchangeUserNames()
    {
	return exchangeUserNames;
    }

    public void setExchangeUserNames(List<String> exchangeUserNames)
    {
	this.exchangeUserNames = exchangeUserNames;
    }

    public List<String> getGmailUserNames()
    {
	return gmailUserNames;
    }

    public void setGmailUserNames(List<String> gmailUserNames)
    {
	this.gmailUserNames = gmailUserNames;
    }

    public boolean isHasEmailAccountsConfigured()
    {
	return hasEmailAccountsConfigured;
    }

    public void setHasEmailAccountsConfigured(boolean hasEmailAccountsConfigured)
    {
	this.hasEmailAccountsConfigured = hasEmailAccountsConfigured;
    }

    public boolean isHasSharedEmailAccounts()
    {
	return hasSharedEmailAccounts;
    }

    public void setHasSharedEmailAccounts(boolean hasSharedEmailAccounts)
    {
	this.hasSharedEmailAccounts = hasSharedEmailAccounts;
    }

    public String getAgileUserName()
    {
	return agileUserName;
    }

    public void setAgileUserName(String agileUserName)
    {
	this.agileUserName = agileUserName;
    }

    private List<String> imapUserNames;
    private List<String> exchangeUserNames;
    private List<String> gmailUserNames;
    private List<String> sharedImapUserNames;
    private List<String> sharedGmailUserNames;
    private List<String> sharedExchangeUserNames;
    private List<String> fetchUrls;

    public List<String> getFetchUrls()
    {
        return fetchUrls;
    }

    public void setFetchUrls(List<String> fetchUrls)
    {
        this.fetchUrls = fetchUrls;
    }

    public EmailPrefs()
    {

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