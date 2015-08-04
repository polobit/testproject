package com.agilecrm.logger;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintStream;

import org.apache.log4j.Logger;

public class AgileAPILogger
{
    final static Logger logger = Logger.getLogger(AgileAPILogger.class);

    static
    {
	tieSystemOutAndErrToLog();
    }

    public static Logger getLogger(String loggerFile)
    {
	return logger;
    }

    public static FileWriter getFileWriter()
    {
	File file = new File("/home/yaswanth/apilog-writer.csv");
	try
	{
	    FileWriter writer = new FileWriter(file);

	    return writer;
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return null;
    }

    public static void tieSystemOutAndErrToLog()
    {
	System.setOut(createLoggingProxy(System.out));
	System.setErr(createLoggingErrorProxy(System.err));
    }

    public static PrintStream createLoggingProxy(final PrintStream realPrintStream)
    {
	return new PrintStream(realPrintStream)
	{
	    public void print(final String string)
	    {
		// realPrintStream.print(string);
		logger.info(string);
	    }
	};
    }

    public static PrintStream createLoggingErrorProxy(final PrintStream realPrintStream)
    {
	return new PrintStream(realPrintStream)
	{
	    public void print(final String string)
	    {
		// realPrintStream.print(string);
		logger.error(string);
	    }
	};
    }

}
