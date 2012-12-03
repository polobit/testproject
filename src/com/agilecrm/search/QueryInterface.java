package com.agilecrm.search;

import java.util.Collection;
import java.util.List;

import com.agilecrm.search.ui.serialize.SearchRule;

public interface QueryInterface
{
    public Collection<?> simpleSearch(String keyword);

    public Collection<?> advancedSearch(List<SearchRule> rule);
}
