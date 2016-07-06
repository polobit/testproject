package com.agilecrm.db;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.mchange.v2.c3p0.ComboPooledDataSource;

/**
 * 
 * @author Ramesh Rudra
 * 
 *         This class handles connections to all campaign logs mysql severs.
 *         Depending on domain name we choose which mysql shard to use.
 */
public class GoogleSqlConnectionFetcher // implements Cloneable
{
    private static Pattern firstShardPattern = null;
    private static Pattern secondShardPattern = null;
    private static Pattern thirdShardPattern = null;
    
    private static ComboPooledDataSource cpds1 = null;
    private static ComboPooledDataSource cpds2 = null;
    private static ComboPooledDataSource cpds3 = null;
    private static ComboPooledDataSource sandbox_cpds = null;
    
    private static final String CLOUD_APP_ID = "agile-crm-cloud";
    private static final String SANDBOX_APP_ID = "agilecrmbeta";
    
    // private GoogleSqlConnectionFetcher()
    // {
    // firstShardPattern = Pattern.compile("^[A-M a-m]");
    // secondShardPattern = Pattern.compile("^[N-Z n-z]");
    // thirdShardPattern = Pattern.compile("^[O-Z o-z]");
    // }
    //
    // public static GoogleSqlConnectionFetcher getInstance()
    // {
    // return GoogleSqlConnectionFetherHolder.instance;
    // }
    
    static
    {
	firstShardPattern = Pattern.compile("^[A-E a-e]");
	secondShardPattern = Pattern.compile("^[F-N f-n]");
	thirdShardPattern = Pattern.compile("^[O-Z o-z]");
    }
    
    /**
     * Provides the connection to respective mysql shard. Depending on
     * application id we filters mysql shards.
     * 
     * @param appName
     * @param domain
     * @return
     * @throws Exception
     */
    public Connection getConntectionFromPool() throws SQLException, PropertyVetoException
    {
	Connection conn = null;
	String applicationId = SystemProperty.applicationId.get();
	String domain = NamespaceManager.get();
	
	if (StringUtils.isNotBlank(applicationId))
	{
	    if (StringUtils.equals(applicationId, CLOUD_APP_ID))
		conn = getSqlConnectionFromPool(domain);
	    else if (StringUtils.equals(applicationId, SANDBOX_APP_ID))
		conn = getSandboxConnectionFromPool();
	    else
		conn = getSqlConnectionFromPool(domain);
	}
	else
	{
	    // Get local mysql connection
	}
	return conn;
    }
    
    /**
     * Depending on domain name we decides which production shard to use.
     * 
     * @param domain
     * @return
     * @throws SQLException
     * @throws PropertyVetoException
     */
    private Connection getSqlConnectionFromPool(String domain) throws SQLException, PropertyVetoException
    {
	Connection conn = null;
	int shardNumber = getShardNumber(domain);
	switch (shardNumber)
	{
	case 1:
	    conn = getFirstShardConnectionFromPool();
	    break;
	case 2:
	    conn = getSecondShardConnectionFromPool();
	    break;
	case 3:
	    conn = getThirdShardConnectionFromPool();
	    break;
	}
	return conn;
    }
    
    // /**
    // * Provides connection to campaign logs sandbox mysql server.
    // *
    // * @param domain
    // * @return
    // * @throws SQLException
    // * @throws PropertyVetoException
    // */
    // private Connection getSandboxConnectionFromPool(String domain) throws
    // SQLException, PropertyVetoException
    // {
    // Connection conn = null;
    // // return getSandboxSqlServerConnectionFromPool();
    // int shardNumber = getShardNumber(domain);
    // switch (shardNumber)
    // {
    // case 1:
    // conn = getSandboxFirstShardConnectionFromPool();
    // break;
    // case 2:
    // conn = getSandboxSecondShardConnectionFromPool();
    // break;
    // }
    // return conn;
    // }
    
