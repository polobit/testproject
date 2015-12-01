<script id="automation-add-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="span8">
            <div class="well">
                <form id="addAutomationForm" name="addAutomationForm" class="form-horizontal">
                   {{#if id}}
                        <legend>Edit Automation</legend>
                        <input name="id" type="hidden" value="{{id}}" />
                    {{else}}
                        <legend><i class="icon-plus-sign"></i> Add Automation</legend>
                    {{/if}} 
                   <fieldset>
                        <div class="control-group">
                            <label class="control-label" style="width:200px!important;">Name <span class="field_req">*</span></label>
                            <div class="controls" style="margin-left:220px!important;">
                                <input type="text" id="name" class="required" name="name" />
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" style="width:200px!important;">Select Filter type <span class="field_req">*</span></label>
                                <div class="controls" style="margin-left:220px!important;">
                                    <select id="filter-select" name="contactFilter_id" class="required"> 
                                    <option value="">Select...</option>
                                    </select>
                                </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" style="width:200px!important;">Run this Campaign on the Contacts<span class="field_req">*</span></label>
                            <div class="controls" style="margin-left:220px!important;">
                                <select id="campaign-select" name="campaign_id" class="required">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" style="width:200px!important;">Select period <span class="field_req">*</span></label>
                           
                                  <div class="controls" style="margin-left:220px!important;">
                                    <select id="period-type" name="durationType" class="required">
				        <option value="">Select...</option>
                                        <option value="DAILY">Daily</option>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                    </select>
                                </div>
                        </div>
                        <div class="form-actions">          
                            <a href="#automations" id="automation-save" class="save btn btn-primary">Save</a>
                            <a href="#automations" id="automation-cancel" class="btn">Cancel</a> 
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
</div>
</script>
<script id="automations-model-template" type="text/html">
	<td class="data" data="{{id}}">{{name}}</td>
    <td>{{titleFromEnums durationType}}</td>
    <td>{{contactFilter}}</td>
	<td>{{campaign}}</td>
	<br />
</script>

<script id="automations-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>List of Automations</h1>
            <a href="#automation-add" class="btn right" id="addAutomation" style="top:-30px;position:relative"><i class="icon-plus-sign"></i> Add Automation</a>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
        {{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You do not have any Automations currently.</h3>
                    <div class="text">
                        You can define a automations to start execution of a campaign. But please make sure to create atleast one campaign before creating automation.
                    </div>
                    <a href="#automation-add" class="btn blue btn-slate-action"><i class="icon-plus-sign"></i>  Add Automation </a>
                </div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
        <div class="data-block">
            <div class="data-container">
                <table class="table table-striped showCheckboxes" url="core/api/automations/bulk">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Period</th>
                            <th>Contact Filter</th>
                            <th>Campaign</th>
                        </tr>
                    </thead>
                    <tbody id="automations-model-list" route="automation/"> </tbody>
                </table>
            </div>
        </div>
        {{/if}}
    </div>
    <div class="span3">
        <div class="well">
            <h3>
                What are Automations?
            </h3>
            <br />
            <p>
                Automations are pre-defined conditions set up by you. If the condition is satisfied, you can choose an action to follow using workflow automation.
            </p>
            <p>
                e.g. If a user registers on your website, you can automate the workflow to send a welcome email. The user registering on site is the trigger.
            </p>
        </div>
    </div>
</div>
</script><script id="campaign-analysis-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1 class="pull-left">Campaign <small>analysis</small></h1>
            <div class="right">
        		<select id="campaign-reports-select" class="required">
        			<option value="">Select...</option>
        		</select>
			</div>
            <div class="clearfix"></div>
        </div>
    </div>
</div>

<div id="campaign-analysis-tabs"></div>
</script>

<script id="campaign-analysis-tabs-template" type="text/html">
<div class="row">
	<div class="span12">
		<ul class="nav nav-tabs" id="campaign-tabs">
			<li class="campaign-stats-tab" data-campaign-tab-active="STATS"><a href="#email-reports/{{id}}">Stats</a></li>
			<li class="campaign-subscribers-tab active" data-campaign-tab-active="SUBSCRIBERS"><a href="#workflow/all-subscribers/{{id}}">Subscribers</a></li>
			<li class="campaign-logs-tab" data-campaign-tab-active="LOGS"><a href="#workflows/logs/{{id}}">Logs</a></li>
		</ul>
		<div class="tab-content" style="overflow:visible;">
			<div class="tabs" id="campaign-analysis-tabs-content"></div>
		</div>
	</div>
</div>
</script><script id="campaign-email-reports-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">                
             <div id="reportrange" class="pull-right" style="margin-right:2px;padding:4px 8px;box-shadow: 0 0px 2px rgba(0, 0, 0, .25), inset 0 -1px 0 rgba(0, 0, 0, .1);">
                <i class="icon-calendar icon-large"></i>
                <span id="range">{{date-range "today" "-6"}}</span>
              </div>
            <h3>Reports<!-- <small> - <span id="reports-campaign-name"></span></small> --></h3>
        </div>
    </div>
</div>

<div>	
	<!-- Email Reports -->
	<div id="email-reports">
		<div class="row">
			<div class="span12">
				<h3 style="text-align: center;">Email Reports</h3>
			</div>
			<div id="email-table-reports" style="padding-top:50px; margin-left: 25px;">
			</div>
		</div>
		<hr />	
		<div class="row"><div class="span12"><h3>Daily</h3></div>
			<div id="line-daily-chart" style="height:300px;padding-top:50px; margin-left: 25px;"></div>
		</div>
		<hr />
		<div class="row"><div class="span12"><h3>Hourly</h3></div>
			<div id="line-hourly-chart" style="height:300px;padding-top:50px; margin-left: 25px;"></div>
		</div>
		<hr />
		<div class="row">
                    <div class="span12"><h3 style="display:inline;">Weekly</h3>
					   <h5 style="display:inline;">(From <span id="week-range">{{date-range "today" "-6"}}</span>)</h5>
					</div>
			<div id="line-weekly-chart" style="height:300px;padding-top:50px; margin-left: 25px;"></div>
		</div>
		<hr />
	</div>
	<!-- End of Email Reports -->  

   </div>
</div>

</script><script id="campaign-email-table-reports-template" type="text/html">
<div class="span10 offset1">  
	<table class="table table-bordered">
		<tbody>
			<tr>
				<th>Emails Sent</th>
				<th>Emails Opened<span
							style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px; vertical-align: top" rel="popover"
							data-placement="right"
							data-title:" data-content="Total email opens recorded & unique opens."
							id="element" data-trigger="hover" />
						</span></th>
				<th>Clicks<span
							style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px; vertical-align: top" rel="popover"
							data-placement="right"
							data-title:" data-content="Total email link clicks recorded & unique clicks"
							id="element" data-trigger="hover" /></th>
				<th>Unsubscriptions</th>
				<th>Hard Bounces <span
							style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px; vertical-align: top" rel="popover"
							data-placement="right"
							data-title:" data-content="A hard bounce occurs when the recipient's email is invalid."
							id="element" data-trigger="hover" />
						</span></th>
				<th>Soft Bounces <span
							style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px; vertical-align: top" rel="popover"
							data-placement="right"
							data-title:" data-content="A soft bounce occurs when the sender's email box is full or for other reasons."
							id="element" data-trigger="hover" />
						</span></th>
				<th>Spam Complaints</th>
			</tr>
            <tr>
				<td>{{#if sent}}{{sent}}{{else}} - {{/if}}</td>
				<td>{{#if opened}}{{opened}} ({{unique_opened}}) {{else}} - {{/if}}</td>
				<td>{{#if clicks}} {{clicks}} ({{unique_clicks}}) {{else}} - {{/if}}</td>
				<td>{{#if unsubscribed}}{{unsubscribed}} {{else}} - {{/if}}</td>
				<td>{{#if hard_bounce}}{{hard_bounce}} {{else}} - {{/if}}</td>
				<td>{{#if soft_bounce}}{{soft_bounce}} {{else}} - {{/if}}</td>
                <td>{{#if spam}}{{spam}} {{else}} - {{/if}}</td>
			</tr>
		</tbody>
	</table>
</div>
</script><script id="campaign-logs-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h3>Logs <!--<small>for <span id="logs-campaign-name"></span></small>--></h3>
            <a href="#" class="btn btn-danger right" id="delete_campaign_logs" style='top:-29px;position:relative;'>Delete All Logs</a>
			<div class="pull-right" style="top: -29px; position: relative; padding-right: 5px;">
				<div class="btn-group">
  				<button class="btn"><span id="log-filter-title">All</span></button>
  				<button class="btn dropdown-toggle" data-toggle="dropdown">
    				<span class="caret"></span>
  				</button>
  				<ul class="dropdown-menu">
                    <li><a href="#" data-log-type="ALL" data-campaign-id="{{get_id_from_hash}}" class="log-filters">All</a></li> 
    				<li><a href="#" data-log-type="EMAIL_SENT" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Sent</a></li>
					<li><a href="#" data-log-type="EMAIL_OPENED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Opened</a></li>
					<li><a href="#" data-log-type="EMAIL_CLICKED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Clicked</a></li>
					<li><a href="#" data-log-type="UNSUBSCRIBED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Unsubscribed</a></li>
                    <li><a href="#" data-log-type="EMAIL_HARD_BOUNCED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Hard Bounced</a></li>
					<li><a href="#" data-log-type="EMAIL_SOFT_BOUNCED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Soft Bounced</a></li>
                    <li><a href="#" data-log-type="EMAIL_SPAM" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Spam Reported</a></li>
  				</ul>
			</div>
        </div>
        </div>
    </div>
</div>
<div class="row">
	<div class="span12">
    {{#unless this.length}}
	<div id="logs-slate"></div>
    {{/unless}}

    {{#if this.length}}
    <div class="data">
        <div class="data-container">
            <table class="table table-striped onlySorting" id="logs-table" url="core/api/campaigns/logs/bulk">
                <thead>
                    <tr>
                        <th></th>
                        <th>Contact</th>
                        <th>Log Type</th>
                        <th>Message</th>
                        <th>Time</th>                    
                    </tr>
                </thead>
                <tbody id="campaign-logs-model-list" route="contact/">
                </tbody>
            </table>
        </div>
    </div>
    {{/if}}
</div>
</div>
</script>

<script id="campaign-logs-model-template" type="text/html">
{{#if contact}}
<input name="id" class="campaign" type="hidden" value="{{campaign_id}}" />
<td></td>
<td class="data" data={{subscriber_id}} style="white-space:nowrap;">
	<div style="display:inline;padding-right:10px;height:auto;">
    	<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl contact.properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
    </div>
 	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;width:14em;overflow:hidden;">
    	<b>	{{contact_name contact.properties contact.type}} </b>
        <br />
        	{{getPropertyValue contact.properties "email"}}
    </div>
</td>
<td style="width:10em;">{{titleFromEnums log_type}}</td>
<td class="ellipsis-multi-line" id="autoellipsis" style="width:15em; height:70px;">{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}</td>
<td><small class="edit-hover"> 
		<time class="log-created-time" datetime="{{epochToHumanDate "" time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" time}}</time>
	</small></td>
<br/>
{{/if}}
</script><script id="campaign-stats-chart-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Campaigns Comparison</h1>
        </div>
    </div>
</div>
<div class="row">
    <div class="span12">     
        <div id="campaign-stats-chart" style="width:100%; height:300px"></div>
    </div>
</div>
</script><script id="trigger-add-template" type="text/html">
<div>
    <div class="span12">
        <div class="span8">
            <div class="well">
                <form id="addTriggerForm" name="addTriggerForm" class="form-horizontal">
                    {{#if id}}
                        <legend>Edit Trigger</legend>
                        <input name="id" type="hidden" value="{{id}}" />
                    {{else}}
                        <legend><i class="icon-plus-sign"></i> Add Trigger</legend>
                    {{/if}} 
                    <fieldset>
                        <div class="control-group">
                            <label class="control-label" style="width:200px!important;">Name <span class="field_req">*</span></label>
                            <div class="controls" style="margin-left:220px!important;">
                                <input type="text" id="name" class="required" name="name" />
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" style="width:200px!important;">When this happens <span class="field_req">*</span></label>
                            <div id="LHS" name="LHS">
                                  <div class="controls" style="margin-left:220px!important;">
                                    <select id="trigger-type" name="type" class="required">		
 										<option></option>
                                        <optgroup label="Tag">
										<option value="TAG_IS_ADDED">Tag is added</option>
                                        <option value="TAG_IS_DELETED">Tag is deleted</option>
										<optgroup label="Contact">
                                        <option value="CONTACT_IS_ADDED">Contact is added</option>
                                        <option value="ADD_SCORE" id="add-score">Contact Score (>=)</option>
                                        <optgroup label="Deal">
                                        <option value="DEAL_IS_ADDED">Deal is added</option>
                                        <option value="DEAL_IS_DELETED">Deal is deleted</option>
                                        <option value="DEAL_MILESTONE_IS_CHANGED">Deal milestone is changed</option>
										<optgroup label="Timer">
										<option value="RUNS_DAILY">Daily</option>
                                        <option value="RUNS_WEEKLY">Weekly</option>
                                        <option value="RUNS_MONTHLY">Monthly</option>
										<optgroup label="Payments">
										<option value="STRIPE_CHARGE_EVENT" id="stripe-charge-event">Stripe Event</option>
										<optgroup label="Email Bounces">
										<option value="SOFT_BOUNCE">Soft Bounce</option>
										<option value="HARD_BOUNCE">Hard Bounce</option>
										<option value="SPAM">Spam</option>
										<optgroup label="Email Event">
										<option value="INBOUND_MAIL_EVENT" id="inbound-mail-event">New Email</option>
										<option value="EMAIL_OPENED">Email Opened</option>
										<option value="EMAIL_LINK_CLICKED">Email Link Clicked</option>
										<option value="UNSUBSCRIBED">Unsubscribed</option>
										<optgroup label="Calendar">
										<option value="EVENT_IS_ADDED">Event is added</option>
										<optgroup label="Call">
										<option value="INBOUND_CALL">Inbound Call</option>
										<option value="OUTBOUND_CALL">Outbound Call</option>
										<optgroup label="Ecommerce">
										<option value="SHOPIFY_EVENT" id="shopify-event">Shopify Event</option>
										<optgroup label="Form">
										<option value="FORM_SUBMIT" id="form-event">Form Submit</option>
									</select>
                                </div>
                            </div>
                        </div>
						
						<div class="control-group" style="display:none;">
							<div class="controls" style="margin-left:220px!important;">
                            <select id="contact-filter" name="contact_filter_id" class="required">
                                    <option value="">Select...</option>
                                </select>
							</div>
                        </div>
							
                        <div class="control-group" style="display:none;">
                            <div id="RHS" name="RHS">
                                <label class="control-label TAG_IS_ADDED TAG_IS_DELETED ADD_SCORE EMAIL_OPENED" style="width:200px!important;"></label>
                                <div class="controls" style="margin-left:220px!important;width:230px!important;">
                                    <input type="text" value="{{custom_tags}}" id="trigger-custom-tags" name="custom_tags" class="required trigger-tags TAG_IS_ADDED TAG_IS_DELETED" style="margin-bottom: -1px;" placeholder="Enter tag" />
                                    <input type="text" placeholder="Enter Score" {{#if custom_score}} value="{{this.custom_score}}" {{/if}} id="trigger-custom-score" name="custom_score" class="ADD_SCORE required custom-value digits" />
                                </div>
                            </div>
                        </div>
						
						<!--Call Inbound and Outbound -->
						<div class="control-group" style="display: none;">
							<div id="CALL">
								<label class="control-label INBOUND_CALL OUTBOUND_CALL" style="width:200px!important;"></label>
								<div class="controls" style="margin-left:220px!important;">	
									<select name="call_disposition" class="required">
										<option value="" class="INBOUND_CALL OUTBOUND_CALL">Select call status</option>
										<option value="ALL" class="INBOUND_CALL OUTBOUND_CALL">All</option>			
										<option value="answered" class="INBOUND_CALL OUTBOUND_CALL">Answered</option>
										<!--<option value="no-answer" class="INBOUND_CALL OUTBOUND_CALL">No Answer</option>-->
										<option value="busy" class="INBOUND_CALL OUTBOUND_CALL">Busy</option>
										<option value="failed" class="OUTBOUND_CALL">Failed</option>
										<option value="voicemail" class="OUTBOUND_CALL">Voicemail</option>
									</select>
								</div>
							</div>
						</div>
                        
						<div class="control-group" style="display:none;">
							<div class="controls" style="margin-left:220px!important;">
                            <select id="trigger-deal-milestone" name="trigger_deal_milestone" class="required">
                                    <option value="">Select...</option>
                                </select>
							</div>
                        </div>
						<!-- Calendar Event -->
						 <div class="control-group" style="display:none;">
							<div class="controls" style="margin-left:220px!important;">
                            <select id="event-type" name="event_type" class="required">
									<option value="">Select Event Type</option>
                                    <option value="ANY">Any Event</option>
									<option value="WEB_APPOINTMENT">Online Appointment</option>
                                </select>
							</div>
                        </div>
						 <div class="control-group" style="display:none;">
							<div class="controls" style="margin-left:220px!important;">
                            <select id="event-owner-id" name="event_owner_id" class="required">
                                    <option value="">Select...</option>
                                </select>
							</div>
                        </div>
						<div class="control-group" style="display:none;">
							<div class="controls" style="margin-left:220px!important">
							<select id="trigger-stripe-event" name="trigger_stripe_event" class="required">
									<option value="">Select Stripe Event</option>
									<option value="CHARGE_SUCCEEDED" id="charge-succeeded">Charge succeeded</option>
									<option value="CHARGE_FAILED" id="charge-failed">Charge failed</option>
									<option value="CHARGE_REFUNDED" id="charge-refunded">Charge refunded</option>
									<option value="CHARGE_CAPTURED" id="charge-captured">Charge captured</option>
									<option value="CHARGE_UPDATED" id="charge-updated">Charge updated</option>
									<option value="CUSTOMER_DELETED" id="customer-deleted">Customer deleted</option>
							</select>
							<div style="margin-top:2px;">
							<small>You need to <a href="https://stripe.com/docs/webhooks#configuring-your-webhook-settings" target="_blank">setup webhooks</a> in your stripe account for this</small>
							</div>
							</div>
						</div>
                        <!--Email Clicked and Opened-->
						<div class="control-group" style="display:none;">
							<div class="controls" style="margin-left:220px!important">
									<select id="email-tracking-type" name="email_tracking_type" class="required">
										<option value="ANY">Personal or Campaign emails</option>
										<option value="PERSONAL">Personal emails only</option>
										<option value="CAMPAIGNS">Campaign emails only</option>
									</select>
							</div>
						</div>
						<div class="control-group" style="display:none;">
                            <label class="control-label" style="width:200px!important;"></label>
                            <div class="controls" style="margin-left:220px!important;">
                                <select id="email-tracking-campaign-id" name="email_tracking_campaign_id" class="required">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                        </div>
						 <div class="control-group" style="display:none;">
                            <div>
                                <label class="control-label" style="width:200px!important;"></label>
                                <div class="controls" style="margin-left:220px!important;width:230px!important;">
                                    <input type="text" id="custom-link-clicked" value="{{custom_link_clicked}}" name="custom_link_clicked" class="required EMAIL_LINK_CLICKED" style="margin-bottom: -1px;" placeholder="Link URL contains" />
                                </div>
                            </div>
                        </div>
						<div class="control-group" style="display:none;">
							<div class="controls" style="margin-left:220px!important">
							<select id="trigger-shopify-event" name="trigger_shopify_event" class="required">
									<option value="">Select Shopify Event</option>
									<option value="CUSTOMERS_CREATE">Customer created</option>
									<option value="CUSTOMERS_UPDATE">Customer updated</option>
									<option value="ORDERS_CREATE">Order created</option>
									<option value="ORDERS_UPDATED">Order updated</option>
									<option value="ORDERS_PAID">Order payment</option>
									<option value="ORDERS_DELETE">Order deleted</option>
									<option value="ORDERS_FULFILLED">Order fulfilled</option>
									<option value="ORDERS_CANCELLED">Order cancelled</option>
									<option value="CHECKOUTS_CREATE">Checkout created</option>
									<option value="CHECKOUTS_UPDATE">Checkout updated</option>
									<option value="CHECKOUTS_DELETE">Checkout deleted</option>
							</select>
							<div style="margin-top:12px;">
								<small><i class="icon-info-sign"></i> You need to setup Webhooks in your Shopify account for this. In your stores Admin panel, go to Settings, Notifications, Webhooks, and create a webhook for the desired event with the below URL. <br> <a class="inbound-help-text">{{shopifyWebhook}}</a></small>
							</div>
							</div>	
						</div>
						<div class="control-group" style="display:none;">
							<div class="controls" style="margin-left:220px!important">
							<select id="trigger-form-event" name="trigger_form_event" class="required">
								<option value="">Select...</option>
							</select>
							</div>
						</div>
						<div id="trigger-inbound-mail-event" style="display:none;">
						<div class="control-group">
							<div class="controls" style="margin-left:220px!important; margin-top:-12px;">
								<small><i class="icon-info-sign"></i> For Agile CRM to recognize your emails, please setup <a class="inbound-help-text">{{inboundMail}}</a> as forwarding email at your email server. When there is a new email to this address, the From address will be added to your Contacts and to the Campaign (in case it is a new Contact).</small>								
							</div>
                		</div>
						</div>
						<div id="trigger-run-on-new-contacts" style="display:none;">
							<div class="control-group">
								<div class="controls" style="margin-left:220px!important;">
									<input type="checkbox" class="pull-left" name="trigger_run_on_new_contacts">
									<label class="control-label pos-rlt text-left  p-l-xs" style="top:-4px; width: 200px;">Run only on new Contacts</label>
								</div>
							</div>
						</div>
						<div id="new-mail-trigger-run-on-new-contacts" style="display:none;">
							<div class="control-group">
								<div class="controls" style="margin-left:220px!important;">
									<input type="checkbox" class="pull-left" name="new_email_trigger_run_on_new_contacts" checked="true">
									<label class="control-label pos-rlt text-left  p-l-xs" style="top:-4px; width: 200px;">Run only for new Contacts</label>
								</div>
							</div>
						</div>
						<div id="trigger-filter-condition" style="display:none;"></div>
                        <div class="control-group">
                            <label class="control-label" style="width:200px!important;">Run this Campaign on the Contact <span class="field_req">*</span></label>
                            <div class="controls" style="margin-left:220px!important;">
                                <select id="campaign-select" name="campaign_id" class="required">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-actions" style="padding-left: 220px;">          
                            <a href="#triggers" id="trigger-save" class="save btn btn-primary">Save</a>
                            <a href="#" id="trigger-cancel" class="btn">Cancel</a> 
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
        <div class="span3">
            <div class="well">
                <h3>
                    Triggers
                </h3>
                <br />   
                <p> Give your trigger a name and choose a condition to be satisfied. Immediately link your trigger to the appropriate campaign, for an action to follow.</p>
            </div>
        </div>
    </div>
</div>
</script><script id="triggers-model-template" type="text/html">
			
	<td class="data" data="{{id}}"><a href="#trigger/{{id}}" class="stop-propagation">{{name}}</a></td>        
	<td>{{triggerType type}}</td>
	<td>{{#if custom_score}}{{custom_score}} {{/if}} {{#if custom_tags}}{{custom_tags}}{{/if}} {{#if trigger_deal_milestone}}{{trigger_milestone trigger_deal_milestone}}{{/if}} {{#if trigger_stripe_event}}{{trigger_stripe_event}}{{/if}}{{#if trigger_shopify_event}}{{trigger_shopify_event}}{{/if}} {{#if contactFilter}}{{contactFilter}}{{/if}}{{#if trigger_form_event}}{{getFormNameFromId trigger_form_event}}{{/if}}</td>
	<td>{{campaign}}</td>
	<br />
</script>

<script id="triggers-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>List of Triggers</h1>
            <a href="#trigger-add" class="btn right" id="addTrigger" style="top:-30px;position:relative"><i class="icon-plus-sign"></i> Add Trigger</a>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
        {{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You do not have any triggers currently.</h3>
                    <div class="text">
                        You can define a trigger to start execution of a campaign. But please make sure to create atleast one campaign before creating triggers.
                    </div>
                    <a href="#trigger-add" class="btn blue btn-slate-action"><i class="icon-plus-sign"></i>  Add trigger </a>
                </div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
        <div class="data-block">
            <div class="data-container">
                <table class="table table-striped showCheckboxes" url="core/api/triggers/bulk">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Condition</th>
                            <th>Value</th>
                            <th>Campaign</th>
                        </tr>
                    </thead>
                    <tbody id="triggers-model-list" route="trigger/"> </tbody>
                </table>
            </div>
        </div>
        {{/if}}
    </div>
    <div class="span3">
        <div class="well">
            <h3>
                What are Triggers?
            </h3>
            <br />
            <p>
                Triggers are pre-defined conditions set up by you. If the condition is satisfied, you can choose an action to follow using workflow automation.
            </p>
            <p>
                e.g. If a user registers on your website, you can automate the workflow to send a welcome email. The user registering on site is the trigger.
            </p>
        </div>
    </div>
</div>
</script><script id="workflow-active-contacts-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <div class="right">
				<div class="btn-group">
  					<button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
    					{{get_subscribers_type_from_hash}} Subscribers <span class="caret"></span>
  					</button>
  					<ul class="dropdown-menu" role="menu">
    					<li><a href="#workflow/all-subscribers/{{get_id_from_hash}}">All</a></li>
						<li><a href="#workflow/active-subscribers/{{get_id_from_hash}}">Active</a></li>
						<li><a href="#workflow/completed-subscribers/{{get_id_from_hash}}">Completed</a></li>
                        <li><a href="#workflow/removed-subscribers/{{get_id_from_hash}}">Removed</a></li>
                        <li><a href="#workflow/unsubscribed-subscribers/{{get_id_from_hash}}">Unsubscribed</a></li>
                        <li><a href="#workflow/hardbounced-subscribers/{{get_id_from_hash}}">Hard Bounced</a></li>
						<li><a href="#workflow/softbounced-subscribers/{{get_id_from_hash}}">Soft Bounced</a></li>
						<li><a href="#workflow/spam-reported-subscribers/{{get_id_from_hash}}">Spam Reported</a></li>
					</ul>
				</div>
			</div>
			<h3>Active Subscribers<!-- <small> - <span id="subscribers-campaign-name"></span></small>--> <span class="badge">{{subscribers_count}}</span></h3>
        </div>
    </div>
</div>
{{!-- Shows pad-content if active subscribers are empty --}}
{{#unless this.length}}
<div id="subscribers-slate"></div>
{{/unless}}

{{#if this.length}}
<div class="row">
	<div class="span12">
 		<div class="data">
        	<div class="data-container">
		    	<div class="btn delete-checked-contacts" id="remove-active-from-campaign" style="top: -10px; display: none;"> Delete</div>
            	
            	<!-- Shows selected contacts list and offer to select all if current list is more than the page-size -->
                <div style="display: block; left: 70px; position: relative;top: -23px;" id="subscribers-bulk-select"></div>
            	<br/>
				<br/>
            	<table class="table table-striped showCheckboxes" url="core/api/bulk/update?workflow_id={{get_id_from_hash}}&action_type=REMOVE_ACTIVE_SUBSCRIBERS" id="active-campaign">
                	<thead>
                    	<tr>
                        	<th>Contact</th>
                        	<th>Campaign Date</th>
                        	<th>Campaigns</th>
                    	</tr>
                	</thead>
                	<tbody id="workflow-active-contacts-model-list" route="contact/">
                	</tbody>
            	</table>
        	</div>
    	</div>
	</div>
</div>
{{/if}}
</script>
<script id="workflow-active-contacts-model-template" type="text/html">
<td class="data" data={{id}} style="width:20em;">
	<div style="display:inline;padding-right:10px;height:auto;">
    	<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px;" title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
    </div>
 	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:12em;overflow:hidden;">
    	<b>	{{contact_name properties type}} </b>
        <br />
        	{{getPropertyValue properties "email"}}
    </div>
    <div style="float:right"></div>
</td>
<td>
    <div>
        <small class="edit-hover"> 
		    <span><em>Started</em>&nbsp;</span>
                {{!-- Gets started time of current campaign from campaignStatus array having same campaign-id --}}

                {{#if_same_campaign this "campaignStatus"}}
                <time class="campaign-started-time" datetime="{{epochToHumanDate "" start_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start_time}}</time>
                {{/if_same_campaign}}
        </small>
    </div>
</td>
<td style="width: 50%">
    <div style="word-break:break-all">
		{{#if_other_active_campaigns this "campaignStatus"}}
           
         {{!-- Shows Active campaigns separated by comma --}}
         {{#if this.active}} 
         <div style="white-space: nowrap; width: 30em; overflow: hidden; text-overflow: ellipsis;">
           Active - {{#toLinkTrigger this.active}}<a href="#workflow/{{campaign_id}}" class="stop-propagation">{{#if campaign_name}}{{campaign_name}}{{else}} Active Campaign {{/if}}</a>{{/toLinkTrigger}}
         </div>
         {{/if}}
         {{#if this.done}}
         <div style="white-space: nowrap; width: 30em; overflow: hidden; text-overflow: ellipsis;">
         	Done - {{#toLinkTrigger this.done}}<a href="#workflow/{{campaign_id}}" class="stop-propagation">{{#if campaign_name}}{{campaign_name}}{{else}} Done Campaign {{/if}}</a>{{/toLinkTrigger}}
         </div>
         {{/if}} 
   
        {{/if_other_active_campaigns}}
	</div>
</td>
</script><script id="workflow-add-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="well">
            <form id="workflowform">
                <fieldset>
                    <div class="control-group">
                        <label class="control-label"><b>Name of campaign:</b> <span class="field_req">*</span></label>
                        <div class="controls">
							<a data-toggle="modal" id="workflow-designer-help" class="right" style="font-size:10px;margin-top:-20px;cursor:pointer; clear:both;">Need help? Watch our tutorial.</a>
                            <input name="workflow-name" type="text" id="workflow-name" class="span3 required" placeholder="Name of campaign" />
                            <span id="workflow-msg" style="margin-left: 130px;"></span>
							{{#if is_new}}
							<button class="btn btn-primary right" id="save-workflow-top" style="position:relative; margin-right:5px">Save Campaign</button>
							{{else}}
							<div class="btn-group right" style="position:relative;">
                            	<a href="#" class="btn" id="save-workflow-top"><i class="icon-plus-sign"></i> Save Campaign</a>
            					<a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
								<ul class="dropdown-menu pull-right">
									<li><a href="#" id="duplicate-workflow-top"><i class="icon-copy"></i> Create a Copy</a></li>
								</ul>
                            </div>
                            {{/if}}
                            <div style="display:inline-block;position:relative; margin-right:5px;margin-top:8px" class="save-workflow-img right"></div>
                        </div>
                    </div>
					<div id="designer-tour">
                    <IFRAME SRC="designer.html" id="designer" frameBorder="0" name="designer" WIDTH="100%" HEIGHT="900px"></IFRAME>
                    </div>
					<br />
                    <br />
                 
                    <div>
						<a href="#" id="workflow-unsubscribe-option" data-toggle="collapse" data-target="#workflow-unsubscribe-block"><span><i class="icon-plus"></i></span> Manage Unsubscription</a>
					</div>
					<br/>
					<div class="collapse" id="workflow-unsubscribe-block">
                    	<small>Agile can unsubscribe your contacts from either the current campaign or all campaigns (ongoing and future)</small>
						<div class="control-group">
							<label class="control-label" style="float: left; width: 140px; padding-top: 5px;">
								<b>Unsubscribe Action:</b>
							</label>
							<div class="controls" style="margin-left: 61px;">
								<select name="action" id="unsubscribe-action">
									<option value="ASK_USER">Prompt User (Recommended)</option>
									<option value="UNSUBSCRIBE_FROM_ALL">All Campaigns</option>
                                    <option value="UNSUBSCRIBE_FROM_THIS_CAMPAIGN">Current Campaign only</option>
								</select>
							</div>
                    	</div>
                        <br/>
                        <small>Agile can add the tags automatically when your contact unsubscribes. You can run more campaigns against this tag in future.</small>
                    	<div class="control-group">
							<label class="control-label" style="float: left; width: 140px; padding-top: 5px;">
								<b>Tags:</b>
							</label>
							<div class="controls" style="margin-left: 55px;">
								<input type="text" name="tag" id="unsubscribe-tag" placeholder="Separate tags with comma">
							</div>
                    	</div>
                        <br/>
                        <small>Unsubscribed contacts are not sent any further emails or tweets but other actions such as lead scoring will still continue to execute.</small>
					</div>
                   
                    <br />
                    <br />
                    {{#if is_new}}
						<button class="btn btn-primary" id="save-workflow-bottom">Save Campaign</button>
					{{else}}
						<div class="btn-group" style="display: inline-block; margin-bottom: -10px;">
                           	<a href="#" class="btn" id="save-workflow-bottom"><i class="icon-plus-sign"></i> Save Campaign</a>
            				<a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
							<ul class="dropdown-menu pull-right">
								<li><a href="#" id="duplicate-workflow-bottom"><i class="icon-copy"></i> Create a Copy</a></li>
							</ul>
                         </div>
                    {{/if}}
                    <div style="display:inline-block" class="save-workflow-img"></div>
                    <br />
                </fieldset>
            </form>
        </div>
    </div>
</div>
</script><script id = "campaign-node-limit-modal-template" type="text/html">
<div class="modal hide fade" id="campaign-node-limit-modal">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-file-text"></i> Campaign Node Limit Reached</h3>
    </div>
	<div class="modal-body">
        <div id="limit-alert-details">
            <p>You have reached the limit of {{campaignNodesLimit}} nodes in your current plan {{planName}}. Please consider upgrading or splitting the campaign and use the 'Transfer' option.</p>
        </div>
    </div>
    <div class="modal-footer">
    <span class="contacts-export-csv-message" style="margin-right:5px"></span>
    <a href="#" class="btn btn-primary" data-dismiss="modal">OK</a>
    </div>
</div>
</script>

<script id = "SMSGateway-integration-alert-modal-template" type="text/html">
	<div class="modal hide fade" id="SMSGateway-integration-alert">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3><i class="icon-file-text"></i> {{title}} </h3>
		</div>
		<div class="modal-body">
			{{#if_equals "SMS Gateway not Configured" title}} 
				<div id="Twilio-Gateway-not-Configured-details">
					<p>{{message}}</p>
				</div>
			{{/if_equals}}
			{{#if_equals "No Twilio Number" title}} 
				<div id="No-Twilio-Number-details">
					<p>{{message}}</p>
				</div>
			{{/if_equals}}
		</div>
		<div class="modal-footer">
			<span class="contacts-export-csv-message" style="margin-right:5px"></span>
				<a href="#" class="btn btn-primary" data-dismiss="modal">OK</a>
		</div>
	</div>
</script>
<script id = workflow-designer-help-modal-template type="text/html">
<div class="modal hide fade" id="workflow-designer-help-modal">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-play-sign"></i> Workflow Tutorial</h3>
    </div>
	<div class="modal-body">
        <div id="workflow-help-detail" style="margin-left:50px;">
		</div>
    </div>
</div>
</script><script id="workflow-other-subscribers-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <div class="right">
				<div class="btn-group">
  					<button type="button" class="btn dropdown-toggle" data-toggle="dropdown">
    					{{get_subscribers_type_from_hash}} Subscribers <span class="caret"></span>
  					</button>
  					<ul class="dropdown-menu" role="menu">
    					<li><a href="#workflow/all-subscribers/{{get_id_from_hash}}">All</a></li>
						<li><a href="#workflow/active-subscribers/{{get_id_from_hash}}">Active</a></li>
						<li><a href="#workflow/completed-subscribers/{{get_id_from_hash}}">Completed</a></li>
                        <li><a href="#workflow/removed-subscribers/{{get_id_from_hash}}">Removed</a></li>
                        <li><a href="#workflow/unsubscribed-subscribers/{{get_id_from_hash}}">Unsubscribed</a></li>
                        <li><a href="#workflow/hardbounced-subscribers/{{get_id_from_hash}}">Hard Bounced</a></li>
						<li><a href="#workflow/softbounced-subscribers/{{get_id_from_hash}}">Soft Bounced</a></li>
						<li><a href="#workflow/spam-reported-subscribers/{{get_id_from_hash}}">Spam Reported</a></li>
					</ul>
				</div>
			</div>
			<h3>{{get_subscribers_type_from_hash}} Subscribers<!--<small> - <span id="subscribers-campaign-name"></span></small>--> <span class="badge">{{subscribers_count}}</span></h3>
        </div>
    </div>
</div>

{{!-- Shows pad-content if subscribers are empty --}}
{{#unless this.length}}
<div id="subscribers-slate"></div>
{{/unless}}

{{#if this.length}}
<div class="row">
	<div class="span12"
		<div class="data">
        	<div class="data-container">
            	<table class="table table-striped onlySorting">
                	<thead>
                    	<tr>
							<th></th>
                        	<th>Contact</th>
                        	<th>Campaign Date</th>
							<!--<th>Status</th>-->
							<th>Campaigns</th>
                    	</tr>
                	</thead>
                	<tbody id="workflow-other-subscribers-model-list" route="contact/">
                	</tbody>
            	</table>
        	</div>
    	</div>
	</div>
</div>
{{/if}}
</script>
<script id="workflow-other-subscribers-model-template" type="text/html">
<td></td>
<td class="data" data={{id}} style="width:20em;">
	<div style="display:inline;padding-right:10px;height:auto;">
    	<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px;" title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
    </div>
 	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:12em;overflow:hidden;">
    	<b>	{{contact_name properties type}} </b>
        <br />
        	{{getPropertyValue properties "email"}}
    </div>
    <div style="float:right"></div>
</td>
<td>
    <div>
        <small class="edit-hover"> 
		    <span><em>Started</em>&nbsp;</span>
                {{#if_same_campaign this "campaignStatus"}}
                <time class="campaign-started-time" datetime="{{epochToHumanDate "" start_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start_time}}</time>
                </br>
				{{#if this.end_time}}
				<span><em>Completed</em>&nbsp;</span>
                <time class="campaign-completed-time" datetime="{{epochToHumanDate "" end_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" end_time}}</time>
                {{/if}}
				{{/if_same_campaign}}
        </small>
    </div>
</td>
<!--<td>
 {{#if_same_campaign this "campaignStatus"}} {{#if this.end_time}}Completed{{else}} Active{{/if}} {{/if_same_campaign}}
</td> -->
<td style="width: 50%">
    <div style="word-break:break-all">
		{{#if_other_active_campaigns this "campaignStatus"}}
           
         {{!-- Shows Active campaigns separated by comma --}}
         {{#if this.active}} 
         <div style="white-space: nowrap; width: 30em; overflow: hidden; text-overflow: ellipsis;">
           Active - {{#toLinkTrigger this.active}}<a href="#workflow/{{campaign_id}}" class="stop-propagation">{{#if campaign_name}}{{campaign_name}}{{else}} Active Campaign {{/if}}</a>{{/toLinkTrigger}}
         </div>
         {{/if}}
         {{#if this.done}}
         <div style="white-space: nowrap; width: 30em; overflow: hidden; text-overflow: ellipsis;">
         	Done - {{#toLinkTrigger this.done}}<a href="#workflow/{{campaign_id}}" class="stop-propagation">{{#if campaign_name}}{{campaign_name}}{{else}} Done Campaign {{/if}}</a>{{/toLinkTrigger}}
         </div>
         {{/if}} 
   
        {{/if_other_active_campaigns}}
	</div>
</td>
</script><script id="workflows-model-template" type="text/html">
	<td class="hide data" data="{{id}}">{{id}}</td>
	<td><a style="text-decoration:none;">{{name}}</a></td>
<!--<td><div style="height:auto;text-overflow:ellipsis;white-space:nowrap;width:5em;overflow:hidden;">
           {{#if pic}} 
               <img class="thumbnail" src="{{pic}}" width="40px" height="40px" />
           {{else}}
               <img class="thumbnail" src="{{defaultGravatarurl 40}}" width="40px" height="40px" />
           {{/if}}
           <b> {{creatorName}}</b>
        </div>
    </td>
    <td>
        <div>
			<a href="#workflow/active-contacts/{{id}}" id="active-contacts" class="stop-propagation">active</a>, 
            <a href="#workflow/completed-contacts/{{id}}" id="done-contacts" class="stop-propagation">completed</a>
        </div>
    </td>-->
    <td class="workflow-triggers" workflow-id={{id}}><a href="#trigger-add/{{id}}" class="stop-propagation"><i class="icon-plus" style="font-size:10px;margin-left:15px"></i> Add</a></td>
	<!--<td><a href="#workflow/all-subscribers/{{id}}" class="workflow-subscribers stop-propagation">Subscribers</a></td>
	<td><a href="#workflows/logs/{{id}}"  class="stop-propagation ">Logs</a></td> -->
    <td><a href="#email-reports/{{id}}" class="stop-propagation">Reports</a></td>
    <td> 
        {{#if updated_time}}
        <div>
            <small class="edit-hover"> 
		        <span><em>Modified</em>&nbsp;</span>
                <time class="campaign-created-time" datetime="{{epochToHumanDate "" updated_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" updated_time}}</time>
            </small>
        </div>
        {{else}}
        <div>
            <small class="edit-hover"> 
		       <span><em>Created</em>&nbsp;</span>
               <time class="campaign-created-time" datetime="{{epochToHumanDate "" created_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
         	</small>
        </div>
        {{/if}}
    </td>  
<br />
</script>

<script id="workflows-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Campaigns <small>{{#campaigns_heading this}}{{/campaigns_heading}}</small></h1>
			<div class="btn-group right" style="top:-30px;position:relative">
            	<a href="#workflow-templates" class="btn" id="addWorkflow"><i class="icon-plus-sign"></i> Add Campaign</a>
            	<a id="campaign-stats" class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
				<ul class="dropdown-menu pull-right">
					<li><a href="#campaign-stats" id="campaign-stats"><i class="icon-bar-chart"></i> Compare Campaigns</a></li>
				</ul>
			</div>
            <a href="#triggers" class="btn right" id="add-trigger" style="top:-30px;position:relative; margin-right:10px"><i class="icon-cog"></i> Manage Triggers</a>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
      <!-- Pending Triggers Content -->
        <div id="triggers-verification" style="margin-top:-10px;display:none;">
            <div class="alert danger info-block" style="color: black;background-color: rgb(255,255,204);border: 1px solid rgb(211,211,211);">
                <div>
                <i class="icon-warning-sign"></i><strong style="">PENDING TRIGGERS. <!--<a href="#trigger-add" style="float: right;cursor: pointer;font-weight: normal;">How to add trigger?</a>--></strong>
                <p>You have at least one campaign but no triggers yet. <br/></p>
                <p>Campaigns can be manually run on contact(s) or you can setup a trigger to run the campaign automatically based on certain conditions. <a href="#trigger-add">Setup a new trigger.</a></p>
                </div>
            </div>
        </div>
        <!-- End of Pending Triggers Content -->

        {{#unless this.length}}
        <div id="slate">
        </div>
        {{/unless}}
        {{#if this.length}}
{{add_tag "Campaigns"}}
        <div class="data-block">
            <div class="data-container">
                <table class="table table-striped showCheckboxes" url="core/api/workflows/bulk" id="workflows-tour-step">
                    <thead>
                        <tr>
                            <th class="hide">Id</th>
                            <th>Name</th>
                       <!-- <th>Creator</th> -->
                       <!-- <th>Subscribers</th> -->
                            <th>Triggers</th>
                        </tr>
                    </thead>
                    <tbody id="workflows-model-list" style="cursor:pointer;" route="workflow/"> </tbody>
                </table>
            </div>
        </div>
        {{/if}}
    </div>
    <div class="span3" id="learn-workflows">
        <div class="well">
            <h3>
                What is Workflow Automation?
            </h3>
            <br />
            <p>
                Workflow is an intelligent sales and marketing automation process for sending your contacts relevant information at the right time.Use it to automate most of your follow-up activities.
            </p>
            <p>
                e.g. You can send an email to all users who have signed up on your site. And then based on their behavior in the control panel, you can send them targeted messages periodically.
            </p>
            <br />
            <h3>
                What are Triggers?
            </h3>
            <br />
            <p>
                Triggers are pre-defined conditions set up by you. If the condition is satisfied, you can choose an action to follow using workflow automation.
            </p>
            <p>
                e.g. If a user registers on your website, you can automate the workflow to send a welcome email. The user registering on site is the trigger.
            </p>
        </div>
    </div>
</div>
</script><script type="text/html" id="workflow-categories-template">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h2>Select a template <small> New Campaign</small></h2>
            <a href="#workflow-add" class="btn" title="Start with an empty campaign" style="float:right;top: -32px;position: relative;">
				I'm Pro
            </a>
        </div>
    </div>
    <div class="span12">
        <div class="page-header">
            <h2>General</h2>
        </div>
        <div id="general" class="row">
			<div class="span3">
    			<div class="well" style="text-align: center;">
        		<!-- Icon and Title -->
        			<div>
            			<div style="padding:20px 0px 10px;">
                			<i class="icon-file-text icon-4x"></i>
            			</div>
            			<b>Newsletter</b>
        			</div>
        			<br>
        			<!-- Description -->
        			<div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="Send a newsletter and see reports on opens and clicks">
            			Send a newsletter and see reports on opens and clicks
        			</div>
        			<!-- Add button -->
        			<div style="/*margin: 40px auto;	width: 50%;*/">
            			<a class="btn btn-primary workflow-template-add" href="#workflow-add/general/newsletter">Go</a>
        			</div>
    			</div>
			</div>

			<div class="span3">
    			<div class="well" style="text-align: center;">
        			<!-- Icon and Title -->
        			<div>
            			<div style="padding:20px 0px 10px;">
                			<i class="icon-time icon-4x"></i>
            			</div>
            			<b>Autoresponder</b>
        			</div>
        			<br>
        			<!-- Description -->
        			<div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="Send emails and follow-up automatically after a specified duration">
            			Send emails and follow-up automatically after a specified duration
        			</div>
        			<!-- Add button -->
        			<div style="/*margin: 40px auto;	width: 50%;*/">
            			<a class="btn btn-primary workflow-template-add" href="#workflow-add/general/auto_responder">Go</a>
        			</div>
    			</div>
			</div>
		</div>
        <br>
    </div>
    <div class="span12">
        <div class="page-header">
            <h2>Marketing Automation</h2>
        </div>
        <div id="marketing-automation" class="row">
        
<div class="span3">
    <div class="well" style="text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 0px 10px;">
                <i class="icon-star-half-full icon-4x"></i>
            </div>
            <b>Lead Scoring</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="Score your leads when they click email links and browse the website">
            Score your leads when they click email links and browse the website
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary workflow-template-add" href="#workflow-add/marketing-automation/lead_scoring">Go</a>
        </div>
    </div>
</div>

<div class="span3">
    <div class="well" style="text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 0px 10px;">
                <i class="icon-twitter icon-4x"></i>
            </div>
            <b>Social Campaign</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="Reach out to prospects on social media. Send automated Tweets">
            Reach out to prospects on social media. Send automated Tweets
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary workflow-template-add" href="#workflow-add/marketing-automation/social_campaign">Go</a>
        </div>
    </div>
</div>

<div class="span3">
    <div class="well" style="text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 0px 10px;">
                <i class="icon-beaker icon-4x"></i>
            </div>
            <b>A/B Test</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="A/B test your emails. Compare results and optimize messages">
            A/B test your emails. Compare results and optimize messages
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary workflow-template-add" href="#workflow-add/marketing-automation/ab_testing">Go</a>
        </div>
    </div>
</div>
</div>
        <br>
    </div>
    <div class="span12">
        <div class="page-header">
            <h2>SaaS</h2>
        </div>
        <div id="saas" class="row">
        
<div class="span3">
    <div class="well" style="text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 0px 10px;">
                <i class="icon-gift icon-4x"></i>
            </div>
            <b>Signup Welcome</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="Send a welcome email after users signup">
            Send a welcome email after users signup
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary workflow-template-add" href="#workflow-add/saas/signup_welcome">Go</a>
        </div>
    </div>
</div>

<div class="span3">
    <div class="well" style="text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 0px 10px;">
                <i class="icon-plane icon-4x"></i>
            </div>
            <b>User Onboarding</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="Help your users with timely communication to bring them onboard and improve retention">
            Help your users with timely communication to bring them onboard and improve retention
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary workflow-template-add" href="#workflow-add/saas/user_onboarding">Go</a>
        </div>
    </div>
</div>

<div class="span3">
    <div class="well" style="text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 0px 10px;">
                <i class="icon-level-up icon-4x"></i>
            </div>
            <b>Trial Conversion</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="Identify who among your free/trial users are ready to convert and reach out to them">
            Identify who among your free/trial users are ready to convert and reach out to them
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary workflow-template-add" href="#workflow-add/saas/trial_conversion">Go</a>
        </div>
    </div>
</div>
</div>
        <br>
    </div>
    <div class="span12">
        <div class="page-header">
            <h2>E-commerce</h2>
        </div>
        <div id="ecommerce" class="row">
        
<div class="span3">
    <div class="well" style="text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 0px 10px;">
                <i class="icon-shopping-cart icon-4x"></i>
            </div>
            <b>Cart Abandonment</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="Detect when your users abandon cart and send them relavent communication">
            Detect when your users abandon cart and send them relavent communication
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary workflow-template-add" href="#workflow-add/ecommerce/cart_abandonment">Go</a>
        </div>
    </div>
</div>

<div class="span3">
    <div class="well" style="text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 0px 10px;">
                <i class="icon-bullseye icon-4x"></i>
            </div>
            <b>Targeted Promo</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline" style="/*-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;*/margin-bottom: 20px;" rel="tooltip" title="Send relevant and timely promotional communication to users based on their interests and actions">
            Send relevant and timely promotional communication to users based on their interests and actions
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary workflow-template-add" href="#workflow-add/ecommerce/targeted_promo">Go</a>
        </div>
    </div>
</div>
</div>
        <br>
    </div>
</div>
</script><script id="workflow-triggers-template" type="text/html">

{{!-- Shows triggers of each workflow --}}
{{#toLinkTrigger triggers}} <a href="#trigger/{{id}}" class="stop-propagation">{{name}}</a>{{/toLinkTrigger}}

</script>