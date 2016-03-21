package com.agilecrm.contact.upload.blob.status.specifications;

public interface StatusProcessor<T>
{
    public T getStatus();

    public boolean shouldSendDelayMessage();

    public void setCount(int totalEntities);

    public void setTaskQueue(String taskName);

    public String getTaskQueueName();

}
