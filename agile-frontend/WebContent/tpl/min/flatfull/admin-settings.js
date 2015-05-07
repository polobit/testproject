 <script id="admin-settings-template" type="text/html">
<div class="">
<!-- Check whether DomainUSer has admin Privileges -->
        <div class="bg-light lter b-b wrapper-md">
            <h1 class="pull-left font-thin h3">Admin Settings</h1>
<a href="#subscribe" class="pull-right text-lg  text-info">Plan & Upgrade</a>
<div class="clearfix"></div>    
    </div>
   

    <!-- <div class="app-content-full  h-full enable-full-height"> -->
	<div class="hbox hbox-auto-xs hbox-auto-sm bg-light agile-tab">
	<div class="col w b-r">
    <div class="vbox">
      <div class="row-row">
		<div id="AdminPrefsTab" class="list-group list-group-lg no-radius no-border no-bg m-b-none">
		
			<a href="#account-prefs" class="account-prefs-tab list-group-item  select">Account Preferences</a>
			<a href="#users" class="users-tab list-group-item">Users</a>
			<a href="#custom-fields" class="custom-fields-tab list-group-item">Custom Fields</a>
			<a href="#analytics-code" class="analytics-code-tab list-group-item">API & Analytics</a>
			<a href="#milestones" class="milestones-tab list-group-item">Deals</a>
		<!-- <a href="#menu-settings" class="menu-settings-tab list-group-item">Menu Settings</a> -->
            <a href="#integrations-stats" class="stats-tab list-group-item">Stats</a>
			<a href="#tag-management" class="tag-management-tab list-group-item">Tag Management</a>
			<a href="#integrations" class="integrations-tab list-group-item">Integrations</a>
		</div>
		</div>
		</div>
		</div>
		<div class="tab-content wrapper-md">
			<div class="tabs" id="admin-prefs-tabs-content"></div>
		</div>
	</div>
	</div>
	
</div>

</script><script id="admin-settings-api-key-model-template" type="text/html">
	<div class="col">
      <div class="hbox h-auto m-b-lg">
      
		
		<div class="tab-content">

			<div id="api-analytics-accordion">
	<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
		<div class="panel panel-default">
			<div id="settings-api">
				<div class="panel-heading" role="tab" id="headingOne">
					<div class="panel-title">
						<a class="accordion-toggle" data-toggle="collapse" aria-controls="collapseOne" aria-expanded="true" data-parent="#accordion" href="#api-key">API Key</a>
					</div>
				</div>
				<div class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne" id="api-key">
					<div class="panel-body" id="api-accordion">
						<div class="tab-pane active" id="api">

							<b>API key</b> for REST clients (Java, PHP, .Net wrappers) and integrations (Zapier, Wufoo, Unbounce, Chrome extension and others).
						   <div class="clearfix"></div>
						   <br/>
								<pre  id="api_key_code">{{api_key}}<span class="pull-right inline-block"><a id="api_key_generate_icon" class="c-p m-t-xs m-r-xs"><i class="icon-repeat"></i></a><img border="0" src="/img/help.png" class="question-tag-tiny v-top"  rel="popover" data-placement="bottom" data-title="" data-content="Reset API Key" id="element" data-trigger="hover" data-original-title=""></span></pre>
								tracking-webrules
						  <b>Javascript API key</b> only for tracking code on website.
						  <div class="clearfix"></div>
						   <br/>
								<pre  id="jsapi_key_code">{{js_api_key}}<span class="inline-block pull-right"><a id="jsapi_key_generate_icon" class="c-p m-t-xs m-r-xs"><i class="icon-repeat"></i></a><img border="0" src="/img/help.png" class="question-tag-tiny v-top" rel="popover" data-placement="bottom" data-title="" data-content="Reset JavaScript API Key" id="element" data-trigger="hover" data-original-title=""></span></pre>
								 
							<!--<form id="allowedDomainsForm" method="get" action="" class="form-horizontal">

								<label>Allowed Domains<span class="field_req">*</span></label> <br/>
								<textarea class="required" name="allowed_domains" cols="50" rows="4" id="allowed_domains">{{allowed_domains}}</textarea>
								<input type="text" name="id" class="hidden form-control" value={{id}}>
								<input type="text" name="api_key" class="hidden form-control" value={{api_key}}>
								<input type="text" name="js_api_key" class="hidden form-control" value={{js_api_key}}> <br/> <br/>       	
								<button type="submit" class="save btn btn-sm btn-primary form-control">Save Changes</button>
							</form>-->
						</div>
		
					</div>
				</div>
			</div>
		</div>

		<div class="panel panel-default">
			<div id="settings-analytics">
				<div class="panel-heading" role="tab" id="headingTwo">
					<div class="panel-title">
						<a class="accordion-toggle" data-toggle="collapse" aria-controls="collapseTwo" aria-expanded="true" data-parent="#accordion" href="#analytics-code">Analytics Code</a>
					</div>
				</div>
				<div class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo" id="analytics-code">
					<div class="panel-body" id="api-accordion">
<div class="tab-pane" id="analytics">


		<p>You can use javascript API to track page views on your site, add / delete contacts from your website or blog directly. Copy and paste the below code in your webpage's HTML just before the <b>&lt;/BODY&gt;</b> tag to enable tracking / API methods.</p>

		<ul class="nav nav-pills" id="TrackingTab">
			<li class="tracking-tab"><a data-toggle="tab" href="#tracking"><span>Tracking code</span></a></li>
			<li class="tracking-webrules-tab active"><a data-toggle="tab" href="#tracking-webrules"><span>Tracking code with Web Rules enabled</span></a></li>
			<li class="tracking-webrules-whitelist-tab active"><a data-toggle="tab" href="#tracking-webrules-whitelist"><span>Tracking code with Web Rules Whitelist enabled</span></a></li>
		</ul>
		<div class="tab-content p-t-sm">

			<!--  Tracking code templete -->
			<div class="tab-pane" id="tracking">
				<div class="clearfix"></div>
				<br>
				<div><!--<a class="right btn" id="api_track_code_icon" style="margin:5px 10px 0px 0px;cursor:pointer;"><i class="icon-copy"></i></a>-->
				<pre  id="api_track_code">
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
				<br>
				<pre  id="api_track_webrules_code">
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

							<!--  Tracking code with Web Rules whitelist enabled -->
			<div class="tab-pane active" id="tracking-webrules-whitelist">
			<div class="clearfix"></div>
			<div><!--<a class="right btn" id="api_track_webrules_code_icon" style="margin:5px 10px 0px 0px;cursor:pointer;"><i class="icon-copy"></i></a>-->
			<pre class="prettyprint" id="api_track_webrules_code">
			&lt;script type="text/javascript" src="https://{{getCurrentDomain}}.agilecrm.com/stats/min/agile-min.js"&gt;
			&lt;/script&gt;
			&lt;script type="text/javascript" &gt;
 			 _agile.set_account('{{js_api_key}}', '{{getCurrentDomain}}');
 			 _agile_set_whitelist('{{getBase64Domain}}');
 			 _agile.track_page_view();
 			 _agile_execute_web_rules();
			&lt;/script&gt;
			</pre></div>
			</div>
			<!-- / Tracking code with Web Rules whitelist enabled -->
						</div>
					

				<br/>
				<p><b>API Reference</b></p>

				Set Email (Mandatory)<div class="clearfix"></div>
								
				<pre >
				 _agile.set_email('jim@example.com');
				</pre>
					

				Track Page View<div class="clearfix"></div>
								
				<pre >
				 _agile.track_page_view({
				   success: function(data) {
					 console.log("success");
				   },
				   error: function(data) {
					 console.log("error");
				   }
				 })</pre>


				Create Contact<div class="clearfix"></div>
								
				<pre >
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
					

				Delete Contact<div class="clearfix"></div>
								
				<pre >
				 _agile.delete_contact('jim@example.com', {
				   success: function(data) {
					 console.log("success");
				   },
				   error: function(data) {
					 console.log("error");
				   }
				 });</pre>
					

				Add Property<div class="clearfix"></div>
								
				<pre >
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
					

				Add Tag<div class="clearfix"></div>
								
				<pre >
				 _agile.add_tag('tags2, tag3, tag4', {
				   success: function(data) {
					 console.log("success");
				   },
				   error: function(data) {
					 console.log("error");
				   }
				 });</pre>
					

				Remove Tag<div class="clearfix"></div>
								
				<pre >
				 _agile.remove_tag('tag4, tag5, tag6', {
				   success: function(data) {
					 console.log("success");
				   },
				   error: function(data) {
					 console.log("error");
				   }
				 });</pre>
					

				Add Score<div class="clearfix"></div>
								<div class="row">
									<div class="col-md-12">
				<pre >
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
			</div>
		</div>
	</div>
