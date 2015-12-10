package com.agilecrm.contact.config;

/**
 * 
 * @author Yaswanth
 *
 */
public class ContactSaveConfig
{
    private boolean enableDuplicateCheck = true;
    private boolean enableMerge = true;
    private boolean updateTagEntity = true;
    private boolean enableNotification = true;

    public boolean isEnableDuplicateCheck()
    {
	return enableDuplicateCheck;
    }

    public void setEnableDuplicateCheck(boolean enableDuplicateCheck)
    {
	this.enableDuplicateCheck = enableDuplicateCheck;
    }

    public boolean isEnableMerge()
    {
	return enableMerge;
    }

    public void setEnableMerge(boolean enableMerge)
    {
	this.enableMerge = enableMerge;
    }

    public boolean isUpdateTagEntity()
    {
	return updateTagEntity;
    }

    public void setUpdateTagEntity(boolean updateTagEntity)
    {
	this.updateTagEntity = updateTagEntity;
    }

    public boolean isEnableNotification()
    {
	return enableNotification;
    }

    public void setEnableNotification(boolean enableNotification)
    {
	this.enableNotification = enableNotification;
    }

}
