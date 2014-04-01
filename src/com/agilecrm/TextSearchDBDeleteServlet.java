package com.agilecrm;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.util.AccountDeleteUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.search.Cursor;
import com.google.appengine.api.search.GetIndexesRequest;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.Schema;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * Servlet implementation class TextSearchDBDelete
 */
public class TextSearchDBDeleteServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    /**
     * Default constructor.
     */
    public TextSearchDBDeleteServlet()
    {
	// TODO Auto-generated constructor stub
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
     *      response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {

	String namespace = request.getParameter("namespace");

	System.out.println("namespace : " + namespace);

	if (StringUtils.isEmpty(namespace))
	    return;

	String schemaString = request.getParameter("schema");

	if (!StringUtils.isEmpty(schemaString))
	{
	    String oldNamespace = NamespaceManager.get();
	    try
	    {

		NamespaceManager.set(namespace);
		com.google.appengine.api.search.GetResponse<Index> response1 = SearchServiceFactory.getSearchService().getIndexes(
			GetIndexesRequest.newBuilder().setSchemaFetched(true).build());

		QueryOptions options = QueryOptions.newBuilder().setCursor(Cursor.newBuilder().setPerResult(true).build()).build();

		System.out.println(response1);
		for (Index index1 : response1)
		{

		    Schema schema = index1.getSchema();
		    Set<String> typesForField = new HashSet<String>();

		    for (String fieldName : schema.getFieldNames())
		    {
			typesForField = schema.getFieldNames();

		    }

		    System.out.println("namespace of index : " + index1.getNamespace());
		    System.out.println("fields count : " + typesForField.size());
		    System.out.println(typesForField);

		    try
		    {
			if (namespace.equals(index1.getNamespace()))
			{
			    System.out.println("delete schema");
			    index1.deleteSchema();
			}
		    }
		    catch (Exception e)
		    {
			e.printStackTrace();
		    }

		}

	    }
	    catch (Exception e)
	    {

	    }
	    finally
	    {
		NamespaceManager.set(oldNamespace);
	    }
	    return;
	}
	// Gets index of 'contacts' document
	Index index = SearchServiceFactory.getSearchService().getIndex(IndexSpec.newBuilder().setName("contacts"));
	for (int i = 0; i < 10000; i++)
	{

	}

	// Created a deferred task for report generation
	TextSearchDeleteDeferredTask textSearchDeleteDeferredTask = new TextSearchDeleteDeferredTask(namespace);

	// Add to queue
	com.google.appengine.api.taskqueue.Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(textSearchDeleteDeferredTask));

	/*
	 * int tmp = 1 + 1; if (tmp == 2) return;
	 */

    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
     *      response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	// TODO Auto-generated method stub
    }

}

class TextSearchDeleteDeferredTask implements DeferredTask
{
    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;
    String namespace;

    public TextSearchDeleteDeferredTask(String namespace)
    {
	this.namespace = namespace;
    }

    public void run()
    {
	// Returns if namespace is empty
	if (StringUtils.isEmpty(namespace))
	    return;

	// TODO Auto-generated method stub
	AccountDeleteUtil.deleteTextSearchData(namespace, 0l);
    }
}
