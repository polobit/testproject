package com.agilecrm.imap;

import java.io.IOException;
import java.security.Provider;
import java.security.Security;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

import javax.mail.Flags;
import javax.mail.Flags.Flag;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.URLName;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.imap.IMAPStoreWrapper;
import com.agilecrm.imap.OAuth2Authenticator;
import com.sun.mail.imap.IMAPFolder;
import com.sun.mail.imap.IMAPSSLStore;
import com.sun.mail.imap.IMAPStore;
import com.sun.xml.internal.messaging.saaj.packaging.mime.MessagingException;

@SuppressWarnings("serial")
public class IMAPServlet extends HttpServlet
{
    public static final String SERVER_RESPONSE_STATUS = "status";
    public static final String SERVER_RESPONSE_STATUS_SUCCESS = "success";
    public static final String SERVER_RESPONSE_STATUS_RESPONSE = "response";
    public static final String SERVER_RESPONSE_STATUS_ERROR = "error";
    public static final String SERVER_RESPONSE_STATUS_ERROR_MESSG = "errormssg";

    static
    {
	Security.addProvider(new XoauthProvider());
    }

    private Map<String, IMAPStoreWrapper> cacheMap = new ConcurrentHashMap<String, IMAPStoreWrapper>();

    private int REQUEST_LIMIT;

    private int CONNECTION_CACHE_TIME_LIMIT;

    private int requestCount;

    public void init() throws ServletException
    {
	cacheMap = new ConcurrentHashMap<String, IMAPStoreWrapper>();
	requestCount = 0;
	REQUEST_LIMIT = 25;
	CONNECTION_CACHE_TIME_LIMIT = 3600000;
    }

    public static IMAPStore getGmailOAuthStore(String host, int port, String userEmail, String oauthToken,
	    String oauthTokenSecret, String consumerKey, String consumerSecret) throws Exception
    {
	Properties props = new Properties();
	props.put("mail.imaps.sasl.enable", "true");
	props.put("mail.imaps.sasl.mechanisms", "XOAUTH");
	props.put("mail.imaps.sasl.mechanisms.xoauth.oauthToken", oauthToken);
	props.put("mail.imaps.sasl.mechanisms.xoauth.oauthTokenSecret", oauthTokenSecret);
	props.put("mail.imaps.sasl.mechanisms.xoauth.consumerKey", consumerKey);
	props.put("mail.imaps.sasl.mechanisms.xoauth.consumerSecret", consumerSecret);
	Session session = Session.getInstance(props);

	URLName unusedUrlName = null;

	IMAPSSLStore store = new IMAPSSLStore(session, unusedUrlName);
	// String emptyPassword = "";
	store.connect(host, port, userEmail, "");
	return store;
    }

    public IMAPStore getStore(String serverName, String userName, String password, int port) throws Exception
    {

	// Cache map key
	String key = getKey(serverName, userName, password);

	// Get IMAPStoreWrapper
	IMAPStoreWrapper storeWrapper = cacheMap.get(key);

	IMAPStore store = null;

	// If exists in cachemap
	if (storeWrapper != null)
	{
	    store = storeWrapper.getStore();

	    storeWrapper.setLastUsedTime(System.currentTimeMillis());

	    if (store != null)
	    {
		if (store.isConnected())
		{
		    System.out.println("Returning store from map...");
		    return store;
		}
		else
		{
		    store.connect();

		    if (store.isConnected())
			return store;
		    else
			store.close();
		}
	    }
	}

	Properties props = System.getProperties();

	if (port == 143)
	{
	    props.setProperty("mail.store.protocol", "imap");
	    props.put("mail.imap.ssl.enable", "false");
	}
	else
	{
	    props.setProperty("mail.store.protocol", "imaps");
	    props.put("mail.imap.ssl.enable", "true");
	}

	if (port != -1)
	{
	    props.setProperty("mail.store.port", port + "");
	}

	// IMAPStore connection pool
	props.setProperty("mail.imap.connectionpoolsize", "1");
	props.setProperty("mail.imap.connectionpooltimeout", "300000");

	Session session = Session.getInstance(props, null);
	//session.setDebug(true);

	store = (IMAPStore) session.getStore("imap");

	long startTime = System.currentTimeMillis();
	store.connect(serverName, userName, password);
	System.out.println("Time to connect IMAP Store is " + (System.currentTimeMillis() - startTime));

	// Add to cache map
	addStoreToCacheMap(key, store);

	System.out.println("CacheMap size is " + cacheMap.size());

	return store;
    }

