package com.agilecrm.search.document;

import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.SearchService;
import com.google.appengine.api.search.SearchServiceFactory;

public class Document
{
    public Document()
    {
	// TODO Auto-generated constructor stub
    }

    /**
     * Initializes/get search service for the app
     */
    public SearchService searchService = SearchServiceFactory.getSearchService();

    /**
     * Index for the contact Document, Required to search on contacts document
     */
    public Index index = searchService.getIndex(IndexSpec.newBuilder().setName("contacts"));

}
