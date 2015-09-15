package com.auth;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.Collections;

import com.Globals;
import com.agilecrm.logger.AgileAPILogger;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.taskqueue.Taskqueue;
import com.google.api.services.taskqueue.TaskqueueRequest;
import com.google.api.services.taskqueue.TaskqueueRequestInitializer;
import com.google.api.services.taskqueue.TaskqueueScopes;

/**
 * @author yaswanth
 *
 */
public class Authorization
{

    /** Directory to store user credentials. */
    private static final java.io.File DATA_STORE_DIR = new java.io.File(System.getProperty("user.dir"),
	    ".store/beta/task_queue_sample");

    private static FileDataStoreFactory dataStoreFactory;

    private static HttpTransport httpTransport;

    /** Global instance of the JSON factory. */
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    public static Credential credentials = null;

    public static org.apache.log4j.Logger logger = AgileAPILogger.getLogger("initial");

    static
    {
	try
	{
	    dataStoreFactory = new FileDataStoreFactory(DATA_STORE_DIR);

	    httpTransport = GoogleNetHttpTransport.newTrustedTransport();
	}
	catch (IOException | GeneralSecurityException e)
	{

	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

    /** Authorizes the installed application to access user's protected data. */
    private static Credential authorize() throws Exception
    {
	logger.info(System.getProperty("user.dir"));

	logger.info(System.getProperty("user.dir") + "/credentials/beta/client_secrets.json");

	FileInputStream f = new FileInputStream(new File(System.getProperty("user.dir")
		+ "/credentials/beta/client_secrets.json"));
	logger.info(f.toString());
	// load client secrets
	GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(f));

	// set up authorization code flow
	GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(httpTransport, JSON_FACTORY,
		clientSecrets, Collections.singleton(TaskqueueScopes.TASKQUEUE)).setDataStoreFactory(dataStoreFactory)
		.setAccessType("offline").build();

	// GoogleCredential.fromStream(new FileInputStream(DATA_STORE_DIR));
	// authorize
	return new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");
    }

    public static Credential getCredentials() throws Exception
    {

	if (credentials != null)
	{
	    if (credentials.getExpirationTimeMilliseconds() > (System.currentTimeMillis() - 120000))
		return credentials;

	    try
	    {
		logger.info("*************************************");
		logger.info(credentials.getAccessToken());
		logger.info(credentials.getExpirationTimeMilliseconds());
		logger.info(Thread.currentThread().getName());
		credentials.refreshToken();
		logger.info(credentials.getAccessToken());
		logger.info(credentials.getExpirationTimeMilliseconds());
		logger.info("**************************************");
	    }
	    catch (IOException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}

	return credentials = authorize();
    }

    public static Taskqueue getTaskqeues(String taskName)
    {
	try
	{
	    Credential cred = getCredentials();

	    Taskqueue tq = new Taskqueue.Builder(httpTransport, JSON_FACTORY, cred)
		    .setApplicationName(Globals.PROJECT_NAME)
		    .setTaskqueueRequestInitializer(new TaskqueueRequestInitializer()
		    {

			@Override
			public void initializeTaskqueueRequest(TaskqueueRequest<?> request)
			{
			    request.setPrettyPrint(true);
			}
		    }).build();

	    return tq;

	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return null;
    }

    public static void main(String[] args)
    {
	try
	{
	    getCredentials();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }
}