    /**
     * 
     * Returns the connection to respective mysql shard. Based on domain name we
     * decide which mysql shard to use for read/write operations.Operations from
     * GCE/EC2 machines uses this method to get the connection. Maintains
     * connection pool.
     * 
     * @param appName
     * @param domain
     * @return
     */
    public Connection getConnection()
    {
	
	Connection conn = null;
	String applicationId = SystemProperty.applicationId.get();
	String domain = NamespaceManager.get();
	
	if (StringUtils.isNotBlank(applicationId))
	{
	    if (StringUtils.equals(applicationId, CLOUD_APP_ID))
		conn = getSqlConnection(domain);
	    else if (StringUtils.equals(applicationId, SANDBOX_APP_ID))
		conn = getSandboxSqlConnection();
	    else
		conn = getSqlConnection(domain);
	}
	else
	{
	    // Get local mysql connection
	}
	return conn;
    }
    
    /**
     * Returns the connection to respective mysql shard. Based on domain name we
     * decide which mysql shard to use for read/write operations.Operations from
     * GAE machines uses this method to get the connection.
     * 
     * 
     * @param domain
     * @return
     */
    private Connection getSqlConnection(String domain)
    {
	Connection conn = null;
	int shardNumber = getShardNumber(domain);
	switch (shardNumber)
	{
	case 1:
	    conn = getFirstShardConnection();
	    break;
	case 2:
	    conn = getSecondShardConnection();
	    break;
	case 3:
	    conn = getThirdShardConnection();
	    break;
	}
	return conn;
    }
    
    // private Connection getSandboxSqlConnection(String domain)
    // {
    // Connection conn = null;
    // int shardNumber = getShardNumber(domain);
    // switch (shardNumber)
    // {
    // case 1:
    // conn = getSandboxSqlServerConnection();
    // break;
    // case 2:
    // conn = getSandboxSecondShardConnection();
    // break;
    // }
    // // return getSandboxSqlServerConnection();
    // return conn;
    // }
    
    private Connection getSandboxSqlServerConnection()
    {
	String url = null;
	Connection conn = null;
	
	try
	{
	    if (SystemProperty.environment.value() != null
		    && SystemProperty.environment.value() != SystemProperty.Environment.Value.Development)
	    {
		// Load the class that provides the new "jdbc:google:mysql://"
		// prefix.
		Class.forName("com.mysql.jdbc.GoogleDriver");
		url = "jdbc:google:mysql://agiledbs:campaign-logs-sandbox/stats2?user=root&password=sqlrocks123";
		System.out.println("Google sql url is " + url);
	    }
	    else
	    {
		Class.forName("com.mysql.jdbc.Driver");
		url = "jdbc:mysql://localhost:3306/stats?user=root&password=mysql123";
		// Alternatively, connect to a Google Cloud SQL instance using:
		// jdbc:mysql://ip-address-of-google-cloud-sql-instance:3306/guestbook?user=root
	    }
	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}
	
	try
	{
	    System.out.println("The connection url is  " + url);
	    Long startTime = System.currentTimeMillis();
	    conn = DriverManager.getConnection(url);
	    System.out.println(conn.isClosed());
	    System.out.println("Time taken to get sql connection  : " + (System.currentTimeMillis() - startTime));
	}
	catch (Exception ex)
	{
	    System.out.println(" Error getting the connection object " + ex.getMessage());
	    ex.printStackTrace();
	}
	
	return conn;
    }
    
