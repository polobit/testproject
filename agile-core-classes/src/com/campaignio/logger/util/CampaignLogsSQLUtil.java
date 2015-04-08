package com.campaignio.logger.util;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.campaignio.wrapper.CampaignLogWrapper;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

/**
 * <code>CampaignLogsSQLUtil</code> is the SQL Utility class for campaign logs.
 * It provides SQL queries to insert, fetch and delete campaign logs
 * 
 * @author Naresh
 * 
 */
public class CampaignLogsSQLUtil
{

	/**
	 * Inserts obtained fields into campaign logs table.
	 * 
	 * @param domain
	 *            - Domain.
	 * @param campaignId
	 *            - Campaign Id.
	 * @param subscriberId
	 *            - Subscriber Id.
	 * @param logTime
	 *            - Log Time.
	 * @param message
	 *            - Log Message.
	 * @param type
	 *            - Log Type.
	 */
	public static void addToCampaignLogs(String domain, String campaignId, String campaignName, String subscriberId,
			String message, String type)
	{
		String insertToLogs = "INSERT INTO campaign_logs (domain, campaign_id, campaign_name, subscriber_id, log_time, message, log_type) VALUES("
				+ GoogleSQLUtil.encodeSQLColumnValue(domain)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(campaignId)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(campaignName)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(subscriberId)
				+ ",NOW()"
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(message) + "," + GoogleSQLUtil.encodeSQLColumnValue(type) + ")";

		System.out.println("Insert Query to CampaignLogs: " + insertToLogs);

		try
		{
			GoogleSQL.executeNonQuery(insertToLogs);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * Returns logs with respect to campaign-id or subscriber-id.
	 * 
	 * @param campaignId
	 *            - Campaign Id.
	 * @param subscriberId
	 *            - Subscriber Id.
	 * @param domain
	 *            - Domain
	 * @return JSONArray of logs.
	 */
	public static JSONArray getLogs(String campaignId, String subscriberId, String domain, String offset, String limit,
			String filterType)
	{
		String logs = "";
		if (StringUtils.isNotBlank(filterType))
		{
		    logs = "SELECT campaign_id,subscriber_id,message,log_time,log_type,campaign_name,UNIX_TIMESTAMP(log_time) AS time FROM campaign_logs WHERE "
			    + getWhereConditionOfLogs(campaignId,subscriberId, domain) + getFilterType(filterType)
			    + " ORDER BY log_time DESC" + GoogleSQLUtil.appendLimitToQuery(offset, limit);
		}
		else
		{
		    logs = "SELECT campaign_id,subscriber_id,message,log_time,log_type,campaign_name,UNIX_TIMESTAMP(log_time) AS time FROM campaign_logs WHERE log_type <> 'EMAIL_SLEEP' AND "
			    + getWhereConditionOfLogs(campaignId,subscriberId, domain) + " ORDER BY log_time DESC"
			    + GoogleSQLUtil.appendLimitToQuery(offset, limit);
		}

		try
		{
		    return GoogleSQL.getJSONQuery(logs);
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    return null;
		}
	}

	/**
	 * Deletes logs with respect to campaign.
	 * 
	 * @param campaignId
	 *            - Campaign id.
	 * @param domain
	 *            - Domain.
	 */
	public static void deleteLogsFromSQL(String campaignId, String subscriberId, String domain)
	{
		String deleteCampaignLogs = "DELETE FROM campaign_logs WHERE"
				+ getWhereConditionOfLogs(campaignId, subscriberId, domain);
		try
		{
			GoogleSQL.executeNonQuery(deleteCampaignLogs);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * Deletes logs with respect to campaign, subscriber and logtype.
	 * 
	 * @param campaignId
	 *            - Campaign id.
	 * @param subscriberId
	 *            - Subscriber id.
	 * @param domain
	 *            - Domain.
	 * @param logType
	 *            - campaign log type
	 */
	public static void deleteLogsFromSQL(String campaignId, String subscriberId, String domain, String logType)
	{
		String deleteCampaignLogs = "DELETE FROM campaign_logs WHERE"
				+ getWhereConditionOfLogs(campaignId, subscriberId, domain);

		if (!StringUtils.isEmpty(logType))
			deleteCampaignLogs += "AND log_type=" + GoogleSQLUtil.encodeSQLColumnValue(logType);

		try
		{
			GoogleSQL.executeNonQuery(deleteCampaignLogs);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * Returns where clause for campaign logs query.
	 * 
	 * @param campaignId
	 *            - campaignId.
	 * @param subscriberId
	 *            - subscriberId.
	 * @param domain
	 *            - domain.
	 * @return String
	 */
	private static String getWhereConditionOfLogs(String campaignId, String subscriberId, String domain)
	{
		String condition = null;

		if (!StringUtils.isEmpty(campaignId))
		{
			condition = " campaign_id = " + GoogleSQLUtil.encodeSQLColumnValue(campaignId);

			// If both are not null
			if (!StringUtils.isEmpty(subscriberId))
				return condition += " AND " + " subscriber_id = " + GoogleSQLUtil.encodeSQLColumnValue(subscriberId)
						+ " AND " + GoogleSQLUtil.appendDomainToQuery(domain);
		}

		if (!StringUtils.isEmpty(subscriberId))
			condition = " subscriber_id = " + GoogleSQLUtil.encodeSQLColumnValue(subscriberId);

		// if both campaignId and subscriberId are null
		if (StringUtils.isEmpty(campaignId) && StringUtils.isEmpty(subscriberId))
			return GoogleSQLUtil.appendDomainToQuery(domain);

		condition += " AND " + GoogleSQLUtil.appendDomainToQuery(domain);

		return condition;
	}

	/**
	 * Deletes logs based on domain from SQL.
	 * 
	 * @param namespace
	 *            - namespace.
	 */
	public static void deleteLogsBasedOnDomain(String namespace)
	{
		String deleteLogs = "DELETE FROM campaign_logs WHERE" + GoogleSQLUtil.appendDomainToQuery(namespace);

		try
		{
			GoogleSQL.executeNonQuery(deleteLogs);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	/**
	 * Appends filter type to logs query
	 * 
	 * @param logFilterType
	 *            - logFilterType like EMAIL_SENT
	 * @return String
	 */
	public static String getFilterType(String logFilterType)
	{
		// If logFilterType is empty
		if (StringUtils.isBlank(logFilterType))
			return "";

		return " AND log_type=" + GoogleSQLUtil.encodeSQLColumnValue(logFilterType);
	}

	/**
	 * Returns count of rows w.r.t log type
	 * 
	 * @param campaignId
	 *            - campaign id
	 * @param subscriberId
	 *            - subscriber id
	 * @param logType
	 *            - log type
	 * @param domain
	 *            - domain
	 * @return integer value
	 */
	public static int getCountByLogType(String campaignId, String subscriberId, String logType, String domain)
	{
		String logsCountQuery = "SELECT COUNT(*) FROM campaign_logs WHERE domain = "
				+ GoogleSQLUtil.encodeSQLColumnValue(domain) + " AND campaign_id = "
				+ GoogleSQLUtil.encodeSQLColumnValue(campaignId) + " AND subscriber_id = "
				+ GoogleSQLUtil.encodeSQLColumnValue(subscriberId) + " AND log_type="
				+ GoogleSQLUtil.encodeSQLColumnValue(logType);

		int count = 0;

		System.out.println("Count Query of logs by logtype: " + logsCountQuery);

		ResultSet rs = GoogleSQL.executeQuery(logsCountQuery);

		try
		{
			if (rs.next())
			{
				// Gets first column
				count = rs.getInt(1);
			}
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		finally
		{
			// Closes the Connection and ResultSet Objects
			GoogleSQL.closeResultSet(rs);
		}

		return count;
	}

	/**
	 * 
	 * @param log_type
	 * @param cursor
	 * @param page_size
	 * @return
	 */
	public static JSONArray getContactActivitiesLogs(String log_type, String cursor, String page_size)
	{
		String logs = null;
		String domain = NamespaceManager.get();

		if (log_type == null || ("All_Activities").equals(log_type))
		{

			String pageViewAliasTable = " ( SELECT url,ip,stats_time,email,"
					+ "NULL AS campaign_id,NULL AS subscriber_id ,NULL AS campaign_name,NULL AS log_time,NULL AS log_type, NULL AS message, UNIX_TIMESTAMP(stats_time) AS time"
					+ " FROM page_views AS pageViewAlias WHERE DOMAIN = '" + domain
					+ "' AND URL !='' AND EMAIL != '' ORDER BY stats_time DESC LIMIT "
					+ (Integer.parseInt(cursor) == 0 ? "20" : Integer.parseInt(cursor) + 20) + ") ";

			String campaignLogAliasTable = " ( SELECT NULL AS url,NULL AS ip,NULL AS stats_time,NULL AS email,"
					+ "campaign_id,subscriber_id,campaign_name,log_time,log_type,message,UNIX_TIMESTAMP(log_time) AS time "
					+ "FROM campaign_logs AS campaignLogsAlias WHERE DOMAIN = '"
					+ domain
					+ "' AND (log_type='EMAIL_OPENED' OR log_type='CLICK' OR log_type='UNSUBSCRIBED') ORDER BY log_time DESC LIMIT "
					+ (Integer.parseInt(cursor) == 0 ? "20" : Integer.parseInt(cursor) + 20) + ") ";

			logs = "SELECT url, ip, stats_time, email, campaign_id, subscriber_id, campaign_name, log_time, log_type, message, time"
					+ " from( "
					+ pageViewAliasTable
					+ " UNION ALL "
					+ campaignLogAliasTable
					+ " ) as ContactLogAlias ORDER BY TIME DESC LIMIT " + page_size + " OFFSET " + cursor;
		}

		else if (("PAGE_VIEWS").equals(log_type.toUpperCase()))
			logs = "SELECT url, ip, stats_time, email, UNIX_TIMESTAMP(stats_time) AS time FROM page_views "
					+ "WHERE email != '' AND url != '' AND domain = '" + domain + "' ORDER BY stats_time DESC LIMIT "
					+ page_size + "  OFFSET " + cursor;

		else
			logs = "SELECT campaign_id, subscriber_id, campaign_name, log_time, log_type,message, UNIX_TIMESTAMP(log_time) AS time FROM campaign_logs "
					+ " USE INDEX(domain_logtype_logtime_index) WHERE domain = '"
					+ domain
					+ "' AND log_type = '"
					+ log_type.toUpperCase() + "' ORDER BY time DESC LIMIT " + page_size + " OFFSET " + cursor;
		// change
		try
		{

			return GoogleSQL.getJSONQuery(logs);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	/**
	 * Returns logs with respect to both campaign and subscriber.
	 * 
	 * @param campaignId
	 *            - Campaign Id.
	 * @param subscriberId
	 *            - Subscriber Id.
	 * @param limit
	 *            - limit to get number of logs.
	 * @return logs array string.
	 */
	public static List<CampaignLogWrapper> getCampaignLogs(String campaignId, String subscriberId, String offset,String limit, String logType)
	{
		String domain = NamespaceManager.get();

		// For localhost
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			domain = "localhost";

		if (StringUtils.isEmpty(domain))
			return null;

		// To know SQL process time
		long startTime = System.currentTimeMillis();

		// get SQL logs
		JSONArray logs = CampaignLogsSQLUtil.getLogs(campaignId, subscriberId, domain, offset,limit, logType);

		long processTime = System.currentTimeMillis() - startTime;
		System.out.println("Process time for getting logs is " + processTime + "ms");

		if (logs == null)
			return null;

		try
		{
			// to attach contact and campaign-name to each log.
		    List<CampaignLogWrapper> logsList =  new ObjectMapper().readValue(logs.toString(), new TypeReference<List<CampaignLogWrapper>>()
			    {
			    });
		    if(logsList!=null && logsList.size()>0)
		    {
			CampaignLogWrapper lastLog = logsList.get(logsList.size() - 1);
			lastLog.cursor = (Integer.parseInt(offset) + Integer.parseInt(limit)) + "";
		    }
		    return logsList;
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    return null;
		}
	}

}