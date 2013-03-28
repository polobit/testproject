package com.agilecrm.googlesql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import com.google.appengine.api.rdbms.AppEngineDriver;

/**
 * <code>GoogleSQL</code> handles connection and runs queries of google cloud
 * sql. It establishes connection and runs the given query.
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
	int success = 2;

	try
	{
	    // get the connection object
	    conn = GetConnection();
	    if (conn == null)
		return;

	    // creates the statement object
	    Statement stmt = conn.createStatement();
	    // Execute the query
	    success = stmt.executeUpdate(sql);

	    if (success == 1)
		System.out.println("Saved successfully");
	    else if (success == 0)
		System.out.println("Not saved successfully");
	}
	catch (SQLException ex)
	{
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
}
