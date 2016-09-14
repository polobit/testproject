package com.webruleio.reports;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.Calendar;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import com.webruleio.reports.AnalyticsDBConnectionFetcher;
import com.campaignio.reports.DateUtil;

/**
 * <code>WebruleReportsUtil</code> is the utility class that initializes graphs
 * with default data. Inorder to built bar-charts with the values obtained,
 * first need to intialize the X-axis and Y-axis values with default values.
 * <p>
 
 * 
 * @author Poulami
 */
public class WebruleReportsUtil
{


    
    /**
     * Takes the query as input returns the ResultSet object.
     * 
     * @param query
     *            - sql query.
     * @return ResultSet Object.
     * 
     */
    
    
    
    public static ResultSet executeQuery(String query)
    {
	ResultSet rs = null;

	try
	{
	 // get the connection object
	    AnalyticsDBConnectionFetcher fetch = new AnalyticsDBConnectionFetcher();
		Connection conn =fetch.getConnection();
	    if (conn == null)
		return null;


	    // creates the statement object
	    Statement stmt = conn.createStatement();

	    // get the ResultSet object
	    rs = stmt.executeQuery(query);
	}
	catch (Exception ex)
	{
	    System.out.println("Error in executing given query: " + ex);
	    ex.printStackTrace();
	}

	return rs;
    }

    /**
     * Gets results from given query and return results in json array.
     * 
     * @param query
     *            - query
     * @return - json array
     * @throws Exception
     */
    public static JSONArray getWebruleJSONQuery(String query,Connection conn) throws Exception
    {
	System.out.println("Query " + query);

	// get the ResultSet object
	ResultSet rs = executeQuery(query);

	if (rs == null)
	    return null;

	System.out.println("RS " + rs);

	// JSONArray for each record
	JSONArray agentDetailsArray = new JSONArray();

	// get the resultset metadata object to get the column names
	ResultSetMetaData resultMetadata = rs.getMetaData();

	// get the column count in the resultset object
	int numColumns = resultMetadata.getColumnCount();

	// variable for get the name of the column
	String columnName = null;

	try
	{
	    // iterate the ResultSet object
	    while (rs.next())
	    {
		// create JSONObject for each record
		JSONObject eachAgentJSON = new JSONObject();

		// Get the column names and put
		// eachAgent record in agentJSONArray
		for (int i = 1; i < numColumns + 1; i++)
		{
		    // Get the column names
		    columnName = resultMetadata.getColumnName(i);

		    // put column name and value in json array
		    eachAgentJSON.put(columnName, "" + rs.getString(columnName));
		}

		// place result data in agentDetailsArray
		agentDetailsArray.put(eachAgentJSON);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception while mapping result set" + e);
	    return agentDetailsArray;
	}
	finally
	{
	    // close the Connection and ResultSet objects
	    closeResultSet(rs);
	}

	return agentDetailsArray;
    }

    /**
     * Closes the connection,resultSet and statement objects.Takes the resultSet
     * as input returns the boolean (returns true if connection closed
     * successfully otherwise returns false)
     * 
     * @param rs
     *            - ResultSet
     * @return boolean value.
     */
    public static boolean closeResultSet(ResultSet rs)
    {
	try
	{
	    if (rs == null)
		return false;

	    // get the Statement object from the ResultSet
	    Statement stmt = rs.getStatement();

	    // get the Connection object from the Statement
	    Connection conn = stmt.getConnection();

	    // close the ResultSet
	    rs.close();

	    // close the Statement
	    stmt.close();

	    // close the Connection
	    conn.close();

	    System.out.println("Closed the connection from database");

	}
	catch (Exception ex)
	{
	    System.out.println(" Error closing the result set ");
	    ex.printStackTrace();
	}

	return true;
    }

    
  
    /**
     * Returns start date in mysql date format based on type like hourly, weekly
     * or daily
     * 
     * @param startTime
     *            - Epoch time of start date.
     * @param endTime
     *            - Epoch time of end date. Required for weekly
     * @param type
     *            - hourly or weekly or daily.
     * @param timeZone
     *            - TimeZone Id obtained from client side. E.g. -330
     * @return String
     */
    public static String getStartDate(String startTime, String endTime, String type, String timeZone)
    {
	// Weekly
	if (StringUtils.equalsIgnoreCase(type, "day"))
	{
	    Calendar calendar = Calendar.getInstance();
	    calendar.setTimeInMillis(Long.parseLong(endTime));
	    calendar.add(Calendar.DAY_OF_MONTH, -6);
	    startTime = calendar.getTimeInMillis() + "";
	}

	// Converts epoch time to "yyyy-MM-dd HH:mm:ss" and set timezone.
	return DateUtil.getMySQLNowDateFormat(Long.parseLong(startTime), timeZone);
    }

    /**
     * Returns end date with mid-night time in mysql date format.
     * 
     * @param endTime
     *            - Epoch time of end date.
     * @param timeZone
     *            - TimeZone Id obtained from client side. E.g. -330
     * @return String
     */
    public static String getEndDate(String endTime, String timeZone)
    {
	Calendar endCal = Calendar.getInstance();
	endCal.setTimeInMillis(Long.parseLong(endTime));
	endCal.add(Calendar.HOUR, 23);
	endCal.add(Calendar.MINUTE, 59);
	endCal.add(Calendar.SECOND, 59);
	endTime = endCal.getTimeInMillis() + "";

	// Converts epoch time to "yyyy-MM-dd HH:mm:ss" and set timezone.
	return DateUtil.getMySQLNowDateFormat(Long.parseLong(endTime), timeZone);
    }
    
    /**
     * Returns end date with mid-night time in mysql date format.
     * 
     * @param endTime
     *            - Epoch time of end date.
     * @param timeZone
     *            - TimeZone Id obtained from client side. E.g. -330
     * @return String
     */
    public static String getEndDateForReports(String endTime, String timeZone)
    {
	// Converts epoch time to "yyyy-MM-dd HH:mm:ss" and set timezone.
	return DateUtil.getMySQLNowDateFormat(Long.parseLong(endTime), timeZone);
    }


   }