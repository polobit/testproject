package com.agilecrm.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.appengine.api.utils.SystemProperty;

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
	public static Connection getGoogleSQLConnection()
	{

		String url = null;

		try
		{
			if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
			{
				// Load the class that provides the new "jdbc:google:mysql://"
				// prefix.
				Class.forName("com.mysql.jdbc.GoogleDriver");
				url = "jdbc:google:mysql://agiledbs:agile/stats?user=root";

				System.out.println("Google sql url is " + url);
			}
			else
			{
				// Local MySQL instance to use during development.
				Class.forName("com.mysql.jdbc.Driver");
				url = "jdbc:mysql://localhost:3306/stats?user=root&password=mysql123";

				// Alternatively, connect to a Google Cloud SQL instance using:
				// jdbc:mysql://ip-address-of-google-cloud-sql-instance:3306/guestbook?user=root
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		Connection conn = null;

		try
		{
			System.out.println("The connection url is  " + url);

			conn = DriverManager.getConnection(url);
		}
		catch (Exception ex)
		{
			System.out.println(" Error getting the connection object " + ex.getMessage());
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
		int rowCount;

		try
		{
			// get the connection object
			conn = getGoogleSQLConnection();
			if (conn == null)
				return;

			// creates the statement object
			Statement stmt = conn.createStatement();

			// Execute the query. Returns the row count for INSERT, DELETE and
			// UPDATE or 0 for other statements
			rowCount = stmt.executeUpdate(sql);

			System.out.println("Number of rows affected in SQL by DML statement: " + rowCount);
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
			Connection conn = getGoogleSQLConnection();
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
					eachAgentJSON.put(columnName, "" + rs.getString(columnName));
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