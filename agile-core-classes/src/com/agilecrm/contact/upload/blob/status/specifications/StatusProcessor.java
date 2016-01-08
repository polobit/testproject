package com.agilecrm.contact.upload.blob.status.specifications;

public interface StatusProcessor<T>
{
    public T getStatus();

    public void setCount(int i);
}
