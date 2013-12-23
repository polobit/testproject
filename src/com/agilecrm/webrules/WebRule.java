package com.agilecrm.webrules;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class WebRule
{
	@Id
	public Long id;

	@NotSaved(IfDefault.class)
	public String name = null;

	@NotSaved(IfDefault.class)
	@Embedded
	public List<SearchRule> rules = new ArrayList<SearchRule>();

	@NotSaved(IfDefault.class)
	@Embedded
	public List<WebRuleAction> actions = new ArrayList<WebRuleAction>();

	public String action = null;

	@NotSaved(IfDefault.class)
	public Long campaign_id = 0L;

	@NotSaved(IfDefault.class)
	public String popup_type = null;

	@NotSaved(IfDefault.class)
	public String popup_pattern = null;

	@NotSaved(IfDefault.class)
	public String title = null;

	@NotSaved(IfDefault.class)
	public String popup_text = null;

	public static ObjectifyGenericDao<WebRule> dao = new ObjectifyGenericDao<WebRule>(WebRule.class);

	public WebRule()
	{

	}

	/**
	 * Saves the report
	 */
	public void save()
	{
		dao.put(this);
	}
}

@XmlRootElement
class WebRuleAction
{
	public enum Action
	{
		POPUP, ASSIGN_CAMPAIGN, UNSUBSCRIBE_CAMPAIGN, ADD_TAG, REMOVE_TAG, ADD_SCORE, SUBTRACT_SCORE, MODAL_POPUP, CORNER_NOTY, NOTY, JAVA_SCRIPT;
	}

	public Action action = null;
	public String RHS = null;

	public String position = null;

	public String popup_pattern = null;

	public String title = null;

	public String popup_text = null;
}