    public static JSONArray getGmailEmailsUsingOAuth(String host, int port, String userEmail, String oauthToken,
	    String oauthTokenSecret, String consumerKey, String consumerSecret, String searchEmail,
	    String searchEmailSubject, int offset, int count,String folderNames, String search_content) throws Exception
    {
	IMAPStore store = getGmailOAuthStore(host, port, userEmail, oauthToken, oauthTokenSecret, consumerKey,
	        consumerSecret);
	return searchEmailsFromStore(store, searchEmail, searchEmailSubject, offset, count, folderNames, search_content);
    }

    public static JSONArray getGmailEmailsUsingOAuth2(String host, int port, String userEmail, String oauthToken,
	    String searchEmail, String searchEmailSubject, int offset, int count,String folderNames, String search_content) throws Exception
    {
	// Store store = getGmailOAuth2Store(host, port, userEmail, oauthToken);
	IMAPStore store = OAuth2Authenticator.connectToImap(host, port, userEmail, oauthToken, true);
	return searchEmailsFromStore(store, searchEmail, searchEmailSubject, offset, count, folderNames, search_content);

    }

    public JSONArray getIMAPEmails(String serverName, int port, String userName, String password, String searchEmail,
	    String searchEmailSubject, int offset, int count, String folderNames, String search_content) throws Exception
    {
	IMAPStore store = getStore(serverName, userName, password, port);

	return searchEmailsFromStore(store, searchEmail, searchEmailSubject, offset, count, folderNames, search_content);

    }

