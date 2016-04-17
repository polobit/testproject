package com.agilecrm.contact.upload.blob.status.specifications;

import com.agilecrm.user.DomainUser;

public interface StatusSender
{
    public void sendEmail(DomainUser user, StatusProcessor<?> processor);
}
