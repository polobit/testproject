package com.campaignio.logger;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * <code>LogItem</code> holds log's type, time and message. Each log is created
 * with these attributes.
 * 
 * @author Naresh
 * 
 */
@XmlRootElement
public class LogItem
{

    /**
     * Log Type
     */
    public String logType;

    /**
     * Log Time
     */
    public long logTime;

    /**
     * Log Message.
     */
    public String logMessage;

    /**
     * Default LogItem
     */
    LogItem()
    {

    }

    /**
     * Constructs a new {@link LogItem}
     * 
     * @param logType
     *            - logType.
     * @param logTime
     *            - logTime.
     * @param logMessage
     *            - logMessage.
     */
    public LogItem(String logType, long logTime, String logMessage)
    {
	this.logType = logType;
	this.logTime = logTime;
	this.logMessage = logMessage;
    }

}