    public JSONArray getIMAPFolders(String serverName, int port, String userName, String password)
    {
	JSONArray folders = null;
	try
	{
	    IMAPStore store = getStore(serverName, userName, password, port);
	    folders = IMAPUtil.getAllFolders(store);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	return folders;
    }

    public static JSONArray searchEmailsFromStore(IMAPStore store, String searchEmail, String searchEmailSubject,
	    int offset, int count, String folderNames, String search_content) throws Exception
    {
	JSONArray searchResults = new JSONArray();
	List<IMAPFolder> folders = null;
	try
	{
	    folders = IMAPUtil.getListOfFolders(store, folderNames);
	    List<Message> allItems = new ArrayList<Message>();
	    for (IMAPFolder folder : folders)
	    {
		Message[] items = IMAPUtil.searchMessagesInFolder(folder, searchEmail, searchEmailSubject, count,
		        offset,search_content);
		for (Message message : items)
		    allItems.add(message);
	    }
	    Iterator<Message> iterator = allItems.iterator();
	    while (iterator.hasNext())
	    {
		Message msg = iterator.next();
		if (msg == null || msg.getSentDate() == null)
		    iterator.remove();
	    }
	    //Collections.sort(allItems, new SentDateComparator());
	    searchResults = IMAPUtil.getMessages(allItems, count, offset);
	}
	catch (Exception e)
	{
	    System.out.println("Exception occured while searching emails from store..." + e.getMessage());
	    throw e;
	}
	finally
	{
	    if (folders != null)
	    {
		for (int i = 0; i < folders.size(); i++)
		{
		    IMAPFolder folder = folders.get(i);
		    if (folder != null)
			folder.close(false);
		}
	    }
	}
	return searchResults;
    }

    public static void checkParameters(HttpServletRequest req, HttpServletResponse resp, String[] parameters)
	    throws Exception
    {
	for (int index = 0; index < parameters.length; index++)
	{
	    String parameter = req.getParameter(parameters[index]);
	    if ((parameter == null) || (parameter.length() == 0))
	    {
		throw new Exception("invalid response " + parameters[index] + " Not found.");
	    }
	}
    }

    public static void sendResponse(HttpServletRequest req, HttpServletResponse resp, JSONObject responseJSON)
	    throws Exception
    {
	String callback = req.getParameter("callback");
	if (callback == null)
	{
	    resp.getWriter().println(responseJSON);
	}
	else
	{
	    resp.getWriter().println(callback + "(" + responseJSON + ")");
	}
    }

    public void service(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
	// Count requests
	synchronized (this)
	{
	    requestCount++;
	}

	String USER_NAME = "user_name";
	String SEARCH_EMAIL = "search_email";
	String SEARCH_EMAIL_SUBJECT = "search_email_subject";
	String HOST = "host";
	String PORT = "port";
	String OFFSET = "offset";
	String COUNT = "count";
	String COMMAND = "command";
	String COMMAND_OAUTH_EMAIL = "oauth_email";
	String OAUTH_EMAIL_CONSUMER_KEY = "consumer_key";
	String OAUTH_EMAIL_CONSUMER_SECRET = "consumer_secret";
	String OAUTH_EMAIL_OAUTH_KEY = "oauth_key";
	String OAUTH_EMAIL_OAUTH_SECRET = "oauth_secret";
	String COMMAND_IMAP_EMAIL = "imap_email";
	String IMAP_PASSWORD = "password";

	// Set the response to UTF8
	resp.setContentType("text/plain; charset=utf-8");

	try
	{
	    String fetchItems = req.getParameter("fetch_items");
	    String userName = req.getParameter("user_name");
	    String host = req.getParameter("host");
	    String port = req.getParameter("port");
	    String search_email = req.getParameter("search_email");
	    String search_content = req.getParameter("search_content");
	    String flagset = req.getParameter("flag");
	    String folderNames = req.getParameter("folder_names");
	    String messnum = req.getParameter("mesnum");
	    int[] msgnums = new int[0];
	    if(messnum != null && !messnum.equals("") && messnum !=""){
	    	String[] mesnum = messnum.split(",");
	    	msgnums = new int[mesnum.length];
	    	for(int i=0;i<mesnum.length;i++){
	    		msgnums[i] = Integer.parseInt(mesnum[i].trim());
	    	}
	    }
	    if(StringUtils.isBlank(fetchItems))
	    {
	    	fetchItems = "mails";
	    }
	    if (StringUtils.isNotBlank(fetchItems) && fetchItems.equalsIgnoreCase("mails"))
	    {
		//Getting mails

	    	if(flagset != null && flagset !="" && !flagset.equals("")){
	    		
	    	}else{
		    	if(search_email != null){
		    		checkParameters(req, resp, new String[] { "user_name", "search_email", "host", "port", "offset",
			        "count", "command" });
		    	}else{
		    		checkParameters(req, resp, new String[] { "user_name","host", "port", "offset",
		    		        "count", "command" });
		    	}
	    	}
		String searchEmail = req.getParameter(SEARCH_EMAIL);
		String searchEmailSubject = req.getParameter(SEARCH_EMAIL_SUBJECT);
		String offsetString = req.getParameter(OFFSET);
		String countString = req.getParameter(COUNT);
		String command = req.getParameter(COMMAND);
		JSONArray emails;
		if (command.equalsIgnoreCase("oauth_email"))
		{
		    checkParameters(req, resp, new String[] { "consumer_key", "consumer_secret", "oauth_key",
			    "oauth_secret" });

		    String consumerKey = req.getParameter("consumer_key");
		    String consumerSecret = req.getParameter("consumer_secret");
		    String oauthKey = req.getParameter("oauth_key");
		    String oauthSecret = req.getParameter("oauth_secret");
		    if(flagset != null && flagset !="" && !flagset.equals("")){
		    	String status = setFlagUsingOAuth(host, Integer.parseInt(port), userName, oauthKey, oauthSecret,
				    consumerKey, consumerSecret, flagset,msgnums,folderNames);
			    sendResponse(req, resp, new JSONObject().put("status", status));
		    }else{
		    	emails = getGmailEmailsUsingOAuth(host, Integer.parseInt(port), userName, oauthKey, oauthSecret,
				    consumerKey, consumerSecret, searchEmail, searchEmailSubject,
				    Integer.parseInt(offsetString), Integer.parseInt(countString),folderNames,search_content);
			    sendResponse(req, resp, new JSONObject().put("emails", emails));
		    }
		}
		else if (command.equalsIgnoreCase("oauth_email2"))
		{
		    checkParameters(req, resp, new String[] { "oauth_key" });
		    String oauthKey = req.getParameter("oauth_key");
		    if(flagset != null && flagset !="" && !flagset.equals("")){
		    	String status = setFlagUsingOAuth2(host, Integer.parseInt(port), userName, oauthKey, flagset,msgnums,folderNames);
			    sendResponse(req, resp, new JSONObject().put("status", status));
		    }else{
			    emails = getGmailEmailsUsingOAuth2(host, Integer.parseInt(port), userName, oauthKey, searchEmail,
				    searchEmailSubject, Integer.parseInt(offsetString), Integer.parseInt(countString),folderNames,search_content);
			    sendResponse(req, resp, new JSONObject().put("emails", emails));
		    }
		}
		else
		{
		    checkParameters(req, resp, new String[] { "password" });
		    String password = req.getParameter("password");
		    if(flagset != null && flagset !="" && !flagset.equals("")){
		    	String status = setFlagUsingIMAP(host, Integer.parseInt(port), userName, password, flagset,msgnums,folderNames);
			    sendResponse(req, resp, new JSONObject().put("status", status));
		    }else{
			    emails = getIMAPEmails(host, Integer.parseInt(port), userName, password, searchEmail,
				    searchEmailSubject, Integer.parseInt(offsetString), Integer.parseInt(countString),
				    folderNames,search_content);
			    sendResponse(req, resp, new JSONObject().put("emails", emails));
		    }
		}
	    }
	    else if (StringUtils.isNotBlank(fetchItems) && fetchItems.equalsIgnoreCase("folders"))
	    {
		//Getting All folders
		checkParameters(req, resp, new String[] { "user_name", "host", "port", "password" });
		String password = req.getParameter("password");
		JSONArray folders = getIMAPFolders(host, Integer.parseInt(port), userName, password);
		sendResponse(req, resp, new JSONObject().put("folders", folders));
	    }
	    else if (StringUtils.isNotBlank(fetchItems) && fetchItems.equalsIgnoreCase("default_folders"))
	    {
		//Getting default folders
		checkParameters(req, resp, new String[] { "user_name", "host", "port", "password" });
		String password = req.getParameter("password");
		IMAPStore store = getStore(host, userName, password, Integer.parseInt(port));
		JSONArray folders = IMAPUtil.getDefaultFolders(store);
		sendResponse(req, resp, new JSONObject().put("folders", folders));
	    }
	    
	    if (requestCount >= REQUEST_LIMIT)
		checkMapEntries();
	}
	catch (Exception e)
	{
	    try
	    {
		sendError(req, resp, e.getMessage());
		e.printStackTrace();
	    }
	    catch (Exception localException1)
	    {
	    }
	}
    }

    public static JSONObject getErrorJSON(String errorMessage) throws Exception
    {
	//return new JSONObject().put("status", "error").put("errormssg", errorMessage);
	return new JSONObject().put("errormssg", errorMessage);
    }

    public static void sendError(HttpServletRequest req, HttpServletResponse resp, String errorMessage)
	    throws Exception
    {
	String userName = req.getParameter("user_name");
	String info = "Unable to fetch emails from account \""+userName+"\"  ";
	sendResponse(req, resp, getErrorJSON(info.concat(errorMessage)));
    }

    /**
     * This method is used to iterate over cacheMap and deletes the object if it
     * is not used in last one hour
     * 
     * @throws Exception
     */
    public synchronized void checkMapEntries() throws Exception
    {
	if (cacheMap.size() >= REQUEST_LIMIT)
	{
	    long currentTime = System.currentTimeMillis();
	    Iterator<Map.Entry<String, IMAPStoreWrapper>> itr = cacheMap.entrySet().iterator();

	    while (itr.hasNext())
	    {
		Map.Entry<String, IMAPStoreWrapper> entry = itr.next();
		IMAPStoreWrapper wrapper = entry.getValue();

		if (currentTime - wrapper.getLastUsedTime() >= CONNECTION_CACHE_TIME_LIMIT)
		{
		    IMAPStore store = wrapper.getStore();

		    // close connection
		    if (store != null)
			store.close();

		    itr.remove();
		}
	    }

	    requestCount = 0;
	}
    }

    /**
     * Adds store to map com.agilecrm.email.IMAPServlet.getKey(String, String,
     * String).userName
     * 
     * @param key
     *            - cacheMap key
     * @param store
     *            - IMAPStore object
     */
    public void addStoreToCacheMap(String key, IMAPStore store)
    {
	IMAPStoreWrapper storeWrapper = new IMAPStoreWrapper();
	storeWrapper.setStore(store);
	storeWrapper.setLastUsedTime(System.currentTimeMillis());
	cacheMap.put(key, storeWrapper);
    }

    /**
     * Returns concatenated string to add as key to cache map
     * 
     * @param serverName
     *            - imap server name
     * @param userName
     *            - user name
     * @param password
     *            - email password
     * @return String
     */
    public static String getKey(String serverName, String userName, String password)
    {
	return serverName + userName + password;
    }

    public static void main(String[] args) throws Exception
    {
	
	// JSONArray getIMAPEmails(String serverName, int port, String userName,
	// String password, String searchEmail,
	// String searchEmailSubject, int offset, int count) throws Exception
	// JSONArray emails = getGmailEmailsUsingOAuth2("imap.gmail.com", 993,
	// "naresh@faxdesk.com",
	// "ya29.NgDj3qLxnPBMliIAAAD-x2YsGRAC-z6Z1k4ZFZ_H2LRNJ_0dT6nFLWgmKziPokrWk3lmvii0a55sQ53cHxE",
	// "naresh.mekala_90@rediffmail.com", null, 0, 2);

	// JSONArray emails = getGmailEmailsUsingOAuth("imap.gmail.com", 993,
	// "naresh@faxdesk.com",
	// "ya29.NgDj3qLxnPBMliIAAAD-x2YsGRAC-z6Z1k4ZFZ_H2LRNJ_0dT6nFLWgmKziPokrWk3lmvii0a55sQ53cHxE",
	// "naresh.mekala_90@rediffmail.com", 0, 2);

	// System.out.println(emails);
//
    }
    /**
     * Raesh code
     */
    
    public String setFlagUsingOAuth(String host, int port, String userEmail, String oauthToken, String oauthTokenSecret, String consumerKey, String consumerSecret, String flagset,int[] msgnums, String foldername)throws Exception{
		IMAPStore store = getGmailOAuthStore(host, port, userEmail, oauthToken, oauthTokenSecret, consumerKey,consumerSecret);
		String status = "";
    	if(setFlag(store, flagset, msgnums, foldername)){
    		status="success";
    	}else{
    		status = "failed";
    	}
    	return status;
    }
    public String setFlagUsingOAuth2(String host, int port, String userEmail, String oauthToken, String flagset,int[] msgnums, String foldername)throws Exception{
    	IMAPStore store = OAuth2Authenticator.connectToImap(host, port, userEmail, oauthToken, true);
    	String status = "";
    	if(setFlag(store, flagset, msgnums, foldername)){
    		status="success";
    	}else{
    		status = "failed";
    	}
    	return status;
    }
    public String setFlagUsingIMAP(String host, int port, String userEmail, String password, String flagset,int[] msgnums, String foldername) throws Exception{
    	IMAPStore store = getStore(host, userEmail, password, port);
    	String status = "";
    	if(setFlag(store, flagset, msgnums, foldername)){
    		status="success";
    	}else{
    		status = "failed";
    	}
    	return status;
    }
    
    public Boolean setFlag(IMAPStore store, String flag, int[] msgnums, String foldername){
    	try{
    		Folder folder = store.getFolder(foldername);
    		folder.open(Folder.READ_WRITE);
    		if(StringUtils.equals("SEEN", flag)){
				for(int i=0;i<msgnums.length;i++){
					folder.getMessage(msgnums[i]).setFlag(Flags.Flag.SEEN, true);
				}
    		}else if(StringUtils.equals("DELETED", flag)){
    			for(int i=0;i<msgnums.length;i++){
					folder.getMessage(msgnums[i]).setFlag(Flags.Flag.DELETED, true);
				}
    		}else if(StringUtils.equals("DRAFT", flag)){
    			for(int i=0;i<msgnums.length;i++){
					folder.getMessage(msgnums[i]).setFlag(Flags.Flag.DRAFT, true);
				}
    		}else if(StringUtils.equals("UNREAD", flag)){
    			for(int i=0;i<msgnums.length;i++){
					folder.getMessage(msgnums[i]).setFlag(Flags.Flag.SEEN, false);
				}
    		}
    		folder.close(false);
            store.close();
    		return true;
    	}catch(Exception e){
    		e.printStackTrace();
    		return false;
    	}
    }
}

final class XoauthProvider extends Provider
{
    public XoauthProvider()
    {
	super("Google Xoauth Provider", 1.0D, "Provides the Xoauth experimental SASL Mechanism");
	put("SaslClientFactory.XOAUTH", "com.agilecrm.email.xoauth.XoauthSaslClientFactory");
    }
}
