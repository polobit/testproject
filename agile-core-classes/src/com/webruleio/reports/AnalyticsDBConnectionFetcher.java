package com.webruleio.reports;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.mysql.jdbc.Statement;

public class AnalyticsDBConnectionFetcher {

	public static final String PRODUCTION_APP_ID = "agile-crm-cloud";
	public static final String SANDBOX_APP_ID = "agilecrmbeta";
	private static final String URL = "jdbc:google:mysql://agiledbs:campaign-logs-sandbox/stats2?user=root&password=sqlrocks123";
	
	//public enum  

	// public = "agilecrmbtea"

	public Connection getConnection() {
		Connection conn = null;
		String applicationId = VersioningUtil.getApplicationAPPId();
		if (StringUtils.isNotBlank(applicationId)) {
			/*if (StringUtils.equals(applicationId, PRODUCTION_APP_ID))
				conn = getSQLConnection(URL);
			else */
			    if (StringUtils.equals(applicationId, SANDBOX_APP_ID))
				conn = getSQLConnection(URL);
		}
		return conn;
	}

	private Connection getSQLConnection(String serverURL) {
		String url = null;
		Connection conn = null;

		try {
			if (SystemProperty.environment.value() != null
					&& SystemProperty.environment.value() != SystemProperty.Environment.Value.Development) {
				// Load the class that provides the new "jdbc:google:mysql://"
				// prefix.
				Class.forName("com.mysql.jdbc.GoogleDriver");
				url = serverURL;
				System.out.println("Google sql url is " + url);
			} else {
				Class.forName("com.mysql.jdbc.Driver");
				url = "jdbc:mysql://localhost:3306/stats3?user=root&password=mysql123";
				// Alternatively, connect to a Google Cloud SQL instance using:
				// jdbc:mysql://ip-address-of-google-cloud-sql-instance:3306/guestbook?user=root
			}
		} catch (Exception e) {
			System.err.println(e.getMessage());
		}

		try {
			System.out.println("The connection url is  " + url);
			Long startTime = System.currentTimeMillis();
			conn = DriverManager.getConnection(url);
			System.out.println(conn.isClosed());
			System.out.println("Time taken to get sql connection  : "
					+ (System.currentTimeMillis() - startTime));
		} catch (Exception ex) {
			System.out.println(" Error getting the connection object "
					+ ex.getMessage());
			ex.printStackTrace();
		}

		return conn;
	}
}