    // private Connection getSandboxSqlServerConnectionFromPool() throws
    // SQLException, PropertyVetoException
    // {
    // // if (SystemProperty.environment.value() != null
    // // && SystemProperty.environment.value() !=
    // // SystemProperty.Environment.Value.Development)
    // // {
    // // return getGoogleSQLConnection();
    // // }
    //
    // String url =
    // "jdbc:mysql://173.194.84.175:3306/stats?user=root&password=mysql123";
    //
    // if (cpds1 != null)
    // return cpds1.getConnection();
    //
    // Properties property = new Properties(System.getProperties());
    // property.put("com.mchange.v2.log.MLog", "log4j");
    // property.put("autoReconnect", "true");
    //
    // // property.put("com.mchange.v2.log.FallbackMLog.DEFAULT_CUTOFF_LEVEL",
    // // "OFF");
    // System.setProperties(property);
    // cpds1 = new ComboPooledDataSource();
    // cpds1.setDataSourceName("stats2");
    // cpds1.setDriverClass("com.mysql.jdbc.Driver");
    // // loads the jdbc driver
    // //
    // cpds.setJdbcUrl("jdbc:mysql://localhost:3306/stats?user=root&password=mysql123");
    // // jdbc:mysql://localhost:3306/stats?user=root&password=mysql123
    // cpds1.setJdbcUrl(url);
    // // cpds.setUser("root");
    // // firstShardConnectionPool.setPassword("mysql123");
    //
    // cpds1.setProperties(property);
    //
    // // the settings below are optional -- c3p0 can work with defaults
    // cpds1.setMinPoolSize(2);
    // cpds1.setAcquireIncrement(2);
    // cpds1.setMaxPoolSize(10);
    // cpds1.setMaxIdleTime(1200000); // In milli-seconds
    // System.out.println(cpds1.getMaxIdleTime());
    // System.out.println(cpds1.getMaxStatementsPerConnection());
    // System.out.println(cpds1.getMaxIdleTime());
    // return cpds1.getConnection();
    // }
    
    /***
     * Matches the domain name pattern and Returns the MySql instance shard
     * number
     * 
     * @param domain
     * @return
     */
    private int getShardNumber(String domain)
    {
	// if domain unrecognized by our pattern we uses third shard as default.
	int shardNumber = 3;
	Matcher matcher1 = firstShardPattern.matcher(domain);
	Matcher matcher2 = secondShardPattern.matcher(domain);
	Matcher matcher3 = thirdShardPattern.matcher(domain);
	if (matcher1.find())
	{
	    shardNumber = 1;
	    return shardNumber;
	}
	else if (matcher2.find())
	{
	    shardNumber = 2;
	    return shardNumber;
	}
	else if (matcher3.find())
	{
	    shardNumber = 3;
	    return shardNumber;
	}
	return shardNumber;
    }
    
    private Connection getFirstShardConnectionFromPool() throws PropertyVetoException, SQLException
    {
	
	String url = "jdbc:mysql://173.194.233.191:3306/stats?user=root&password=sqlrocks123";
	
	if (cpds1 != null)
	    return cpds1.getConnection();
	
	Properties property = new Properties(System.getProperties());
	property.put("com.mchange.v2.log.MLog", "log4j");
	property.put("autoReconnect", "true");
	
	// property.put("com.mchange.v2.log.FallbackMLog.DEFAULT_CUTOFF_LEVEL",
	// "OFF");
	System.setProperties(property);
	cpds1 = new ComboPooledDataSource();
	cpds1.setDataSourceName("stats2");
	cpds1.setDriverClass("com.mysql.jdbc.Driver");
	// loads the jdbc driver
	// cpds.setJdbcUrl("jdbc:mysql://localhost:3306/stats?user=root&password=mysql123");
	// jdbc:mysql://localhost:3306/stats?user=root&password=mysql123
	cpds1.setJdbcUrl(url);
	// cpds.setUser("root");
	// firstShardConnectionPool.setPassword("mysql123");
	
	cpds1.setProperties(property);
	
	// the settings below are optional -- c3p0 can work with defaults
	cpds1.setMinPoolSize(2);
	cpds1.setAcquireIncrement(2);
	cpds1.setMaxPoolSize(10);
	cpds1.setMaxIdleTime(1200000); // In milli-seconds
	System.out.println(cpds1.getMaxIdleTime());
	System.out.println(cpds1.getMaxStatementsPerConnection());
	System.out.println(cpds1.getMaxIdleTime());
	return cpds1.getConnection();
    }
    