</div>

			

		</div>
	</div>
	</div>

    <div class="col w-md">
        <div class="data-block">
            <div class="p-l p-r">
				<h4 class="m-t-none">
                    Help
                </h4>
                
				<p>Agile supports open standard REST. You can use any language which supports REST.</p>
				We currently have the following libraries for your convenience<br/>
				<ul class="p-l-md">
					<li>Java - <a href="https://github.com/agilecrm/java-api" target="_blank" rel="nofollow" title="Link: https://github.com/agilecrm/java-api">GitHub</a></li>
					<li>Javascript - <a href="https://github.com/agilecrm/javascript-api" target="_blank" rel="nofollow" title="Link: https://github.com/agilecrm/javascript-api">GitHub</a></li>
                    <li>PHP - <a href="https://github.com/agilecrm/php-api" target="_blank" rel="nofollow" title="Link: https://github.com/agilecrm/php-api">GitHub</a></li>
                    <li>.NET - <a href="https://github.com/agilecrm/c-sharp-api" target="_blank" rel="nofollow" title="Link: https://github.com/agilecrm/c-sharp-api">GitHub</a></li>
				</ul>
				We will be publishing API for other languages very soon.
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
</script>
<!--  Contact View Detail in Detailed mode - when only one contact is shown -->
<script id="admin-settings-account-prefs-template" type="text/html">
<div class="panel panel-default">
	<div class="panel-heading">Account Preferences</div>
	<div class="panel-body">
    <form id="accountPrefs" class="form-horizontal">
        <fieldset>
            <input name="id" class="form-control" type="hidden" value="{{id}}" />
            
            <div class="row">
				<div class="col-md-7 col-xs-8">
                    <div class="control-group form-group">
                        <label class="control-label col-sm-4 col-xs-4">Plan</label> 
                        <div class="controls col-sm-8 m-t-xs col-xs-8">
                            {{#if plan.plan_id}}
                            {{plan.plan_id}} ( <a href="#subscribe" class="text-info">Upgrade</a> | <a href="#" id="cancel-account-request" class="text-info">Cancel Account</a> )
                            {{else}}
                            Free ( <a href="#subscribe" class="text-info">Upgrade</a> | <a href="#" id="cancel-account" class="text-info">Cancel Account</a> )
                            {{/if}}
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-4 col-xs-4">Users</label>
                        <div class="controls col-sm-8 m-t-xs col-xs-8">
                            {{#if plan.quantity}}
                            {{plan.quantity}}
                            {{else}}
                            1
                            {{/if}}
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-4 col-xs-4">Company <span class="field_req">*</span></label> 
                        <div class="controls col-sm-8 col-xs-8">
                            <input name="company_name" class="input-medium required form-control" type="text" value="{{company_name}}" />
                        </div>
                    </div>
					 <input name="timezone" class="form-control" type="hidden" value="{{timezone}}" />
				</div>
                <div class="col-md-offset-2 col-md-3 col-xs-4">
                    <div >
                        <div id="upload-container" messg="User image has been uploaded">
                            <div class="clearfix">
                                <div class="imgholder thumb-wrapper thumb-lg">
                                    {{#if logo}}
                                    <img class="w-full" src="{{logo}}"  width="85" />
                                    {{else}}
                                    <img class="w-full" src="https://contactuswidget.appspot.com/images/pic.png"  width="85" />
                                    {{/if}}													
                                </div>
                                <p>
                                    <input type="hidden" class="form-control" id="upload_url" name="logo" />  
                                    <input class="upload_s3 btn btn-default btn-sm m-t-sm m-l-xs" type="button" id="account_prefs_image" value="Upload Logo" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
<div class="line ling-lg b-b"></div>
<div class="row">
<div class="col-md-7 col-xs-8">
<div class="col-sm-offset-4 col-sm-8 col-xs-offset-4 col-xs-8">
            
                <a href="#" type="submit" class="save btn btn-sm btn-primary">Save Changes</a>
           

</div>
</div>
</div>
        </fieldset>
    </form>
</div>
</div>

</script><script id="custom-field-add-modal-template" type="text/html">
<!-- New (Text) Modal views -->
<div class="modal fade" id="custom-field-add-modal">
 <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title"><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="textModalForm" name="textModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Label <span class="field_req">*</span></label> 
                    <div class="controls col-sm-9">
					{{#if id}}
                        <input type="text" id="label" placeholder="Label" class="required form-control noSpecialChars" value="{{../field_label}}" disabled / >
						<input name="field_label" type="text" id="label" placeholder="Label" class="required form-control noSpecialChars hide" value="{{../field_label}}" / >
						{{else}}
							<input name="field_label" type="text" id="label" placeholder="Label" class="required form-control noSpecialChars" value="{{field_label}}"/>
					{{/if}}
                    </div>
                </div>
  				<div class="control-group form-group">
                    <label class="control-label col-sm-3">Type <span class="field_req">*</span></label>
                    <div class="controls col-sm-9">
						 <select name="field_type" id="custom-field-type" class="form-control">
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
                <input class="hide form-control" name="scope" type="text" placeholder="Label" value="{{scope}}" />
				<input class="hide form-control" name="position" type="text" placeholder="Label" value="{{position}}" />
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Description <span class="field_req">*</span></label>
                    <div class="controls col-sm-9">
                        <input name="field_description" type="text" id="field_description" placeholder="Description" class="required form-control" />
                    </div>
                </div>
				<div id="custom-field-custom-info"></div>
				 <div class="control-group form-group" id="custom-field-list-values" style="display:none">
                    <label class="control-label col-sm-3">List Values <span class="field_req">*</span></label>
                    <div class="controls col-sm-9">
                        <input name="field_data" type="text" id="listvalues" placeholder="Enter values separated by semicolon" class="required form-control" />
                    </div>
                </div>
			    <div class="control-group form-group" id="custom-field-data" style="display:none">
                    <label class="control-label col-sm-3">Number of Lines <span class="field_req">*</span></label>
                    <div class="controls col-sm-9"> 
                        <input name="field_data" type="text" id="arearows" placeholder="Rows" class="required digits form-control" max="10" min="2" />
                    </div>
                </div>
				<div class="control-group form-group" id="custom-field-formula-data" style="display:none">
                    <label class="control-label col-sm-3">Formula <span class="field_req">*</span></label>
                    <div class="controls col-sm-9"> 
                        <textarea name="field_data" id="formulaData" placeholder="Ex: \{{number1}}*(\{{number2}}+\{{number3}})" class="formulaData required" style="max-width:420px;" rows="3" />
                    </div>
					<div class="tip">
						<p class="text-muted">
							<i class="icon-lightbulb text-md"></i> 
							An arithmetic formula based on number custom fields. <a href="http://mustache.github.io/" target="_blank">Mustache conditions</a> can be used here.
						</p>
					</div>
                </div>
                
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Required </label>
                        <div class="controls checkbox col-sm-3">
<label class="i-checks i-checks-sm">
                            <input name="is_required" type="checkbox" id="required"  /><i></i>
</label>
                        </div>
                    
                    
                        <label class="control-label col-sm-3">Searchable </label>
                        <div class="controls checkbox col-sm-3">
                            <label class="i-checks i-checks-sm"> 
                            <input name="searchable" type="checkbox" id="searchable" /><i></i>
                            </label>
                        </div>
                    
                </div>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3 hide">Validation Rule <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="validationRule" type="hidden" id="validationRule" placeholder="Validation Rule" class="required form-control" value="*" />
                    </div>
                </div>
				{{#if id}}
					<input name="id" value="{{id}}" class="hide form-control"></input>
				{{/if}}
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn btn-sm btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</div>
</div>
</script>

<script id="custom-field-text-modal-template" type="text/html">
<!-- New (Text) Modal views -->
<div class="modal fade" id="textModal">
 <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title"><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="textModalForm" name="textModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required noSpecialChars form-control" />
                    </div>
                </div>
                <input class="hide form-control" name="field_type" type="text" placeholder="Label" value="TEXT" />
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Description <span class="field_req">*</span></label>
                    <div class="controls">
                        <input name="field_description" type="text" id="field_description" placeholder="Description" class="required form-control" />
                    </div>
                </div>
			     <div class="control-group form-group">
                    <label class="control-label col-sm-3">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						 <select name="scope" class="form-control">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
               
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Required </label>
                        <div class="controls checkbox">
                        <label class="i-checks i-checks-sm">
                            <input name="is_required" type="checkbox" id="required" /><i></i>
                        </label>
                        </div>
                    </div>
                    <div class="control-group form-group m-l-md span4">
                        <label class="control-label col-sm-3">Searchable </label>
                        <div class="controls checkbox">
                        <label class="i-checks i-checks-sm"> 
                            <input name="searchable" type="checkbox" id="searchable" /><i></i>
                        </label>
                        </div>
                    </div>
              
                <div class="control-group form-group">
                    <label class="control-label col-sm-3 hide">Validation Rule <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="validationRule" type="hidden" id="validationRule" placeholder="Validation Rule" class="required form-control" value="*" />
                    </div>
                </div>
			
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn btn-sm btn-primary" id="customfield_validate">Save Changes</a>
    </div>
  </div>
  </div>
</div>
</script>
<!-- End of (Text) Modal views -->

<script id="custom-field-date-modal-template" type="text/html">
<!-- New (Date) Modal views -->
<div class="modal fade" id="dateModal">
 <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title"><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="dateModalForm" name="dateModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required noSpecialChars form-control" />
                    </div>
                </div>
                <input class="hide form-control" name="field_type" type="text" placeholder="Label" value="DATE" />
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required form-control" />
                    </div>
                </div>
	    	 <div class="control-group form-group">
                    <label class="control-label col-sm-3">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope" class="form-control">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Required </label>
                        <div class="controls checkbox">
                        <label class="i-checks i-checks-sm">
                            <input name="is_required" type="checkbox" id="required" /><i></i>
                        </label>
                        </div>
                    </div>
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Searchable </label>
                        <div class="controls checkbox">
                          <label class="i-checks i-checks-sm"> 
                            <input name="searchable" type="checkbox" id="searchable" /><i></i>
                        </label>
                             </div>
                    
                </div>
				<p>Note : For date custom fields, the field value if provided using the API, should be an epoch number.</p>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn-sm btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
  </div>
  </div>
</div>
</script>
<!-- End of (Date) Modal views -->

<script id="custom-field-list-modal-template" type="text/html">
<!-- New (List) Modal views -->
<div class="modal fade" id="listModal">
<div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title"><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="listModalForm" name="listModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required form-control noSpecialChars" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="LIST" />
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required form-control" />
                    </div>
                </div>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">List Values <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_data" type="text" id="listvalues" placeholder="Enter values separated by semicolon" class="required form-control" />
                    </div>
                </div>
	     		<div class="control-group form-group">
                    <label class="control-label col-sm-3">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope" class="form-control">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Required </label>
                        <div class="controls checkbox">
                        <label class="i-checks i-checks-sm">
                            <input name="is_required" type="checkbox" id="required" /><i></i>
                         </label>
                        </div>
                    </div>
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Searchable </label>
                        <div class="controls checkbox"> 
                        <label class="i-checks i-checks-sm"> 
                            <input name="searchable" type="checkbox" id="searchable" /><i></i>
                        </label>
                        </div>
                    
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn-sm btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</div>
</div>
</script>
<!-- End of (List) Modal views -->

<script id="custom-field-checkbox-modal-template" type="text/html">
<!-- New (Check Box) Modal views -->
<div class="modal fade" id="checkboxModal">
<div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title"><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="checkboxModalForm" name="checkboxModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required noSpecialChars form-control" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="CHECKBOX"  />
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required form-control" />
                    </div>
                </div>
	    	 <div class="control-group form-group">
                    <label class="control-label col-sm-3">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope" class="form-control">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Required </label>
                        <div class="controls checkbox">
                         <label class="i-checks i-checks-sm">
                            <input name="is_required" type="checkbox" id="required" /><i></i>
                         </label>
                        </div>
                    </div>
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Searchable </label>
                        <div class="controls checkbox"> 
                        <label class="i-checks i-checks-sm">
                            <input name="searchable" type="checkbox" id="searchable" /><i></i>
                        </label>
                        </div>
                    
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn-sm btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</div>
</div>
</script>
<!-- End of (Check Box) Modal views -->

<script id="custom-field-textarea-modal-template" type="text/html">
<!-- New (Text Area) Modal views -->
<div class="modal fade" id="textareaModal">
<div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title"><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="textareaModalForm" name="textareaModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required form-control" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="TEXTAREA" />
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required form-control" />
                    </div>
                </div>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Number of Lines <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_data" type="text" id="arearows" placeholder="Rows" class="required digits form-control" max="10" min="2" />
                    </div>
                </div>
	    	 <div class="control-group form-group">
                    <label class="control-label col-sm-3">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope" class="form-control">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Required </label>
                        <div class="controls checkbox">
                         <label class="i-checks i-checks-sm">
                            <input name="is_required" type="checkbox" id="required" /><i></i>
                         </label>
                        </div>
                    </div>
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Searchable </label>
                        <div class="controls checkbox">
                          <label class="i-checks i-checks-sm"> 
                            <input name="searchable" type="checkbox" id="searchable" /><i></i>
                          </label>
                        </div>
                    
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn-sm btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</div>
</div>
</script>
<!-- End of (Text Area) Modal views -->


<script id="custom-field-checkbox-modal-template" type="text/html">
<!-- New (Generated Link) Modal views -->
<div class="modal fade" id="linkModal">
<div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title"><i class="icon-plus-sign"></i>  Add Custom Field</h3>
    </div>
    <div class="modal-body">
        <form id="linkModalForm" name="linkModalForm" method="post" class="form-horizontal">
            <fieldset>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Label <span class="field_req">*</span></label> 
                    <div class="controls">
                        <input name="field_label" type="text" id="label" placeholder="Label" class="required form-control" />
                    </div>
                </div>
                <input class="hide" name="field_type" type="text" placeholder="Label" value="LINK" />
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Description <span class="field_req">*</span></label>
                    <div class="controls"> 
                        <input name="field_description" type="text" id="description" placeholder="Description" class="required form-control" />
                    </div>
                </div>
                <div class="control-group form-group">
                    <label class="control-label col-sm-3">Link Definition <span class="field_req">*</span></label>
                    <div class="controls">
                        <input name="listvalues" type="text" id="listvalues" placeholder="e.g. http://example.com?emailAddress={email}" class="required form-control" />
                    </div>
                </div>
	    	 <div class="control-group form-group">
                    <label class="control-label col-sm-3">Scope <span class="field_req">*</span></label>
                    <div class="controls">
						<select name="scope" class="form-control">
							<option value="PERSON">Contact</option>
							<option value="COMPANY">Company</option>
							<option value="DEAL">Deals</option>
							<option value="CASE">Cases</option>
						</select>
                    </div>
                </div>
                
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Required </label>
                        <div class="controls checkbox">
                        <label class="i-checks i-checks-sm">
                            <input name="is_required" type="checkbox" id="required" /><i></i>
                         </label>
                        </div>
                    </div>
                    <div class="control-group form-group span4">
                        <label class="control-label col-sm-3">Searchable </label>
                        <div class="controls checkbox"> 
                        <label class="i-checks i-checks-sm">
                            <input name="searchable" type="checkbox" id="searchable" /><i></i>
                          </label>
                        </div>
                    
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer form-actions">
        <a href="#" type="submit" class="save btn-sm btn btn-primary" id="customfield_validate">Save Changes</a>
    </div>
</div>
</div>
</div>
</script>
<!-- End of (Generated Link) Modal views -->
<div id="custom-field-modal"></div>
<script id="admin-settings-customfields-collection-template" type="text/html">
<!-- <div class="" style="margin-bottom: 15px;">
            <h4>Custom Fields</h4>
            <ul class="nav right">
                <li class="btn-group right pos-rlt" style="top:0px;">
                    <a href="#custom-fields-add" class="dropdown-toggle btn btn-sm right" data-toggle="dropdown">
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

    <div class="col">
    <div class="hbox h-auto m-b-lg">
	<div  id="custom-fields-accordion">
	<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
	
         {{#if this.length}}
        	<div class="panel panel-default">
			<div id="CONTACT-custom-fields">
				<div class="panel-heading" role="tab" id="headingOne">
					<div class="panel-title">
						<a class="accordion-toggle" data-toggle="collapse"  aria-controls="collapseOne" aria-expanded="true"  data-parent="#accordion" href="#collapseOne">Contacts</a>
					</div>
				</div>
				<div class="panel-collapse collapse in" role="tabpanel"  aria-labelledby="headingOne" id="collapseOne" >
				<div class="panel-body p-n" id="customfields-contacts-accordion"></div>
				</div>
				</div>
			
			</div>
			<div class="panel panel-default">
			<div id="COMPANY-custom-fields">
				<div class="panel-heading" role="tab" id="headingTwo">
					<div class="panel-title">
						<a class="collapsed accordion-toggle" aria-controls="collapseTwo" aria-expanded="false"  data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Companies</a>
					</div>
				</div>
				<div class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo" id="collapseTwo" >
				<div class="panel-body p-n" id="customfields-companies-accordion"></div>
			
			</div>
			</div>
			</div>
			
			<div class="panel panel-default">
			<div id="DEAL-custom-fields">
				<div class="panel-heading" role="tab" id="headingThree">
					<div class="panel-title">
						<a class="collapsed accordion-toggle" aria-controls="collapseThree" aria-expanded="false"   data-toggle="collapse" data-parent="#accordion" href="#collapseThree">Deals</a>
					</div>
				</div>
				<div class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree" id="collapseThree" >
				<div class="panel-body p-n" id="customfields-deals-accordion"></div>
			</div>
			</div>
			</div>
			<div class="panel panel-default">
			<div id="CASE-custom-fields">
				<div class="panel-heading" role="tab" id="headingFour">
					<div class="panel-title">
						<a class="collapsed accordion-toggle" aria-controls="collapseFour"  aria-expanded="false"  data-toggle="collapse" data-parent="#accordion" href="#collapseFour">Cases</a>
					</div>
				</div>
				<div class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour" id="collapseFour" >
				<div class="panel-body p-n" id="customfields-cases-accordion"></div>
			</div>
			</div>
			</div>
        {{/if}}
	</div>
    </div>
    </div>
    </div>
    <div class="col w-md">
        <div class="data-block">
            <div class="p-l p-r">
				<h4 class="m-t-none">
                    Help
                </h4>
                
				<p>You can define custom fields for Contacts here. They appear in new contact form in Agile and can also be updated using our <a href="#analytics-code">API</a>.</p>
				Agile provides the following custom field types:<br/>
				<ul class="p-l-md">
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
</script>

<script id="admin-settings-customfields-model-template" type="text/html">
    <td><div class="inline-block v-top text-ellipsis w-full">{{field_label}}</div> </td>
    <td><div class="inline-block v-top text-ellipsis w-full">{{field_description}}</div> </td>
    <td>{{ucfirst field_type}}</td>
	<td>{{ucfirst scope}}</td>
    <br/>
</script>


<script id="admin-settings-customfields-contact-collection-template" type="text/html">
{{#if this.length}}
        <table class="table table-hover  custom-fields-table table-hover m-b-none" url="core/api/custom-fields/bulk">
				<colgroup><col width="40%"><col width="12%"><col width="1%"></colgroup>
                    <tbody id="admin-settings-customfields-contact-model-list" class="custom-fields-contact-tbody">
                    </tbody>
                </table>
        {{/if}}
		<div class="p-l p-t p-b">
			<a href="#contactCustomFModal" class="fieldmodal text-info" data-toggle="modal" type="CONTACT" ><i class="icon-plus-sign" /> Add </a>
		</div>
</script>

<script id="admin-settings-customfields-contact-model-template" type="text/html">
	<td class="b-r-none">
		<div class="inline-block v-top text-ellipsis w-full">
			{{field_label}}
			{{#if_equals is_required true}}
				<span class="field_req">*</span>
			{{/if_equals}}
		</div>
		<div class="inline-block v-top text-ellipsi w-full"><small>{{field_description}}</small></div> 
	</td>
    <td class="p-r-none b-r-none">
		<div class="text-right">
			{{#if_equals searchable true}}
				<span class="label m-r-xs bg-light dk text-tiny">Searchable</span>
			{{/if_equals}}
			<span class="label m-r-xs bg-light dk text-tiny">{{choose_custom_field_type field_type}}</span>
		</div>
	</td>
	<td align="right" class="b-r-none p-l-none">
		<div class="m-l" style="visibility:hidden;">
			<a class="text-l-none-hover c-p text-sm"><i title="Drag" class="icon-move"></i></a>
		</div>
		<div style="visibility:hidden;">
			<a id="edit-custom-field" class="c-p t-l-none text-sm"  data-toggle="modal" role="button" href="#">
				<i title="Edit Contact Custom Field" class="task-action icon icon-edit"></i>
			</a>
			<a id="delete-custom-field" class="c-p t-l-none text-sm"  data-toggle="modal" role="button" href="#">
				<i title="Delete Contact Custom Field" class="task-action icon icon-trash"></i>
			</a>
		</div>
	</td>
	<br/>
</script>
<script id="admin-settings-customfields-company-collection-template" type="text/html">
    {{#if this.length}}
        <table class="table table-hover custom-fields-table table-hover m-b-none" url="core/api/custom-fields/bulk">
			<colgroup><col width="40%"><col width="12%"><col width="3%"></colgroup>
                    <tbody id="admin-settings-customfields-company-model-list" class="custom-fields-company-tbody">
                    </tbody>
                </table>
        {{/if}}
		<div class="p-l p-t p-b">
			<a href="#contactCustomFModal" class="fieldmodal text-info" data-toggle="modal" type="COMPANY"><i class="icon-plus-sign" /> Add </a>
		</div>
</script>
<script id="admin-settings-customfields-company-model-template" type="text/html">
    <td class="b-r-none">
		<div class="inline-block v-top text-ellipsis w-full">
			{{field_label}}
			{{#if_equals is_required true}}
				<span class="field_req">*</span>
			{{/if_equals}}
		</div>
		<div class="inline-block v-top text-ellipsis w-full"><small>{{field_description}}</small></div> 
	</td>
    <td class="p-r-none b-r-none">
		<div class="text-right">
			{{#if_equals searchable true}}
				<span class="label m-r-xs bg-light dk text-tiny">Searchable</span>
			{{/if_equals}}
			<span class="label m-r-xs bg-light dk text-tiny">{{choose_custom_field_type field_type}}</span>
		</div>
	</td>
	<td align="right" class="b-r-none"> 
		<div  class="m-l-sm" style="visibility:hidden;">
			<a class="text-l-none-hover c-p text-sm"><i title="Drag" class="icon-move"></i></a>
		</div>
		<div style="visibility:hidden;">
			<a id="edit-custom-field" class="c-p t-l-none text-sm"  data-toggle="modal" role="button" href="#">
				<i title="Edit Company Custom Field" class="task-action icon icon-edit"></i>
			</a>
			<a id="delete-custom-field" class="c-p t-l-none text-sm" data-toggle="modal" role="button" href="#">
				<i title="Delete Company Custom Field" class="task-action icon icon-trash"></i>
			</a>
		</div>
	</td>
	<br/>
</script>
<script id="admin-settings-customfields-deal-collection-template" type="text/html">
    {{#if this.length}}
        <table class="table table-hover custom-fields-table table-hover m-b-none" url="core/api/custom-fields/bulk">
			<colgroup><col width="40%"><col width="12%"><col width="3%"></colgroup>
                    <tbody id="admin-settings-customfields-deal-model-list" class="custom-fields-deal-tbody">
                    </tbody>
                </table>
        {{/if}}
		<div class="p-l p-t p-b">
			<a href="#contactCustomFModal" class="fieldmodal text-info" data-toggle="modal" type="DEAL"><i class="icon-plus-sign" /> Add </a>
		</div>
</script>

<script id="admin-settings-customfields-deal-model-template" type="text/html">
    <td class="b-r-none">
		<div class="inline-block v-top text-ellipsis w-full">
			{{field_label}}
			{{#if_equals is_required true}}
				<span class="field_req">*</span>
			{{/if_equals}}
		</div>
		<div class="inline-block v-top text-ellipsis w-full"><small>{{field_description}}</small></div> 
	</td>
    <td class="p-r-none b-r-none">
		<div class="text-right">
			{{#if_equals searchable true}}
				<span class="label m-r-xs bg-light dk text-tiny">Searchable</span>
			{{/if_equals}}
			<span class="label m-r-xs bg-light dk text-tiny">{{choose_custom_field_type field_type}}</span>
		</div>
	</td>
	<td align="right" class="b-r-none">
		<div class="m-l m-b-n-xs" style="visibility:hidden;">
			<a class="text-l-none-hover c-p text-sm"><i title="Drag" class="icon-move"></i></a>
		</div>
		<div style="visibility:hidden;">
			<a id="edit-custom-field" class="c-p t-l-none text-sm"  data-toggle="modal" role="button" href="#">
				<i title="Edit Deal Custom Field" class="task-action icon icon-edit"></i>
			</a>
			<a id="delete-custom-field" class="c-p t-l-none text-sm" data-toggle="modal" role="button" href="#">
				<i title="Delete Deal Custom Field" class="task-action icon icon-trash"></i>
			</a>
		</div>
	</td>
	<br/>
</script>
<script id="admin-settings-customfields-case-collection-template" type="text/html">
    {{#if this.length}}
        <table class="table table-hover  custom-fields-table table-hover m-b-none" url="core/api/custom-fields/bulk">
			<colgroup><col width="40%"><col width="12%"><col width="3%"></colgroup>
                    <tbody id="admin-settings-customfields-case-model-list" class="custom-fields-case-tbody">
                    </tbody>
                </table>
        {{/if}}
		<div class="p-l p-t p-b">
			<a href="#contactCustomFModal" class="fieldmodal text-info" data-toggle="modal" type="CASE"><i class="icon-plus-sign" /> Add </a>
		</div>
</script>
<script id="admin-settings-customfields-case-model-template" type="text/html">
	<td class="b-r-none">
		<div class="inline-block v-top text-ellipsis w-full">
			{{field_label}}
			{{#if_equals is_required true}}
				<span class="field_req">*</span>
			{{/if_equals}}
		</div>
		<div class="inline-block v-top text-ellipsis w-full"><small>{{field_description}}</small></div> 
	</td>
    <td class="p-r-none b-r-none">
		<div class="text-right">
			{{#if_equals searchable true}}
				<span class="label m-r-xs bg-light dk text-tiny">Searchable</span>
			{{/if_equals}}
			<span class="label m-r-xs bg-light dk text-tiny">{{choose_custom_field_type field_type}}</span>
		</div>
	</td>
	<td align="right" class="b-r-none">
		<div class="m-l m-b-n-xs" style="visibility:hidden;">
			<a class="text-l-none-hover c-p text-sm"><i title="Drag" class="icon-move"></i></a>
		</div>
		<div style="visibility:hidden;">
			<a id="edit-custom-field" class="c-p t-l-none text-sm" data-toggle="modal" role="button" href="#">
				<i title="Edit Case Custom Field" class="task-action icon icon-edit"></i>
			</a>
			<a id="delete-custom-field" class="c-p t-l-none text-sm" data-toggle="modal" role="button" href="#">
				<i title="Delete Case Custom Field" class="task-action icon icon-trash"></i>
			</a>
		</div>
	</td>
	<br/>
</script><script id="settings-email-gateway-template" type="text/html">
<div class="wrapper-md">
<div class="row">
<div class="col-md-4 col-sm-6 col-xs-12">
	<div class="panel p-md widget-add">
		<form style="border-bottom:none;margin-top:-10px;margin-bottom: 0px;" id="email-gateway-integration-form">
	    	<fieldset>
				<h5>Enter your account details</h5>
				<div class="control-group form-group">
					<div class="controls" id="LHS">
						<select name="email_api" id="email-api" class="required form-control">
							<!--<option value="SEND_GRID">SendGrid</option>--> 
							<option value="MANDRILL">Mandrill</option> 
						</select>
					</div>
				</div>
				<div class="control-group form-group"  id="RHS">
					<!--<div class="controls">
						<input type="text" class="input-medium required SEND_GRID form-control" style="width:90%" placeholder="Username" value="{{api_user}}" name="api_user">
					</div>-->
					<div class="controls">
						<!--<input type="password" class="input-medium form-control required SEND_GRID" style="width:90%" placeholder="Password" value="{{#if api_user}}{{api_key}}{{/if}}"  name="api_key"/>-->
                        <input type="text" class="input-medium required MANDRILL form-control"  placeholder="API Key" value="{{#unless api_user}}{{api_key}}{{/unless}}" name="api_key"/>
					</div>
				</div>
				<div class="form-actions">
					<a type="reset" class="btn btn-default btn-sm" href="#integrations">Cancel</a>
               		<a type="submit" class="save btn btn-sm btn-primary">Save</a>
             	</div>
			 </fieldset>
	    </form>
	</div>
</div>
</script>
<script type="text/html" id="admin-settings-integration-stats-template">
<div class="col">
	<div class="col-md-12">
		<div class="panel wrapper-md m-t-sm"> 
		<legend class="m-b-sm"> Email Stats LKAJSLKSDJF
				<span class="pull-right inline">
					{{#if this.id}}Reputation {{{get_subaccount_reputation reputation}}}
					{{/if}}
				</span>
		</legend>
		<div class="row">
        	<div class="col-md-6">
            	<h4 class="text-center">Emails Sent</h4>
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
        	<div class="col-md-6">
            	<h4 class="text-center">Bounces ( Last 30 Days )</h4>
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
		<legend class="m-b-sm"> SMS Stats
				<span class="inline" ></span>
		</legend>
					{{#unless Stats-Type}}
					<div class="text-md">No SMS gateway configured. <a class="text-info" href="#integrations">Configure Now</a></div>
					{{/unless}}
		{{#if_equals "SMS-Stats" Stats-Type}}
		<div class="row">
        	<div class="col-md-6">
            	<h4 class="text-center">SMS Sent</h4>
				<table class="table table-bordered">
					<tbody>
						<tr><th>Today</th><td>{{numberWithCommas Today}} </td></tr>
						<tr><th>Yesterday</th><td> {{numberWithCommas Yesterday}}</td></tr>
						<tr><th>This Month</th><td>{{numberWithCommas ThisMonth}} </td></tr>
						<tr><th>Last Month</th><td>{{numberWithCommas LastMonth}} </td></tr>
					</tbody>
				</table>
        	</div>
        	<div class="col-md-6">
            	<h4 class="text-center">SMS Details ( Last 30 Days )</h4>
				<table class="table table-bordered">
					<tbody>
						<tr><th>Queued</th><td>{{Queued}} </td></tr>
						<tr><th>Delivered</th><td> {{Delivered}}</td></tr>
						<tr><th>Undelivered
						<span class="v-top">
						<img border="0" src="/img/help.png" class="question-tag-tiny v-top"  rel="popover" data-placement="right" data-title:"="" 
						data-content="Twilio has received a delivery receipt indicating that the message was not delivered. This can happen for a number of reasons including carrier content filtering, availability of the destination handset, etc." 
						id="element" data-trigger="hover" data-original-title=""></span>
						</th><td>{{Undelivered}}</td></tr>
						<tr><th>Failed
						<span class="v-top">
						<img border="0" src="/img/help.png" class="question-tag-tiny v-top" rel="popover" data-placement="right" data-title:"="" 
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
</div>
</script><script id="admin-settings-import-google-contacts-template"
	type="text/html">
	<div class="panel wrapper widget-add" >
    <center>
    <img class="thumbnail m-b-none thumb-xl bg-transparent" src="/img/icons/google-contacts-sync.png" />
    </center>
    <div class="m-b-md m-t"  rel="tooltip" >
		Agile can periodically sync your contacts in your CRM with your Google Contacts.
	</div>
    <div>
			{{#if id}}
    			<a class="btn btn-sm btn-danger delete"  id="google-import-prefs-delete" >Disable</a>
				<a href="#sync/contacts" class="btn btn-sm btn-default" id="setting-widget">Settings</a>
    		{{else}}
				{{#canSyncContacts}}
    					<div class="btn btn-sm btn-default inline-block" id="google-import">Enable</div>
					{{else}}
						<span class="btn btn-sm btn-primary inline-block" disabled>Enable</span>
						<span class="m-l-xs"><i>Needs import privilege.</i></span>
				{{/canSyncContacts}}
    		{{/if}}
	</div>
</div>
</script>

<script id="admin-settings-import-google-contacts-setup-template"
	type="text/html">
<div class="row">
<div class="col-md-4 col-sm-6 col-xs-12">
	<div class="panel wrapper" >
 	<!-- <legend>Contacts <span class="label label-danger m-b-sm">Beta</span>{{#if id}}<span style="font-size:14px;float:right" title="Sync Contacts" title="Sync Contacts"><a class="icon-refresh save-contact-prefs" href="#" sync = "true" id="google-import-sync"  style="cursor:pointer;text-decoration:none"></a></span>{{/if}}</legend> -->

	<span class="label label-danger pull-right m-b-sm">Beta</span>
   <center> <img class="thumbnail m-b-none img-responsive thumb-xl bg-transparent" src="/img/icons/google-contacts-sync.png" /></center>
	<br />
{{#unless id}}
    <div class="ellipsis-multiline"  rel="tooltip" >
		Setup contact sync with your Gmail or Google Apps account.
	</div>
</div>
{{/unless}}
{{#if id}}

    <form id="google-contacts-import-form">
        <fieldset>
	<div class="control-group form-group">
		<label class="control-label">Type</label> 
           <div class="controls">
				<select class="required form-control" name="sync_type" id="sync-type">
					<option value="">- Select -</option>
					<option value="CLIENT_TO_AGILE">Google to Agile</option>
					<option value="AGILE_TO_CLIENT">Agile to Google</option>
					<option value="TWO_WAY">Both ways</option>
				</select>
			</div>
	</div>

{{#if_equals sync_type "AGILE_TO_CLIENT"}}
	<div class="control-group form-group" style="display:none" id="sync_from_group_controlgroup">
{{else}}
	<div class="control-group form-group" id="sync_from_group_controlgroup">
{{/if_equals}}
		<label class="control-label">Sync From</label> 
           <div class="controls">
				<select name="sync_from_group" class="required form-control">
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
<span class="help-block"><small>Google contact  group to sync from.</small></span>
	</div>

{{#if_equals sync_type "AGILE_TO_CLIENT"}}
	<div class="control-group form-group" id="sync_to_group_controlgroup">
{{else}}
{{#if_equals sync_type "TWO_WAY"}}
<div class="control-group form-group" id="sync_to_group_controlgroup">
{{else}}
<div class="control-group form-group" style="display:none" id="sync_to_group_controlgroup">
{{/if_equals}}
{{/if_equals}}

		<label class="control-label">Sync To</label> 
           <div class="controls">
				<select name="sync_to_group" class="required form-control">
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
	<span class="help-block"><small>Google contact  group to sync to.</small></span>
	</div>

		<div class="control-group form-group">
		<label class="control-label" style="text-align:">Frequency</label> 
           <div class="controls">
				<select class="required form-control" name="duration">

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
<div class="control-group form-group"  id="my_contacts_sync_group">
{{else}}
{{#if_equals sync_type "TWO_WAY"}}
<div class="control-group form-group" id="my_contacts_sync_group">
{{else}}
<div class="control-group form-group" style="display:none" id="my_contacts_sync_group">
{{/if_equals}}
{{/if_equals}}
	<div class="controls">
       <div class="checkbox">
<label class="i-checks i-checks-sm">
          <input  type="checkbox" name="my_contacts" value="true" checked="checked"><i></i>
            Only sync Agile contacts owned by me
        </label> 
</div>      
    </div>
</div>
		 <input name="id" type="hidden" value="{{id}}" />


      <div class="form-actions">
<a href="#sync" class="btn btn-default btn-sm ml_5">Cancel</a>
{{#if inProgress}}
			<div class="btn btn-primary btn-sm save-contact-prefs inline-block" id="google-import-prefs-save" disabled>Syncing</div>
	{{else}}
<div class="btn btn-sm btn-primary save-contact-prefs inline-block" id="google-import-prefs-save">Sync</div>
{{/if}}		

	 </div>
	{{/if}}
        </fieldset>
    </form>
</div>
</div>
</script>



<script id="admin-settings-import-stripe-contact-sync-prefs-template"
	type="text/html">
<div class="row">
<div class="col-md-4 col-sm-6 col-xs-12">
<div class="panel wrapper" >
<span class="label label-danger pull-right m-b">Beta</span>
<center> <img class="thumbnail m-b-none img-responsive thumb-xl bg-transparent" src="/img/plugins/Stripe.png" /></center>

{{#unless id}}
    <div class="m-t m-b"  rel="tooltip" >
		Setup contact sync with your Stripe account.
	</div>

{{/unless}} 
    {{#if id}}
<form id="stripe-prefs-form" class="m-b">
<input type ="hidden" value = "{{id}}" name ="id">
          <div>Account Linked : {{userName}} <span><a href="#" class="delete">Change</a></span></div>
	
          
             	<div class="control-group form-group">
					<label class="control-label">Frequency</label> 
           				<div class="controls">
							<select class="required form-control" name="duration" id="freq">

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

			<div class="form-actions">
<a href="#sync" class="btn btn-default btn-sm inline-block">Cancel</a>
{{#if inProgress}}
			<button class="btn btn-sm btn-primary ml_5" id="stripe_sync_prefs" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-sm btn-primary ml_5" id="stripe_sync_prefs">Sync</button>
{{/if}}

       	  	</div>


       
    </form>
{{else}}
<div class="btn btn-primary btn-sm inline-block" id="stripe_import">Enable</div>
{{/if}}

</div>
</div>
</script>


<script id="admin-settings-import-stripe-contact-sync-template"
	type="text/html">
	<div class="panel wrapper widget-add" >
    <center>
    <img class="thumbnail m-b-none thumb-xl bg-transparent" src="/img/plugins/Stripe.png" />
	</center>
    <div class="m-t"  rel="tooltip" >
	Sync customers in Stripe as Contacts in Agile CRM with their subscription & payment data.
	</div>
    <div class="m-t">
			{{#if id}}
    			<a class="btn btn-sm btn-danger delete"  id="stripe-import-prefs-delete" >Disable</a>
				<a href="#sync/stripe-import" class="btn btn-sm btn-default" id="setting-widget">Settings</a>
    		{{else}}
				{{#canSyncContacts}}
    						<div class="btn btn-sm btn-default inline-block" id="stripe_import">Enable</div>
					{{else}}
							<span class="btn btn-sm btn-default inline-block"  disabled>Enable</span>
							<span class="m-l-xs"><i>Needs import privilege.</i></span>
				{{/canSyncContacts}}
    		
    		{{/if}}
	</div>
</div>
</script>

<script id="admin-settings-import-shopify-prefs-template"
	type="text/html">
<div class="row">
<div class="col-md-6 col-sm-6 col-xs-12">
<div class="panel wrapper" >
<span class="label label-danger pull-right m-b-sm">Beta</span>
<center> <img class="thumbnail m-b-none img-responsive thumb-xl bg-transparent" src="img/crm-plugins/shopify.png" /></center>
<br/>
{{#unless id}}
    <div class="m-b-md"   rel="tooltip" >
		Setup contact sync with your Shopify account.
	</div>


<div class='input-group'>
	<span class="input-group-addon">https://</span>
	  <input id="shop" required="required" name="shopname" class="form-control"  type="text" placeholder="Enter shop domain">
    <span class="input-group-addon">.myshopify.com</span>
    
    </div>
<a href ="#" id ="import_shopify" class="btn btn-sm btn-primary m-t">Connect</a>

  {{/unless}}

  

    <form id="shopify-contact-import-form">
<input type ="hidden" value = "{{id}}" name ="id">
        
	
           {{#if id}}
              <div>
                   Shop : <span>{{othersParams}}</span>
                
                       <a class="delete" href="#"  id="shopify-import-prefs-delete" >Change</a>
					</div>
                 
             	<div class="control-group form-group">
					<label class="control-label">Frequency</label> 
           				<div class="controls">
							<select class="required form-control" name="duration" id="freq">

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

			<div class="form-actions">
<a href="#sync" class="btn btn-default btn-sm inline-block">Cancel</a>
{{#if inProgress}}
			<button class="btn btn-sm btn-primary ml_5" id="shopify-setting" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-sm btn-primary ml_5" id="shopify-setting">Sync</button>
{{/if}}

       	  	</div>

	{{/if}}

       
    </form>
</div>
</div>
</script>


<script id="admin-settings-import-shopify-contact-syncPrefs-template"
	type="text/html">
	<div class="panel wrapper widget-add" >
    <center>
    <img class="thumbnail m-b-none thumb-xl bg-transparent"  src="img/crm-plugins/shopify.png" />
	</center>
    <div class="ellipsis-multiline m-t-md"   rel="tooltip" >
		Sync customer data and Agile CRM as contacts along with purchase history.
	</div>
   <div class="m-t-md">
			{{#if id}}
        	   <a class="btn btn-sm btn-danger delete"  id="shopify-import-prefs-delete" >Disable</a>
				<a href="#sync/shopify" class="btn btn-sm btn-default">Settings</a>
			{{else}}
					{{#canSyncContacts}}
    						   <a href="#sync/shopify"  class="btn btn-sm btn-default inline-block">Enable</a>
						{{else}}
							   <a class="btn btn-sm btn-default inline-block" disabled>Enable</a>
								<span class="m-l-xs"><i>Needs import privilege.</i></span>
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
        	   <a class="btn btn-sm btn-danger delete"  id="zoho-prefs-delete" >Disable</a>
				<a href="#sync/zoho-import" class="btn btn-sm btn-primary" id="setting-widget">Settings</a>
			</div>
         {{else}}
				{{#canSyncContacts}}
    						   <button class="btn btn-sm" id="zoho-import" style="display:inline-block;">Enable</button>
						{{else}}
							   <a href="#" class="btn btn-sm" style="display:inline-block;" disabled>Enable</a>
								<span class="m-r-xs"><i>Needs import privilege.</i></span>
					{{/canSyncContacts}}
         <div>
           
        </div>
{{/if}}

    </form>
</div>
</script>


<script id="admin-settings-import-quickbook-settings-template"
	type="text/html">
<div class="row">
<div class="col-md-4 col-sm-6 col-xs-12">
<div class="panel wrapper" >
<span class="label label-danger pull-right">Beta</span>
<center> <img class="thumbnail m-b-none img-responsive thumb-xl bg-transparent" src="/widgets/QuickBooks210x70.png" /></center>
<br/>
{{#unless id}}
    <div class="ellipsis-multiline m-b-md"   rel="tooltip" >
		Setup contact sync with your Quickbook account.
	</div>
{{/unless}} 
    {{#if id}}
<form id="quickbook-form">
<input type ="hidden" value = "{{id}}" name ="id">
          <div>Account Linked : {{userName}} <span><a href="#" class="delete">Change</a></span></div>
	
          <br>
             	<div class="control-group form-group">
					<label class="control-label">Frequency</label> 
           				<div class="controls">
							<select class="required form-control" name="duration" id="freq">

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

			<div class="form-actions m-t-md">
<a href="#sync" class="btn btn-default btn-sm inline-block">Cancel</a>
{{#if inProgress}}
			<button class="btn btn-sm btn-primary ml_5" id="quickbook_sync_prefs" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-sm btn-primary ml_5" id="quickbook_sync_prefs">Sync</button>
{{/if}}

       	  	</div>


       
    </form>
{{else}}
 <a href="/OAuthServlet?service=quickbook-import&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks""  class="btn btn-sm btn-primary inline-block">Enable</a>
{{/if}}

</div>
</div>
</script>


<script id="admin-settings-import-quickbook-template" type="text/html">
	<div class="panel wrapper widget-add" >
    <center>
    <img class="thumbnail thumb-xl m-b-none"  src="/widgets/QuickBooks210x70.png"/>
	</center>
    <div   rel="tooltip" class="m-t m-b">
		Sync customers in Quickbooks as Contacts in Agile CRM along with invoice and payment data.
	</div>
    
			{{#if id}}
        	   <a class="btn btn-sm btn-danger delete"  id="quick-book-delete" >Disable</a>
				<a href="#sync/quickbook" class="btn btn-sm btn-default">Settings</a>
			{{else}}

			  
				{{#canSyncContacts}}
    						 <a href="/OAuthServlet?service=quickbook-import&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks""  class="btn btn-sm btn-default inline-block">Enable</a>
						{{else}}
							   <a href="#"  class="btn btn-sm btn-default inline-block" disabled>Enable</a>
								<span class="m-l-xs"><i>Needs import privilege.</i></span>
					{{/canSyncContacts}}

			{{/if}}

</div>


</script>


<script id="admin-settings-import-xeroSync-template" type="text/html">
	<div class="panel wrapper widget-add" >
    <center>
    <img class="thumbnail"  src="/widgets/xero210x70.png"  style="width:210px; height:80px;" />
	</center>
    <br />
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;"  rel="tooltip" >
		Sync customers in Xero as Contacts in Agile CRM along with invoice and payment data.
	</div>
    
			{{#if id}}
        	   <a class="btn btn-sm btn-danger delete" >Disable</a>
				<a href="#sync/xero" class="btn btn-default btn-sm">Settings</a>
			{{else}}

			   
			{{#canSyncContacts}}
    						 <a href="#" id ="xeroconnect"class="btn btn-default btn-sm" style="display:inline-block;">Enable</a>
						{{else}}
							   <a href="#"  class="btn btn-default"  style="display:inline-block;" disabled>Enable</a>
								<span style="margin-left:5px"><i>Needs import privilege.</i></span>
					{{/canSyncContacts}}
			{{/if}}

</div>


</script>


<script id="admin-settings-import-xero-settings-template"
	type="text/html">
<div class="col-md-4 panel wrapper" >
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
							<select class="required form-control" name="duration" id="freq">

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
			<button class="btn btn-sm btn-primary" id="xero_sync_prefs" style="display:inline-block;" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-sm btn-primary" id="xero_sync_prefs" style="display:inline-block;">Sync</button>
{{/if}}

           		<a href="#sync" class="btn btn-default btn-sm ml_5" style="text-decoration:none;">Cancel</a>
       	  	</div>


       
    </form>
{{else}}
 <a href="#" id ="xeroconnect" class="btn btn-default btn-sm" style="display:inline-block;">Enable</a>
{{/if}}

</div>
</script>


<script id="admin-settings-import-freshbooks-settings-template"
	type="text/html">
<div class="row">
<div class="col-md-4 col-sm-6 col-xs-12">
<div class="panel wrapper" >
<span class="label label-danger pull-right m-b">Beta</span>
<center> <img class="thumbnail m-b-none img-responsive thumb-xl bg-transparent" src="img/plugins/freshbooks-logo.png"  /></center>
{{#unless id}}
    <div class="m-t m-b"  rel="tooltip" >
		Setup contacts sync with your Freshbooks account.
	</div>
{{/unless}} 

    {{#if id}}
<form id="freshbooks-form">
<input type ="hidden" value = "{{id}}" name ="id">
          <div><span>Account Linked </span>  <span>{{othersParams}}.freshbooks.com <span><a href="#" class="delete">Change</a></span></span></div>
	
          
             	<div class="control-group form-group">
					<label class="control-label">Frequency</label> 
           				<div class="controls">
							<select class="required form-control" name="duration" id="freq">

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

			<div class="form-actions">
<a href="#sync" class="btn btn-default btn-sm inline-block">Cancel</a>
{{#if inProgress}}
			<button class="btn btn-sm btn-primary ml_5" id="freshbooks_sync_prefs" disabled="disabled">Syncing</button>
{{else}}
<button class="btn btn-sm btn-primary ml_5" id="freshbooks_sync_prefs">Sync</button>
{{/if}}
       	  	</div>


       
    </form>
{{else}}
<div>

<form id="freshbooks_login_form" name="freshbooks_login_form" method="post">
	    	
			
                   
				<div class="control-group form-group"><div class="controls">



<div class='input-group'>
	<span class="input-group-addon">https://</span>
	  <input type="url" id="freshbooks_url" class="input-medium form-control" placeholder="Freshbooks domain name" value="" id="freshbooks_url">
    <span class="input-group-addon">.freshbooks.com</span>

                </div>  
<div id="domainerror" class="hide text-danger">Enter Domain Name</div>
         </div>
			</div>	
               
           <div class="control-group form-group"><div class="controls">
              <input type="text" id="freshbooks_apiKey" class="input-medium form-control"   placeholder="API Token" value="" id="freshbooks_apiKey"></input>
            <div id="apierror" class="hide text-danger">Enter Valid API Token</div>
    </div></div>
				
               <a href ="#" id ="freshbooks" class="btn btn-sm btn-primary">Connect</a>
				
	    </form>
</div>
{{/if}}

</div>
</div>
</script>

<script
	id="admin-settings-import-freshbooks-contacts-syncPrefs-template"
	type="text/html">


	<div class="panel wrapper widget-add" >
    <center>
    <img class="thumbnail m-b-none thumb-xl bg-transparent" src="img/plugins/freshbooks-logo.png" />
    </center>
    <div class="m-t m-b" rel="tooltip" >
		Sync Clients from Freshbooks as Contacts in Agile CRM along with purchase history.
	</div>
    
			{{#if id}}
        	   <a class="btn btn-sm btn-danger delete">Disable</a>
				<a href="#sync/freshbooks/setting" class="btn btn-sm btn-default">Settings</a>
			{{else}}

	  {{#canSyncContacts}}
	            <a href="#sync/freshbooks" class="btn btn-sm btn-default inline-block">Enable</a>
           {{else}}
		         <span class="btn btn-sm btn-default inline-block" disabled>Enable</span>
				 <span class="m-l-xs"><i>Needs import privilege.</i></span>
	{{/canSyncContacts}}
			{{/if}}

</div>

</script>


<script id="admin-settings-import-freshbooks-contacts-form-template"
	type="text/html">
<div class="row">
<div class="col-md-4 col-sm-6 col-xs-12">
<div class="panel wrapper" >
<span class="label label-danger pull-right m-b">Beta</span>
<center> <img class="thumbnail m-b-none img-responsive thumb-xl bg-transparent" src="img/plugins/freshbooks-logo.png" /></center>

{{#unless id}}
    <div class="m-t m-b"  rel="tooltip" >
		Setup contacts sync with your Freshbooks account.
	</div>
{{/unless}}

<form  id="freshbooks_login_form" name="freshbooks_login_form" method="post">
	    	
			
                     
				<div class="control-group form-group"><div class="controls">



<div class='input-group'>
	<span class="input-group-addon">https://</span>
	  <input type="url" id="freshbooks_url" class="input-medium form-control"  placeholder="Freshbooks domain name" value="" id="freshbooks_url">
    <span class="input-group-addon">.freshbooks.com</span>

                </div>  
<div id="domainerror" class="hide text-danger">Enter Domain Name</div>
         </div>
</div>
				
               
           <div class="control-group form-group"><div class="controls">
              <input type="text" id="freshbooks_apiKey" class="input-medium form-control"  placeholder="API Token" value="" id="freshbooks_apiKey"></input>
           <div id="apierror" class="hide text-danger">Enter Valid API Token</div>
       </div></div>
				<div class="m-t-md">
               <a href ="#" id ="freshbooks" class="btn btn-sm btn-primary">Connect</a>
				</div>
	    </form>
</div>
</div>
</script>
<script type="text/html" id="admin-settings-integrations-stats-template">
		
<div class="m-b-sm">
<h4 class="h4 pull-left"> Email Stats </h4>
				<div  class="pull-right">
					{{#if this.id}}Reputation {{{get_subaccount_reputation reputation}}}
					{{/if}}
				</div>
<div class="clearfix"></div>
		</div>
{{#unless _agile_email_gateway}}
			{{#if_equals "paused" status}}
				<div class="alert alert-danger m-t" role="alert">
  					Important: Emails from your account are blocked due to poor reputation. Please contact our <a href="#contact-us">support</a> team if you wish to correct this.
				</div>
			{{/if_equals}}
		{{/unless}}
		<div>
		<div class="row">
        	<div class="col-md-6 b-r b-light">
        	<div class="panel panel-default">
            	<div class="panel-heading">Emails Sent</div>
            	
				<table class="table table-bordered table-hover">
					<tbody>
						<tr><td>This Hour</td><td>{{numberWithCommas sent_hourly}}</td></tr>
						<tr><td>This Week</td><td>{{numberWithCommas sent_weekly}}</td></tr>
						<tr><td>This Month</td><td>{{numberWithCommas sent_monthly}}</td></tr>
						<tr><td>Overall</td><td>{{numberWithCommas sent_total}}</td></tr>
					</tbody>
				</table>
				
        	</div>
        	</div>
        	<div class="col-md-6">
        	<div class="panel panel-default">
            	<div class="panel-heading">Bounces (Last 30 Days)</div>
            	
				<table class="table table-bordered table-hover">
					<tbody>
						<tr><td>Hard Bounce</td><td>{{numberWithCommas last_30_days.hard_bounces}}</td></tr>
						<tr><td>Soft Bounce</td><td>{{numberWithCommas last_30_days.soft_bounces}}</td></tr>
						<tr><td>Rejects</td><td>{{numberWithCommas last_30_days.rejects}}</td></tr>
						<tr><td>Spam Complaints</td><td>{{numberWithCommas last_30_days.complaints}}</td></tr>
					</tbody>
				</table>
				
        	</div>
    	</div>
    	</div>
    	</div>
    	
		<div class="m-b-sm"> 
			<h4 class="h4"> SMS Stats </h4>
			<span class="inline" ></span>
		</div>
		<div>
					{{#unless Stats-Type}}
					<div class="text-md">No SMS gateway configured. <a class="text-info" href="#integrations">Configure Now</a></div>
					{{/unless}}
		{{#if_equals "TWILIO" Stats-Type}}
		
		<div class="row">
        	<div class="col-md-6 b-r">
             <div class="panel panel-default">
            	<div class="panel-heading">SMS Sent</div>
                 
				<table class="table table-bordered table-hover bg-white">
					<tbody>
						<tr><td>Today</td><td>{{numberWithCommas Today}}</td></tr>
						<tr><td>Yesterday</td><td> {{numberWithCommas Yesterday}}</td></tr>
						<tr><td>This Month</td><td>{{numberWithCommas ThisMonth}} </td></tr>
						<tr><td>Last Month</td><td>{{numberWithCommas LastMonth}} </td></tr>
					</tbody>
				</table>
        	
            </div>
            </div>
        	<div class="col-md-6">
            <div class="panel panel-default">
            <div class="panel-heading">Delivery Status (Last 50 Messages)</div>
            
				<table class="table table-bordered table-hover bg-white">
					<tbody>
						<tr><td>Queued</td><td>{{numberWithCommas Queued}} </td></tr>
						<tr><td>Delivered</td><td> {{numberWithCommas Delivered}}</td></tr>
						<tr><td>Undelivered
						<span class="v-top">
						<img border="0" src="/img/help.png" class="question-tag-tiny v-top" rel="popover" data-placement="right" data-title:"="" 
						data-content="This can happen for a number of reasons including carrier content filtering, availability of the destination handset, etc." 
						id="element" data-trigger="hover" data-original-title=""></span>
						</td><td>{{numberWithCommas Undelivered}}</td></tr>
						<tr><td>Failed
						<span class="v-top">
						<img border="0" src="/img/help.png" class="question-tag-tiny v-top" rel="popover" data-placement="right" data-title:"="" 
						data-content="This can happen for various reasons including incorrect number, improper number format, queue overflows or  account suspensions. Twilio does not charge you for failed messages." 
						id="element" data-trigger="hover" data-original-title=""></span>
						</td><td>{{numberWithCommas Failed}} </td></tr>
					</tbody>
				</table>
           
           </div>
        	</div>
    	</div>
    	
		{{/if_equals}}
		{{#if_equals "PLIVO" Stats-Type}}
		<div class="text-md">No stats available for Plivo SMS Gateway.</div>			
		{{/if_equals}}
		</div>

</script><script id="admin-settings-milestones-collection-template"
	type="text/html">
	<div class='col'>
		<div class="hbox h-auto m-b-sm">
			<h4><div class="m-t-xs pull-left">Deal Tracks</div>
			{{#isTracksEligible}}
				<a href="#pipelineModal" role="button" data-toggle="modal" type="submit" class="add-pipeline btn btn-default btn-addon btn-sm" style="float:right;"><i class="icon icon-plus-sign"></i> Add Track</a>
			{{else}}
				<span class="btn btn-default disabled" style="float:right;"><i class="icon icon-plus-sign"></i> Add Track</span>
				<div class="clearfix"></div>
			{{/isTracksEligible}}
			</h4>
            <div class="clearfix"></div>
			{{#isTracksEligible}}
			{{else}}
			<div class="pull-right m-t-n-sm m-b-sm"><i>Regular or Pro plan only</i></div>
			<div class="clearfix"></div>
			{{/isTracksEligible}}
		</div>
		<div class="accordion" id="deal-tracks-accordion">
			<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
    			<div id="admin-settings-milestones-model-list"></div>
			</div>
		</div>
		<!-- <div class="form-actions">
    		<a href="#" class="save-pipelines btn btn-primary">Save</a>
    	</div> -->
	</div>
<!-- Help Text -->
<div class="col w-md">
	<div class="data-block">
		<div class="p-l p-r">
			<h4 class="m-t-none">What are Tracks and Milestones?</h4>			
			<p>Tracks are sales processes. Use tracks to correspond to particular products or services offered by your company, or set up tracks to be used in deals with customers, partners, resellers, etc. When you create a new deal, you choose which track to associate it with.</p>
			<br/>
			<p>Milestones define the status of deals in a particular track. You can create any number of custom milestones in a track. Common milestones include 'New', 'In Progress',  'Won' or  'Lost'. When you associate a deal with a track, that deal will typically need to go through all of the track's milestones to be completed or finalized.</p>
		</div>
	</div>
</div>
</script>

<script id="admin-settings-milestones-model-template" type="text/html">
    	
		<div class="panel panel-default">
		<form id="milestonesForm_{{id}}" class="form-horizontal m-b-none pipeline" method=post>
		<div id="{{id}}-deal-track" class="accordion-group overflow-hidden">
		<div class="panel-heading pos-rlt" role="tab" id="headingOne">
		<div class="accordion-heading">
    		{{#if id}}
    			<input type="text" name="id" class="hide form-control" value="{{id}}">
    		{{/if}} 
			{{#if id}}
    			<input type="text" name="name" class="hide form-control" value="{{name}}">
    		{{/if}}
			<input type="hidden" name="isDefault" value={{isDefault}}>
			<div class="panel-title"><a class="accordion-toggle pull-left text-l-none-hover" data-toggle="collapse" aria-controls="collapseOne" aria-expanded="true" data-parent="#deal-tracks-accordion" href="#dealtracks-{{id}}-accordion" style="width:90%;">{{name}}</a></div>
			<div id="icons" class="pull-right pos-abs pos-r-0 pos-t-0 p-r m-t-xs" style="display:none;">
			{{#isTracksEligible}}
			{{#hasSingleTrack}}
				<a href="#pipeline-delete-modal" role="button" data-toggle="modal" class="pipeline-delete m-t-xs m-l-sm c-p text-l-none pull-right text-sm" id="{{id}}" data="{{name}}"><i class="task-action icon icon-trash" data="{{id}}" title="Delete Track"></i></a>
			{{/hasSingleTrack}}
			<a href="#pipelineModal" role="button" data-toggle="modal" class="pipeline-edit m-t-xs c-p text-l-none pull-right text-sm {{#hasSingleTrack}} {{else}}p-r-xs{{/hasSingleTrack}}" id="{{id}}" data="{{name}}" ><i class="task-action icon icon-edit" data="{{id}}" title="Edit Track"></i></a>
			{{else}}
			{{#if_equals isDefault 'false'}}
				{{#hasSingleTrack}}
					<a href="#pipeline-delete-modal" role="button" data-toggle="modal" class="pipeline-delete m-t-xs m-l-sm c-p text-l-none pull-right text-sm" id="{{id}}" data="{{name}}"><i class="task-action icon icon-trash" data="{{id}}" title="Delete Track"></i></a>
				{{/hasSingleTrack}}
				<a href="#pipelineModal" role="button" data-toggle="modal" class="pipeline-edit m-t-xs c-p text-l-none pull-right text-sm" id="{{id}}" data="{{name}}" ><i class="task-action icon icon-edit" data="{{id}}" title="Edit Track"></i></a>
			{{/if_equals}}
			{{/isTracksEligible}}
			</div>
			<div class="clearfix"></div>
			</div>
		</div>
			<div class="panel-collapse" role="tabpanel" aria-labelledby="headingOne" id="collapseOne">
			<div class="panel-body p-n  collapse" id="dealtracks-{{id}}-accordion">
			<fieldset>
    		<div class="control-group m-b-none">  	 
                    <div id="milestone-values-{{id}}">
					<table class="table table-hover  custom-fields-table bg-white table-hover m-b-none" >
					<colgroup><col width="50%"><col width="4%"></colgroup>
					<tbody class="deal-tracks-tbody ui-sortable">
					{{#milestone_ul milestones}}{{/milestone_ul}}
					</tbody>
					</table>
					</div>
					<div class="p-l p-t p-b"><a href="#" class="show_milestone_field text-info"><i class="icon-plus-sign"></i> Add Milestone</a></div>
					<div class="show_field p-l p-t p-b" style="display:none;">
						<input id="add_new_milestone" class="add_new_milestone form-control input-sm" style="width:145px;display:inline-block" type="text" placeholder="New Milestone">
						<a class="btn btn-info btn-addon btn-sm add_milestone" data-toggle="modal" id="add_milestone" href="#">Add</a>
					</div>
    				<div class="hidden"><input name="milestones" type="text" class="required form-control" value="{{milestones}}"/></div>
    		</div> 
    		</fieldset>
			</div>
			</div>
		</div>
    	</form>
		</div>
		
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
                <a type="submit" class="btn btn-sm btn-primary save">Save Changes</a>
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
<div class="wrapper-md">
<div class="row">
<div class="col-md-4 col-sm-6 col-xs-12">
	<div class="panel p-md">
		<form id="sms-gateway-integration-form">
			<fieldset>

				<div style="position: relative; padding-top: 10px;">
					<center>
						<img class="thumbnail img-responsive" alt="sms-integration" id="integrations-image" style="top: -5px; position: relative; height: 85px;" />
					</center>
				</div>

				<div class="control-group" class="m-b-none">
					<div class="controls">
						<h5 id="integrations-label"></h5>             			
					</div>
				</div>

				<div class="p-t-sm">
					<div>
						{{#if id}} 
							<input type="hidden" class="input-medium required TWILIO PLIVO form-control" style="width: 90%" name="id" value="{{id}}" />
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
										
										<input type="hidden" class="input-medium required TWILIO PLIVO form-control" style="width: 90%" name="id" />

										{{#if_equals "TWILIO" sms_api}}
											<div class="control-group" style="margin-bottom: 0px; margin-top: -12px;">
												<div class="controls">
													<input type="text" class="input-medium required TWILIO PLIVO form-control" style="width: 90%" placeholder="ACCOUNT SID"  name="account_sid" value="{{account_sid}}"/>
												</div>
											</div>

										{{else}}

										<div class="control-group" style="margin-bottom: 0px; margin-top: -12px;">
											<div class="controls">
												<input type="text" class="input-medium required TWILIO PLIVO form-control" style="width: 90%" placeholder="ACCOUNT ID" name="account_id" value="{{account_id}}"/>
											</div>
										</div>

										{{/if_equals}}

										<div class="control-group form-group" style="margin-bottom: 0px;">
											<div class="controls">
												<input type="text" class="input-medium required TWILIO PLIVO form-control" style="width: 90%; margin-top: 10px;" placeholder="Auth Token" name="auth_token" value="{{auth_token}}" id = "auth_token" />
											</div>
										</div>

									{{/stringToJSON}}

								{{/if}}

							{{/if_equals}}

						{{else}} 

							{{#if id}}
								<input type="hidden" class="input-medium required TWILIO PLIVO form-control" style="width: 90%" name="id" />
							{{/if}}

							<div class="control-group form-group" style="margin-bottom: 0px;">
								<div class="controls">
									<input type="text" class="input-medium required TWILIO PLIVO form-control" style="width: 90%;margin-top: -12px;" id="accoundID" />
								</div>
							</div>

							<div class="control-group form-group" style="margin-bottom: 0px;">
								<div class="controls">
									<input type="text" class="input-medium required TWILIO PLIVO form-control" style="width: 90%; margin-top: 10px" placeholder="Auth Token" name="auth_token" id = "auth_token" />
								</div>
							</div>

						{{/if_equals}}
					</div>
				</div>

				<div id="sms-integration-error">
					<p style="margin: 10px 0px 5px 0px;">
						<a type="reset" class="btn btn-default btn-sm" href="#integrations" style="text-decoration: none;">Cancel</a>
						<a type="submit" href="#" class="save btn-sm btn btn-primary" style="text-decoration: none;">Save</a> 
					</p>
				</div>

			</fieldset>
		</form>
	</div>
</div>
</script>















<script id="admin-settings-user-add-template" type="text/html">
<div class="wrapper">
    <div class="row">
    	<div class="col-md-9">
    	<div class="panel panel-default">
    		<div class="panel-heading">
    			{{#if id}}
             	   <h4 class="h4">Edit User Details</h4>
    				
				{{else}}
					<h4 class="h4">New User Details</h4>
    			{{/if}}
			</div>
    		<form id="userForm" name="userForm" method="get" action="" class="form-horizontal">
				{{#if id}}
					<input type="text" name="id" class="hide" value={{id}} >
				{{/if}}
    			<fieldset class="wrapper">					
    				<br/>
                   	<div class="control-group form-group">

    					<label class="control-label col-md-3" for="cname">Name <span class="field_req">*</span></label> 
<div class="col-md-9">
                   		<div class="controls">
    						<input type="text" id="cname" name="name" class="required form-control" placeholder="Name" autocapitalize="off"/>
    					</div>
</div>
    				</div> 
    			
    				<div class="control-group form-group">

    					<label class="control-label col-md-3" for="eaddress">Email Address <span class="field_req">*</span></label> 

<div class="col-md-9">                   		
<div class="controls">
    						<input type="text" id="eaddress" class="email required form-control" name='email' placeholder="Email address" autocapitalize="off"/> 
    					</div>
    				</div>
    </div>
                       <div class="control-group form-group">

    					<label class="control-label col-md-3" for="password">Password <span class="field_req">*</span></label> 
<div class="col-md-9">                   		
<div class="controls">
    						<input type="password" class="required form-control" id="password" value="{{password}}" name='password' maxlength="20" minlength="4" placeholder="Password" autocapitalize="off"/> 
    					</div>
    				</div>
</div>

    
    				<div class="control-group form-group">
<div class="col-sm-offset-3 col-md-9">
    					<div class="controls">
    						<div class="checkbox">
<label class="i-checks i-checks-sm">
    							<input type="checkbox" id="Disabled" name='is_disabled' value='true'/><i></i>
                           		Disable this user
</label>
    						</div>
    					</div>
    				</div>
</div>
	
					<div class="control-group form-group">
<div class="col-sm-offset-3 col-md-9">
    					<div class="controls">
    						<div class="checkbox">
<label class="i-checks i-checks-sm">
    							<input type="checkbox" id="Admin" name='is_admin' value='true'/><i></i> 
                           		Administrator<br/><div style="margin-left:6px;"><small>Allow access to admin settings (configuration and user management)</small></div>
    						</label>
</div>
    					</div>
    				</div>
</div>
<div class="col-sm-offset-3 col-md-9 p-l-xs">
					<div id="accordion">
					  <div class="controls">
     					 <div>
        					<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" >
          						<span class="icon-plus"> </span> Privileges</a>
					        </a>
      					</div>
    				</div>
					<div id="collapseOne" class="panel-collapse collapse" >
      					<div class="m-l-md">
					{{#unless id}}
 					<div class="control-group form-group">
						
					<div class="controls">
						<div class="multiple-checkbox" name="newscopes">
								<label class="i-checks i-checks-sm checkbox">
                            	<input type="checkbox" name="temp"  value="CREATE_CONTACT" checked><i></i> 
                            		Create Contacts <br/>
									<div style="margin-left:6px;"><small> Add contacts</small></div>
								</label>
								<label class="i-checks i-checks-sm checkbox">
            	            	    <input type="checkbox" name="temp"  value="IMPORT_CONTACTS" checked><i></i> 
        	                    	Import Contacts  <br/>
									<div style="margin-left:6px;"><small> Import from CSV file, sync from Google Apps and other integrations </small></div>
    	                       </label>
                               <label class="i-checks i-checks-sm checkbox">
            	            	    <input type="checkbox" name="temp"  value="EXPORT_CONTACTS" checked><i></i> 
        	                    	Export Contacts  <br/>
									<div style="margin-left:6px;"><small> Export contacts as a CSV file </small></div>
    	                       </label>
								<label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="temp"  value="VIEW_CONTACTS" checked><i></i> 
                            		View All Contacts  <br/>
									<div style="margin-left:6px;"><small> View contacts owned by other users</small></div>
                           		</label>
								<label class="i-checks i-checks-sm checkbox">
                        		    <input type="checkbox" name="temp" value="DELETE_CONTACTS" checked><i></i> 
                        	    	Update All Contacts  <br/>
									<div style="margin-left:6px;"><small>  Edit and delete contacts owned by other users</small></div>
                    	       </label>
							</div>
						</div>
                    </div>
						{{else}}
						{{#unless is_admin}}
						<div class="control-group form-group">
						<div class="controls">
						<div class="multiple-checkbox"  name="newscopes">
								<label class="i-checks i-checks-sm checkbox">
                            	<input type="checkbox" name="temp"  value="CREATE_CONTACT"><i></i> 
                            		Create Contacts <br/>
									<div style="margin-left:6px;"><small> Add contacts</small></div>
								</label>
								<label class="i-checks i-checks-sm checkbox">
            	            	    <input type="checkbox" name="temp"  value="IMPORT_CONTACTS"><i></i>
        	                    	Import Contacts  <br/>
									<div style="margin-left:6px;"><small> Import from CSV file, sync from Google Apps and other integrations</small></div>
    	                       </label>
                               <label class="i-checks i-checks-sm checkbox">
            	            	    <input type="checkbox" name="temp"  value="EXPORT_CONTACTS"><i></i>
        	                    	Export Contacts  <br/>
									<div style="margin-left:6px;"><small> Export contacts as a CSV file</small></div>
    	                       </label>
								<label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="temp"  value="VIEW_CONTACTS"><i></i> 
                            		View All Contacts  <br/>
									<div style="margin-left:6px;"><small> View contacts owned by other users </small></div>
                           		</label>
								<label class="i-checks i-checks-sm checkbox">
                        		    <input type="checkbox" name="temp" value="DELETE_CONTACTS"><i></i> 
                        	    	Update All Contacts  <br/>
									<div style="margin-left:6px;"><small>  Edit and delete contacts owned by other users</small></div>
                    	       </label>
							</div>
						</div>
                    </div>
					{{else}}
					<div class="control-group form-group">
						<div class="controls">
						<div class="multiple-checkbox"  name="newscopes">
									<label class="i-checks i-checks-sm checkbox" >
                            	<input type="checkbox" name="temp"  value="CREATE_CONTACT" disabled><i></i> 
                            		Create Contacts <br/>
									<div style="margin-left:6px;"><small> Add contacts</small></div>
								</label>
								<label class="i-checks i-checks-sm checkbox" >
            	            	    <input type="checkbox" name="temp"  value="IMPORT_CONTACTS" disabled><i></i> 
        	                    	Import Contacts  <br/>
									<div style="margin-left:6px;"><small> Import from CSV file, sync from Google Apps and other integrations </small></div>
    	                       </label>
                               <label class="i-checks i-checks-sm checkbox" >
            	            	    <input type="checkbox" name="temp"  value="EXPORT_CONTACTS" disabled><i></i> 
        	                    	Export Contacts  <br/>
									<div style="margin-left:6px;"><small> Export contacts as a CSV file </small></div>
    	                       </label>
								<label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="temp"  value="VIEW_CONTACTS" disabled><i></i> 
                            		View All Contacts  <br/>
									<div style="margin-left:6px;"><small> View contacts owned by other users </small></div>
                           		</label>
								<label class="i-checks i-checks-sm checkbox">
                        		    <input type="checkbox" name="temp" value="DELETE_CONTACTS" disabled><i></i> 
                        	    	Update All Contacts  <br/>
									<div style="margin-left:6px;"><small>  Edit and delete contacts owned by other users</small></div>
                    	       </label>
							</div>
						</div>
                    </div>
					{{/unless}}
					{{/unless}}
				
					<div class="control-group form-group" style="margin-top:-20px">
						<div class="controls">
						<div class="multiple-checkbox"  name="newMenuScopes" style="padding-top:5px">
					{{#if id}}
						<label class="i-checks i-checks-sm checkbox hide">
                        		    <input type="checkbox" name="scopes-temp" class="required hide" value="CONTACT" checked><i></i> 
                        	    	Contacts<br/><div style="margin-left:6px;"><small>Manage contacts</small></div></label> 
								<label class="i-checks i-checks-sm checkbox">
                        		    <input type="checkbox" name="scopes-temp" class="required" value="CALENDAR" ><i></i> 
                        	    	Calendar<br/><div style="margin-left:6px;"><small>Manage your tasks and events</small></div></label> 
								<label class="i-checks i-checks-sm checkbox">
            	            	    <input type="checkbox" name="scopes-temp" class="required" value="DEALS"><i></i> 
        	                    	Deals<br/>
									<div style="margin-left:6px;"><small> Track sales opportunities</small></div>
    	                       </label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="CAMPAIGN"><i></i> 
                            		Campaigns<br/>
										<div style="margin-left:6px;"><small> Automate marketing</small></div>
                           		</label>
						
								 </label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="CASES"><i></i> 
                            		Cases<br/>
									<div style="margin-left:6px;"><small>Log and address customer issues</small></div>
                           		</label>
 								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp"  class="required" value="SOCIAL" ><i></i> 
                            		Social Suite<br/>
									<div style="margin-left:6px;"><small> Monitor your brand on social media</small></div>
                           		</label>
								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="WEBRULE" ><i></i> 
                            		Web Rule<br/>
									<div style="margin-left:6px;"><small> Enagage your website visitors with smart popups, or perform automatic actions </small></div>
                           		</label>
								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="DOCUMENT" ><i></i> 
                            		Documents<br/>
								<div style="margin-left:6px;"><small> Upload and attach documents to contacts, deals or cases</small></div>
                           		</label>
								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp"  class="required" value="ACTIVITY" ><i></i> 
                            		Activities<br/>
									<div style="margin-left:6px;"><small> Know what other users are doing</small></div>
                           		</label>
								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp"  class="required" value="REPORT" ><i></i> 
                            		Reports<br/>
									<div style="margin-left:6px;"><small> Stay on top of your data</small></div>
                           		</label>

						{{else}}
								<label class="i-checks i-checks-sm checkbox hide"  >
                        		    <input type="checkbox" name="scopes-temp" class="required hide" value="CONTACT" checked><i></i> 
                        	    	Contacts<br/><div style="margin-left:6px;"><small>Manage contacts</small></div></label>
								<label class="i-checks i-checks-sm checkbox">
                        		    <input type="checkbox" name="scopes-temp" class="required" value="CALENDAR" checked><i></i> 
                        	    	Calendar<br/><div style="margin-left:6px;"><small>Manage your tasks and events</small></div></label> 
								<label class="i-checks i-checks-sm checkbox">
            	            	    <input type="checkbox" name="scopes-temp" class="required" value="DEALS" checked><i></i> 
        	                    	Deals<br/>
									<div style="margin-left:6px;"><small> Track sales opportunities</small></div>
    	                       </label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="CAMPAIGN" checked><i></i> 
                            		Campaigns<br/>
										<div style="margin-left:6px;"><small> Automate marketing</small></div>
                           		</label>
						
								 </label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="CASES" checked><i></i> 
                            		Cases<br/>
									<div style="margin-left:6px;"><small>Log and address customer issues</small></div>
                           		</label>
 								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp"  class="required" value="SOCIAL" checked><i></i> 
                            		Social Suite<br/>
									<div style="margin-left:6px;"><small> Monitor your brand on social media</small></div>
                           		</label>
								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="WEBRULE" checked><i></i> 
                            		Web Rule<br/>
									<div style="margin-left:6px;"><small> Enagage your website visitors with smart popups, or perform automatic actions </small></div>
                           		</label>
								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp" class="required" value="DOCUMENT" checked><i></i> 
                            		Documents<br/>
								<div style="margin-left:6px;"><small> Upload and attach documents to contacts, deals or cases</small></div>
                           		</label>
								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp"  class="required" value="ACTIVITY" checked><i></i> 
                            		Activities<br/>
									<div style="margin-left:6px;"><small> Know what other users are doing</small></div>
                           		</label>
								</label><label class="i-checks i-checks-sm checkbox">
                        	    	<input type="checkbox" name="scopes-temp"  class="required" value="REPORT" checked><i></i> 
                            		Reports<br/>
									<div style="margin-left:6px;"><small> Stay on top of your data</small></div>
                           		</label>

					{{/if}}
				</div>
				</div>	
				</div>
    			</div>
					</div>
					</div>
					</div>
					<div class="row">
<div class="col-md-12"><hr>
</div>
</div>
<div class="form-group">
    				<div class="form-actions col-sm-offset-3 col-md-9">

                    {{#if id}}
                	
    					<input type="text" name="meeting_types" class="hide form-control"  value="{{meeting_types}}">
                        <input type="text" name="meeting_durations" class="hide form-control"  value="{{meeting_durations}}">
                        <input type="text" name="business_hours" class="hide form-control"  value="{{business_hours}}">
						<input type="text" name="info_json_string" class="hide form-control"  value="{{info_json_string}}">
                        <input type="text" name="timezone" class="hide form-control"  value="{{timezone}}">
				
    				{{/if}}
    				<div class="form-actions">
						<a type="reset" href='#users' class="btn btn-default btn-sm">Cancel</a>
               			<button type="submit" class="save btn btn-sm btn-primary">Save Changes</button>
             			</div>
</div>
</div>
    			</fieldset>
    		</form>
    	</div>
    </div>
    </div>
    </div>
</script><script id="admin-settings-users-collection-template" type="text/html">

<div class="panel panel-default">
 <div class="panel-heading">
	<div class="pull-left  m-t-xs">Users</div>
	<div class="pull-right">
		<a href="#users-add" class="btn btn-sm btn-default btn-addon" id="addUser"><span><i class='icon-plus-sign'/></span> Add User</a>
	</div>
	<div class="clearfix"></div>
 </div>
<div class="row">
            <div class="col-md-12 col-sm-12 table-responsive"> 
            <table class="table table-striped showCheckboxes agile-table panel" url="core/api/users/bulk">
                <thead>
                    <tr>
						
                        <th style="width:60%" class="header">User</th>
						<!--  <th style="width:20%" class="header">Tags</th> -->
                        <th style="width:20%" class="header">Created On</th>
                        <th style="width:20%" class="header">Last Logged In</th>
						<!-- <th style="width:20%" class="header">&nbsp;</th> -->
                    </tr>
                 </thead>
                 <tbody id='admin-settings-users-model-list' route='user-edit/'>
                 </tbody>
            </table>
            </div>
    </div>
</div>
</script>
<script id="admin-settings-users-model-template" type="text/html">
    <td class='data' data='{{id}}'>
    <div class="table-resp">
	<div class="thumb-xs agile-img avatar">
	   {{#if ownerPic}}
        <img class="img-inital r r-2x" src="{{ownerPic}}"  title="{{name}}" />
	   {{else}}
		<img class="w-full" src="{{defaultGravatarurl 50}}" title="{{name}}" />
       {{/if}}
    </div>
	<div class="agile-thumb agile-thumb-view">
		<a class="m-r-sm custom-link pull-left text-ellipsis w-auto" style="max-width:calc(100% - 101px);">{{name}}</a>
<span class="pull-left" style="width:91px">
		{{#if is_admin}}
			<span class="label m-r-xs bg-light dk text-tiny">Admin</span>
		{{/if}}
		{{#if is_account_owner}}
			<span class="label bg-light dk text-tiny">Owner</span>
		{{/if}}
		{{#if is_disabled}}
			<span class="label label-danger">Disabled</span>
		{{/if}}
		</span>	
<div class="clearfix"></div>
		<div class="text-xs">{{email}}</div>
	</div>
	</div>
	</td>
	<!-- <td>
		<span class="pull-left" style="width:91px">
		{{#if is_admin}}
			<span class="label m-r-xs bg-light dk text-tiny">Admin</span>
		{{/if}}
		{{#if is_account_owner}}
			<span class="label bg-light dk text-tiny">Owner</span>
		{{/if}}
		{{#if is_disabled}}
			<span class="label label-danger">Disabled</span>
		{{/if}}
		</span>	
	</td> -->
    <td>
		<div class="table-resp">
		{{epochToDate info_json_string "created_time"}}
		</div>
	</td>
    <td class="text-muted">
		<div class="table-resp">
			<i class="fa fa-clock-o"></i>
			<time class="last-login-time" datetime="{{epochToDate info_json_string "logged_in_time"}}" >{{epochToDate info_json_string "logged_in_time"}}</time>
		</div>
	</td>
   <!-- <td><div class="table-resp">{{#if is_admin}}<span class="label m-r-xs bg-light dk text-tiny">Admin</span>{{/if}}{{#if is_account_owner}}<span class="label bg-light dk text-tiny">Owner</span>{{/if}}{{#if is_disabled}}<span class="label label-danger">Disabled</span>{{/if}}</div></td> -->
    
</script>
<script id="admin-settings-web-to-lead-collection-template" type="text/html">
<div class="row">
	<div class="col-md-12">
          <h4 class="m-b-sm m-t-none h4"> Web to Lead <small></small></h3>
	  <div class="row">
		<div class="col-md-4 col-sm-6 col-xs-12 text-center" >
			<div class="panel wrapper text-center b-a" >
			<div class="text-2x pos-rlt thumb-xl w-full">Form Builder<!-- <span class="label label-danger text-xs pos-t-n-sm pos-r-0">Beta</span>--></div>
				<div class="m-t"  rel="tooltip" title="Build your form using our form builder.">
					Build your form using our form builder.
				</div>
<br>
<br>
<a href="#forms"  class="block text-info">Launch Form Builder</a>
			</div>
		</div>
		<div class="col-md-4 col-sm-6 col-xs-12 text-center" >
			<div class="panel wrapper text-center b-a " >
				<div class="text-2x thumb-xl w-full">JS API</div>
    			<div  rel="tooltip" class="m-t" title="Use our JS API to push data into Agile from your web forms.">
					Use our JS API to push data into Agile from your web forms.
				</div>
<br>
<a href="https://github.com/agilecrm/javascript-api" target="_blank" class="m-t-md block text-info">Learn More</a>
			</div>
		</div>
		<div class="col-md-4 col-sm-6 col-xs-12 text-center" >
			<div class="panel wrapper text-center b-a" >
				<a href="https://www.agilecrm.com/wufoo.html" target="_blank" class="t-l-none square-thumb ">
                 <center>
					<img alt="wufoo-integration" src="img/crm-plugins/wufoo.png" class="m-b-md img-responsive thumb-xl">
				</center>
                  </a>
    			<div  rel="tooltip" title="Push form submissions in Wufoo as a contact in Agile.">
					Push form submissions in Wufoo as a contact in Agile.
				</div>
<br>
<br>
<a href="https://www.agilecrm.com/wufoo.html" target="_blank" class="block text-info" style="margin-bottom:2px">Learn More</a>
			</div>
		</div>
		</div>
		<div class="row">
		<div class="col-md-4 col-sm-6 col-xs-12 text-center" >
			<div class="panel wrapper text-center b-a" >
				<a href="https://www.agilecrm.com/unbounce.html" target="_blank" class="t-l-none square-thumb">
                <center>
					<img alt="unbounce-integration" src="img/crm-plugins/unbounce.png" class="img-responsive m-b-md thumb-xl">
                 </center>
				</a>
				<div rel="tooltip" title="Push Unbounce landing page form data as a contact in Agile.">
					Push Unbounce landing page form data as a contact in Agile.
				</div>
<br>
<br>
<a href="https://www.agilecrm.com/unbounce.html" target="_blank" class="block text-info">Learn More</a>
			</div>
		</div>
		<div class="col-md-4 col-sm-6 col-xs-12 text-center">
			<div class="panel wrapper text-center b-a">
				<div class="pos-rlt">
						<span class="label label-danger pos-abs pos-r-0">Beta</span>
						<a href="https://www.agilecrm.com/gravity-forms" target="_blank" class="t-l-none square-thumb">
							<center>
							<img alt="gravity-forms-integration" src="img/crm-plugins/gravity-forms.png" class="img-responsive thumb-xl ">
							</center>
						</a>
					<div class="clearfix"></div>
				</div>
				<br/>
				<div class="ellipsis-multiline m-t-sm" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 45px !important;"  rel="tooltip" title="Advanced forms plugin for Wordpress.">
					Advanced forms plugin for Wordpress.
				</div><br/><a href="https://www.agilecrm.com/gravity-forms" target="_blank" class="text-info">Learn More</a>
			</div>
		</div>
		</div>
	 </div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
          <h4 class="m-b-sm"> E-commerce <small></small></h4>
	  <div class="row">
		<div class="col-md-4 col-sm-6 col-xs-12 text-center">
			<div class="panel wrapper text-center b-a">
				<a href="https://www.agilecrm.com/shopify-integration" target="_blank" class="t-l-none">
                <center>
					<img alt="shopify-integration" src="img/crm-plugins/shopify.png" class="img-responsive thumb-xl">
                 </center>
				</a>
				<br/><br/>
				<div rel="tooltip" title="Shopify is a powerful ecommerce solution that includes everything you need to create an online store.">
					Shopify is a powerful ecommerce solution that includes everything you need to create an online store.
				</div><br/><br/><a href="https://www.agilecrm.com/shopify-integration" target="_blank" class="text-info">Learn More</a>
			</div>
		</div>

		<div class="col-md-4 col-sm-6 col-xs-12 text-center">
			<div class="panel wrapper text-center b-a">
				<div class="pos-rlt">
						<span class="label label-danger pos-abs pos-r-0">Beta</span>
						<a href="https://www.agilecrm.com/magento-crm" target="_blank" style="text-decoration:none;">
							<center>		
           						 <img alt="magento-integration" src="img/crm-plugins/Magento.png" class="img-responsive thumb-xl">
           					</center>
						</a>
					<div class="clearfix"></div>
				</div>
			<br>
			
				<br/>
				<div rel="tooltip" title="Magento is the open-source ecommerce software and platform trusted by the world's leading brands.">
					Magento is the open-source ecommerce software and platform trusted by the world's leading brands.
				</div><br/><a href="https://www.agilecrm.com/magento-crm" target="_blank" class="text-info">Learn More</a>
			</div>
		</div>
		<div class="col-md-4 col-sm-6 col-xs-12 text-center">
			<div class="panel wrapper text-center b-a">
					
					<div class="pos-rlt">
						<span class="label label-danger pos-abs pos-r-0">Beta</span><br/>
						<a href="https://www.agilecrm.com/woocommerce-crm" target="_blank" style="text-decoration:none;">
							<center>
							<img alt="woocommerce-integration" src="img/crm-plugins/woocommerce.png" class="img-responsive thumb-xl">
							</center>
						</a>
						<div class="clearfix"></div>
					</div>
                    
				
				<br><br>
				<div rel="tooltip" title="WooCommerce is a popular and free ecommerce plugin for Wordpress.">
					WooCommerce is a popular and free ecommerce plugin for Wordpress.
				</div><br><br>
                 
<a href="https://www.agilecrm.com/woocommerce-crm" target="_blank" class="text-info">Learn More</a>
			</div>
		</div>
	  </div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
          <h4 class="m-b-sm"> CMS <small></small></h4>
	  <div class="row">
		<div class="col-md-4 col-sm-6 col-xs-12 text-center">
			<div class="panel wrapper text-center b-a">
				<!--<a href="https://www.agilecrm.com/cms.html" target="_blank" style="text-decoration:none;"></a>-->
				<center>	
              <img alt="cms-integration" src="img/crm-plugins/wordpress.png" class="img-responsive thumb-xl">
                </center>
				<br/><br/>
				<div  rel="tooltip" title="WordPress is a free and open source blogging tool and a content management system (CMS) based on PHP and MySQL, which runs on a web hosting service.">
					WordPress is a free and open source blogging tool and a content management system (CMS) based on PHP and MySQL, which runs on a web hosting service.
				</div><br/><a href="https://www.agilecrm.com/wordpress-integration" target="_blank" class="text-info">Learn More</a>
			</div>
		</div>
	  </div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
          <h4 class="m-b-sm"> Web App Integrations <small></small></h4>
	  <div class="row">
		<div class="col-md-4 col-sm-6 col-xs-12 text-center">
			<div class="panel wrapper text-center b-a">
				<!--<a href="" target="_blank" style="text-decoration:none;"></a>-->
				<center>	
                <img alt="cms-integration" src="img/crm-plugins/zapier.png" class="img-responsive thumb-xl">
                </center>
				<br/><br/>
				<div rel="tooltip" title="Zapier is the easiest way to connect hundreds of SaaS apps you use to easily move your data and automate tedious tasks.">
					Zapier is the easiest way to connect hundreds of SaaS apps you use to easily move your data and automate tedious tasks.
				</div><br/><a href="https://zapier.com/zapbook/agile-crm/" target="_blank" class="text-info">Try Zapier App</a>
			</div>
		</div>
	  </div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
			<h4 class="m-b-sm">Email Gateways</h4>
		<div class="row">
			<div class="col-md-4 col-sm-6 col-xs-12 text-center" id="mandrill-email-api-integration">
				<div class="panel wrapper text-center b-a">
					<div class="pos-rlt">
						<!--<span class="label label-danger pos-abs pos-r-0">Beta</span>-->
                        <center>
						<img alt="cms-integration" src="img/crm-plugins/mandrill_logo.png" class="thumb-lg img-responsive">
						</center>	
                        <div class="clearfix"></div>
					</div>
					<br>
					<div    rel="tooltip" title="Mandrill is a transactional email product by MailChimp.">
					Send your emails via your Mandrill account. Mandrill is a scalable and affordable email infrastructure service.
					</div><br/>
					<div align="left">
						{{#if this.length}}	
							{{#gateway_exists "MANDRILL" this}}
								<a href="#" class="btn btn-sm btn-danger " id="email-gateway-delete">Disable</a>
								<a href="#email-gateways/mandrill" class="btn btn-sm btn-default">Settings</a>
							{{else}}
								{{#check_plan "FREE"}}
									<a class="btn btn-sm btn-default" disabled="disabled">Enable</a><span class="m-l-xs"><i>Paid accounts only</i></span>
								{{else}}
									<a href="#email-gateways/mandrill" class="btn btn-sm btn-default">Enable</a>
								{{/check_plan}}	
							{{/gateway_exists}}
							{{else}}
								{{#check_plan "FREE"}}
									<a class="btn btn-sm btn-danger" disabled="disabled">Enable</a><span class="m-l-xs"><i>Paid accounts only</i></span>
										{{else}}
											<a href="#email-gateways/mandrill" class="btn btn-sm btn-default">Enable</a> 
								{{/check_plan}}	
							{{/if}}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-12" id="SMSGateway">
	<h4 class="m-b-sm">SMS Gateways</h4>
		<!-- Twilio -->
<div class="row">
		<div class="col-md-4 col-sm-6 col-xs-12 text-center"  id="twilio-sms-api-integration">
			<div class="panel wrapper text-center b-a">
				<div class="pos-rlt">
                <center>
					<img alt="sms-integration" src="/img/plugins/twilio.png" class=" thumb-xl img-responsive">
                 </center>
						<div class="clearfix">
						</div>
				</div>
				<br>
				<div >
				Twilio provides APIs for text messages and VoIP. User your Twilio account to send SMS from Campaigns.
				</div><br/>
				<div align="left"> 
					{{#if this.length}}	
						{{#gateway_exists "TWILIO" this}}
							<a href="#integrations" class="btn btn-sm btn-danger " id="sms-gateway-delete"  data={{id}} >Disable</a>
								<a href="#sms-gateways/twilio" class="btn btn-sm btn-">Settings</a>
						{{else}}
							{{#check_plan "FREE"}}
								<a class="btn btn-sm btn-default btn-addon" disabled="disabled"><i class="icon-plus m-r-xs"></i>Enable</a><span class="m-l-xs"><i>Paid accounts only</i></span>
							{{else}}
								<a href="#sms-gateways/twilio" class="btn btn-sm btn-default">Enable</a>
							{{/check_plan}}	
						{{/gateway_exists}}
					{{else}}
						{{#check_plan "FREE"}}
							<a class="btn btn-sm btn-default" disabled="disabled">Enable</a><span class="m-l-xs"><i>Paid accounts only</i></span>
						{{else}}
							<a href="#sms-gateways/twilio" class="btn btn-sm btn-default">Enable</a> 
						{{/check_plan}}	
					{{/if}}
				</div>
			</div>
		</div>

		<!-- Plivo -->		
		<div class="col-md-4 col-sm-6 col-xs-12 text-center" id="plivo-sms-api-integration">
			<div class="panel wrapper text-center b-a">
				<div class="pos-rlt">
				<center><img alt="sms-integration" src="/img/plugins/plivo.png" class=" thumb-xl img-responsive">
                </center>
						<div class="clearfix">
						</div>
				</div>
				<br>
				<div class="m-t-sm"   rel="tooltip" ">
				Plivo provides Voice and SMS API for businesses of all sizes.  Use your Plivo account to send SMS from Campaigns.
				</div><br/>
				<div align="left"> 
					{{#if this.length}}	
						{{#gateway_exists "PLIVO" this}}
							<a href="#integrations" class="btn btn-sm btn-danger " id="sms-gateway-delete"  data={{id}} >Disable</a>
								<a href="#sms-gateways/plivo" class="btn btn-sm btn-default">Settings</a>
						{{else}}
							{{#check_plan "FREE"}}
								<a class="btn btn-sm btn-default" disabled="disabled">Enable</a><span class="m-l-xs"><i>Paid accounts only</i></span>
							{{else}}
								<a href="#sms-gateways/plivo" class="btn btn-sm btn-default">Enable</a>
							{{/check_plan}}	
						{{/gateway_exists}}
					{{else}}
						{{#check_plan "FREE"}}
							<a class="btn btn-sm btn-default" disabled="disabled">Enable</a><span class="m-l-xs"><i>Paid accounts only</i></span>
						{{else}}
							<a href="#sms-gateways/plivo" class="btn btn-sm btn-default">Enable</a> 
						{{/check_plan}}	
					{{/if}}
				</div>
			</div>
		</div>
</div>
	</div>
</div>

</script>	


<script id = "sms-integration-alert-modal-template" type="text/html">
	<div class="modal fade" id="SMSGateway-integration-alert">
	 <div class="modal-dialog">
    <div class="modal-content">
    	<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3 class="modal-title"><i class="icon-file-text"></i> {{title}} </h3>
		</div>
		<div class="modal-body">
				<div id="sms-integrations-message">
					<p>  {{message}}</p>
				</div>
		</div>
		<div class="modal-footer">
			<span class="sms-integrations-footer m-r-xs"></span>
				<a href="#" class="btn btn-sm btn-primary" data-dismiss="modal">OK</a>
		</div>
	</div>
	</div>
</div>
</script>