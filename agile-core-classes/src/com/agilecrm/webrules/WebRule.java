package com.agilecrm.webrules;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.google.appengine.api.datastore.Text;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class WebRule
{
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String name = null;

    public Boolean disabled;

    // Store type of the rule whether it is plain web rule or shopify rule
    @NotSaved(IfDefault.class)
    public String rule_type = "WEBRULE";

    @NotSaved(IfDefault.class)
    @Embedded
    public List<SearchRule> rules = new ArrayList<SearchRule>();

    @NotSaved(IfDefault.class)
    @Embedded
    @Unindexed
    public List<WebRuleAction> actions = new ArrayList<WebRuleAction>();

    @NotSaved(IfDefault.class)
    public int position = 0;

    // Added to send the country to the client - this is not saved
    @NotSaved
    public String country = "";

    public static ObjectifyGenericDao<WebRule> dao = new ObjectifyGenericDao<WebRule>(WebRule.class);

    public WebRule()
    {

    }

    /*
     * @PostLoad void postLoad() { System.out.println("post load");
     * System.out.println(actions); for (WebRuleAction action : actions) {
     * System.out.println(action.action); System.out.println(action.popup_text);
     * }
     * 
     * }
     */

    /**
     * Saves the report
     */
    public void save() throws PlanRestrictedException
    {
	dao.put(this);
    }
}

@XmlRootElement
class WebRuleAction
{
    @Override
    public String toString()
    {
	return "WebRuleAction [action=" + action + ", RHS=" + RHS + ", position=" + position + ", popup_pattern=" + popup_pattern + ", title=" + title
		+ ", popup_text=" + popup_text + ", delay=" + delay + ", timer=" + timer + "]";
    }

    public enum Action
    {
	POPUP, ASSIGN_CAMPAIGN, UNSUBSCRIBE_CAMPAIGN, ADD_TAG, REMOVE_TAG, ADD_SCORE, SUBTRACT_SCORE, MODAL_POPUP, CORNER_NOTY, NOTY, JAVA_SCRIPT, RUN_JAVASCRIPT, FORM;
    }

    public Action action = null;
    public String RHS = null;

    public String position = null;

    public String popup_pattern = null;

    public String title = null;

    public Text popup_text = null;

    public String delay = null;

    public Long timer = 0L;
}
