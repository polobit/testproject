package com.campaignio.logger;

import javax.xml.bind.annotation.XmlRootElement;

import com.googlecode.objectify.annotation.Indexed;

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
    public String type;

    /**
     * Log Time
     */
    public long time;

    /**
     * Log Message.
     */
    public String message;

    /**
     * Icon pic based on logType.
     */
    public String pic;

    @Indexed
    public long email_opened = 0L;

    @Indexed
    public long email_clicked = 0L;

    @Indexed
    public long email_sent = 0L;

    /**
     * Default LogItem
     */
    LogItem()
    {

    }

    /**
     * Constructs a new {@link LogItem}
     * 
     * @param type
     *            - logType.
     * @param time
     *            - logTime.
     * @param message
     *            - logMessage.
     */
    public LogItem(String type, long time, String message, String pic)
    {
	this.type = type;
	this.time = time;
	this.message = message;
	this.pic = pic;

	addSearch(this.type);
    }

    /**
     * Assigns time to type to search on required type.
     * 
     * @param type
     *            - Log type.
     */
    private void addSearch(String type)
    {
	if (type.equals("Send E-mail"))
	    email_sent = time;
	else if (type.equals("Email Opened"))
	    email_opened = time;
	else if (type.equals("Email Clicked"))
	    email_clicked = time;
    }
}