    private Connection getSecondShardConnectionFromPool() throws SQLException, PropertyVetoException
    {
	
	String url = "jdbc:mysql://173.194.228.39:3306/stats?user=root&password=sqlrocks123";
	
	if (cpds2 != null)
	    return cpds2.getConnection();
	
	Properties property = new Properties(System.getProperties());
	property.put("com.mchange.v2.log.MLog", "log4j");
	property.put("autoReconnect", "true");
	
	// property.put("com.mchange.v2.log.FallbackMLog.DEFAULT_CUTOFF_LEVEL",
	// "OFF");
	System.setProperties(property);
	cpds2 = new ComboPooledDataSource();
	cpds2.setDataSourceName("stats2");
	cpds2.setDriverClass("com.mysql.jdbc.Driver");
	// loads the jdbc driver
	// cpds.setJdbcUrl("jdbc:mysql://localhost:3306/stats?user=root&password=mysql123");
	// jdbc:mysql://localhost:3306/stats?user=root&password=mysql123
	cpds2.setJdbcUrl(url);
	// cpds.setUser("root");
	// firstShardConnectionPool.setPassword("mysql123");
	
	cpds2.setProperties(property);
	
	// the settings below are optional -- c3p0 can work with defaults
	cpds2.setMinPoolSize(2);
	cpds2.setAcquireIncrement(2);
	cpds2.setMaxPoolSize(10);
	cpds2.setMaxIdleTime(1200000); // In milli-seconds
	System.out.println(cpds2.getMaxIdleTime());
	System.out.println(cpds2.getMaxStatementsPerConnection());
	System.out.println(cpds2.getMaxIdleTime());
	return cpds2.getConnection();
    }
    
    private Connection getThirdShardConnectionFromPool() throws SQLException, PropertyVetoException
    {
	String url = "jdbc:mysql://173.194.232.240:3306/stats?user=root&password=sqlrocks123";
	
	if (cpds3 != null)
	    return cpds3.getConnection();
	
	Properties property = new Properties(System.getProperties());
	property.put("com.mchange.v2.log.MLog", "log4j");
	property.put("autoReconnect", "true");
	
	// property.put("com.mchange.v2.log.FallbackMLog.DEFAULT_CUTOFF_LEVEL",
	// "OFF");
	System.setProperties(property);
	cpds3 = new ComboPooledDataSource();
	cpds3.setDataSourceName("stats2");
	cpds3.setDriverClass("com.mysql.jdbc.Driver");
	// loads the jdbc driver
	// cpds.setJdbcUrl("jdbc:mysql://localhost:3306/stats?user=root&password=mysql123");
	// jdbc:mysql://localhost:3306/stats?user=root&password=mysql123
	cpds3.setJdbcUrl(url);
	// cpds.setUser("root");
	// firstShardConnectionPool.setPassword("mysql123");
	
	cpds3.setProperties(property);
	
	// the settings below are optional -- c3p0 can work with defaults
	cpds3.setMinPoolSize(2);
	cpds3.setAcquireIncrement(2);
	cpds3.setMaxPoolSize(10);
	cpds3.setMaxIdleTime(1200000); // In milli-seconds
	System.out.println(cpds3.getMaxIdleTime());
	System.out.println(cpds3.getMaxStatementsPerConnection());
	System.out.println(cpds3.getMaxIdleTime());
	return cpds3.getConnection();
    }
    
