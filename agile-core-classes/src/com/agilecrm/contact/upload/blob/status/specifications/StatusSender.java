package com.agilecrm.contact.upload.blob.status.specifications;

public interface StatusSender
{
    public void sendEmail(String email, StatusProcessor<?> processor);
}
