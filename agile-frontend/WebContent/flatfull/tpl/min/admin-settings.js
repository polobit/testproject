<script id="admin-settings-template" type="text/html">
<!-- Check whether DomainUSer has admin Privileges -->
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Admin Settings<a href="#subscribe" class="pull-right" style="font-size:20px;margin-top:10px;">Plan & Upgrade</a></h1>
        </div>
    </div>
</div>

<div class="row">
	<div class="span12">
		<ul class="nav nav-tabs" id="AdminPrefsTab">
			<li class="account-prefs-tab active"><a href="#account-prefs">Account Preferences</a></li>
			<li class="users-tab"><a href="#users">Users</a></li>
			<li class="custom-fields-tab"><a href="#custom-fields">Custom Fields</a></li>
			<li class="analytics-code-tab"><a href="#analytics-code">API & Analytics</a></li>
			<li class="milestones-tab"><a href="#milestones">Deals</a></li>
		<!-- <li class="menu-settings-tab"><a href="#menu-settings">Menu Settings</a></li> -->
            <!-- Bhasuri 10/25/2014 -->
			<li class="stats-tab"><a href="#integrations-stats">Stats</a></li>
			<li class="tag-management-tab"><a href="#tag-management">Tag Management</a></li>
			<li class="integrations-tab"><a href="#integrations">Integrations</a></li>
		</ul>
		<div class="tab-content">
			<div class="tabs" id="admin-prefs-tabs-content"><img src="img/1-0.gif"></img></div>
		</div>
	</div>
</div>
</script><script id="admin-settings-api-key-model-template" type="text/html">
<!-- 
<div class="row">
	<div class="span12">
		<div class="">
			<h3><strong>API & Analytics</strong></h3>
		</div>
	</div>
</div>-->

<div class="row">
	<div class="span5">
		<ul class="nav nav-tabs" id="APITab">
			<li class="api-tab active"><a data-toggle="tab" href="#api">API Key</a></li>
			<li class="analytics-tab"><a data-toggle="tab" href="#analytics">Analytics Code</a></li>
		</ul>
		<div class="tab-content">

			<!--  API Key templete -->

<div class="tab-pane active" id="api">
    <b>API key</b> for REST clients (Java, PHP, .Net wrappers) and integrations (Zapier, Wufoo, Unbounce, Chrome extension and others).
   <div class="clearfix"></div>
   <br/>
   <div class="row-fluid">
      <div class="span11">
         <div>
			<pre class="prettyprint pln" id="api_key_code">{{api_key}}<span style="display: inline-block; float:right;"><a id="api_key_generate_icon" style="margin:4px 4px 0px 0px;cursor:pointer;"><i class="icon-repeat"></i></a><img border="0" src="/img/help.png" style="height: 6px; vertical-align: text-top" rel="popover" data-placement="bottom" data-title="" data-content="Reset API Key" id="element" data-trigger="hover" data-original-title=""></span></pre>
         </div>
      </div>
   </div>
  <b>Javascript API key</b> only for tracking code on website.
  <div class="clearfix"></div>
   <br/>
      <div class="row-fluid">
      <div class="span11">
         <div>
			<pre class="prettyprint pln" id="jsapi_key_code">{{js_api_key}}<span style="display: inline-block; float:right;"><a id="jsapi_key_generate_icon" style="margin:4px 4px 0px 0px;cursor:pointer;"><i class="icon-repeat"></i></a><img border="0" src="/img/help.png" style="height: 6px; vertical-align: text-top" rel="popover" data-placement="bottom" data-title="" data-content="Reset JavaScript API Key" id="element" data-trigger="hover" data-original-title=""></span></pre>
         </div>
      </div>
   </div>
	<!--<form id="allowedDomainsForm" method="get" action="" class="form-horizontal">

    	<label>Allowed Domains<span class="field_req">*</span></label> <br/>
		<textarea class="required" name="allowed_domains" cols="50" rows="4" id="allowed_domains">{{allowed_domains}}</textarea>
		<input type="text" name="id" class="hidden" value={{id}}>
		<input type="text" name="api_key" class="hidden" value={{api_key}}>
		<input type="text" name="js_api_key" class="hidden" value={{js_api_key}}> <br/> <br/>       	
		<button type="submit" class="save btn btn-primary">Save Changes</button>
	</form>-->
</div>

			<!-- End of API Key templete-->

			<div class="tab-pane" id="analytics">

<div class="row-fluid">
	<div class="span11">
		<p>You can use javascript API to track page views on your site, add / delete contacts from your website or blog directly. Copy and paste the below code in your webpage's HTML just before the <b>&lt;/BODY&gt;</b> tag to enable tracking / API methods.</p>

		<ul class="nav nav-pills" id="TrackingTab">
			<li class="tracking-tab"><a data-toggle="tab" href="#tracking"><span>Tracking code</span></a></li>
			<li class="tracking-webrules-tab active"><a data-toggle="tab" href="#tracking-webrules"><span>Tracking code with Web Rules enabled</span></a></li>
		</ul>
		<div class="tab-content">

			<!--  Tracking code templete -->
			<div class="tab-pane" id="tracking">
<div class="clearfix"></div>
<div><!--<a class="right btn" id="api_track_code_icon" style="margin:5px 10px 0px 0px;cursor:pointer;"><i class="icon-copy"></i></a>-->
<pre class="prettyprint" id="api_track_code">
&lt;script type="text/javascript" src="https://{{getCurrentDomain}}.agilecrm.com/stats/min/agile-min.js"&gt; 
&lt;/script&gt;
&lt;script type="text/javascript" &gt;
 _agile.set_account('{{js_api_key}}', '{{getCurrentDomain}}');
 _agile.track_page_view();
&lt;/script&gt;
</pre></div>
			</div>
			<!-- End of Tracking code templete -->

			<!--  Tracking code with Web Rules templete -->
			<div class="tab-pane active" id="tracking-webrules">
<div class="clearfix"></div>
<div><!--<a class="right btn" id="api_track_webrules_code_icon" style="margin:5px 10px 0px 0px;cursor:pointer;"><i class="icon-copy"></i></a>-->
<pre class="prettyprint" id="api_track_webrules_code">
&lt;script type="text/javascript" src="https://{{getCurrentDomain}}.agilecrm.com/stats/min/agile-min.js"&gt; 
&lt;/script&gt;
&lt;script type="text/javascript" &gt;
 _agile.set_account('{{js_api_key}}', '{{getCurrentDomain}}');
 _agile.track_page_view();
 _agile_execute_web_rules();
&lt;/script&gt;
</pre></div>
			</div>
			<!-- Tracking code with Web Rules templete -->

		</div>
	</div>
</div>

<br/>
<p><b>API Reference</b></p>

Set Email (Mandatory)<div class="clearfix"></div><br/>
				<div class="row-fluid">
    				<div class="span11">
<pre class="prettyprint">
 _agile.set_email('jim@example.com');
</pre>
	</div>
</div>

Track Page View<div class="clearfix"></div><br/>
				<div class="row-fluid">
    				<div class="span11">
<pre class="prettyprint">
 _agile.track_page_view({
   success: function(data) {
     console.log("success");
   },
   error: function(data) {
     console.log("error");
   }
 })</pre>
	</div>
</div>

Create Contact<div class="clearfix"></div><br/>
				<div class="row-fluid">
    				<div class="span11">
<pre class="prettyprint">
 _agile.create_contact({
  "email": "jim@example.com",
  "first_name": "Jim",
  "last_name": "Brown",
  "company": "abc corp",
  "title": "lead",
  "phone": "+1-541-754-3010",
  "website": "http://www.example.com",
  "address": "{\"city\":\"new delhi\", \"state\":\"delhi\",\"country\":\"india\"}",
  "tags": "tag1, tag2"
}, {
  success: function(data) {
    console.log("success");
  },
  error: function(data) {
    console.log("error");
  }
});
</pre>
	</div>
</div>

Delete Contact<div class="clearfix"></div><br/>
				<div class="row-fluid">
    				<div class="span11">
<pre class="prettyprint">
 _agile.delete_contact('jim@example.com', {
   success: function(data) {
     console.log("success");
   },
   error: function(data) {
     console.log("error");
   }
 });</pre>
	</div>
</div>

Add Property<div class="clearfix"></div><br/>
				<div class="row-fluid">
    				<div class="span11">
<pre class="prettyprint">
_agile.set_property({
  "name": "phone",
  "value": "+1-541-754-3010",
  "type": "mobile"
}, {
  success: function(data) {
    console.log("success");
  },
  error: function(data) {
    console.log("error");
  }
});</pre>
	</div>
</div>

Add Tag<div class="clearfix"></div><br/>
				<div class="row-fluid">
    				<div class="span11">
<pre class="prettyprint">
 _agile.add_tag('tags2, tag3, tag4', {
   success: function(data) {
     console.log("success");
   },
   error: function(data) {
     console.log("error");
   }
 });</pre>
	</div>
</div>

Remove Tag<div class="clearfix"></div><br/>
				<div class="row-fluid">
    				<div class="span11">
<pre class="prettyprint">
 _agile.remove_tag('tag4, tag5, tag6', {
   success: function(data) {
     console.log("success");
   },
   error: function(data) {
     console.log("error");
   }
 });</pre>
	</div>
</div>

Add Score<div class="clearfix"></div><br/>
				<div class="row-fluid">
    				<div class="span11">
<pre class="prettyprint">
_agile.add_score(10, {
  success: function(data) {
    console.log("success");
  },
  error: function(data) {
    console.log("error");
  }
});

// Subtract Score
_agile.add_score(-5, {
  success: function(data) {
    console.log("success");
  },
  error: function(data) {
    console.log("error");
  }
});
</pre>
	</div>
</div>

			</div>

		</div>
	</div>

    <div class="span3 offset4">
        <div class="data-block">
            <div class="well">
				<h3>
                    Help
                </h3>
                <br />
				<p>Agile supports open standard REST. You can use any language which supports REST.</p>
				We currently have the following libraries for your convenience<br/>
				<ul>
					<li>Java - <a href="https://github.com/agilecrm/java-api" target="_blank" rel="nofollow" title="Link: https://github.com/agilecrm/java-api">GitHub</a></li>
					<li>Javascript - <a href="https://github.com/agilecrm/javascript-api" target="_blank" rel="nofollow" title="Link: https://github.com/agilecrm/javascript-api">GitHub</a></li>
                    <li>PHP - <a href="https://github.com/agilecrm/php-api" target="_blank" rel="nofollow" title="Link: https://github.com/agilecrm/php-api">GitHub</a></li>
                    <li>.NET - <a href="https://github.com/agilecrm/c-sharp-api" target="_blank" rel="nofollow" title="Link: https://github.com/agilecrm/c-sharp-api">GitHub</a></li>
				</ul>
				We will be publishing API for other languages very soon.
            </div>
        </div>
    </div>


</div>

</script>
<script id = "admin-settings-api-model-template" type="text/html">
<div class="row">
    <div class="span7">
        <pre class="prettyprint linenums " ">
            API-KEY  {{api_key}}
        </pre>
    </div>