    private Connection getFirstShardConnection()
    {
	String url = null;
	Connection conn = null;
	
	try
	{
	    if (SystemProperty.environment.value() != null
		    && SystemProperty.environment.value() != SystemProperty.Environment.Value.Development)
	    {
		// Load the class that provides the new "jdbc:google:mysql://"
		// prefix.
		Class.forName("com.mysql.jdbc.GoogleDriver");
		url = "jdbc:google:mysql://agiledbs:campaign-logs-shard-1/stats2?user=root&password=sqlrocks123";
		System.out.println("Google sql url is " + url);
	    }
	    else
	    {
		Class.forName("com.mysql.jdbc.Driver");
		url = "jdbc:mysql://localhost:3306/stats?user=root&password=mysql123";
		// Alternatively, connect to a Google Cloud SQL instance using:
		// jdbc:mysql://ip-address-of-google-cloud-sql-instance:3306/guestbook?user=root
	    }
	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}
	
	try
	{
	    System.out.println("The connection url is  " + url);
	    Long startTime = System.currentTimeMillis();
	    conn = DriverManager.getConnection(url);
	    System.out.println(conn.isClosed());
	    System.out.println("Time taken to get sql connection  : " + (System.currentTimeMillis() - startTime));
	}
	catch (Exception ex)
	{
	    System.out.println(" Error getting the connection object " + ex.getMessage());
	    ex.printStackTrace();
	}
	
	return conn;
    }
    
    private Connection getSecondShardConnection()
    {
	String url = null;
	Connection conn = null;
	
	try
	{
	    if (SystemProperty.environment.value() != null
		    && SystemProperty.environment.value() != SystemProperty.Environment.Value.Development)
	    {
		// Load the class that provides the new "jdbc:google:mysql://"
		// prefix.
		Class.forName("com.mysql.jdbc.GoogleDriver");
		url = "jdbc:google:mysql://agiledbs:campaign-logs-shard-2/stats2?user=root&password=sqlrocks123";
		System.out.println("Google sql url is " + url);
	    }
	    else
	    {
		Class.forName("com.mysql.jdbc.Driver");
		url = "jdbc:mysql://localhost:3306/stats?user=root&password=mysql123";
		// Alternatively, connect to a Google Cloud SQL instance using:
		// jdbc:mysql://ip-address-of-google-cloud-sql-instance:3306/guestbook?user=root
	    }
	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}
	
	try
	{
	    System.out.println("The connection url is  " + url);
	    Long startTime = System.currentTimeMillis();
	    conn = DriverManager.getConnection(url);
	    System.out.println(conn.isClosed());
	    System.out.println("Time taken to get sql connection  : " + (System.currentTimeMillis() - startTime));
	}
	catch (Exception ex)
	{
	    System.out.println(" Error getting the connection object " + ex.getMessage());
	    ex.printStackTrace();
	}
	
	return conn;
    }
    
    private Connection getThirdShardConnection()
    {
	String url = null;
	Connection conn = null;
	
	try
	{
	    if (SystemProperty.environment.value() != null
		    && SystemProperty.environment.value() != SystemProperty.Environment.Value.Development)
	    {
		// Load the class that provides the new "jdbc:google:mysql://"
		// prefix.
		Class.forName("com.mysql.jdbc.GoogleDriver");
		url = "jdbc:google:mysql://agiledbs:campaign-logs-shard-3/stats2?user=root&password=sqlrocks123";
		System.out.println("Google sql url is " + url);
	    }
	    else
	    {
		Class.forName("com.mysql.jdbc.Driver");
		url = "jdbc:mysql://localhost:3306/stats?user=root&password=mysql123";
		// Alternatively, connect to a Google Cloud SQL instance using:
		// jdbc:mysql://ip-address-of-google-cloud-sql-instance:3306/guestbook?user=root
	    }
	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}
	
	try
	{
	    System.out.println("The connection url is  " + url);
	    Long startTime = System.currentTimeMillis();
	    conn = DriverManager.getConnection(url);
	    System.out.println(conn.isClosed());
	    System.out.println("Time taken to get sql connection  : " + (System.currentTimeMillis() - startTime));
	}
	catch (Exception ex)
	{
	    System.out.println(" Error getting the connection object " + ex.getMessage());
	    ex.printStackTrace();
	}
	
	return conn;
    }
    
