package com.webruleio.reports;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.LinkedHashMap;
import org.json.JSONArray;
import org.json.JSONObject;
import com.webruleio.reports.AnalyticsDBConnectionFetcher;
import com.campaignio.reports.CampaignReportsUtil;

/**
 * <code>WebruleReportsUtil</code> is the utility class that initializes graphs
 * with default data. Inorder to built bar-charts with the values obtained,
 * first need to intialize the X-axis and Y-axis values with default values.
 * <p>
 * 
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

    public static final String GROUP_BY_LOG_DATE = "log_date";

    public static ResultSet executeQuery(String query)
    {
	ResultSet rs = null;

	try
	{
	    // get the connection object
	    AnalyticsDBConnectionFetcher fetch = new AnalyticsDBConnectionFetcher();
	    Connection conn = fetch.getConnection();
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
    public static JSONArray getWebruleJSONQuery(String query, Connection conn) throws Exception
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
	    // int sub=0;
	    // iterate the ResultSet object
	    while (rs.next())
	    {
		int view = 0;
		// create JSONObject for each record
		JSONObject eachAgentJSON = new JSONObject();

		// Get the column names and put
		// eachAgent record in agentJSONArray
		for (int i = 1; i < numColumns + 1; i++)
		{
		    int sub = 0;
		    // Get the column names
		    columnName = resultMetadata.getColumnName(i);

		    // put column name and value in json array
		    eachAgentJSON.put(columnName, "" + rs.getString(columnName));

		    if (rs.getString(columnName).equalsIgnoreCase("MODAL_POPUP"))
		    {
			view = view + Integer.parseInt(rs.getString("total"));
			// System.out.println("the view number"+view);
		    }
		    if (rs.getString(columnName).equalsIgnoreCase("SITE_BAR"))
		    {
			view = view + Integer.parseInt(rs.getString("total"));
			// System.out.println("the view number"+view);
		    }
		    if (rs.getString(columnName).equalsIgnoreCase("CORNER_NOTY"))
		    {
			view = view + Integer.parseInt(rs.getString("total"));
			// System.out.println("the view number"+view);
		    }
		    if (rs.getString(columnName).equalsIgnoreCase("CALL_POPUP"))
		    {
			view = view + Integer.parseInt(rs.getString("total"));
			// System.out.println("the view number"+view);
		    }
		    if (rs.getString(columnName).equalsIgnoreCase("REQUEST_PUSH_POPUP"))
		    {
			view = view + Integer.parseInt(rs.getString("total"));
			// System.out.println("the view number"+view);
		    }

		    if (rs.getString(columnName).equalsIgnoreCase("FORM_SUBMITTED"))
		    {
			sub = sub + Integer.parseInt(rs.getString("total"));
			// System.out.println("the submission number"+sub);
			eachAgentJSON.put("TOTAL_SUBMISSIONS", "" + sub);
		    }

		}
		eachAgentJSON.put("TOTAL_VIEWS", "" + view);
		if (!eachAgentJSON.has("TOTAL_SUBMISSIONS"))
		    eachAgentJSON.put("TOTAL_SUBMISSIONS", "" + 0);
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
     * Returns webrule stats data required for graph.
     * 
     * @param startDate
     *            - start date, otherwise null for webrules
     * @param endDate
     *            - end date, otherwise null for webrules
     * @param type
     *            - hourly or weekly or daily.
     * @param timeZone
     *            - TimeZone Id obtained from client side. E.g. -330
     * @param sqlData
     *            - Obtained sql data.
     * @return LinkedHashMap
     */
    public static LinkedHashMap<String, LinkedHashMap<String, Integer>> getEachWebruleStatsData(String startDate,
	    String endDate, String type, String timeZone, JSONArray sqlData)
    {
	// Types of bars in a bar graph
	String[] barTypes = { "TOTAL_VIEWS", "TOTAL_SUBMISSIONS" };

	// Campaigns Comparison need no initialization as there is no duration.
	LinkedHashMap<String, LinkedHashMap<String, Integer>> groupByMap = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();

	String groupBy = GROUP_BY_LOG_DATE;

	// Initialize with default date duration.
	groupByMap = CampaignReportsUtil.getDefaultDateTable(startDate, endDate, type, timeZone, barTypes);

	try
	{
	    int views = 0;
	    int subs = 0;
	    // LinkedHashMap<String, Integer> test= new LinkedHashMap<String,
	    // Integer>();
	    LinkedHashMap<String, Integer> countMap = CampaignReportsUtil.getDefaultCountTable(barTypes);
	    // Arrange sqlData as required to Graph
	    for (int index = 0; index < sqlData.length(); index++)
	    {
		JSONObject logJSON = sqlData.getJSONObject(index);
		if (groupByMap.containsKey(logJSON.getString(groupBy)))
		{
		    countMap = groupByMap.get(logJSON.getString(groupBy));
		    countMap.put("TOTAL_VIEWS",
			    Integer.parseInt(logJSON.getString("TOTAL_VIEWS")) + countMap.get("TOTAL_VIEWS"));
		    countMap.put("TOTAL_SUBMISSIONS", Integer.parseInt(logJSON.getString("TOTAL_SUBMISSIONS"))
			    + countMap.get("TOTAL_SUBMISSIONS"));
		    groupByMap.put(logJSON.getString(groupBy), countMap);

		}
		else
		{
		    views = 0;
		    subs = 0;
		    countMap = CampaignReportsUtil.getDefaultCountTable(barTypes);
		    views = views + Integer.parseInt(logJSON.getString("TOTAL_VIEWS"));
		    subs = subs + Integer.parseInt(logJSON.getString("TOTAL_SUBMISSIONS"));
		    countMap.put("TOTAL_VIEWS", views);
		    countMap.put("TOTAL_SUBMISSIONS", subs);
		    groupByMap.put(logJSON.getString(groupBy), countMap);
		}

	    }

	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}

	return groupByMap;
    }

}