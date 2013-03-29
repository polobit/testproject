package com.agilecrm.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.appengine.api.rdbms.AppEngineDriver;

/**
 * <code>GoogleSQL</code> handles connection and runs queries of google cloud
 * sql. It establishes connection and runs the given queries.
 * 
 */
public class GoogleSQL
{
    /**
     * Establishes connection with Google Cloud SQL with instance name
     * 'agiledbs:agile' and database 'stats'.
     * 
     * @return connection object instance.
     */
    public static Connection GetConnection()
    {
	Connection conn = null;

	try
	{
	    DriverManager.registerDriver(new AppEngineDriver());
	    conn = DriverManager
		    .getConnection("jdbc:google:rdbms://agiledbs:agile/stats");
	}
	catch (Exception ex)
	{
	    System.out.println(" Error getting the connection object ");
	    ex.printStackTrace();
	}
	return conn;
    }

    /**
     * Executes the given SQL statement, which may be an INSERT, UPDATE, or
     * DELETE statement or an SQL statement that returns nothing, such as an SQL
     * DDL statement.
     * 
     * @param sql
     *            - sql statement.
     * @throws Exception
     *             throws SQLException
     */
    public static void executeNonQuery(String sql) throws Exception
    {
	Connection conn = null;
	int success;

	try
	{
	    // get the connection object
	    conn = GetConnection();
	    if (conn == null)
		return;

	    // creates the statement object
	    Statement stmt = conn.createStatement();

	    // Execute the query. Returns the row count.
	    success = stmt.executeUpdate(sql);

	    if (success == 1)
		System.out.println("Saved successfully");
	}
	catch (SQLException ex)
	{
	    System.out.println("Error in executing given query: " + ex);
	    ex.printStackTrace();
	}
	finally
	{
	    if (conn != null)
		try
		{
		    conn.close();
		}
		catch (SQLException e)
		{
		    e.printStackTrace();
		}
	}
    }

    /**
     * Inserts values into page_views table
     * 
     * @param domain
     *            - current namespace.
     * @param guid
     *            - guid.
     * @param email
     *            - email-id.
     * @param sid
     *            - sid.
     * @param url
     *            - url.
     * @param ip
     *            - ip address.
     * @param newOne
     *            - if new
     * @param ref
     *            -reference.
     * @param userAgent
     *            - userAgent header.
     * @param appHeader
     *            - appengine header values.
     * @param time
     *            - requested time.
     */
    public static void addToPageViews(String domain, String guid, String email,
	    String sid, String url, String ip, String newOne, String ref,
	    String userAgent, String country, String region, String city,
	    String cityLatLong, long time)
    {
	String insertToPageViews = "INSERT INTO page_views (domain,guid,email,sid,url,ip,new_one,ref,user_agent,country,region,city,city_lat_long,time) VALUES(\'"
		+ domain
		+ "\',\'"
		+ guid
		+ "\',\'"
		+ email
		+ "\',\'"
		+ sid
		+ "\',\'"
		+ url
		+ "\',\'"
		+ ip
		+ "\',"
		+ newOne
		+ ","
		+ ref
		+ ",\'"
		+ userAgent
		+ "\',\'"
		+ country
		+ "\',\'"
		+ region
		+ "\',\'" + city + "\',\'" + cityLatLong + "\'," + time + ")";

	System.out.println("Insert Query to PageViews: " + insertToPageViews);

	try
	{
	    executeNonQuery(insertToPageViews);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Gets all sessions from table having guids equal with given email
     * 
     * @param email
     *            - email-id
     */
    public static void getFromPageViews(String email)
    {
	// Gets Guids (clients) based on Email from database
	String guids = "(SELECT guid FROM page_views where email=\'" + email
		+ "\') g";

	System.out.println("guids query is: " + guids);

	// Gets all Sessions based on above obtained guids
	String pageViews = "SELECT * FROM page_views p," + guids
		+ " WHERE p.guid=g.guid";

	System.out.println("Select query: " + pageViews);

	try
	{
	    JSONArray arr = getJSONQuery(pageViews);
	    System.out.println("Sessions based on guids and email: " + arr);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Takes the query as input returns the ResultSet object.
     * 
     * @param query
     *            - sql query.
     * @return ResultSet Object.
     */
    public static ResultSet executeQuery(String query)
    {
	ResultSet rs = null;

	try
	{
	    // get the connection object
	    Connection conn = GetConnection();
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
    public static JSONArray getJSONQuery(String query) throws Exception
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
		    eachAgentJSON
			    .put(columnName, "" + rs.getString(columnName));
		}

		// place result data in agentDetailsArray
		agentDetailsArray.put(eachAgentJSON);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
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
}