    /**
     * This method is responsible for creating the connection to sandbox mysql
     * server. It uses connection pool mechanism.
     * 
     * @return
     * @throws PropertyVetoException
     * @throws SQLException
     */
    private Connection getSandboxConnectionFromPool() throws PropertyVetoException, SQLException
    {
	String url = "jdbc:mysql://173.194.107.65:3306/stats2?user=root&password=sqlrocks123";
	
	if (sandbox_cpds != null)
	    return sandbox_cpds.getConnection();
	
	Properties property = new Properties(System.getProperties());
	property.put("com.mchange.v2.log.MLog", "log4j");
	property.put("autoReconnect", "true");
	
	// property.put("com.mchange.v2.log.FallbackMLog.DEFAULT_CUTOFF_LEVEL",
	// "OFF");
	System.setProperties(property);
	sandbox_cpds = new ComboPooledDataSource();
	sandbox_cpds.setDataSourceName("stats2");
	sandbox_cpds.setDriverClass("com.mysql.jdbc.Driver");
	// loads the jdbc driver
	// cpds.setJdbcUrl("jdbc:mysql://localhost:3306/stats?user=root&password=mysql123");
	// jdbc:mysql://localhost:3306/stats?user=root&password=mysql123
	sandbox_cpds.setJdbcUrl(url);
	// cpds.setUser("root");
	// firstShardConnectionPool.setPassword("mysql123");
	
	sandbox_cpds.setProperties(property);
	
	// the settings below are optional -- c3p0 can work with defaults
	sandbox_cpds.setMinPoolSize(2);
	sandbox_cpds.setAcquireIncrement(2);
	sandbox_cpds.setMaxPoolSize(10);
	sandbox_cpds.setMaxIdleTime(1200000); // In milli-seconds
	System.out.println(sandbox_cpds.getMaxIdleTime());
	System.out.println(sandbox_cpds.getMaxStatementsPerConnection());
	System.out.println(sandbox_cpds.getMaxIdleTime());
	return sandbox_cpds.getConnection();
    }
    
    /**
     * This method is responsible for creating the connection to sandbox mysql
     * server.
     * 
     * @return
     */
    private Connection getSandboxSqlConnection()
    {
	String url = null;
	Connection conn = null;
	
	try
	{
	    if (SystemProperty.environment.value() != null
		    && SystemProperty.environment.value() != SystemProperty.Environment.Value.Development)
	    {
		// Load the class that provides the new "jdbc:google:mysql://"
		// prefix.
		Class.forName("com.mysql.jdbc.GoogleDriver");
		url = "jdbc:google:mysql://agiledbs:campaign-logs-sandbox/stats2?user=root&password=sqlrocks123";
		System.out.println("Google sql url is " + url);
	    }
	    else
	    {
		Class.forName("com.mysql.jdbc.Driver");
		url = "jdbc:mysql://localhost:3306/stats2?user=ramesh&password=ramesh123";
		// Alternatively, connect to a Google Cloud SQL instance using:
		// jdbc:mysql://ip-address-of-google-cloud-sql-instance:3306/guestbook?user=root
		
		// Class.forName("com.mysql.jdbc.GoogleDriver");
		// url =
		// "jdbc:google:mysql://agiledbs:campaign-logs-sandbox-2/stats2?user=root";
		// System.out.println("Google sql url is " + url);
	    }
	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}
	
	try
	{
	    System.out.println("The connection url is  " + url);
	    Long startTime = System.currentTimeMillis();
	    conn = DriverManager.getConnection(url);
	    System.out.println(conn.isClosed());
	    System.out.println("Time taken to get sql connection  : " + (System.currentTimeMillis() - startTime));
	}
	catch (Exception ex)
	{
	    System.out.println(" Error getting the connection object " + ex.getMessage());
	    ex.printStackTrace();
	}
	
	return conn;
    }
    
    // private static final class GoogleSqlConnectionFetherHolder
    // {
    // private static final GoogleSqlConnectionFetcher instance = new
    // GoogleSqlConnectionFetcher();
    // }
    //
    // public GoogleSqlConnectionFetcher clone() throws
    // CloneNotSupportedException
    // {
    // throw new
    // CloneNotSupportedException("Google sql connection fetcher is a singleton class");
    // }
    
}