</div>
</script><script id="admin-settings-account-prefs-template" type="text/html">
<!--  Contact View Detail in Detailed mode - when only one contact is shown -->
<div class="row">
<div class="span8 well">
    <form id="accountPrefs" class="form-horizontal">
        <fieldset>
            <input name="id" type="hidden" value="{{id}}" />
            <legend>Account Preferences</legend>
            <div class="row-fluid">
				<div class="span7">
                    <div class="control-group" style="margin-bottom:10px;">
                        <label class="control-label" style="text-align: right;padding-right: 14px;">Plan</label> 
                        <div class="controls" style="margin-top: 5px;">
                            {{#if plan.plan_id}}
                            {{plan.plan_id}} ( <a href="#subscribe" class="link-border">Upgrade</a> | <a href="#" id="cancel-account-request" class="link-border">Cancel Account</a> )
                            {{else}}
                            Free ( <a href="#subscribe" class="link-border">Upgrade</a> | <a href="#" id="cancel-account" class="link-border">Cancel Account</a> )
                            {{/if}}
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">Users</label>
                        <div class="controls" style="margin-top: 5px;">
                            {{#if plan.quantity}}
                            {{plan.quantity}}
                            {{else}}
                            1
                            {{/if}}
                        </div>
                    </div>
                    <div class="control-group" style="margin-bottom:10px;">
                        <label class="control-label">Company <span class="field_req">*</span></label> 
                        <div class="controls">
                            <input name="company_name" class="input-medium required" type="text" value="{{company_name}}" />
                        </div>
                    </div>
					 <input name="timezone" type="hidden" value="{{timezone}}" />
				</div>
                <div style="margin-right:65px;">
                    <div class="right">
                        <div id="upload-container" messg="User image has been uploaded">
                            <div class="clearfix">
                                <div class="imgholder">
                                    {{#if logo}}
                                    <img class="thumbnail" src="{{logo}}" height="75" width="75" />
                                    {{else}}
                                    <img class="thumbnail" src="https://contactuswidget.appspot.com/images/pic.png" height="75" width="75" />
                                    {{/if}}													
                                </div>
                                <p>
                                    <input type="hidden" id="upload_url" name="logo" />  
                                    <input style="margin: 10px 0px 0px;" class="upload_s3 btn" type="button" id="account_prefs_image" value="Upload Logo" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="form-actions">
                <a href="#" type="submit" class="save btn btn-primary">Save Changes</a>
            </div>
        </fieldset>
    </form>
</div>
</div>
</script><script id="custom-field-add-modal-template" type="text/html">
<!-- New (Text) Modal views -->
<div class="modal hide" id="custom-field-add-modal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="textModalForm" name="textModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label class="control-label">Label <span class="field_req">*</span></label> 
                    <div class="controls">
					{{#if id}}
                        <input type="text" id="label" placeholder="Label" class="required noSpecialChars" value="{{../field_label}}" disabled / >
						<input name="field_label" type="text" id="label" placeholder="Label" class="required noSpecialChars hide" value="{{../field_label}}" / >
						{{else}}
							<input name="field_label" type="text" id="label" placeholder="Label" class="required noSpecialChars" value="{{field_label}}"/>
					{{/if}}
                    </div>
                </div>
  				<div class="control-group">
                    <label class="control-label">Type <span class="field_req">*</span></label>
                    <div class="controls">
						 <select name="field_type" id="custom-field-type">
							<option value="TEXT">Text Field</option>
							<option value="TEXTAREA">Text Area</option>
							<option value="DATE">Date Field</option>
							<option value="CHECKBOX">Checkbox</option>
							<option value="LIST">List</option>
							<option value="NUMBER">Number</option>
							<!-- <option value="FORMULA">Formula</option> -->
						</select>
                    </div>
                </div>
                <input class="hide" name="scope" type="text" placeholder="Label" value="{{scope}}" />
				<input class="hide" name="position" type="text" placeholder="Label" value="{{position}}" />
                <div class="control-group">
                    <label class="control-label">Description <span class="field_req">*</span></label>
                    <div class="controls">
                        <input name="field_description" type="text" id="field_description" placeholder="Description" class="required" />
                    </div>
                </div>
				<div id="custom-field-custom-info"></div>
				 <div class="control-group" id="custom-field-list-values" style="display:none">
                    <label class="control-label">List Values <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_data" type="text" id="listvalues" placeholder="Enter values separated by semicolon" class="required" />
                    </div>
                </div>
			    <div class="control-group" id="custom-field-data" style="display:none">
                    <label class="control-label">Number of Lines <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_data" type="text" id="arearows" placeholder="Rows" class="required digits" max="10" min="2" />
                    </div>
                </div>
				<div class="control-group" id="custom-field-formula-data" style="display:none">
                    <label class="control-label">Formula <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <textarea name="field_data" id="formulaData" placeholder="Ex: \{{number1}}*(\{{number2}}+\{{number3}})" class="formulaData required" style="max-width:420px;" rows="3" />
                    </div>
					<div class="tip">
						<p style="margin-left:161px;color:#999999;">
							<i class="icon-lightbulb" style="font-size:17px;"></i> 
							An arithmetic formula based on number custom fields. <a href="http://mustache.github.io/" target="_blank">Mustache conditions</a> can be used here.
						</p>
					</div>
                </div>
                <div class="row-fluid">
                    <div class="control-group span4">
                        <label class="control-label">Required </label>
                        <div class="controls">
                            <input name="is_required" type="checkbox" id="required" />
                        </div>
                    </div>
                    <div class="control-group span4" style="margin-left:38px">
                        <label class="control-label">Searchable </label>
                        <div class="controls"> 
                            <input name="searchable" type="checkbox" id="searchable" />
                        </div>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label hide">Validation Rule <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="validationRule" type="hidden" id="validationRule" placeholder="Validation Rule" class="required" value="*" />
                    </div>
                </div>
				{{#if id}}
					<input name="id" value="{{id}}" class="hide"></input>
				{{/if}}
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</script>

<script id="custom-field-text-modal-template" type="text/html">
<!-- New (Text) Modal views -->
<div class="modal hide" id="textModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="textModalForm" name="textModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label class="control-label">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required noSpecialChars" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="TEXT" />
                <div class="control-group">
                    <label class="control-label">Description <span class="field_req">*</span></label>
                    <div class="controls">
                        <input name="field_description" type="text" id="field_description" placeholder="Description" class="required" />
                    </div>
                </div>
			     <div class="control-group">
                    <label class="control-label">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						 <select name="scope">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="control-group span4">
                        <label class="control-label">Required </label>
                        <div class="controls">
                            <input name="is_required" type="checkbox" id="required" />
                        </div>
                    </div>
                    <div class="control-group span4" style="margin-left:38px">
                        <label class="control-label">Searchable </label>
                        <div class="controls"> 
                            <input name="searchable" type="checkbox" id="searchable" />
                        </div>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label hide">Validation Rule <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="validationRule" type="hidden" id="validationRule" placeholder="Validation Rule" class="required" value="*" />
                    </div>
                </div>
			
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</script>
<!-- End of (Text) Modal views -->

<script id="custom-field-date-modal-template" type="text/html">
<!-- New (Date) Modal views -->
<div class="modal hide " id="dateModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="dateModalForm" name="dateModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label class="control-label">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required noSpecialChars" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="DATE" />
                <div class="control-group">
                    <label class="control-label">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required" />
                    </div>
                </div>
	    	 <div class="control-group">
                    <label class="control-label">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="control-group span4">
                        <label class="control-label">Required </label>
                        <div class="controls">
                            <input name="is_required" type="checkbox" id="required" />
                        </div>
                    </div>
                    <div class="control-group span4" style="margin-left:38px">
                        <label class="control-label">Searchable </label>
                        <div class="controls"> 
                            <input name="searchable" type="checkbox" id="searchable" />
                        </div>
                    </div>
                </div>
				<p style="margin-left:20px;">Note : For date custom fields, the field value if provided using the API, should be an epoch number.</p>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</script>
<!-- End of (Date) Modal views -->

<script id="custom-field-list-modal-template" type="text/html">
<!-- New (List) Modal views -->
<div class="modal hide " id="listModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="listModalForm" name="listModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label class="control-label">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required noSpecialChars" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="LIST" />
                <div class="control-group">
                    <label class="control-label">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required" />
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">List Values <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_data" type="text" id="listvalues" placeholder="Enter values separated by semicolon" class="required" />
                    </div>
                </div>
	     		<div class="control-group">
                    <label class="control-label">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="control-group span4">
                        <label class="control-label">Required </label>
                        <div class="controls">
                            <input name="is_required" type="checkbox" id="required" />
                        </div>
                    </div>
                    <div class="control-group span4" style="margin-left:38px">
                        <label class="control-label">Searchable </label>
                        <div class="controls"> 
                            <input name="searchable" type="checkbox" id="searchable" />
                        </div>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</script>
<!-- End of (List) Modal views -->

<script id="custom-field-checkbox-modal-template" type="text/html">
<!-- New (Check Box) Modal views -->
<div class="modal hide " id="checkboxModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="checkboxModalForm" name="checkboxModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label class="control-label">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required noSpecialChars" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="CHECKBOX" />
                <div class="control-group">
                    <label class="control-label">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required" />
                    </div>
                </div>
	    	 <div class="control-group">
                    <label class="control-label">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="control-group span4">
                        <label class="control-label">Required </label>
                        <div class="controls">
                            <input name="is_required" type="checkbox" id="required" />
                        </div>
                    </div>
                    <div class="control-group span4" style="margin-left:38px">
                        <label class="control-label">Searchable </label>
                        <div class="controls"> 
                            <input name="searchable" type="checkbox" id="searchable" />
                        </div>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</script>
<!-- End of (Check Box) Modal views -->

<script id="custom-field-textarea-modal-template" type="text/html">
<!-- New (Text Area) Modal views -->
<div class="modal hide" id="textareaModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="textareaModalForm" name="textareaModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label class="control-label">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="TEXTAREA" />
                <div class="control-group">
                    <label class="control-label">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required" />
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Number of Lines <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_data" type="text" id="arearows" placeholder="Rows" class="required digits" max="10" min="2" />
                    </div>
                </div>
	    	 <div class="control-group">
                    <label class="control-label">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="control-group span4">
                        <label class="control-label">Required </label>
                        <div class="controls">
                            <input name="is_required" type="checkbox" id="required" />
                        </div>
                    </div>
                    <div class="control-group span4" style="margin-left:38px">
                        <label class="control-label">Searchable </label>
                        <div class="controls"> 
                            <input name="searchable" type="checkbox" id="searchable" />
                        </div>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</script>
<!-- End of (Text Area) Modal views -->


<script id="custom-field-checkbox-modal-template" type="text/html">
<!-- New (Generated Link) Modal views -->
<div class="modal hide" id="linkModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="linkModalForm" name="linkModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group">
                    <label class="control-label">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="LINK" />
                <div class="control-group">
                    <label class="control-label">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required" />
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Link Definition <span class="field_req">*</span></label>
                    <div class="controls">
                        <input name="listvalues" type="text" id="listvalues" placeholder="e.g. http://example.com?emailAddress={email}" class="required" />
                    </div>
                </div>
	    	 <div class="control-group">
                    <label class="control-label">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="control-group span4">
                        <label class="control-label">Required </label>
                        <div class="controls">
                            <input name="is_required" type="checkbox" id="required" />
                        </div>
                    </div>
                    <div class="control-group span4" style="margin-left:38px">
                        <label class="control-label">Searchable </label>
                        <div class="controls"> 
                            <input name="searchable" type="checkbox" id="searchable" />
                        </div>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</script>
<!-- End of (Generated Link) Modal views -->
<script id="admin-settings-customfields-collection-template" type="text/html">
<!-- <div class="" style="margin-bottom: 15px;">
            <h3><strong>Custom Fields</strong></h3>
            <ul class="nav right">
                <li class="btn-group right" style="top:0px;position:relative;">
                    <a href="#custom-fields-add" class="dropdown-toggle btn right" data-toggle="dropdown">
                    <i class="icon-plus-sign" /> Add Custom Field  <span class="caret"></span></a>
                    <ul class="dropdown-menu pull-right">
						<li>
                            <a href="#contactCustomFModal" class="fieldmodal"  type="COMPANY">To Company</a>
                        </li>
						<li>
                            <a href="#contactCustomFModal" class="fieldmodal" type="CONTACT">To Contact</a>
                        </li>
						<li>	
                            <a href="#contactCustomFModal" class="fieldmodal" type="DEAL">To Deals</a>
                        </li>
						<li>	
                            <a href="#contactCustomFModal" class="fieldmodal" type="CASE">To Case</a>
                        </li>
                    </ul>
                </li>
            </ul>
</div> -->
<div class="row">
    <div class="span9">
		<div class="accordion" id="custom-fields-accordion">
		<div class="m-b"><h3>Custom Fields</h3></div>
        {{#unless this.length}}
		<div style="height: 245px;">
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You do not have any custom fields currently.</h3>
                    <div class="text">
                        Define custom fields for contacts and use them to store information specific to you.
                    </div>
					<div class="btn-group blue btn-slate-action" style='position:relative'>
                    	<a href="#custom-fields-add" class="dropdown-toggle btn right" data-toggle="dropdown">
                    		<i class="icon-plus-sign" /> Add Custom Field  <span class="caret"></span></a>
						<ul class="dropdown-menu">
              			<li>
                            <a href="#contactCustomFModal" class="fieldmodal"  type="COMPANY">To Company</a>
                        </li>
						<li>
                            <a href="#contactCustomFModal" class="fieldmodal" type="CONTACT">To Contact</a>
                        </li>
						<li>	
                            <a href="#contactCustomFModal" class="fieldmodal" type="DEAL">To Deals</a>
                        </li>
						<li>	
                            <a href="#contactCustomFModal" class="fieldmodal" type="CASE">To Case</a>
                        </li>
                    </ul>
					</div>
                </div>
            </div>
        </div>
		</div>
        {{/unless}}
        {{#if this.length}}
        	<!-- <table class="table agile-ellipsis-dynamic" url="core/api/custom-fields/bulk" style="background: none repeat scroll 0% 0% inactiveborder;">
				<colgroup><col width="20%"><col width="20%"><col width="20%"><col width="35%"></colgroup>
                    <thead>
                        <tr>
                            <th>Field Label</th>
                            <th>Field Description</th>
                            <th>Field Type</th>
							<th>Scope</th>
                        </tr>
                    </thead>
                    <tbody id="admin-settings-customfields-contact-model-list">
                    </tbody>
                </table> -->
			<div id="CONTACT-custom-fields" class="accordion-group m-b-xs overflow-hidden">
				<div class="accordion-heading" style="background:#f5f5f5;">
					<h4><a class="accordion-toggle collapsed text-l-none-hover" data-toggle="collapse" data-parent="#custom-fields-accordion" href="#customfields-contacts-accordion">Contacts</a></h4>
				</div>
				<div class="collapse in" id="customfields-contacts-accordion"></div>
			</div>
			<div id="COMPANY-custom-fields" class="accordion-group m-b-xs overflow-hidden">
				<div class="accordion-heading" style="background:#f5f5f5;">
					<h4><a class="accordion-toggle collapsed text-l-none-hover" data-toggle="collapse" data-parent="#custom-fields-accordion" href="#customfields-companies-accordion">Companies</a></h4>
				</div>
				<div class="collapse" id="customfields-companies-accordion"></div>
			</div>
			<div id="DEAL-custom-fields" class="accordion-group m-b-xs overflow-hidden">
				<div class="accordion-heading" style="background:#f5f5f5;">
					<h4><a class="accordion-toggle collapsed text-l-none-hover" data-toggle="collapse" data-parent="#custom-fields-accordion" href="#customfields-deals-accordion">Deals</a></h4>
				</div>
				<div class="collapse" id="customfields-deals-accordion"></div>
			</div>
			<div id="CASE-custom-fields" class="accordion-group m-b-xs overflow-hidden">
				<div class="accordion-heading" style="background:#f5f5f5;">
					<h4><a class="accordion-toggle collapsed text-l-none-hover" data-toggle="collapse" data-parent="#custom-fields-accordion" href="#customfields-cases-accordion">Cases</a></h4>
				</div>
				<div class="collapse" id="customfields-cases-accordion"></div>
			</div>
        {{/if}}
	</div>
    </div>
    <div class="span3">
        <div class="data-block">
            <div class="well">
				<h3>
                    Help
                </h3>
                <br />
				<p>You can define custom fields for Contacts here. They appear in new contact form in Agile and can also be updated using our <a href="#analytics-code">API</a>.</p>
				Agile provides the following custom field types:<br/>
				<ul>
					<li>Text field - A simple text field</li>
					<li>Date field - A calendar date input field. (If you are providing this field value through API, provide an epoch number)</li>
					<li>List field - A drop down list option</li>
					<li>Check box - A true/false check box option</li>
					<li>Text area -A large text input field</li>
					<li>Number - A number value</li>
					<!-- <li>Formula - An arithmetic formula based on number custom fields. <a href="http://mustache.github.io/" target="_blank">Mustache conditions</a> can be used here.</li> -->
				</ul>
				Enabling the 'Searchable' option in the custom field dialog will allow you to search contacts in Agile using the custom field value.
            </div>
        </div>
    </div>
</div>
<div id="custom-field-modal"></div>
</script>

<script id="admin-settings-customfields-model-template" type="text/html">
    <td><div style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%">{{field_label}}</div> </td>
    <td><div style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%">{{field_description}}</div> </td>
    <td>{{ucfirst field_type}}</td>
	<td>{{ucfirst scope}}</td>
    <br/>
</script>


<script id="admin-settings-customfields-contact-collection-template" type="text/html">
		{{#if this.length}}
        <table class="table table-bordered agile-ellipsis-dynamic custom-fields-table" url="core/api/custom-fields/bulk" style="margin-bottom:1px;">
				<colgroup><col width="40%"><col width="12%"><col width="3%"></colgroup>
                    <tbody id="admin-settings-customfields-contact-model-list" class="custom-fields-contact-tbody">
                    </tbody>
                </table>
        {{/if}}
		<div class="p-l-md p-t p-b">
			<a href="#contactCustomFModal" class="fieldmodal" data-toggle="modal" type="CONTACT"><i class="icon-plus-sign" /> Add </a>
		</div>
</script>

<script id="admin-settings-customfields-contact-model-template" type="text/html">
	<td>
		<div class="p-l-sm" style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%">
			{{field_label}}
			{{#if_equals is_required true}}
				<span class="field_req">*</span>
			{{/if_equals}}
		</div>
		<div class="p-l-sm" style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%;"><small>{{field_description}}</small></div> 
	</td>
    <td style="padding-right:0;">
		<div style="text-align:right;height:20px;">
			{{#if_equals searchable true}}
				<!-- <i title="Searchable" class="icon-search" style="color:#999999;"></i> -->
				<span class="label">Searchable</span>
			{{/if_equals}}
			<span class="label">{{choose_custom_field_type field_type}}</span>
		</div>
	</td>
	<td>
		<div class="m-b-n-xs" style="display:none;margin-left:16px;">
			<a class="text-l-none-hover c-p"><i title="Drag" class="icon-move"></i></a>
		</div>
		<div style="display:none;margin-bottom:-8px;">
			<a id="edit-custom-field" style="cursor: pointer; text-decoration: none;" data-toggle="modal" role="button" href="#">
				<i title="Edit Contact Custom Field" class="task-action icon icon-edit"></i>
			</a>
			<a id="delete-custom-field" style="cursor: pointer; text-decoration: none;" data-toggle="modal" role="button" href="#">
				<i title="Delete Contact Custom Field" class="task-action icon icon-trash"></i>
			</a>
		</div>
	</td>
	<br/>
</script>
<script id="admin-settings-customfields-company-collection-template" type="text/html">
		{{#if this.length}}
        <table class="table table-bordered agile-ellipsis-dynamic custom-fields-table" url="core/api/custom-fields/bulk" style="margin-bottom:1px;">
			<colgroup><col width="40%"><col width="12%"><col width="3%"></colgroup>
                    <tbody id="admin-settings-customfields-company-model-list" class="custom-fields-company-tbody">
                    </tbody>
                </table>
        {{/if}}
		<div class="p-l-md p-t p-b">
			<a href="#contactCustomFModal" class="fieldmodal" data-toggle="modal" type="COMPANY"><i class="icon-plus-sign" /> Add </a>
		</div>
</script>

<script id="admin-settings-customfields-company-model-template" type="text/html">
    <td>
		<div class="p-l-sm" style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%">
			{{field_label}}
			{{#if_equals is_required true}}
				<span class="field_req">*</span>
			{{/if_equals}}
		</div>
		<div class="p-l-sm" style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%;"><small>{{field_description}}</small></div> 
	</td>
    <td style="padding-right:0;">
		<div style="text-align:right;height:20px;">
			{{#if_equals searchable true}}
				<!-- <i title="Searchable" class="icon-search" style="color:#999999;"></i> -->
				<span class="label">Searchable</span>
			{{/if_equals}}
			<span class="label">{{choose_custom_field_type field_type}}</span>
		</div>
	</td>
	<td>
		<div class="m-b-n-xs" style="display:none;margin-left:16px;">
			<a class="text-l-none-hover c-p"><i title="Drag" class="icon-move"></i></a>
		</div>
		<div style="display:none;margin-bottom:-8px;">
			<a id="edit-custom-field" style="cursor: pointer; text-decoration: none;" data-toggle="modal" role="button" href="#">
				<i title="Edit Company Custom Field" class="task-action icon icon-edit"></i>
			</a>
			<a id="delete-custom-field" style="cursor: pointer; text-decoration: none;" data-toggle="modal" role="button" href="#">
				<i title="Delete Company Custom Field" class="task-action icon icon-trash"></i>
			</a>
		</div>
	</td>
	<br/>
</script>
<script id="admin-settings-customfields-deal-collection-template" type="text/html">
    	{{#if this.length}}
        <table class="table table-bordered agile-ellipsis-dynamic custom-fields-table" url="core/api/custom-fields/bulk" style="margin-bottom:1px;">
			<colgroup><col width="40%"><col width="12%"><col width="3%"></colgroup>
                    <tbody id="admin-settings-customfields-deal-model-list" class="custom-fields-deal-tbody">
                    </tbody>
                </table>
        {{/if}}
		<div class="p-l-md p-t p-b">
			<a href="#contactCustomFModal" class="fieldmodal" data-toggle="modal" type="DEAL"><i class="icon-plus-sign" /> Add </a>
		</div>
</script>

<script id="admin-settings-customfields-deal-model-template" type="text/html">
    <td>
		<div class="p-l-sm" style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%">
			{{field_label}}
			{{#if_equals is_required true}}
				<span class="field_req">*</span>
			{{/if_equals}}
		</div>
		<div class="p-l-sm" style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%;"><small>{{field_description}}</small></div> 
	</td>
    <td style="padding-right:0;">
		<div style="text-align:right;height:20px;">
			{{#if_equals searchable true}}
				<!-- <i title="Searchable" class="icon-search" style="color:#999999;"></i> -->
				<span class="label">Searchable</span>
			{{/if_equals}}
			<span class="label">{{choose_custom_field_type field_type}}</span>
		</div>
	</td>
	<td>
		<div class="m-b-n-xs" style="display:none;margin-left:16px;">
			<a class="text-l-none-hover c-p"><i title="Drag" class="icon-move"></i></a>
		</div>
		<div style="display:none;margin-bottom:-8px;">
			<a id="edit-custom-field" style="cursor: pointer; text-decoration: none;" data-toggle="modal" role="button" href="#">
				<i title="Edit Deal Custom Field" class="task-action icon icon-edit"></i>
			</a>
			<a id="delete-custom-field" style="cursor: pointer; text-decoration: none;" data-toggle="modal" role="button" href="#">
				<i title="Delete Deal Custom Field" class="task-action icon icon-trash"></i>
			</a>
		</div>
	</td>
	<br/>
</script>
<script id="admin-settings-customfields-case-collection-template" type="text/html">
		{{#if this.length}}
        <table class="table table-bordered agile-ellipsis-dynamic custom-fields-table" url="core/api/custom-fields/bulk" style="margin-bottom:1px;">
			<colgroup><col width="40%"><col width="12%"><col width="3%"></colgroup>
                    <tbody id="admin-settings-customfields-case-model-list" class="custom-fields-case-tbody">
                    </tbody>
                </table>
        {{/if}}
		<div class="p-l-md p-t p-b">
			<a href="#contactCustomFModal" class="fieldmodal" data-toggle="modal" type="CASE"><i class="icon-plus-sign" /> Add </a>
		</div>
</script>
<script id="admin-settings-customfields-case-model-template" type="text/html">
	<td>
		<div class="p-l-sm" style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%">
			{{field_label}}
			{{#if_equals is_required true}}
				<span class="field_req">*</span>
			{{/if_equals}}
		</div>
		<div class="p-l-sm" style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%;"><small>{{field_description}}</small></div> 
	</td>
    <td style="padding-right:0;">
		<div style="text-align:right;height:20px;">
			{{#if_equals searchable true}}
				<!-- <i title="Searchable" class="icon-search" style="color:#999999;"></i> -->
				<span class="label">Searchable</span>
			{{/if_equals}}
			<span class="label">{{choose_custom_field_type field_type}}</span>
		</div>
	</td>
	<td>
		<div class="m-b-n-xs" style="display:none;margin-left:16px;">
			<a class="text-l-none-hover c-p"><i title="Drag" class="icon-move"></i></a>
		</div>
		<div style="display:none;margin-bottom:-8px;">
			<a id="edit-custom-field" style="cursor: pointer; text-decoration: none;" data-toggle="modal" role="button" href="#">
				<i title="Edit Case Custom Field" class="task-action icon icon-edit"></i>
			</a>
			<a id="delete-custom-field" style="cursor: pointer; text-decoration: none;" data-toggle="modal" role="button" href="#">
				<i title="Delete Case Custom Field" class="task-action icon icon-trash"></i>
			</a>
		</div>
	</td>
	<br/>
</script>
<script id="settings-email-gateway-template" type="text/html">
	<div class="well widget-add" style="width:220px;">
		<form style="border-bottom:none;margin-top:-10px;margin-bottom: 0px;" id="email-gateway-integration-form">
	    	<fieldset>
				<legend style="margin-bottom: 16px;font-size: 16px;line-height: 30px;">Enter your account details</legend>
				<div class="control-group" style="margin-bottom:0px">
					<div class="controls" id="LHS">
						<select name="email_api" id="email-api" class="required" style="width:94%">
							<!--<option value="SEND_GRID">SendGrid</option>--> 
							<option value="MANDRILL">Mandrill</option> 
						</select>
					</div>
				</div>
				<div class="control-group" style="margin-bottom:0px" id="RHS">
					<!--<div class="controls">
						<input type="text" class="input-medium required SEND_GRID" style="width:90%" placeholder="Username" value="{{api_user}}" name="api_user">
					</div>-->
					<div class="controls">
						<!--<input type="password" class="input-medium required SEND_GRID" style="width:90%" placeholder="Password" value="{{#if api_user}}{{api_key}}{{/if}}"  name="api_key"/>-->
                        <input type="text" class="input-medium required MANDRILL" style="width:90%" placeholder="API Key" value="{{#unless api_user}}{{api_key}}{{/unless}}" name="api_key"/>
					</div>
				</div>
				<div class="form-actions" style="padding: 15px 20px 0px;margin-top: 14px;margin-bottom: 0px;">
               		<a type="submit" class="save btn btn-primary">Save</a>
               		<a type="reset" class="btn" href="#integrations">Cancel</a>
             	</div>
			 </fieldset>
	    </form>
	</div>
</script>
<script type="text/html" id="admin-settings-integration-stats-template">
<div class="row">
	<div class="span9 well">
		<legend style="margin-bottom:10px"> Email Stats
				<span style="display: inline;vertical-align: 1px;" class="pull-right">
					{{#if this.id}}Reputation {{{get_subaccount_reputation reputation}}}
					{{/if}}
				</span>
		</legend>
		<div class="row-fluid">
        	<div class="span6">
            	<h3 style="text-align: center;">Emails Sent</h3>
				<table class="table table-bordered">
					<tbody>
						{{#if this.id}}
						<tr><th>This Hour</th><td>{{numberWithCommas sent_hourly}}</td></tr>
						<tr><th>This Week</th><td>{{numberWithCommas sent_weekly}}</td></tr>
						<tr><th>This Month</th><td>{{numberWithCommas sent_monthly}}</td></tr>
						<tr><th>Overall</th><td>{{numberWithCommas sent_total}}</td></tr>
						{{else}}
						<tr><th>This Hour</th><td>0</td></tr>
						<tr><th>This Week</th><td>0</td></tr>
						<tr><th>This Month</th><td>0</td></tr>
						<tr><th>Overall</th><td>0</td></tr>
						{{/if}}
					</tbody>
				</table>
        	</div>
        	<div class="span6">
            	<h3 style="text-align: center;">Bounces ( Last 30 Days )</h3>
				<table class="table table-bordered">
					<tbody>
						{{#if this.id}}
						<tr><th>Hard Bounce</th><td>{{numberWithCommas last_30_days.hard_bounces}}</td></tr>
						<tr><th>Soft Bounce</th><td>{{numberWithCommas last_30_days.soft_bounces}}</td></tr>
						<tr><th>Rejects</th><td>{{numberWithCommas last_30_days.rejects}}</td></tr>
						<tr><th>Spam Complaints</th><td>{{numberWithCommas last_30_days.complaints}}</td></tr>
						{{else}}
						<tr><th>Hard Bounce</th><td>0</td></tr>
						<tr><th>Soft Bounce</th><td>0</td></tr>
						<tr><th>Rejects</th><td>0</td></tr>
						<tr><th>Spam Complaints</th><td>0</td></tr>
						{{/if}}
					</tbody>
				</table>
        	</div>
    	</div>
		<legend style="margin-bottom:10px"> SMS Stats
				<span style="display: inline;vertical-align: 1px;" ></span>
		</legend>
					{{#unless Stats-Type}}
					<h4 style="text-align: left;">No SMS gateway configured. <a href="#integrations">Configure Now</a></h4>
					{{/unless}}
		{{#if_equals "SMS-Stats" Stats-Type}}
		<div class="row-fluid">
        	<div class="span6">
            	<h3 style="text-align: center;">SMS Sent</h3>
				<table class="table table-bordered">
					<tbody>
						<tr><th>Today</th><td>{{numberWithCommas Today}} </td></tr>
						<tr><th>Yesterday</th><td> {{numberWithCommas Yesterday}}</td></tr>
						<tr><th>This Month</th><td>{{numberWithCommas ThisMonth}} </td></tr>
						<tr><th>Last Month</th><td>{{numberWithCommas LastMonth}} </td></tr>
					</tbody>
				</table>
        	</div>
        	<div class="span6">
            	<h3 style="text-align: center;">SMS Details ( Last 30 Days )</h3>
				<table class="table table-bordered">
					<tbody>
						<tr><th>Queued</th><td>{{Queued}} </td></tr>
						<tr><th>Delivered</th><td> {{Delivered}}</td></tr>
						<tr><th>Undelivered
						<span style="vertical-align: text-top; margin-left: -3px">
						<img border="0" src="/img/help.png" style="height: 6px; vertical-align: top" rel="popover" data-placement="right" data-title:"="" 
						data-content="Twilio has received a delivery receipt indicating that the message was not delivered. This can happen for a number of reasons including carrier content filtering, availability of the destination handset, etc." 
						id="element" data-trigger="hover" data-original-title=""></span>
						</th><td>{{Undelivered}}</td></tr>
						<tr><th>Failed
						<span style="vertical-align: text-top; margin-left: -3px">
						<img border="0" src="/img/help.png" style="height: 6px; vertical-align: top" rel="popover" data-placement="right" data-title:"="" 
						data-content="The message could not be sent. This can happen for various reasons including queue overflows, account suspensions. Twilio does not charge you for failed messages." 
						id="element" data-trigger="hover" data-original-title=""></span>
						</th><td>{{Failed}} </td></tr>
					</tbody>
				</table>
        	</div>
    	</div>
		{{/if_equals}}
	</div>
</div>
</script><script id="admin-settings-import-google-contacts-template"
	type="text/html">
	<div class="well widget-add" style="width:220px; height:270px;">
    <img class="thumbnail" src="/img/icons/google-contacts-sync.png" style="width:210px; height:70px;" />
	<br />
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 120px !important;margin-bottom: 20px;"  rel="tooltip" >
		Agile can periodically sync your contacts in your CRM with your Google Contacts.
	</div>
    <div>
			{{#if id}}
    			<a class="btn btn-danger delete"  id="google-import-prefs-delete" >Disable</a>
				<a href="#sync/contacts" class="btn" id="setting-widget">Settings</a>
    		{{else}}
				{{#canSyncContacts}}
    					<div class="btn" id="google-import" style="display:inline-block;">Enable</div>
					{{else}}
						<span class="btn" style="display:inline-block;" disabled>Enable</span>
						<span style="margin-left:5px"><i>Needs import privilege.</i></span>
				{{/canSyncContacts}}
    		{{/if}}
	</div>
</div>
</script>

<script id="admin-settings-import-google-contacts-setup-template"
	type="text/html">

	<div class="well span4">
 	<!-- <legend>Contacts <span class="label label-important">Beta</span>{{#if id}}<span style="font-size:14px;float:right" title="Sync Contacts" title="Sync Contacts"><a class="icon-refresh save-contact-prefs" href="#" sync = "true" id="google-import-sync"  style="cursor:pointer;text-decoration:none"></a></span>{{/if}}</legend> -->

	<span class="label label-important" style="float:right">Beta</span>
   <center> <img class="thumbnail" src="/img/icons/google-contacts-sync.png" style="width:210px; height:70px;margin-left:40px" /></center>
	<br />
{{#unless id}}
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" >
		Setup contact sync with your Gmail or Google Apps account.
	</div>
{{/unless}}
{{#if id}}

    <form id="google-contacts-import-form" class="form-horizontal">
        <fieldset>
	<div class="control-group" style="margin-left:-80px">
		<label class="control-label" style="text-align:">Type</label> 
           <div class="controls">
				<select class="required" name="sync_type" id="sync-type">
					<option value="">- Select -</option>
					<option value="CLIENT_TO_AGILE">Google to Agile</option>
					<option value="AGILE_TO_CLIENT">Agile to Google</option>
					<option value="TWO_WAY">Both ways</option>
				</select>
			</div>
	</div>

{{#if_equals sync_type "AGILE_TO_CLIENT"}}
	<div class="control-group" style="margin-left:-80px;display:none" id="sync_from_group_controlgroup">
{{else}}
	<div class="control-group" style="margin-left:-80px" id="sync_from_group_controlgroup">
{{/if_equals}}
		<label class="control-label" style="text-align:">Sync From</label> 
           <div class="controls">
				<select name="sync_from_group" class="required">
				{{#each groups}}
					{{#if_equals groupName "Agile"}}
						{{else}}
					{{#if_equals groupName "Contacts"}}
						<option value="{{atomIdDecoded}}">My Contacts (Recommended)</option>
						{{else}}
						<option value="{{atomIdDecoded}}">{{groupName}}</option>
				{{/if_equals}}
					{{/if_equals}}
				{{/each}}
				</select>
			</div>
<span class="help-block" style="margin-left:160px; margin-top:8px"><small>Google contact  group to sync from.</small></span>
	</div>

{{#if_equals sync_type "AGILE_TO_CLIENT"}}
	<div class="control-group" style="margin-left:-80px" id="sync_to_group_controlgroup">
{{else}}
{{#if_equals sync_type "TWO_WAY"}}
<div class="control-group" style="margin-left:-80px" id="sync_to_group_controlgroup">
{{else}}
<div class="control-group" style="margin-left:-80px;display:none" id="sync_to_group_controlgroup">
{{/if_equals}}
{{/if_equals}}

		<label class="control-label" style="text-align:">Sync To</label> 
           <div class="controls">
				<select name="sync_to_group" class="required">
				{{#each groups}}
					{{#if_equals groupName "Agile"}}
						{{#if atomIdDecoded}}
								<option value="{{atomIdDecoded}}" selected="selected">{{groupName}}  (Recommended)</option>
							{{else}}
								<option value="{{groupName}}" selected="selected">{{groupName}}  (Recommended)</option>
						{{/if}}
					{{/if_equals}}
					{{#if_equals groupName "Contacts"}}
						<option value="{{atomIdDecoded}}">My Contacts</option>
					{{/if_equals}}
				{{/each}}
				</select>
			</div>
	<span class="help-block" style="margin-left:160px; margin-top:8px"><small>Google contact  group to sync to.</small></span>
	</div>

		<div class="control-group" style="margin-left:-80px">
		<label class="control-label" style="text-align:">Frequency</label> 
           <div class="controls">
				<select class="required" name="duration">

{{#check_plan "FREE"}}
					<option value="" disabled>Only once (Paid plans)</option>
					<option value="" disabled>Daily  (Paid plans)</option>
{{else}}
					s<option value="ONCE">Only once</option>
					<option value="DAILY">Daily</option>
{{/check_plan}}
					<option value="WEEKLY">Weekly</option>
					<option value="MONTHLY">Monthly</option>
				</select>
			</div>
	</div>

 

{{#if_equals sync_type "AGILE_TO_CLIENT"}}
<div class="control-group" style="margin-left:-80px" id="my_contacts_sync_group">
{{else}}
{{#if_equals sync_type "TWO_WAY"}}
<div class="control-group" style="margin-left:-80px" id="my_contacts_sync_group">
{{else}}
<div class="control-group" style="margin-left:-80px;display:none" id="my_contacts_sync_group">
{{/if_equals}}
{{/if_equals}}
	<div class="controls">
       <label class="checkbox">
          <input  type="checkbox" name="my_contacts" value="true" checked="checked">
            Only sync Agile contacts owned by me
        </label>       
    </div>
</div>
		 <input name="id" type="hidden" value="{{id}}" />


      <div class="form-actions">
{{#if inProgress}}
			<div class="btn btn-primary save-contact-prefs" id="google-import-prefs-save" style="display:inline-block;margin-left:-60px" disabled>Syncing</div>
	{{else}}
<div class="btn btn-primary save-contact-prefs" id="google-import-prefs-save" style="display:inline-block;margin-left:-60px">Sync</div>
{{/if}}		
<a href="#sync" class="btn ml_5" style="text-decoration:none;">Cancel</a>
	 </div>
	{{/if}}
        </fieldset>
    </form>
</div>

</script>



<script id="admin-settings-import-stripe-contact-sync-prefs-template"
	type="text/html">
<div class="span4 well">
<span class="label label-important" style="float:right">Beta</span>
<center> <img class="thumbnail" src="/img/plugins/Stripe.png" style="width:210px; height:70px;margin-left:40px" /></center>
<br/>
{{#unless id}}
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" >
		Setup contact sync with your Stripe account.
	</div>
{{/unless}} 
    {{#if id}}
<form id="stripe-prefs-form" class="form-horizontal">
<input type ="hidden" value = "{{id}}" name ="id">
          <div>Account Linked : {{userName}} <span><a href="#" class="delete">Change</a></span></div>
	
          
             	<div class="control-group" style="margin-left: -80px;margin-top:20px;">
					<label class="control-label">Frequency</label> 
           				<div class="controls">
							<select class="required" name="duration" id="freq">

						{{#check_plan "FREE"}}
							<option value="" disabled>Only once (Paid plans)</option>
							<option value="" disabled>Daily  (Paid plans)</option>
						{{else}}
							<option value="ONCE">Only once</option>
							<option value="DAILY">Daily</option>
						{{/check_plan}}
							<option value="WEEKLY">Weekly</option>
							<option value="MONTHLY">Monthly</option>
						</select>
					</div>
		   		</div>

			<div class="form-actions" style="margin-left: -68px;border-top: 0px;">

{{#if inProgress}}
			<button class="btn btn-primary" id="stripe_sync_prefs" style="display:inline-block;" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-primary" id="stripe_sync_prefs" style="display:inline-block;">Sync</button>
{{/if}}

           		<a href="#sync" class="btn ml_5" style="text-decoration:none;">Cancel</a>
       	  	</div>


       
    </form>
{{else}}
<div class="btn" id="stripe_import" style="display:inline-block;margin-left: 72px;">Enable</div>
{{/if}}

</div>
</script>


<script id="admin-settings-import-stripe-contact-sync-template"
	type="text/html">
	<div class="well widget-add" style="width:220px;">
    <img class="thumbnail" src="/img/plugins/Stripe.png" style="width:210px; height:70px;" />
	<br />
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;"  rel="tooltip" >
	Sync customers in Stripe as Contacts in Agile CRM with their subscription & payment data.
	</div>
    <div>
			{{#if id}}
    			<a class="btn btn-danger delete"  id="stripe-import-prefs-delete" >Disable</a>
    		{{else}}
				{{#canSyncContacts}}
		{{#isAllowedInCurrentPlan "is_accounting_sync_allowed"}}
    					<div class="btn" id="stripe_import" style="display:inline-block;">Enable</div>
								{{else}}
									<a disabled  class="btn"  style="display:inline-block;">Enable</a>
									<div style="display:inline;float:right; max-width:135px;" class="text-right" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
							{{/isAllowedInCurrentPlan}}
    						
					{{else}}
							<span class="btn" style="display:inline-block;" disabled>Enable</span>
							<span style="margin-left:5px"><i>Needs import privilege.</i></span>
				{{/canSyncContacts}}
    		
    		{{/if}}
	</div>
</div>
</script>

<script id="admin-settings-import-shopify-prefs-template"
	type="text/html">
<div class="span4 well">
<span class="label label-important" style="float:right">Beta</span>
<center> <img class="thumbnail" src="img/crm-plugins/shopify.png" style="width:210px; height:70px;margin-left:40px" /></center>
<br/>
{{#unless id}}
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" >
		Setup contact sync with your Shopify account.
	</div>


<div class='input-append input-prepend' style="margin-left: 46px;">
	<span class="add-on" style="border-bottom-right-radius: 0;border-top-right-radius: 0;background-color: #eee;">https://</span>
	  <input id="shop" style="margin-left: -3px;margin-right: -3px;width: 116px;" required="required" name="shopname"  type="text" placeholder="Enter shop domain">
    <span class="add-on" style="border-bottom-right-radius: 0;border-top-right-radius: 0;background-color: #eee;border-radius: 3px;
margin-left: -3px;">.myshopify.com</span>
    
    </div>
<a href ="#" id ="import_shopify" class="btn" style="margin-left: 46px;margin-top:10px;">Connect</a>

  {{/unless}}

  

    <form id="shopify-contact-import-form" class="form-horizontal">
<input type ="hidden" value = "{{id}}" name ="id">
        
	
           {{#if id}}
              <div>
                   Shop : <span style="margin-left: 38px;">{{othersParams}}</span>
                
                       <a class="delete" href="#"  id="shopify-import-prefs-delete" >Change</a>
					</div>
                 
             	<div class="control-group" style="margin-left: -80px;margin-top:20px;">
					<label class="control-label" style="text-align:">Frequency</label> 
           				<div class="controls">
							<select class="required" name="duration" id="freq">

						{{#check_plan "FREE"}}
							<option value="" disabled>Only once (Paid plans)</option>
							<option value="" disabled>Daily  (Paid plans)</option>
						{{else}}
							<option value="ONCE">Only once</option>
							<option value="DAILY">Daily</option>
						{{/check_plan}}
							<option value="WEEKLY">Weekly</option>
							<option value="MONTHLY">Monthly</option>
						</select>
					</div>
		   		</div>

			<div class="form-actions" style="margin-left: -68px;border-top: 0px;">

{{#if inProgress}}
			<button class="btn btn-primary" id="shopify-setting" style="display:inline-block;" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-primary" id="shopify-setting" style="display:inline-block;">Sync</button>
{{/if}}
           		<a href="#sync" class="btn ml_5" style="text-decoration:none;">Cancel</a>

       	  	</div>

	{{/if}}

       
    </form>
</div>
</script>


<script id="admin-settings-import-shopify-contact-syncPrefs-template"
	type="text/html">
	<div class="well widget-add" style="width:220px;">

    <img class="thumbnail"  src="img/crm-plugins/shopify.png" style="width:210px; height:70px;" />
	<br />
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;"  rel="tooltip" >
		Sync customer data and Agile CRM as contacts along with purchase history.
	</div>
   <div>
			{{#if id}}
        	   <a class="btn btn-danger delete"  id="shopify-import-prefs-delete" >Disable</a>
				<a href="#sync/shopify" class="btn">Settings</a>
			{{else}}
					{{#canSyncContacts}}
							{{#isAllowedInCurrentPlan "is_ecommerce_sync_allowed"}}
    						   <a href="#sync/shopify"  class="btn"  style="display:inline-block;">Enable</a>
								{{else}}
									<a disabled  class="btn"  style="display:inline-block;">Enable</a>
									<div style="display:inline;float:right; max-width:135px;" class="text-right" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
							{{/isAllowedInCurrentPlan}}
						{{else}}
							   <a class="btn"  style="display:inline-block;" disabled>Enable</a>
								<span style="margin-left:5px"><i>Needs import privilege.</i></span>
					{{/canSyncContacts}}
			
			{{/if}}
</div>
</div>


</script>

<!--  creating template for zoho crm syn -->
<script id="admin-settings-import-zoho-contact-sync-template"
	type="text/html">
<div class="span4 well" style="height: 200px;">
    <form id="imap-prefs-form">
        <legend>Import from Zoho <span class="label label-important">Alpha</span></legend>
		<div>
			Import customers from Zoho
		</div>

           {{#if id}}
          <div class="form-actions">
        	   <a class="btn btn-danger delete"  id="zoho-prefs-delete" >Disable</a>
				<a href="#sync/zoho-import" class="btn" id="setting-widget">Settings</a>
			</div>
         {{else}}
				{{#canSyncContacts}}
    						   <button class="btn" id="zoho-import" style="display:inline-block;">Enable</button>
							{{#isAllowedInCurrentPlan "is_ecommerce_sync_allowed"}}
							  <button class="btn" id="zoho-import" style="display:inline-block;">Enable</button>
								{{else}}
									<a disabled  class="btn"  style="display:inline-block;">Enable</a>
									<div style="display:inline;float:right; max-width:135px;" class="text-right" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
							{{/isAllowedInCurrentPlan}}
						{{else}}
							   <a href="#"  class="btn"  style="display:inline-block;" disabled>Enable</a>
								<span style="margin-left:5px"><i>Needs import privilege.</i></span>
					{{/canSyncContacts}}
         <div>
           
        </div>
{{/if}}

    </form>
</div>
</script>


<script id="admin-settings-import-quickbook-settings-template"
	type="text/html">
<div class="span4 well">
<span class="label label-important" style="float:right">Beta</span>
<center> <img class="thumbnail" src="/widgets/QuickBooks210x70.png" style="width:210px; height:70px;margin-left:40px" /></center>
<br/>
{{#unless id}}
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" >
		Setup contact sync with your Quickbook account.
	</div>
{{/unless}} 
    {{#if id}}
<form id="quickbook-form" class="form-horizontal">
<input type ="hidden" value = "{{id}}" name ="id">
          <div>Account Linked : {{userName}} <span><a href="#" class="delete">Change</a></span></div>
	
          
             	<div class="control-group" style="margin-left: -80px;margin-top:20px;">
					<label class="control-label">Frequency</label> 
           				<div class="controls">
							<select class="required" name="duration" id="freq">

						{{#check_plan "FREE"}}
							<option value="" disabled>Only once (Paid plans)</option>
							<option value="" disabled>Daily  (Paid plans)</option>
						{{else}}
							<option value="ONCE">Only once</option>
							<option value="DAILY">Daily</option>
						{{/check_plan}}
							<option value="WEEKLY">Weekly</option>
							<option value="MONTHLY">Monthly</option>
						</select>
					</div>
		   		</div>

			<div class="form-actions" style="margin-left: -68px;border-top: 0px;">

{{#if inProgress}}
			<button class="btn btn-primary" id="quickbook_sync_prefs" style="display:inline-block;" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-primary" id="quickbook_sync_prefs" style="display:inline-block;">Sync</button>
{{/if}}

           		<a href="#sync" class="btn ml_5" style="text-decoration:none;">Cancel</a>
       	  	</div>


       
    </form>
{{else}}
 <a href="/OAuthServlet?service=quickbook-import&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks""  class="btn"  style="display:inline-block;margin-left: 70px;">Enable</a>
{{/if}}

</div>
</script>


<script id="admin-settings-import-quickbook-template" type="text/html">
	<div class="well widget-add" style="width:220px;">

    <img class="thumbnail"  src="/widgets/QuickBooks210x70.png" style="width:210px; height:70px;" />
	<br />
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;"  rel="tooltip" >
		Sync customers in Quickbooks as Contacts in Agile CRM along with invoice and payment data.
	</div>
    
			{{#if id}}
        	   <a class="btn btn-danger delete"  id="quick-book-delete" >Disable</a>
				<a href="#sync/quickbook" class="btn">Settings</a>
			{{else}}

			  
				{{#canSyncContacts}}
						{{#isAllowedInCurrentPlan "is_accounting_sync_allowed"}}
    					 <a href="/OAuthServlet?service=quickbook-import&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks""  class="btn"  style="display:inline-block;">Enable</a>
								{{else}}
									<a disabled  class="btn"  style="display:inline-block;">Enable</a>
									<div style="display:inline;float:right; max-width:135px;" class="text-right" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
							{{/isAllowedInCurrentPlan}}
    						
						{{else}}
							   <a href="#"  class="btn"  style="display:inline-block;" disabled>Enable</a>
								<span style="margin-left:5px"><i>Needs import privilege.</i></span>
					{{/canSyncContacts}}

			{{/if}}

</div>


</script>


<script id="admin-settings-import-xeroSync-template" type="text/html">
	<div class="well widget-add" style="width:220px;">

    <img class="thumbnail"  src="/widgets/xero210x70.png"  style="width:210px; height:70px;" />
	<br />
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;"  rel="tooltip" >
		Sync customers in Xero as Contacts in Agile CRM along with invoice and payment data.
	</div>
    
			{{#if id}}
        	   <a class="btn btn-danger delete" >Disable</a>
				<a href="#sync/xero" class="btn">Settings</a>
			{{else}}

			   
			{{#canSyncContacts}}
    						 <a href="#" id ="xeroconnect"class="btn" style="display:inline-block;">Enable</a>
						{{else}}
							   <a href="#"  class="btn"  style="display:inline-block;" disabled>Enable</a>
								<span style="margin-left:5px"><i>Needs import privilege.</i></span>
					{{/canSyncContacts}}
			{{/if}}

</div>


</script>


<script id="admin-settings-import-xero-settings-template"
	type="text/html">
<div class="span4 well">
<span class="label label-important" style="float:right">Beta</span>
<center> <img class="thumbnail" src="/widgets/xero210x70.png"  style="width:210px; height:70px;margin-left:40px" /></center>
<br/>
{{#unless id}}
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" >
		Setup contact sync with your Xero account.
	</div>
{{/unless}} 
    {{#if id}}
<form id="xero-form" class="form-horizontal">
<input type ="hidden" value = "{{id}}" name ="id">
          <div>Account Linked : {{userName}} <span><a href="#" class="delete">Change</a></span></div>
	
          
             	<div class="control-group" style="margin-left: -80px;margin-top:20px;">
					<label class="control-label">Frequency</label> 
           				<div class="controls">
							<select class="required" name="duration" id="freq">

						{{#check_plan "FREE"}}
							<option value="" disabled>Only once (Paid plans)</option>
							<option value="" disabled>Daily  (Paid plans)</option>
						{{else}}
							<option value="ONCE">Only once</option>
							<option value="DAILY">Daily</option>
						{{/check_plan}}
							<option value="WEEKLY">Weekly</option>
							<option value="MONTHLY">Monthly</option>
						</select>
					</div>
		   		</div>

			<div class="form-actions" style="margin-left: -68px;border-top: 0px;">

{{#if inProgress}}
			<button class="btn btn-primary" id="xero_sync_prefs" style="display:inline-block;" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-primary" id="xero_sync_prefs" style="display:inline-block;">Sync</button>
{{/if}}

           		<a href="#sync" class="btn ml_5" style="text-decoration:none;">Cancel</a>
       	  	</div>


       
    </form>
{{else}}
 <a href="#" id ="xeroconnect"class="btn" style="display:inline-block;">Enable</a>
{{/if}}

</div>
</script>


<script id="admin-settings-import-freshbooks-settings-template"
	type="text/html">
<div class="span4 well">
<span class="label label-important" style="float:right">Beta</span>
<center> <img class="thumbnail" src="img/plugins/freshbooks-logo.png" style="width: 216px; height:70px;" /></center>
{{#unless id}}
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;margin-top: 10px;word-break: break-word;margin-left:13px;height:20px !important"  rel="tooltip" >
		Setup contacts sync with your Freshbooks account.
	</div>
{{/unless}} 

    {{#if id}}
<form id="freshbooks-form" class="form-horizontal" style="margin-top:20px;">
<input type ="hidden" value = "{{id}}" name ="id">
          <div><span>Account Linked </span>  <span style="margin-left: 13px;">{{othersParams}}.freshbooks.com <span><a href="#" class="delete">Change</a></span></span></div>
	
          
             	<div class="control-group" style="margin-left: -80px;margin-top:20px;">
					<label class="control-label" style="margin-left: 26px;">Frequency</label> 
           				<div class="controls">
							<select class="required" name="duration" id="freq" style="margin-left: 15px;">

						{{#check_plan "FREE"}}
							<option value="" disabled>Only once (Paid plans)</option>
							<option value="" disabled>Daily  (Paid plans)</option>
						{{else}}
							<option value="ONCE">Only once</option>
							<option value="DAILY">Daily</option>
						{{/check_plan}}
							<option value="WEEKLY">Weekly</option>
							<option value="MONTHLY">Monthly</option>
						</select>
					</div>
		   		</div>

			<div class="form-actions" style="margin-left: -59px;border-top: 0px;">

{{#if inProgress}}
			<button class="btn btn-primary" id="freshbooks_sync_prefs" style="display:inline-block;" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-primary" id="freshbooks_sync_prefs" style="display:inline-block;">Sync</button>
{{/if}}
           		<a href="#sync" class="btn ml_5" style="text-decoration:none;">Cancel</a>
       	  	</div>


       
    </form>
{{else}}
<div style="margin-top: -9px;">

<form class="widget_content" style="border-bottom:none;margin-top:20px;" id="freshbooks_login_form" name="freshbooks_login_form" method="post">
	    	
			
                   
				<div class="control-group" style="margin-bottom: -18px;margin-top: -16px;"><div class="controls">



<div class='input-append input-prepend' style="margin-left: 3px;">
	<span class="add-on" style="border-bottom-right-radius: 0;border-top-right-radius: 0;background-color: #eee;">https://</span>
	  <input type="url" id="freshbooks_url" class="input-medium" style="width:47%;margin-left: -3px;margin-right: -3px;" placeholder="Freshbooks domain name" value="" id="freshbooks_url">
    <span class="add-on" style="border-bottom-right-radius: 0;border-top-right-radius: 0;background-color: #eee;border-radius: 3px;
margin-left: -3px;">.freshbooks.com</span>

                </div>  
<div id="domainerror" class="hide" style="color:red;">Enter Domain Name</div>
         </div>
				
               
           <div class="control-group" style="margin-bottom:0px;margin-top: 12px;"><div class="controls">
              <input type="text" id="freshbooks_apiKey" class="input-medium"  style="width:90%" placeholder="API Token" value="" id="freshbooks_apiKey"></input>
            <div id="apierror" class="hide" style="color:red;">Enter Valid API Token</div>
    </div></div>
				
               <a href ="#" id ="freshbooks" class="btn">Connect</a>
				
	    </form>
</div>
{{/if}}

</div>
</script>

<script
	id="admin-settings-import-freshbooks-contacts-syncPrefs-template"
	type="text/html">


	<div class="well widget-add" style="width:220px;">

    <img class="thumbnail" src="img/plugins/freshbooks-logo.png" style="width: 210px; height:70px;" />
	<br />
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;"  rel="tooltip" >
		Sync Clients from Freshbooks as Contacts in Agile CRM along with purchase history.
	</div>
    
			{{#if id}}
        	   <a class="btn btn-danger delete" >Disable</a>
				<a href="#sync/freshbooks/setting" class="btn">Settings</a>
			{{else}}

	  {{#canSyncContacts}}
		{{#isAllowedInCurrentPlan "is_accounting_sync_allowed"}}
	            <a href="#sync/freshbooks" class="btn" style="display:inline-block;">Enable</a>
								{{else}}
									<a disabled  class="btn"  style="display:inline-block;">Enable</a>
									<div style="display:inline;float:right; max-width:135px;" class="text-right" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
							{{/isAllowedInCurrentPlan}}

           {{else}}
		         <span class="btn" style="display:inline-block;" disabled>Enable</span>
				 <span style="margin-left:5px"><i>Needs import privilege.</i></span>
	{{/canSyncContacts}}
			{{/if}}

</div>

</script>


<script id="admin-settings-import-freshbooks-contacts-form-template"
	type="text/html">
<div class="span4 well">
<span class="label label-important" style="float:right">Beta</span>
<center> <img class="thumbnail" src="img/plugins/freshbooks-logo.png" style="width: 216px;margin-left: 72px; height:70px;" /></center>
<br/>
{{#unless id}}
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;margin-left:13px;height:20px !important"  rel="tooltip" >
		Setup contacts sync with your Freshbooks account.
	</div>
{{/unless}}

<form class="widget_content" style="border-bottom:none;margin-top:20px;" id="freshbooks_login_form" name="freshbooks_login_form" method="post">
	    	
			
                     
				<div class="control-group" style="margin-bottom: -18px;margin-top: -16px;"><div class="controls">



<div class='input-append input-prepend' style="margin-left: 3px;">
	<span class="add-on" style="border-bottom-right-radius: 0;border-top-right-radius: 0;background-color: #eee;">https://</span>
	  <input type="url" id="freshbooks_url" class="input-medium" style="width:47%;margin-left: -3px;margin-right: -3px;" placeholder="Freshbooks domain name" value="" id="freshbooks_url">
    <span class="add-on" style="border-bottom-right-radius: 0;border-top-right-radius: 0;background-color: #eee;border-radius: 3px;
margin-left: -3px;">.freshbooks.com</span>

                </div>  
<div id="domainerror" class="hide" style="color:red;">Enter Domain Name</div>
         </div>
				
               
           <div class="control-group" style="margin-bottom:0px;margin-top: 12px;"><div class="controls">
              <input type="text" id="freshbooks_apiKey" class="input-medium"  style="width:90%" placeholder="API Token" value="" id="freshbooks_apiKey"></input>
           <div id="apierror" class="hide" style="color:red;">Enter Valid API Token</div>
       </div></div>
				
               <a href ="#" id ="freshbooks" class="btn">Connect</a>
				
	    </form>
</div>
</script>
<script type="text/html" id="admin-settings-integrations-stats-template">
<div class="row">
	<div class="span9 well">
		<legend style="margin-bottom:10px"> Email Stats
				<!--<span style='top: -3px;' class='text-sm pos-rlt label label-{{#if_equals "active" status}}success{{else}}warning{{/if_equals}}'>{{capFirstLetter status}}</span>-->
				<span style="display: inline;vertical-align: 1px;" class="pull-right">
					{{#if this.id}}Reputation {{{get_subaccount_reputation reputation}}}
					{{/if}}
				</span>
		</legend>
		{{#unless _agile_email_gateway}}
			{{#if_equals "paused" status}}
				<div class="alert alert-danger m-t" role="alert">
  					Important: Emails from your account are blocked due to poor reputation. Please contact our <a href="#contact-us">support</a> team if you wish to correct this.
				</div>
			{{/if_equals}}
		{{/unless}}
		<div class="row-fluid">
        	<div class="span6">
            	<h3 style="text-align: center;">Emails Sent</h3>
				<table class="table table-bordered">
					<tbody>
						<tr><th>This Hour</th><td>{{numberWithCommas sent_hourly}}</td></tr>
						<tr><th>This Week</th><td>{{numberWithCommas sent_weekly}}</td></tr>
						<tr><th>This Month</th><td>{{numberWithCommas sent_monthly}}</td></tr>
						<tr><th>Overall</th><td>{{numberWithCommas sent_total}}</td></tr>
					</tbody>
				</table>
        	</div>
        	<div class="span6">
            	<h3 style="text-align: center;">Bounces (Last 30 Days)</h3>
				<table class="table table-bordered">
					<tbody>
						<tr><th>Hard Bounce</th><td>{{numberWithCommas last_30_days.hard_bounces}}</td></tr>
						<tr><th>Soft Bounce</th><td>{{numberWithCommas last_30_days.soft_bounces}}</td></tr>
						<tr><th>Rejects</th><td>{{numberWithCommas last_30_days.rejects}}</td></tr>
						<tr><th>Spam Complaints</th><td>{{numberWithCommas last_30_days.complaints}}</td></tr>
					</tbody>
				</table>
        	</div>
    	</div>
		<legend style="margin-bottom:10px"> SMS Stats
				<span style="display: inline;vertical-align: 1px;" ></span>
		</legend>
					{{#unless Stats-Type}}
					<h4 style="text-align: left;">No SMS gateway configured. <a href="#integrations">Configure Now</a></h4>
					{{/unless}}
		{{#if_equals "TWILIO" Stats-Type}}
		<div class="row-fluid">
        	<div class="span6">
            	<h3 style="text-align: center;">SMS Sent</h3>
				<table class="table table-bordered">
					<tbody>
						<tr><th>Today</th><td>{{numberWithCommas Today}}</td></tr>
						<tr><th>Yesterday</th><td> {{numberWithCommas Yesterday}}</td></tr>
						<tr><th>This Month</th><td>{{numberWithCommas ThisMonth}} </td></tr>
						<tr><th>Last Month</th><td>{{numberWithCommas LastMonth}} </td></tr>
					</tbody>
				</table>
        	</div>
        	<div class="span6">
            	<h3 style="text-align: center;">Delivery Status (Last 50 Messages)</h3>
				<table class="table table-bordered">
					<tbody>
						<tr><th>Queued</th><td>{{numberWithCommas Queued}} </td></tr>
						<tr><th>Delivered</th><td> {{numberWithCommas Delivered}}</td></tr>
						<tr><th>Undelivered
						<span style="vertical-align: text-top; margin-left: -3px">
						<img border="0" src="/img/help.png" style="height: 6px; vertical-align: top" rel="popover" data-placement="right" data-title:"="" 
						data-content="This can happen for a number of reasons including carrier content filtering, availability of the destination handset, etc." 
						id="element" data-trigger="hover" data-original-title=""></span>
						</th><td>{{numberWithCommas Undelivered}}</td></tr>
						<tr><th>Failed
						<span style="vertical-align: text-top; margin-left: -3px">
						<img border="0" src="/img/help.png" style="height: 6px; vertical-align: top" rel="popover" data-placement="right" data-title:"="" 
						data-content="This can happen for various reasons including incorrect number, improper number format, queue overflows or  account suspensions. Twilio does not charge you for failed messages." 
						id="element" data-trigger="hover" data-original-title=""></span>
						</th><td>{{numberWithCommas Failed}} </td></tr>
					</tbody>
				</table>
        	</div>
    	</div>
		{{/if_equals}}
		{{#if_equals "PLIVO" Stats-Type}}
		<h4 style="text-align: left;">No stats available for Plivo SMS Gateway.</h4>			
		{{/if_equals}}
	</div>
</div>
</script><script id="admin-settings-milestones-collection-template" type="text/html">
<div class="row">
	<div class='span9'>
	
		<div>
			<h3>Deal Tracks
			{{#isTracksEligible}}
				<a href="#pipelineModal" role="button" data-toggle="modal" type="submit" class="add-pipeline btn" style="float:right;"><i class="icon icon-plus-sign"></i> Add Track</a>
			{{else}}
				<span class="btn disabled" style="float:right;"><i class="icon icon-plus-sign"></i> Add Track</span>
				<div class="clearfix"></div>
			{{/isTracksEligible}}
			</h3>
		{{#isTracksEligible}}
		{{else}}
		<div class="pull-right" style="margin-top:2px;"><i>Please <a href="#subscribe">upgrade</a> to add more Tracks.</i></div>
		<div class="clearfix"></div>
		{{/isTracksEligible}}
		</div>
		<div class="accordion" id="deal-tracks-accordion">
    	<div id="admin-settings-milestones-model-list"></div>
		</div>
	<!--	<div class="form-actions">
    		<a href="#" class="save-pipelines btn btn-primary">Save</a>
    	</div>	-->
		<!-- New (Pipeline) Modal views -->
	<div class="modal hide fade" id="pipelineModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>&nbsp;Add Track</h3>
    </div>
    <div class="modal-body" style="max-height:420px !important;">
        <form id="pipelineForm" name="pipelineForm" method="post">
            <fieldset>
                <p>
				<input type="hidden" name="id" id="pipeline_id"/>
				<input type="checkbox" name="isDefault" id="is_default" style="display:none;"/>
                <div class="control-group">
                    <label class="control-label"><b>Track Name</b> <span class="field_req">*</span></label>
                    <div class="controls">
                        <input name="name" type="text" field="pipeline" class="required" id="pipline_name" placeholder="Track" />

                    </div>
                </div>
                <div class="control-group hide">
					<label class="control-label"><b>Milestones</b> <span class="field_req">*</span></label>
                    <div class="controls">
                        <input class="input-large" name="milestones" class="required" type="text" id="milestones" value="New,Prospect,Proposal,Won,Lost" />
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
		<span class="save-status"></span>
        <a href="#" class="save btn btn-primary" id="pipeline_validate">Save
        </a>
    </div>

</div>
<!-- End of Modal views -->
    </div>
<!-- Help Text -->
<div class="span3">
	<div class="data-block">
		<div class="well">
			<h3>What are Tracks and Milestones?</h3>
			<br/>
			<p>Tracks are sales processes. Use tracks to correspond to particular products or services offered by your company, or set up tracks to be used in deals with customers, partners, resellers, etc. When you create a new deal, you choose which track to associate it with.</p>
			<br/>
			<p>Milestones define the status of deals in a particular track. You can create any number of custom milestones in a track. Common milestones include 'New', 'In Progress',  'Won' or  'Lost'. When you associate a deal with a track, that deal will typically need to go through all of the track's milestones to be completed or finalized.</p>
		</div>
	</div>
</div>
<!-- End Help Text -->
<div class="modal hide fade" id="pipeline-delete-modal">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3>Delete Track</h3>
    </div>
	<div class="modal-body">
        <div id="deals-export-csv-detail">
             <p>Are you sure you want to delete Track - <span id="track-name"></span> ? </p>
			<p>All existing deals in this track can be accessed from the Deals list view.</p>
        </div>
    </div>
    <div class="modal-footer">
    <span class="pipeline-delete-message" style="margin-right:5px;color:red;"></span>
    <a href="#" id="pipeline-delete-confirm" class="btn btn-primary">Yes</a>
    <a  href="#" class="btn close" data-dismiss="modal" style="opacity:0.5;">No</a>
    </div>
</div>

<!-- milestone error message -->
<div class="modal hide fade" id="milestone-error-modal">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3>Add Milestone</h3>
    </div>
	<div class="modal-body">
        <p><i class="icon-exclamation-sign" style="font-size: 25px;vertical-align: middle;padding-right: 5px;"></i>Special characters are not allowed except space and underscore</p>
    </div>
    <div class="modal-footer">
    <a  href="#" class="btn close" data-dismiss="modal" style="opacity:0.5;">Ok</a>
    </div>
</div>
</div>
</script>

<script id="admin-settings-milestones-model-template" type="text/html">
    	
		<form id="milestonesForm_{{id}}" class="form-horizontal m-t-sm m-b-none pipeline" method=post>
		<div id="{{id}}-deal-track" class="accordion-group overflow-hidden m-b-xs">
		<div class="accordion-heading" style="background:#f5f5f5;">
    		{{#if id}}
    			<input type="text" name="id" class="hide" value="{{id}}">
    		{{/if}} 
			{{#if id}}
    			<input type="text" name="name" class="hide" value="{{name}}">
    		{{/if}}

			<input type="hidden" name="isDefault" value={{isDefault}}>
			<h4><a class="accordion-toggle collapsed pull-left text-l-none-hover" style="width:90%" data-toggle="collapse" data-parent="#deal-tracks-accordion" href="#dealtracks-{{id}}-accordion">{{name}}</a>
			<div id="icons" style="display:none;">
			{{#isTracksEligible}}
			{{#hasSingleTrack}}
				<a href="#pipeline-delete-modal" role="button" data-toggle="modal" class="pipeline-delete m-t-xs m-l-sm c-p text-l-none pull-right text-lg" id="{{id}}" data="{{name}}"><i class="task-action icon icon-trash" data="{{id}}" title="Delete Track"></i></a>
			{{/hasSingleTrack}}
			<a href="#pipelineModal" role="button" data-toggle="modal" class="pipeline-edit m-t-xs c-p text-l-none pull-right text-lg {{#hasSingleTrack}} {{else}}p-r-xs{{/hasSingleTrack}}" id="{{id}}" data="{{name}}" ><i class="task-action icon icon-edit" data="{{id}}" title="Edit Track"></i></a>
			{{else}}
			{{#if_equals isDefault 'false'}}
				{{#hasSingleTrack}}
					<a href="#pipeline-delete-modal" role="button" data-toggle="modal" class="pipeline-delete m-t-xs m-l-sm c-p text-l-none pull-right text-lg" id="{{id}}" data="{{name}}"><i class="task-action icon icon-trash" data="{{id}}" title="Delete Track"></i></a>
				{{/hasSingleTrack}}
				<a href="#pipelineModal" role="button" data-toggle="modal" class="pipeline-edit m-t-xs c-p text-l-none pull-right text-lg {{#if isDefault}} p-r-xs{{/if}}" id="{{id}}" data="{{name}}" ><i class="task-action icon icon-edit" data="{{id}}" title="Edit Track"></i></a>
			{{/if_equals}}
			{{/isTracksEligible}}
			</div></h4>
			<div class="clearfix"></div>
			</div>
			<div class="collapse" id="dealtracks-{{id}}-accordion">
			<fieldset>
    		<div class="control-group m-b-none">  	 
                    <div id="milestone-values-{{id}}">
					<table class="table table-bordered agile-ellipsis-dynamic custom-fields-table m-b-xxs" >
					<colgroup><col width="50%"><col width="3%"></colgroup>
					<tbody class="deal-tracks-tbody ui-sortable">
					{{#milestone_ul milestones}}{{/milestone_ul}}
					</tbody>
					</table>
					</div>
					<div class="p-l-md p-t p-b"><a href="#" class="show_milestone_field anchor-link"><i class="icon-plus-sign"></i> Add Milestone</a></div>
					<div class="show_field p-l-md p-t p-b" style="display:none;padding-left: 18px;">
						<input id="add_new_milestone" class="add_new_milestone"  type="text" placeholder="New Milestone">
						<a class="btn add_milestone" id="add_milestone" href="#">Add</a>
					</div>
    				<div class="hidden"><input name="milestones" type="text" class="required" value="{{milestones}}"/></div>
    		</div> 
    		</fieldset>
			</div>
		</div>
    	</form>
		
</script>

<script id="admin-settings-menu-settings-template" type="text/html">
<!--  Contact View Detail in Detailed mode - when only one contact is shown -->
<div class="span8 well">
    <form id="navmodsSelect" class="form-horizontal">
        <fieldset>
            {{#if id}}
			<input name="id" type="hidden" value="{{id}}" />
			{{/if}}
            <legend>Select the options to show in the menu bar (on the top)</legend>
            <div class="row-fluid">
				<div class="span11">
         
                    <div style="margin-left: 50px;">
                        <input name='calendar' type='checkbox' style="vertical-align:top; " />
						<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Calendar<br/><small> manage your tasks and events</small></label>
                    </div>
                    <div style="margin-left: 50px;">
                         <input name='campaign' type='checkbox' style="vertical-align:top; " />
						 <label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Campaigns<br/><small> automate marketing</small></label>
                    </div>
                    <div style="margin-left: 50px;">
                         <input name='deals' type='checkbox' style="vertical-align:top; " />
						 <label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Deals<br/><small> track sales opportunities</small></label>
                    </div>
                    <div style="margin-left: 50px;">
                         <input name='social' type='checkbox' style="vertical-align:top; " />
						 <label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Social<br/><small> monitor your brand on social media</small></label>
                    </div>
                	<div style="margin-left: 50px;">
                        <input name='documents' type='checkbox' style="vertical-align:top; " />
						<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Documents<br/><small> upload and attach documents to contacts, deals or cases</small></label>
                    </div>
                    <div style="margin-left: 50px;">
                         <input name='reports' type='checkbox' style="vertical-align:top; " />
						 <label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Reports<br/><small> stay on top of your data</small></label>
                    </div>
                    <div style="margin-left: 50px;">
                        <input name='cases' type='checkbox' style="vertical-align:top; " />
						<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Cases<br/><small> log and address customer issues</small></label>
                    </div>
					 <div style="margin-left: 50px;">
                        <input name='web_rules' type='checkbox' style="vertical-align:top; " />
						<label style="display: inline-block;padding-left: 14px;vertical-align: -3px;">Web Rules<br/><small> log and address customer issues</small></label>
                    </div>

				</div>
            </div>
            <div class="clearfix"></div>
            <div class="form-actions">
                <a type="submit" class="btn btn-primary save">Save Changes</a>
					<p style='display:inline-block;'>
						<i><small>
							<span id='div-success' style='display:none;'>Saved Successfully</span>
							<span id='div-fail' style='display:none; color:#B94A48; font-size:14px'>Save Failed</span>
						</small></i>
					</p>
			 </div>
        </fieldset>
    </form>
</div>
</script><script id="settings-sms-gateway-template" type="text/html">
	<div class="well" style="width: 300px;">
		<form style="border-bottom: none; margin-top: -10px; margin-bottom: 0px;" id="sms-gateway-integration-form">
			<fieldset>

				<div style="position: relative; padding-top: 10px;">
					<center>
						<img class="thumbnail" alt="sms-integration" id="integrations-image" style="top: -5px; position: relative; height: 85px;" />
					</center>
				</div>

				<div class="control-group" style="margin-bottom: 0px;margin-top : 20px;">
					<div class="controls">
						<label id="integrations-label"></label>             			
					</div>
				</div>

				<div style="margin-bottom: 0px; padding-top: 24px;">
					<div>
						{{#if id}} 
							<input type="hidden" class="input-medium required TWILIO PLIVO" style="width: 90%" name="id" value="{{id}}" />
						{{/if}} 
							<input type="hidden" class="input-medium required TWILIO" style="width: 90%" value="INTEGRATIONS" name="widget_type" /> 
							<input type="hidden" class="input-medium required TWILIO PLIVO" style="width: 90%" value="SMS-Gateway" name="name" /> 
						
						{{#if widget_type}} 
							<input type="hidden" class="input-medium required TWILIO PLIVO" style="width: 90%" value="This is a {{widget_type}} gateway" name="description" />
						{{/if}}

						{{#if_equals "TWILIO" sms_api}} 
							<input type="hidden" class="input-medium required TWILIO" style="width: 90%" name="endpoint" value="https://api.twilio.com" /> 
						{{/if_equals}} 

						{{#if_equals "INTEGRATIONS" widget_type}}
							{{#if_equals "SMS-Gateway" name}} 
								{{#if prefs}} 
									{{#stringToJSON this "prefs"}} 
										
										<input type="hidden" class="input-medium required TWILIO PLIVO" style="width: 90%" name="id" />

										{{#if_equals "TWILIO" sms_api}}
											<div class="control-group" style="margin-bottom: 0px; margin-top: -12px;">
												<div class="controls">
													<input type="text" class="input-medium required TWILIO PLIVO" style="width: 90%" placeholder="ACCOUNT SID"  name="account_sid" value="{{account_sid}}"/>
												</div>
											</div>

										{{else}}

										<div class="control-group" style="margin-bottom: 0px; margin-top: -12px;">
											<div class="controls">
												<input type="text" class="input-medium required TWILIO PLIVO" style="width: 90%" placeholder="ACCOUNT ID" name="account_id" value="{{account_id}}"/>
											</div>
										</div>

										{{/if_equals}}

										<div class="control-group" style="margin-bottom: 0px;">
											<div class="controls">
												<input type="text" class="input-medium required TWILIO PLIVO" style="width: 90%; margin-top: 10px;" placeholder="Auth Token" name="auth_token" value="{{auth_token}}" id = "auth_token" />
											</div>
										</div>

									{{/stringToJSON}}

								{{/if}}

							{{/if_equals}}

						{{else}} 

							{{#if id}}
								<input type="hidden" class="input-medium required TWILIO PLIVO" style="width: 90%" name="id" />
							{{/if}}

							<div class="control-group" style="margin-bottom: 0px;">
								<div class="controls">
									<input type="text" class="input-medium required TWILIO PLIVO" style="width: 90%;margin-top: -12px;" id="accoundID" />
								</div>
							</div>

							<div class="control-group" style="margin-bottom: 0px;">
								<div class="controls">
									<input type="text" class="input-medium required TWILIO PLIVO" style="width: 90%; margin-top: 10px" placeholder="Auth Token" name="auth_token" id = "auth_token" />
								</div>
							</div>

						{{/if_equals}}
					</div>
				</div>

				<div id="sms-integration-error">
					<p style="margin: 10px 0px 5px 0px;">
						<a type="submit" href="#" class="save btn btn-primary" style="text-decoration: none; padding: 4px 5px;">Save</a> 
						<a type="reset" class="btn" href="#integrations" style="text-decoration: none;">Cancel</a>
					</p>
				</div>

			</fieldset>
		</form>
	</div>
</script>















<script id="admin-settings-user-add-template" type="text/html">
    <div class="row">
    	<div class="span9">
    	<div class="well">
    
    		<form id="userForm" name="userForm" method="get" action="" class="form-horizontal">
    			<fieldset>
    				{{#if id}}
                		<legend>Edit User Details</legend>
    					<input type="text" name="id" class="hide" value={{id}} >
					{{else}}
						<legend>New User Details</legend>
    				{{/if}}
    				<br/>
                   	<div class="control-group">
    					<label class="control-label" for="cname">Name <span class="field_req">*</span></label> 
                   		<div class="controls">
    						<input type="text" id="cname" name="name" class="required" placeholder="Name" autocapitalize="off"/>
    					</div>
    				</div> 
    			
    				<div class="control-group">
    					<label class="control-label" for="eaddress">Email Address <span class="field_req">*</span></label> 
                   		<div class="controls">
    						<input type="text" id="eaddress" class="email required" name='email' placeholder="Email address" autocapitalize="off"/> 
    					</div>
    				</div>
    
                       <div class="control-group">
    					<label class="control-label" for="password">Password <span class="field_req">*</span></label> 
                   		<div class="controls">
    						<input type="password" class="required" id="password" value="{{password}}" name='password' maxlength="20" minlength="4" placeholder="Password" autocapitalize="off"/> 
    					</div>
    				</div>

    
    				<div class="control-group">
    					<div class="controls">
    						<label class="checkbox">
    							<input type="checkbox" id="Disabled" name='is_disabled' value='true'/> 
                           		Disable this user
    						</label>
    					</div>
    				</div>
	
					<div class="control-group">
    					<div class="controls">
    						<label class="checkbox">
    							<input type="checkbox" id="Admin" name='is_admin' value='true'/> 
                           		Administrator<br/><small>Allow access to admin settings (configuration and user management)</small>
    						</label>
    					</div>
    				</div>


					<div id="accordion">
					  <div class="panel-heading controls">
     					 <div class="panel-title">
        					<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" >
          						<span class="icon-plus"> </span> Privileges</a>
					        </a>
      					</div>
    				</div>
					<div id="collapseOne" class="panel-collapse collapse" >
						
      					<div class="panel-body" style="margin-top:20px!important;margin-left:20px" >
					{{#isAllowedInCurrentPlan "is_ACL_allowed"}}
						{{else}}
	 					<div class="control-group" style="margin-top:-2%">
							<div class="controls">
								<p><i>{{toSafeString message}}</i><p>
							</div>
						</div>
					{{/isAllowedInCurrentPlan}}

					<div class="control-group" style="margin-top:-2%">
					
						<div class="controls">
							{{#aclsWithPlans this}}
								{{getTemplate "admin-settings-user-acl" this}}
							{{/aclsWithPlans}}
						</div>
					</div>
				
					<div class="control-group" style="margin-top:-20px">
						<div class="controls">
						
							{{#aclsWithPlans this}}
								{{getTemplate "admin-settings-user-menu-scopes" this}}
							{{/aclsWithPlans}}
			
				</div>	
				</div>
    			</div>
					</div>
					</div>

                    {{#if id}}
                	
    					<input type="text" name="meeting_types" class="hide"  value="{{meeting_types}}">
                        <input type="text" name="meeting_durations" class="hide"  value="{{meeting_durations}}">
                        <input type="text" name="business_hours" class="hide"  value="{{business_hours}}">
						<input type="text" name="info_json_string" class="hide"  value="{{info_json_string}}">
                        <input type="text" name="timezone" class="hide"  value="{{timezone}}">
				
    				{{/if}}
    				<div class="form-actions">
               			<button type="submit" class="save btn btn-primary">Save Changes</button>
               			<a type="reset" href='#users' class="btn">Cancel</a>
             			</div>
    			</fieldset>
    		</form>
    	</div>
    </div>
    </div>
</script>

<script id="admin-settings-user-acl-template" type="text/html">
<div class="multiple-checkbox"  name="newscopes">
								<label class="checkbox" >
                            	<input type="checkbox" name="temp"  value="CREATE_CONTACT" {{#if user_scopes.disabled}}disabled{{/if}} {{#if user_scopes.checked}}checked{{/if}}> 
                            		Create Contacts <br/>
									<small> Add contacts</small>
								</label>
								<label class="checkbox" >
            	            	    <input type="checkbox" name="temp"  value="IMPORT_CONTACTS" {{#if user_scopes.disabled}}disabled{{/if}} {{#if user_scopes.checked}}checked{{/if}}> 
        	                    	Import Contacts  <br/>
									<small> Import from CSV file, sync from Google Apps and other integrations</small>
    	                       </label>
								<label class="checkbox" >
                        	    	<input type="checkbox" name="temp"  value="VIEW_CONTACTS" {{#if user_scopes.disabled}}disabled{{/if}} {{#if user_scopes.checked}}checked{{/if}}> 
                            		View All Contacts  <br/>
									<small> View contacts owned by other users </small>
                           		</label>
								<label class="checkbox" >
                        		    <input type="checkbox" name="temp" value="DELETE_CONTACTS" {{#if user_scopes.disabled}}disabled{{/if}} {{#if user_scopes.checked}}checked{{/if}}> 
                        	    	Update All Contacts  <br/>
									<small>  Edit and delete contacts owned by other users</small>
                    	       </label>
							</div>
</script>

<script id="admin-settings-user-acl-disabled-template" type="text/html">
<div class="multiple-checkbox">
							<label class="checkbox" >    
							<input type="checkbox" name="temp"  value="CREATE_CONTACT" checked disabled> 
                            		Create Contacts <br/>
									<small> Add contacts</small>
								</label>
								<label class="checkbox" >
            	            	    <input type="checkbox" name="temp"  value="IMPORT_CONTACTS" checked disabled> 
        	                    	Import Contacts  <br/>
									<small> Import from CSV file, sync from Google Apps and other integrations </small>
    	                       </label>
								<label class="checkbox" >
                        	    	<input type="checkbox" name="temp"  value="VIEW_CONTACTS" checked disabled> 
                            		View All Contacts  <br/>
									<small> View contacts owned by other users</small>
                           		</label>
								<label class="checkbox" >
                        		    <input type="checkbox" name="temp" value="DELETE_CONTACTS" checked disabled> 
                        	    	Update All Contacts  <br/>
									<small>  Edit and delete contacts owned by other users</small>
                    	       </label>
	</div>
</script>


<script id="admin-settings-user-menu-scopes-template" type="text/html">
<div class="multiple-checkbox"  name="newMenuScopes"  style="padding-top:5px">
	<label class="checkbox hide"  >
                        		    <input type="checkbox" name="scopes-temp" class="required hide" value="CONTACT" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
                        	    	Contacts<br/><small>Manage contacts</small></label> 
								<label class="checkbox"  >
                        		    <input type="checkbox" name="scopes-temp" class="required" value="CALENDAR" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
                        	    	Calendar<br/><small>Manage your tasks and events</small></label> 
								<label class="checkbox"  >
            	            	    <input type="checkbox" name="scopes-temp" class="required" value="DEALS" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
        	                    	Deals<br/>
									<small> Track sales opportunities</small>
    	                       </label><label class="checkbox"  >
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="CAMPAIGN" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
                            		Campaigns<br/>
										<small> Automate marketing</small>
                           		</label>
						
								 </label><label class="checkbox"  >
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="CASES" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
                            		Cases<br/>
									<small>Log and address customer issues</small>
                           		</label>
 								</label><label class="checkbox"  >
                        	    	<input type="checkbox" name="scopes-temp"  class="required" value="SOCIAL" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
                            		Social Suite<br/>
									<small> Monitor your brand on social media</small>
                           		</label>
								</label><label class="checkbox"  >
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="WEBRULE" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
                            		Web Rule<br/>
									<small> Enagage your website visitors with smart popups, or perform automatic actions </small>
                           		</label>
								</label><label class="checkbox"  >
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="DOCUMENT" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
                            		Documents<br/>
								<small> Upload and attach documents to contacts, deals or cases</small>
                           		</label>
								</label><label class="checkbox"  >
                        	    	<input type="checkbox" name="scopes-temp"  class="required" value="ACTIVITY" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
                            		Activities<br/>
									<small> Know what other users are doing</small>
                           		</label>
								</label><label class="checkbox"  >
                        	    	<input type="checkbox" name="scopes-temp"  class="required" value="REPORT" {{#if menu_scopes.disabled}}disabled{{/if}} {{#if menu_scopes.checked}}checked{{/if}}> 
                            		Reports<br/>
									<small> Stay on top of your data</small>
                           		</label>
</div>
</script><script id="admin-settings-users-collection-template" type="text/html">
<div class="row">
        <div class="span12">
            <div class="">
                <h3><strong>Users</strong></h3>
                <a href="#users-add" class="btn right" id="addUser" style='top:-27px;position:relative'><span><i class='icon-plus-sign'/></span> Add User</a>
            </div>
        </div>
    </div>

    <div class="row">
            <div class="span9"> 
            <table class="table table-striped showCheckboxes" url="core/api/users/bulk" style="overflow:scroll;">
                <thead>
                    <tr>
						
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>Created On</th>
                        <th>Last Logged In</th>
                    </tr>
                 </thead>
                 <tbody id='admin-settings-users-model-list' route='user-edit/' style="overflow:scroll;">
                 </tbody>
            </table>
            </div>
    </div>
</script>
<script id="admin-settings-users-model-template" type="text/html">
    <td class='data' data='{{id}}'>
	<div style="height:auto;text-overflow:ellipsis;white-space:nowrap;width:5em;overflow:hidden;" class="pull-left">
	   {{#if ownerPic}}
        <img class="thumbnail" src="{{ownerPic}}" width="40px" height="40px" title="{{name}}" />
	   {{else}}
		<img class="thumbnail" src="{{defaultGravatarurl 50}}" width="40px" height="40px" title="{{name}}" />
       {{/if}}
    </div>
	<div  class="pull-left"style='text-overflow:ellipsis;width:9em;overflow:hidden;'>{{name}}</div></td>
    <td>
        <div style='height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:10em;overflow:hidden;'>
        {{email}}
        </div>
    </td>
    <td><div style='text-overflow:ellipsis;width:7em;overflow:hidden;'>{{epochToDate info_json_string "created_time"}}</div></td>
    <td><time class="last-login-time" datetime="{{epochToDate info_json_string "logged_in_time"}}" style="border-bottom:dotted 1px #999">{{epochToDate info_json_string "logged_in_time"}}</time></td>
    <td><div style='text-overflow:ellipsis;width:8em;overflow:hidden;'>{{#if is_admin}}<span style="margin-right:5px;" class="label">Admin</span>{{/if}}{{#if is_account_owner}}<span class="label">Owner</span>{{/if}}{{#if is_disabled}}<span class="label label-important">Disabled</span>{{/if}}</div></td>
    
</script><script id="admin-settings-web-to-lead-collection-template" type="text/html">
<div class="row">

	<div class="span11">
      <div class="page-header">
          <h2> Web to Lead <small></small></h2>
      </div>
	  <div class="row-fluid">
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
			<h1 style="margin: 25px 0 37px 0;">Form Builder	<!-- <span class="label label-important">Beta</span>	-->	</h1>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 38px !important;"  rel="tooltip" title="Build your form using our form builder.">
					Build your form using our form builder.
				</div><br/><a href="#forms">Show Forms</a>
			</div>
		</div>
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
				<h1 style="font-size: 60px;margin-top:26px;">JS API</h1><br/><br/>
    			<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 38px !important;"  rel="tooltip" title="Use our JS API to push data into Agile from your web forms.">
					Use our JS API to push data into Agile from your web forms.
				</div><br/><a href="https://github.com/agilecrm/javascript-api" target="_blank">Learn More</a>
			</div>
		</div>
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
				<a href="https://www.agilecrm.com/wufoo.html" target="_blank" style="text-decoration:none;">
					<img alt="wufoo-integration" src="img/crm-plugins/wufoo.png">
				</a><br/><br/>
    			<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 38px !important;"  rel="tooltip" title="Push form submissions in Wufoo as a contact in Agile.">
					Push form submissions in Wufoo as a contact in Agile.
				</div><br/><a href="https://www.agilecrm.com/wufoo.html" target="_blank">Learn More</a>
			</div>
		</div>
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
				<a href="https://www.agilecrm.com/unbounce.html" target="_blank" style="text-decoration:none;">
					<img alt="unbounce-integration" src="img/crm-plugins/unbounce.png">
				</a><br/><br/>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 38px !important;"  rel="tooltip" title="Push Unbounce landing page form data as a contact in Agile.">
					Push Unbounce landing page form data as a contact in Agile.
				</div><br/><a href="https://www.agilecrm.com/unbounce.html" target="_blank">Learn More</a>
			</div>
		</div>
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
				<div style="position: relative;">
						<span class="label label-important" style="position: absolute;right: 0;">Beta</span>
						<a href="https://www.agilecrm.com/gravity-forms" target="_blank" style="text-decoration:none;">
							<img alt="gravity-forms-integration" src="img/crm-plugins/gravity-forms.png">
						</a>
					<div class="clearfix"></div>
				</div>
				<br/>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 45px !important;"  rel="tooltip" title="Advanced forms plugin for Wordpress.">
					Advanced forms plugin for Wordpress.
				</div><br/><a href="https://www.agilecrm.com/gravity-forms" target="_blank">Learn More</a>
			</div>
		</div>
	 </div>
	</div>

	<div class="span11">
      <div class="page-header">
          <h2> E-commerce <small></small></h2>
      </div>
	  <div class="row-fluid">
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
				<a href="https://www.agilecrm.com/shopify-integration" target="_blank" style="text-decoration:none;">
					<img alt="shopify-integration" src="img/crm-plugins/shopify.png">
				</a>
				<br/><br/>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;"  rel="tooltip" title="Shopify is a powerful ecommerce solution that includes everything you need to create an online store.">
					Shopify is a powerful ecommerce solution that includes everything you need to create an online store.
				</div><br/><a href="https://www.agilecrm.com/shopify-integration" target="_blank">Learn More</a>
			</div>
		</div>
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
				<div style="position: relative;">
						<span class="label label-important" style="position: absolute;right: 0;">Beta</span>
						<a href="https://www.agilecrm.com/magento-crm" target="_blank" style="text-decoration:none;">
							<img alt="magento-integration" src="img/crm-plugins/Magento.png">
						</a>
					<div class="clearfix"></div>
				</div>
				<br/>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;"  rel="tooltip" title="Magento is the open-source ecommerce software and platform trusted by the world's leading brands.">
					Magento is the open-source ecommerce software and platform trusted by the world's leading brands.
				</div><br/><a href="https://www.agilecrm.com/magento-crm" target="_blank">Learn More</a>
			</div>
		</div>
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
					
					<div style="position: relative;">
						<span class="label label-important" style="position: absolute;right: 0;">Beta</span><br>
						<a href="https://www.agilecrm.com/woocommerce-crm" target="_blank" style="text-decoration:none;">
							<img alt="woocommerce-integration" src="img/crm-plugins/woocommerce.png">
						</a>
						<div class="clearfix"></div>
					</div>
					<br><br>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;" rel="tooltip" title="WooCommerce is a popular and free ecommerce plugin for Wordpress.">
					WooCommerce is a popular and free ecommerce plugin for Wordpress.
				</div><br><a href="https://www.agilecrm.com/woocommerce-crm" target="_blank">Learn More</a>
			</div>
		</div>
	  </div>
	</div>

	<div class="span11">
      <div class="page-header">
          <h2> CMS <small></small></h2>
      </div>
	  <div class="row-fluid">
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
				<!--<a href="https://www.agilecrm.com/cms.html" target="_blank" style="text-decoration:none;"></a>-->
					<img alt="cms-integration" src="img/crm-plugins/wordpress.png">
				<br/><br/>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;"  rel="tooltip" title="WordPress is a free and open source blogging tool and a content management system (CMS) based on PHP and MySQL, which runs on a web hosting service.">
					WordPress is a free and open source blogging tool and a content management system (CMS) based on PHP and MySQL, which runs on a web hosting service.
				</div><br/><a href="https://www.agilecrm.com/wordpress-integration" target="_blank">Learn More</a>
			</div>
		</div>
		
	  </div>
	</div>
	<div class="span11">
      <div class="page-header">
          <h2> Web App Integrations <small></small></h2>
      </div>
	  <div class="row-fluid">
		<div class="span4" style="margin-left:0px;text-align:center;">
			<div class="well" style="width:220px; height:200px;">
				<!--<a href="" target="_blank" style="text-decoration:none;"></a>-->
					<img alt="cms-integration" src="img/crm-plugins/zapier.png">
				<br/><br/>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;"  rel="tooltip" title="Zapier is the easiest way to connect hundreds of SaaS apps you use to easily move your data and automate tedious tasks.">
					Zapier is the easiest way to connect hundreds of SaaS apps you use to easily move your data and automate tedious tasks.
				</div><br/><a href="https://zapier.com/zapbook/agile-crm/" target="_blank">Try Zapier App</a>
			</div>
		</div>
	  </div>
	</div>

	<div class="span11">
		<div class="page-header">
			<h2>Email Gateways</h2>
		</div>
		<div class="row-fluid">
			<div class="span4" style="margin-left:0px;text-align:center;" id="mandrill-email-api-integration">
				<div class="well" style="width:220px; height:200px;">
					<div style="position: relative;">
					<!--	<span class="label label-important" style="position: absolute;right: 0;">Beta</span>	-->
						<img alt="cms-integration" src="img/crm-plugins/mandrill_logo.png" style="top: -5px; position: relative; height: 85px;">
							<div class="clearfix"></div>
					</div>
					<br>
					<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;"  rel="tooltip" title="Mandrill is a transactional email product by MailChimp.">
					Send your emails via your Mandrill account. Mandrill is a scalable and affordable email infrastructure service.
					</div><br/>
					<div style="float:left;">
						{{#if this.length}}	
							{{#gateway_exists "MANDRILL" this}}
								<a href="#" class="btn btn-danger" id="email-gateway-delete">Disable</a>
								<a href="#email-gateways/mandrill" class="btn">Settings</a>
							{{else}}
								{{#isAllowedInCurrentPlan "is_email_gateway_allowed"}}
									<a href="#email-gateways/mandrill" class="btn">Enable</a>
								{{else}}
									<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
											<a class="btn btn-primary _upgrade" id="mandrill_upgrade">Enable</a>
									</div>
									<div style="display:inline;float:right; max-width:135px;" class="text-right mandrill_upgrade" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
								{{/isAllowedInCurrentPlan}}	
							{{/gateway_exists}}
							{{else}}
								{{#isAllowedInCurrentPlan "is_email_gateway_allowed"}}
									<a href="#email-gateways/mandrill" class="btn">Enable</a>
								{{else}}
									<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
											<a class="btn btn-primary  _upgrade" id="mandrill_upgrade">Enable</a>
									</div>
									<div style="display:inline;display:none;float:right; max-width:135px;" class="text-right mandrill_upgrade" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
								{{/isAllowedInCurrentPlan}}	
	
							{{/if}}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="span11" id="SMSGateway">
		<div class="page-header">
			<h2>SMS Gateways</h2>
		</div>

		<!-- Twilio -->
		<div class="span4" style="margin-left:0px;text-align:center;" id="twilio-sms-api-integration">
			<div class="well" style="width:220px; height:200px;">
				<div style="position: relative;">
					<img alt="sms-integration" src="/img/plugins/twilio.png" style="top: -5px; position: relative; height: 85px;">
						<div class="clearfix">
						</div>
				</div>
				<br>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;" >
				Twilio provides APIs for text messages and VoIP. User your Twilio account to send SMS from Campaigns.
				</div><br/>
				<div style="float:left;"> 
					{{#if this.length}}	
						{{#gateway_exists "TWILIO" this}}
							<a href="#integrations" class="btn btn-danger " id="sms-gateway-delete"  data={{id}} >Disable</a>
								<a href="#sms-gateways/twilio" class="btn">Settings</a>
						{{else}}
							{{#isAllowedInCurrentPlan "is_sms_gateway_allowed"}}
								<a href="#sms-gateways/twilio" class="btn">Enable</a>
							{{else}}
									<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
											<a class="btn btn-primary  _upgrade" id="twilio_upgrade">Enable</a>
									</div>
									<div style="display:inline;display:none;float:right; max-width:135px;" class="text-right twilio_upgrade" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
								{{/isAllowedInCurrentPlan}}	
						{{/gateway_exists}}
					{{else}}
						{{#isAllowedInCurrentPlan "is_sms_gateway_allowed"}}
							<a href="#sms-gateways/twilio" class="btn">Enable</a> 
						{{else}}
									<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
											<a class="btn btn-primary  _upgrade" id="twilio_upgrade" >Enable</a>
									</div>
									<div style="display:inline;display:none;float:right; max-width:135px;" class="text-right twilio_upgrade" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
								{{/isAllowedInCurrentPlan}}	
					{{/if}}
				</div>
			</div>
		</div>

		<!-- Plivo -->		
		<div class="span4" style="margin-left:0px;text-align:center;" id="plivo-sms-api-integration">
			<div class="well" style="width:220px; height:200px;">
				<div style="position: relative;">
					<img alt="sms-integration" src="/img/plugins/plivo.png" style="top: -5px; position: relative; height: 85px;">
						<div class="clearfix">
						</div>
				</div>
				<br>
				<div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;"  rel="tooltip" ">
				Plivo provides Voice and SMS API for businesses of all sizes.  Use your Plivo account to send SMS from Campaigns.
				</div><br/>
				<div style="float:left;"> 
					{{#if this.length}}	
						{{#gateway_exists "PLIVO" this}}
							<a href="#integrations" class="btn btn-danger " id="sms-gateway-delete"  data={{id}} >Disable</a>
								<a href="#sms-gateways/plivo" class="btn">Settings</a>
						{{else}}
							{{#isAllowedInCurrentPlan "is_sms_gateway_allowed"}}
								<a href="#sms-gateways/plivo" class="btn">Enable</a>
							{{else}}
									<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
											<a class="btn btn-primary _upgrade" id="plivo_upgrade">Enable</a>
									</div>
									<div style="display:inline;display:none;float:right; max-width:135px;" class="text-right plivo_upgrade" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
								{{/isAllowedInCurrentPlan}}	
						{{/gateway_exists}}
					{{else}}
						{{#isAllowedInCurrentPlan "is_sms_gateway_allowed"}}
							<a href="#sms-gateways/plivo" class="btn">Enable</a>
						{{else}}
									<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
											<a class="btn btn-primary _upgrade" id="plivo_upgrade">Enable</a>
									</div>
									<div style="display:inline;display:none;float:right; max-width:135px;" class="text-right plivo_upgrade" >
										<p><i>{{toSafeString message}}</i><p>
									</div>
								{{/isAllowedInCurrentPlan}}	
					{{/if}}
				</div>
			</div>
		</div>
	</div>
</div>

</script>	


<script id = "sms-integration-alert-modal-template" type="text/html">
	<div class="modal hide fade" id="SMSGateway-integration-alert">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3><i class="icon-file-text"></i> {{title}} </h3>
		</div>
		<div class="modal-body">
				<div id="sms-integrations-message">
					<p>  {{message}}</p>
				</div>
		</div>
		<div class="modal-footer">
			<span class="sms-integrations-footer" style="margin-right:5px"></span>
				<a href="#" class="btn btn-primary" data-dismiss="modal">OK</a>
		</div>
	</div>
</script>
