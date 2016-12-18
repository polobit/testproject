package com.agilecrm.imap;

public enum XoauthProtocol
{
    IMAP("imap"), SMTP("smtp");

    private final String name;

    private XoauthProtocol(String name)
    {
	this.name = name;
    }

    public String getName()
    {
	return this.name;
    }
}