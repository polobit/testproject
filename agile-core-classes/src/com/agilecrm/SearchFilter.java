package com.agilecrm;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;

import com.agilecrm.search.ui.serialize.SearchRule;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public abstract class SearchFilter {
	/**
	 * Represents list of {@link SearchRule}, query is built on these list of
	 * conditions
	 */
	@NotSaved(IfDefault.class)
	@Embedded
	public List<SearchRule> rules = new ArrayList<SearchRule>();

	/**
	 * Represents list of {@link SearchRule}, query is built on these list of
	 * conditions
	 */
	@NotSaved(IfDefault.class)
	@Embedded
	public List<SearchRule> or_rules = new ArrayList<SearchRule>();
}
