package com.agilecrm.contact.sync.service;

public interface ITwoWaySyncService
{
	public void syncContactFromClient();

	public void uploadContactsToClient();
}
