<script id="report-funnel-form-template" type="text/html">
<div class="span6">
    <div class="well">
	<legend class="formheading"><i class="icon-filter" style="padding-right:10px"></i>Funnel graph</legend>
        <form id="funnel-graph"  class="form-horizontal">
            <fieldset style="margin-left:-60px">
                <div class="control-group">  
					  <label class="control-label">Tags <span class="field_req">*</span></label>       
                    <div class="controls">
                        <div class="pull-left">
                        	<ul name="tags" class= "tagsinput tags"></ul>
                        </div>              
                        <input name="tags" type="text" id="addBulkTags multi-tags" class="tags-typeahead multi-tags" placeholder="Enter tags separated by comma"/>
						<span class="error-tags" style="display:none;color:red;">This field is required.</span>
						<input class="hide" name="report_chart_type" value="FUNNEL"/>      
              		</div>
                </div>
            </fieldset>
				  <div class="form-actions">          
                     <a href="#" type="submit" class="btn btn-primary report-chorts" class="btn btn-primary">Show</a>
                    <span class="save-status"></span>
                </div>
        </form>
    </div>
</div>

  <div class="span4">
        <div class="well" id="addview">
            <h3>
              What is a Funnel Report?
            </h3>
            <br />
            <p>
			Funnel report graphically shows you how leads are passing through various stages in your sales cycle. For each Stage you need to have Tags added in Agile. <br/><br/>For example, you can have Tags like Lead, Qualified, Opportunity, Converted - for all contacts in Agile, that reflect their state. You can then create a Funnel Graph on those tags. 


</p>
        </div>
    </div>
</script>

<script id="report-growth-form-template" type="text/html">
<div class="span6">
    <div class="well">
<legend class="formheading"><i class="icon-bar-chart" style="padding-right:10px"></i>Growth graph</legend>
        <form id="growth-graph" class="form-horizontal">
            <fieldset style="margin-left:-60px">
                <div class="control-group">  
					  <label class="control-label">Tags <span class="field_req">*</span></label>       
                    <div class="controls">
                        <div class="pull-left">
                        	<ul name="tags" class= "tagsinput tags"></ul>
                        </div>              
                        <input name="tags" type="text" id="addBulkTags" class="tags-typeahead multi-tags" placeholder="Enter tags separated by comma"/>
						<span class="error-tags" style="display:none;color:red;">This field is required.</span>
						<input class="hide" name="report_chart_type" value="GROWTH"/>      
              		</div>
                </div>
            </fieldset>	
 				 <div class="form-actions">          
                     <a href="#" type="submit" class="btn btn-primary report-chorts" class="btn btn-primary">Show</a>
                    <span class="save-status"></span>
                </div>
        </form>
    </div>
</div>
   <div class="span4">
        <div class="well" id="addview">
            <h3>
               What is a Growth Graph?
            </h3>
            <br />
            <p>
				Growth graphs allow you to see how Contacts/leads with particular Tags are getting added over time. <br/><br/>

				For example, if you are adding a 'Lead' tag to all leads/contacts that you add (or get pushed via API), then you can create a Growth Graph on that tag, to see how many leads you get daily/weekly/monthly over time. <br/><br/>
You can apply additional Filters when you see the graph. Say you have a filter defined for all leads from a particular source (they may have a particular Tag or custom filed value). You can apply that filter on the graph and see how leads from the source are growing. 

</p>
        </div>
    </div>
</script>

<script id="report-cohorts-form-template" type="text/html">
<div class="span6">
    <div class="well">
<legend class="formheading"><i class="icon-group" style="padding-right:10px"></i>Cohorts graph</legend>
        <form id="icon-dashboard" class="form-horizontal">
            <fieldset style="margin-left:-60px">
                <div class="control-group">  
					  <label class="control-label">Tag 1<span class="field_req">*</span></label>
					<div class="controls" id="tags-reports">
                        <input name="tag1" type="text" id="addBulkTags1" class="tags-typeahead-one required"/>
						<span class="error-tags" style="display:none;color:red;">This field is required.</span>
						<input class="hide" name="report_chart_type" value="RATIO"/>
              		</div>       
                </div>
				 <div class="control-group">  
					  <label class="control-label">Tag 2<span class="field_req">*</span></label>       
                    <div class="controls" id="tags-reports">
                        <input name="tag2" type="text" id="addBulkTags2" class="tags-typeahead-one required"/>
						<span class="error-tags" style="display:none;color:red;">This field is required.</span>
              		</div>
                </div>
            </fieldset>
				  <div class="form-actions">          
                     <a href="#" type="submit" class="btn btn-primary report-chorts" class="btn btn-primary">Show</a>
                    <span class="save-status"></span>
                </div>
        </form>
    </div>
</div>
   <div class="span4">
        <div class="well" id="addview">
            <h3>
              What is a Ratio Graph?
            </h3>
            <br />
            <p>
				Ratio graph allow to compare two Tags over time. This allows you to do reports like percentage conversions from one stage to another (represented by Tags). <br/><br/>
For example, if you have a 'Lead' tag for all new contacts and an 'Opportunity' tag for all qualified Opportunities, a Ratio graph between these tags tells you what percentage of Leads that have come in the specified period (day/week/month), have converted into an Opportunity later.<br/>
You can apply Filters for more insightful information. If you have a Filter that gives you leads from a particular source, then applying the filter on the above Ratio report will tell you how many Leads coming from the particular source have converted into an opportunity.



</p>
        </div>
    </div>
</script>

<script id="report-ratio-form-template" type="text/html">

<div class="span6">
    <div class="well">
<legend class="formheading"><i class="icon-dashboard" style="padding-right:10px"></i>Ratio graph</legend>
        <form id="ratio-graph" class="form-horizontal">
            <fieldset style="margin-left:-60px">
                <div class="control-group">  
					  <label class="control-label">Tag 1<span class="field_req">*</span></label>       
                    <div class="controls" id="tags-reports">
                        <input name="tag1" type="text" id="addBulkTags1" class="tags-typeahead-one required"/>
						<span class="error-tags" style="display:none;color:red;">This field is required.</span>
						<input class="hide" name="report_chart_type" value="RATIO"/>      
              		</div>
                </div>
				 <div class="control-group">  
					  <label class="control-label">Tag 2<span class="field_req">*</span></label>       
                    <div class="controls" id="tags-reports">
                        <input name="tag2" type="text" id="addBulkTags2" class="tags-typeahead-one required"/>
						<span class="error-tags" style="display:none;color:red;">This field is required.</span>
              		</div>
                </div>
            </fieldset>
 				 <div class="form-actions">          
                     <a href="#" type="submit" class="btn btn-primary report-chorts" class="btn btn-primary">Show</a>
                    <span class="save-status"></span>
                </div>
        </form>
    </div>
</div>
</script><script id="report-search-model-template" type="text/html">
	<td class="data" data="{{id}}">
    	<div style="display: inline; padding-right: 10px; height: auto;">
        	{{#if_contact_type "PERSON"}} <img class="thumbnail" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display: inline; width:40px; height:40px; " /> {{/if_contact_type}}
        	{{#if_contact_type "COMPANY"}} <img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} /> {{/if_contact_type}}
    	</div>
    	<div style="height: auto; display: inline-block; vertical-align: top; text-overflow: ellipsis; white-space: nowrap; width: 12em; overflow: hidden;">
        	{{#if_contact_type "PERSON"}} <b> {{getPropertyValue properties
        	"first_name"}} {{getPropertyValue properties "last_name"}} </b> <br />
        	{{getPropertyValue properties "email"}} {{/if_contact_type}}
        	{{#if_contact_type "COMPANY"}} <b>{{getPropertyValue properties
        	"name"}}</b></br> {{getPropertyValue properties "url"}} {{/if_contact_type}}
    	</div>
	</td>
	<td>{{getPropertyValue properties "title"}}<br />
    	{{getPropertyValue properties "company"}}
	</td>
	<td>
	  <div class="ellipsis-multiline" style="line-height:20px !important; word-break:keep-all;"> 	
		{{#each tags}}
	    	<span class="label">{{this}}</span>	
		{{/each}}
	  </div>
	</td>
	<td>{{lead_score}}</td>
</script>

<script id="report-search-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            
            <h1><span id="contact-heading">Report Results</span> <small> {{contacts_count}}</small></h1>
            
            <div class="btn-group right" id="view-list" style="top:-29px;position:relative">
            </div>
            <div class="btn-group right" id="filter-list" style="top:-29px;position:relative;margin-right:5px">
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="span12">
        {{#if this.length}}
        <div class="data">
            <div class="data-container">
                <div class="btn-group right" id="bulk-actions" style="position: relative; display: none">
                    <button class="btn">Bulk Actions</button>
                    <button class="btn dropdown-toggle" data-toggle="dropdown" id="view-actions">
                    <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" id="view-actions">
                        <li><a href="#" id="bulk-owner">Change owner</a></li>
						{{#hasMenuScope 'CAMPAIGN'}}
                        <li><a href="#" id="bulk-campaigns">Add to campaign</a></li>
						{{/hasMenuScope}}
                        <li class="hide"><a href="#" id="bulk-email">Send email</a></li>
                        <li><a href="#" id="bulk-tags">Add tags</a></li>
                    </ul>
                </div>
                <table id="contacts_search" class="table table-striped agile-ellipsis-dynamic onlySorting" url="core/api/contacts/bulk" style="overflow: scroll">
                    <thead>
                        <tr style="text-transform: capitalize;">
                            {{reportsContactTableHeadings "fields_set"}}
                        </tr>
                    </thead>
                    <tbody id="report-search-model-list" class="model-list-cursor" route="contact/" style="overflow: scroll;">
                    </tbody>
                </table>
            </div>
        </div>
		{{else}}
			<div class="slate">
    			<div class="slate-content">
					<div class="box-left">
 	           			<img alt="Clipboard" src="/img/clipboard.png">
					</div>
				<div class="box-right">
            		<h3>No results found !</h3>
            		<div class="text">Your search criteria did not match any of your contacts.</div>
        		</div>
    		</div>
		{{/if}}
    </div>
</div>
</script><script id="reports-add-template" type="text/html">
<div class="span12">
	<div class="well">
		<form id="reportsForm" class="form-horizontal">
			<div name="rules" class="formsection chainedSelect">
 					{{#if id}} 
                        <legend class="formheading"> Edit Email Report</legend>
                      {{else}}
                        <legend class="formheading"><i class="icon-plus-sign"></i> Add Email Report</legend>
                    {{/if}}
				<fieldset style="margin-left: -20px">
					<div class="control-group">
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="required" />
						</div>
					</div>

					<div class="control-group" id="report-settings" >
						<label class="control-label">Condition</label>
						<div class="controls">
							<table style="background-color: transparent;margin-bottom:5px" class="reports-condition-table chained-table" >
								<tbody>
									<tr class="chained controls" name="rules" style=" padding-left:100px">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required"
													value="Contact" />
											</div>
										</td>
										<td class="lhs-block span2" style="vertical-align:top; ">
											<div id="LHS" name="LHS">
												<select name="temp" class="lhs" id="LHS" style="width: 125px;">
													<optgroup label="Tag">
														<option value="tags" selected="selected">Tag</option>
														<option value="tags_time">Tag And Created Date</option>
													</optgroup>
													<optgroup label="Date">
														<option value="created_time">Created</option>
														<option value="updated_time">Updated</option>
													</optgroup>
 													<optgroup label="Properties">
														<option value="first_name">First Name</option>
														<option value="email">Email Address</option>
														<option value="company">Company</option>
														<option value="title">Job Title</option>
														<option value="phone">Phone Number</option>
														<option value="lead_score">Lead Score</option>
														<option value="owner_id">Owner</option>
														<option value="address">Address</option>
													</optgroup>
												
													 <optgroup label="Custom Fields" id="custom-fields" class="hide">
													</optgroup>
												</select>
											</div>
										</td>
									<td class="codition-block span2">
											<div id="condition" name="CONDITION">
												<select name="temp" style="width: 100%;">
													<option value="EQUALS"
														class="first_name phone company title org_tag jobtitle email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
													<option value="EQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">is</option>
													<option value="NOTEQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">isn't</option>
													<option value="NOTEQUALS"
														class="first_name company owner org_tag title email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
													<option value="IS_GREATER_THAN" class="lead_score" >greater than</option>
													<option value="IS_LESS_THAN" class="lead_score" >less than</option>
													<option value="EQUALS" class="lead_score">equals</option>
													<option value="BETWEEN_NUMBER" class="lead_score">between</option>

													<option value="EQUALS" class="tags tags_time">is</option>
													<option value="NOTEQUALS" class="tags">isn't</option>
													<option value="ON" class="updated_time created_time">on</option>
													<option value="AFTER" class="created_time updated_time">is
														after</option>
													<option value="BEFORE" class="created_time updated_time">is
														before</option>
													<option value="BETWEEN" class="created_time updated_time">is
														between</option>
													<option value="LAST" class="created_time updated_time">in
														last</option>
													<option value="NEXT" class="created_time updated_time">in next
														</option>
													<option value="EQUALS" class="tag org_tag">is</option>
													<option value="ANYOF" class="tag">is any of</option>
													<option value="CONTAINS" class="address">contains word</option>
													<option value="NOT_CONTAINS" class="address">not contains word</option>
												</select>
											</div>
										</td>
										<td class="rhs-block controls span2" style="vertical-align:top;">
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp" style="width: 92%"
													class="EQUALS NOTEQUALS ANYOF CONTAINS NOT_CONTAINS required"/>
												<input type="text" name="temp" 
													class="MATCHES  required"/>
												<input type="text" name="temp" style="width: 92%"
													class="LAST NEXT required" placeholder="Number of days"/>

                                                <input type="text" name="tag"
													class=" tags tags_time required"
													style="margin: 0 0 0 0px;width: 92%" /> 
                                                <input type="text" name="temp" class="email required" style="width: 92%"/>
												<input type="text" name="temp" style="width:92%"
													class="BETWEEN_NUMBER number required"/>
												<input id="updated_date" type="text" name="updated_date" style="width: 92%"
													class="ON AFTER BEFORE BETWEEN input required date"
													placeholder="MM/DD/YY" />

												<input type="text" name="temp" style="width:92%"
													class="IS_GREATER_THAN IS_LESS_THAN number required"/> 
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; max-width:120px;">
											<div id="RHS-NEW" name="RHS_NEW">
												<input type="text" name="temp" style="width:92%"
													class="BETWEEN_NUMBER number required"/>
												<input id="date_between" type="text" name="temp" style="width: 92%"
													class="BETWEEN input date required" placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="span2" style="vertical-align:top; ">
											<div id="nested_condition" name="nested_condition">
												<select name="temp" style="width: 100%;">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is
														after</option>
													<option value="BEFORE" class="tags_time">is
														before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="LAST" class="tags_time">in last</option>
												</select>
											</div>
										</td>
										<td class="controls span2"  style="vertical-align:top;">
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required"
													style="width: 92%" placeholder="Number of days" /> 
												<input
													id="date_between" type="text" style="width: 92%"
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required"
													placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; ">
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp"
													style="width: 92%" class="BETWEEN input date required"
													placeholder="MM/DD/YY" />
											</div>
										</td>
										<td>
									<div style="margin-left:10px">
										<i
											class="filter-contacts-multiple-remove icon-remove-circle"
											style="display: none;  cursor:pointer;"></i></div></td>

									</tr>
								
								</tbody>
									
							</table>
								<a href="#" class="filter-contacts-multiple-add" style="text-decoration:none;margin-top:5px"><i class="icon-plus"></i> Add</a>
						</div>
					</div>
			</div>

			<div class="control-group" style="margin-left: -20px">
				<label class="control-label">Fields <span class="field_req">*</span></label>
				<div class="controls" id="contactTypeAhead">
					<select id="multipleSelect" class="required" multiple="multiple">
						<optgroup label='Contact Fields'>
							<option value="properties_first_name">First Name</option>
							<option value="properties_last_name">Last Name</option>
							<option value="properties_email">Email</option>
							<option value="properties_company">Company</option>
							<option value="tags">Tags</option>
							<option value="properties_title">Title</option>
							<option value="properties_phone">Phone</option>
							<option value="properties_website">Website</option>
							<option value="created_time">Created Date</option>
							<option value="updated_time">Updated Date</option>
							<option value="properties_image">Image</option>
							<option value="lead_owner">Owner</option>
							<option value="lead_score">Score</option>
						</optgroup>
						<optgroup id="custom-fields-optgroup" label='Custom Fields'>

						</optgroup>
					</select>
				</div>
			</div>

			<div class="control-group" style="margin-left: -20px">
				<label class="control-label">Send Report To<span
					class="field_req">*</span></label>
				<div class="controls">
					<input type="text" name="sendTo" class="required" placeholder="Email addresses separated by comma"/>
				</div>
			</div>
			<div class="control-group" style="margin-left: -20px">
				<label class="control-label">Duration<span
					class="field_req">*</span></label>
				<div class="controls">
					<select class="required" name="duration" id="duration">
					<option value="DAILY">Daily</option>
						<option value="WEEKLY">Weekly</option>
						<option value="MONTHLY">Monthly</option>
					</select>
				</div>
			</div>			
<div class="control-group m-l-n-md">
				<label class="control-label" ><a href="" id="report_advanced" data-toggle="collapse" data-target="#report-advanced-block"><span><i class="icon-plus"></i></span>&nbsp;Advanced</a></label>
			</div>
			<div class="collapse m-l-n-md" id="report-advanced-block">

<div class="control-group">
						<label class="control-label">Time Zone</label>
						<div class="controls">
							<select name="report_timezone" id="report_timezone">
					         <option value="Africa/Abidjan">
									Africa/Abidjan</option>
								<option value="Africa/Accra"> Africa/Accra</option>
								<option value="Africa/Algiers">
									Africa/Algiers</option>
								<option value="Africa/Addis_Ababa">
									Africa/Addis Ababa</option>
								<option value="Africa/Asmara"> Africa/Asmara</option>
								<option value="Africa/Bamako"> Africa/Bamako</option>
								<option value="Africa/Banjul"> Africa/Banjul</option>
								<option value="Africa/Bissau"> Africa/Bissau</option>
								<option value="Africa/Bangui"> Africa/Bangui</option>
								<option value="Africa/Brazzaville">
									Africa/Brazzaville</option>
								<option value="Africa/Blantyre">
									Africa/Blantyre</option>
								<option value="Africa/Bujumbura">
									Africa/Bujumbura</option>

								<option value="Africa/Conakry">
									Africa/Conakry</option>
								<option value="Africa/Casablanca">
									Africa/Casablanca</option>
								<option value="Africa/Cairo"> Africa/Cairo</option>
								<option value="Africa/Ceuta"> Africa/Ceuta</option>
								<option value="Africa/Dakar"> Africa/Dakar</option>
								<option value="Africa/Douala"> Africa/Douala</option>
								<option value="Africa/Dar_es_Salaam">
									Africa/Dar es Salaam</option>
								<option value="Africa/Djibouti">
									Africa/Djibouti</option>

								<option value="Africa/El_Aaiun"> Africa/El
									Aaiun</option>
								<option value="Africa/Freetown">
									Africa/Freetown</option>
								<option value="Africa/Gaborone">
									Africa/Gaborone</option>
								<option value="Africa/Harare"> Africa/Harare</option>
								<option value="Africa/Johannesburg">
									Africa/Johannesburg</option>
								<option value="Africa/Juba"> Africa/Juba</option>
								<option value="Africa/Kinshasa">
									Africa/Kinshasa</option>
								<option value="Africa/Kigali"> Africa/Kigali</option>
								<option value="Africa/Kampala">
									Africa/Kampala</option>
								<option value="Africa/Khartoum">
									Africa/Khartoum</option>
								<option value="Africa/Lome"> Africa/Lome</option>
								<option value="Africa/Lagos"> Africa/Lagos</option>
								<option value="Africa/Libreville">
									Africa/Libreville</option>
								<option value="Africa/Luanda"> Africa/Luanda</option>
								<option value="Africa/Lubumbashi">
									Africa/Lubumbashi</option>
								<option value="Africa/Lusaka"> Africa/Lusaka</option>

								<option value="Africa/Monrovia">
									Africa/Monrovia</option>
								<option value="Africa/Maputo"> Africa/Maputo</option>
								<option value="Africa/Maseru"> Africa/Maseru</option>
								<option value="Africa/Mbabane">
									Africa/Mbabane</option>
								<option value="Africa/Malabo"> Africa/Malabo</option>
								<option value="Africa/Mogadishu">
									Africa/Mogadishu</option>

								<option value="Africa/Nouakchott">
									Africa/Nouakchott</option>
								<option value="Africa/Ndjamena">
									Africa/Ndjamena</option>
								<option value="Africa/Niamey"> Africa/Niamey</option>
								<option value="Africa/Nairobi">
									Africa/Nairobi</option>
								<option value="Africa/Ouagadougou">
									Africa/Ouagadougou</option>
								<option value="Africa/Porto-Novo">
									Africa/Porto-Novo</option>
								<option value="Africa/Sao_Tome"> Africa/Sao
									Tome</option>
								<option value="Africa/Tunis"> Africa/Tunis</option>
								<option value="Africa/Tripoli">
									Africa/Tripoli</option>
								<option value="Africa/Windhoek">
									Africa/Windhoek</option>



								<option value="America/Adak"> America/Adak</option>
								<option value="America/Anchorage">
									America/Anchorage</option>
								<option value="America/Atikokan">
									America/Atikokan</option>
								<option value="America/Anguilla">
									America/Anguilla</option>
								<option value="America/Antigua">
									America/Antigua</option>
								<option value="America/Aruba"> America/Aruba</option>
								<option value="America/Araguaina">
									America/Araguaina</option>
								<option value="America/Argentina/Buenos_Aires">
									America/Argentina/Buenos Aires</option>
								<option value="America/Argentina/Catamarca">
									America/Argentina/Catamarca</option>
								<option value="America/Argentina/Cordoba">
									America/Argentina/Cordoba</option>
								<option value="America/Argentina/Jujuy">
									America/Argentina/Jujuy</option>
								<option value="America/Argentina/La_Rioja">
									America/Argentina/La Rioja</option>
								<option value="America/Argentina/Mendoza">
									America/Argentina/Mendoza</option>
								<option value="America/Argentina/Rio_Gallegos">
									America/Argentina/Rio Gallegos</option>
								<option value="America/Argentina/Salta">
									America/Argentina/Salta</option>
								<option value="America/Argentina/San_Juan">
									America/Argentina/San Juan</option>
								<option value="America/Argentina/San_Luis">
									America/Argentina/San Luis</option>
								<option value="America/Argentina/Tucuman">
									America/Argentina/Tucuman</option>
								<option value="America/Argentina/Ushuaia">
									America/Argentina/Ushuaia</option>
								<option value="America/Asuncion">
									America/Asuncion</option>
								<option value="America/Boise"> America/Boise</option>
								<option value="America/Bogota">
									America/Bogota</option>
								<option value="America/Bahia_Banderas">
									America/Bahia Banderas</option>
								<option value="America/Belize">
									America/Belize</option>
								<option value="America/Barbados">
									America/Barbados</option>
								<option value="America/Blanc-Sablon">
									America/Blanc-Sablon</option>
								<option value="America/Boa_Vista">
									America/Boa Vista</option>
								<option value="America/Bahia"> America/Bahia</option>
								<option value="America/Belem"> America/Belem</option>
								<option value="America/Cancun">
									America/Cancun</option>
								<option value="America/Chicago">
									America/Chicago</option>
								<option value="America/Costa_Rica">
									America/Costa Rica</option>
								<option value="America/Cambridge_Bay">America/Cambridge
									Bay</option>
								<option value="America/Chihuahua">
									America/Chihuahua</option>
								<option value="America/Creston">
									America/Creston</option>
								<option value="America/Cayman">
									America/Cayman</option>
								<option value="America/Caracas">
									America/Caracas</option>
								<option value="America/Curacao">
									America/Curacao</option>
								<option value="America/Campo_Grande">
									America/Campo Grande</option>
								<option value="America/Cayenne">
									America/Cayenne</option>
								<option value="America/Cuiaba">
									America/Cuiaba</option>
								<option value="America/Dawson_Creek">
									America/Dawson Creek</option>
								<option value="America/Dawson">
									America/Dawson</option>
								<option value="America/Denver">
									America/Denver</option>
								<option value="America/Detroit">
									America/Detroit</option>
								<option value="America/Dominica">
									America/Dominica</option>
								<option value="America/Danmarkshavn">
									America/Danmarkshavn</option>
								<option value="America/Edmonton">
									America/Edmonton</option>
								<option value="America/El_Salvador">
									America/El Salvador</option>
								<option value="America/Eirunepe">
									America/Eirunepe</option>
								<option value="America/Fortaleza">
									America/Fortaleza</option>
								<option value="America/Guatemala">
									America/Guatemala</option>
								<option value="America/Grand_Turk">
									America/Grand Turk</option>
								<option value="America/Guayaquil">
									America/Guayaquil</option>
								<option value="America/Glace_Bay">
									America/Glace Bay</option>
								<option value="America/Goose_Bay">
									America/Goose Bay</option>
								<option value="America/Grenada">
									America/Grenada</option>
								<option value="America/Guadeloupe">
									America/Guadeloupe</option>
								<option value="America/Guyana">
									America/Guyana</option>
								<option value="America/Godthab">
									America/Godthab</option>
								<option value="America/Hermosillo">
									America/Hermosillo</option>
								<option value="America/Havana">
									America/Havana</option>
								<option value="America/Halifax">
									America/Halifax</option>
								<option value="America/Inuvik">
									America/Inuvik</option>
								<option value="America/Indiana/Knox">
									America/Indiana/Knox</option>
								<option value="America/Indiana/Tell_City">
									America/Indiana/Tell City</option>
								<option value="America/Indiana/Indianapolis">
									America/Indiana/Indianapolis</option>
								<option value="America/Indiana/Marengo">
									America/Indiana/Marengo</option>
								<option value="America/Indiana/Petersburg">
									America/Indiana/Petersburg</option>
								<option value="America/Indiana/Vevay">
									America/Indiana/Vevay</option>
								<option value="America/Indiana/Vincennes">
									America/Indiana/Vincennes</option>
								<option value="America/Indiana/Winamac">
									America/Indiana/Winamac</option>
								<option value="America/Iqaluit">
									America/Iqaluit</option>
								<option value="America/Juneau">
									America/Juneau</option>
								<option value="America/Jamaica">
									America/Jamaica</option>
								<option value="America/Kentucky/Louisville">
									America/Kentucky/Louisville</option>
								<option value="America/Kentucky/Monticello">
									America/Kentucky/Monticello</option>
								<option value="America/Kralendijk">
									America/Kralendijk</option>
								<option value="America/Los_Angeles">
									America/Los Angeles</option>
								<option value="America/Lima"> America/Lima</option>
								<option value="America/La_Paz"> America/La
									Paz</option>
								<option value="America/Lower_Princes">
									America/Lower Princes</option>
								<option value="America/Metlakatla">
									America/Metlakatla</option>
								<option value="America/Mazatlan">
									America/Mazatlan</option>
								<option value="America/Managua">
									America/Managua</option>
								<option value="America/Matamoros">
									America/Matamoros</option>
								<option value="America/Menominee">
									America/Menominee</option>
								<option value="America/Merida">
									America/Merida</option>
								<option value="America/Mexico_City">
									America/Mexico City</option>
								<option value="America/Monterrey">
									America/Monterrey</option>
								<option value="America/Montreal">
									America/Montreal</option>
								<option value="America/Maceio">
									America/Maceio</option>
								<option value="America/Miquelon">
									America/Miquelon</option>
								<option value="America/Manaus">
									America/Manaus</option>
								<option value="America/Marigot">
									America/Marigot</option>
								<option value="America/Martinique">
									America/Martinique</option>
								<option value="America/Moncton">
									America/Moncton</option>
								<option value="America/Montserrat">
									America/Montserrat</option>
								<option value="America/Montevideo">
									America/Montevideo</option>
								<option value="America/Nome"> America/Nome</option>
								<option value="America/Noronha">
									America/Noronha</option>
								<option value="America/North_Dakota/Beulah">
									America/North Dakota/Beulah</option>
								<option value="America/North_Dakota/Center">
									America/North Dakota/Center</option>
								<option value="America/North_Dakota/New_Salem">
									America/North Dakota/New Salem</option>
								<option value="America/Nassau">
									America/Nassau</option>
								<option value="America/New_York"> America/New
									York</option>
								<option value="America/Nipigon">
									America/Nipigon</option>
								<option value="America/Ojinaga">
									America/Ojinaga</option>
								<option value="America/Phoenix">
									America/Phoenix</option>
								<option value="America/Panama">
									America/Panama</option>
								<option value="America/Pangnirtung">
									America/Pangnirtung</option>
								<option value="America/Port-au-Prince">
									America/Port-au-Prince</option>
								<option value="America/Port_of_Spain">
									America/Port of Spain</option>
								<option value="America/Porto_Velho">
									America/Porto Velho</option>
								<option value="America/Paramaribo">
									America/Paramaribo</option>
								<option value="America/Puerto_Rico">
									America/Puerto Rico</option>
								<option value="America/Rainy_River">
									America/Rainy River</option>
								<option value="America/Rankin_Inlet">
									America/Rankin Inlet</option>
								<option value="America/Regina">
									America/Regina</option>
								<option value="America/Resolute">
									America/Resolute</option>
								<option value="America/Rio_Branco">
									America/Rio Branco</option>

								<option value="America/Recife">
									America/Recife</option>

								<option value="America/Sitka"> America/Sitka</option>
								<option value="America/Santa_Isabel">
									America/Santa Isabel</option>
								<option value="America/Shiprock">
									America/Shiprock</option>
								<option value="America/Swift_Current">
									America/Swift Current</option>
								<option value="America/Santarem">
									America/Santarem</option>
								<option value="America/Santiago">
									America/Santiago</option>
								<option value="America/Santo_Domingo">
									America/Santo Domingo</option>
								<option value="America/St_Barthelemy">
									America/St Barthelemy</option>
								<option value="America/St_Kitts"> America/St
									Kitts</option>
								<option value="America/St_Lucia"> America/St
									Lucia</option>
								<option value="America/St_Thomas"> America/St
									Thomas</option>
								<option value="America/St_Vincent">
									America/St Vincent</option>
								<option value="America/St_Johns"> America/St
									Johns</option>
								<option value="Atlantic/Stanley">
									Atlantic/Stanley</option>
								<option value="America/Sao_Paulo">
									America/Sao Paulo</option>
								<option value="America/Scoresbysund">
									America/Scoresbysund</option>
								<option value="America/Tijuana">
									America/Tijuana</option>
								<option value="America/Tegucigalpa">
									America/Tegucigalpa</option>
								<option value="America/Thunder_Bay">
									America/Thunder Bay</option>
								<option value="America/Toronto">
									America/Toronto</option>
								<option value="America/Thule"> America/Thule</option>
								<option value="America/Tortola">
									America/Tortola</option>
								<option value="America/Vancouver">
									America/Vancouver</option>
								<option value="America/Yakutat">
									America/Yakutat</option>

								<option value="America/Yellowknife">
									America/Yellowknife</option>
								<option value="America/Whitehorse">
									America/Whitehorse</option>
								<option value="America/Winnipeg">
									America/Winnipeg</option>





								<option value="Antarctica/Davis">
									Antarctica/Davis</option>
								<option value="Antarctica/DumontDUrville">
									Antarctica/DumontDUrville</option>

								<option value="Antarctica/Mawson">Antarctica/Mawson</option>
								<option value="Antarctica/Macquarie">
									Antarctica/Macquarie</option>
								<option value="Antarctica/McMurdo">
									Antarctica/McMurdo</option>
								<option value="Antarctica/Palmer">
									Antarctica/Palmer</option>
								<option value="Antarctica/Rothera">
									Antarctica/Rothera</option>
								<option value="Antarctica/Syowa">
									Antarctica/Syowa</option>
								<option value="Antarctica/South_Pole">
									Antarctica/South Pole</option>
								<option value="Antarctica/Vostok">
									Antarctica/Vostok</option>
                                                                <option value="Antarctica/Casey">
									Antarctica/Casey</option>
                                                                <option value="Antarctica/Palmer">
									Antarctica/Palmer</option>
								<option value="Antarctica/Rothera">
									Antarctica/Rothera</option>

								<option value="Asia/Aden"> Asia/Aden</option>
								<option value="Asia/Amman"> Asia/Amman</option>
								<option value="Asia/Aqtau"> Asia/Aqtau</option>
								<option value="Asia/Aqtobe"> Asia/Aqtobe</option>
								<option value="Asia/Ashgabat"> Asia/Ashgabat</option>
								<option value="Asia/Almaty"> Asia/Almaty</option>
								<option value="Asia/Anadyr"> Asia/Anadyr</option>
								<option value="Asia/Baghdad"> Asia/Baghdad</option>
								<option value="Asia/Bahrain"> Asia/Bahrain</option>
								<option value="Asia/Beirut"> Asia/Beirut</option>
								<option value="Asia/Baku"> Asia/Baku</option>
								<option value="Asia/Bishkek"> Asia/Bishkek</option>
								<option value="Asia/Bangkok"> Asia/Bangkok</option>


								<option value="Asia/Brunei"> Asia/Brunei</option>

								<option value="Asia/Colombo"> Asia/Colombo</option>
								<option value="Asia/Choibalsan">
									Asia/Choibalsan</option>
								<option value="Asia/Chongqing">
									Asia/Chongqing</option>
								<option value="Asia/Damascus"> Asia/Damascus</option>
								<option value="Asia/Dubai"> Asia/Dubai</option>
								<option value="Asia/Dushanbe"> Asia/Dushanbe</option>
								<option value="Asia/Dhaka"> Asia/Dhaka</option>
								<option value="Asia/Dili"> Asia/Dili</option>


								<option value="Asia/Gaza"> Asia/Gaza</option>
								<option value="Asia/Hebron"> Asia/Hebron</option>
								<option value="Asia/Hovd"> Asia/Hovd</option>
								<option value="Asia/Ho_Chi_Minh"> Asia/Ho Chi
									Minh</option>
								<option value="Asia/Harbin"> Asia/Harbin</option>
								<option value="Asia/Hong_Kong"> Asia/Hong
									Kong</option>

								<option value="Asia/Irkutsk"> Asia/Irkutsk</option>

								<option value="Asia/Jerusalem">
									Asia/Jerusalem</option>
								<option value="Asia/Jakarta"> Asia/Jakarta</option>
								<option value="Asia/Jayapura"> Asia/Jayapura</option>
								<option value="Asia/Kuwait"> Asia/Kuwait</option>
								<option value="Asia/Kabul"> Asia/Kabul</option>
								<option value="Asia/Karachi"> Asia/Karachi</option>
								<option value="Asia/Kolkata"> Asia/Kolkata</option>
								<option value="Asia/Kathmandu">
									Asia/Kathmandu</option>
								<option value="Asia/Khandyga"> Asia/Khandyga</option>
								<option value="Asia/Kashgar"> Asia/Kashgar</option>
								<option value="Asia/Krasnoyarsk">
									Asia/Krasnoyarsk</option>
								<option value="Asia/Kuala_Lumpur"> Asia/Kuala
									Lumpur</option>
								<option value="Asia/Kuching"> Asia/Kuching</option>
								<option value="Asia/Kamchatka">
									Asia/Kamchatka</option>
								<option value="Asia/Muscat"> Asia/Muscat</option>
								<option value="Asia/Macau"> Asia/Macau</option>
								<option value="Asia/Makassar"> Asia/Makassar</option>
								<option value="Asia/Manila"> Asia/Manila</option>
								<option value="Asia/Magadan"> Asia/Magadan</option>
								<option value="Asia/Nicosia"> Asia/Nicosia</option>
								<option value="Asia/Novokuznetsk">
									Asia/Novokuznetsk</option>
								<option value="Asia/Novosibirsk">
									Asia/Novosibirsk</option>


								<option value="Asia/Oral"> Asia/Oral</option>
								<option value="Asia/Omsk"> Asia/Omsk</option>
								<option value="Asia/Phnom_Penh"> Asia/Phnom
									Penh</option>
								<option value="Asia/Pontianak">
									Asia/Pontianak</option>
								<option value="Asia/Pyongyang">
									Asia/Pyongyang</option>
								<option value="Asia/Qatar"> Asia/Qatar</option>
								<option value="Asia/Qyzylorda">
									Asia/Qyzylorda</option>
								<option value="Asia/Riyadh"> Asia/Riyadh</option>
								<option value="Asia/Rangoon"> Asia/Rangoon</option>
								<option value="Asia/Samarkand">
									Asia/Samarkand</option>
								<option value="Asia/Shanghai"> Asia/Shanghai</option>
								<option value="Asia/Singapore">
									Asia/Singapore</option>
								<option value="Asia/Seoul"> Asia/Seoul</option>
								<option value="Asia/Sakhalin"> Asia/Sakhalin</option>
								<option value="Asia/Tashkent"> Asia/Tashkent</option>
								<option value="Asia/Tokyo"> Asia/Tokyo</option>
								<option value="Asia/Taipei"> Asia/Taipei</option>

								<option value="Asia/Tbilisi"> Asia/Tbilisi</option>
								<option value="Asia/Tehran"> Asia/Tehran</option>
								<option value="Asia/Thimphu"> Asia/Thimphu</option>
								<option value="Asia/Ulaanbaatar">
									Asia/Ulaanbaatar</option>
								<option value="Asia/Urumqi"> Asia/Urumqi</option>
								<option value="Asia/Ust-Nera"> Asia/Ust-Nera</option>
								<option value="Asia/Vientiane">
									Asia/Vientiane</option>
								<option value="Asia/Vladivostok">
									Asia/Vladivostok</option>

								<option value="Asia/Yerevan"> Asia/Yerevan</option>
								<option value="Asia/Yekaterinburg">
									Asia/Yekaterinburg</option>
								<option value="Asia/Yakutsk"> Asia/Yakutsk</option>
								<option value="Australia/Adelaide">
									Australia/Adelaide</option>
								<option value="Australia/Broken_Hill">
									Australia/Broken Hill</option>
								<option value="Australia/Brisbane">
									Australia/Brisbane</option>
								<option value="Australia/Currie">
									Australia/Currie</option>
								<option value="Australia/Darwin">
									Australia/Darwin</option>
								<option value="Australia/Eucla">
									Australia/Eucla</option>
								<option value="Australia/Hobart">
									Australia/Hobart</option>
								<option value="Australia/Lindeman">
									Australia/Lindeman</option>
								<option value="Australia/Lord_Howe">
									Australia/Lord Howe</option>
								<option value="Australia/Melbourne">
									Australia/Melbourne</option>
								<option value="Australia/Perth">
									Australia/Perth</option>
								<option value="Australia/Sydney">
									Australia/Sydney</option>
								<option value="Atlantic/Azores">
									Atlantic/Azores</option>
								<option value="Atlantic/Bermuda">
									Atlantic/Bermuda</option>
								<option value="Atlantic/Cape_Verde">
									Atlantic/Cape Verde</option>
								<option value="Atlantic/Canary">
									Atlantic/Canary</option>
								<option value="Atlantic/Faroe">
									Atlantic/Faroe</option>
								<option value="Arctic/Longyearbyen">
									Arctic/Longyearbyen</option>
								<option value="Atlantic/Madeira">
									Atlantic/Madeira</option>
								<option value="Atlantic/Reykjavik">
									Atlantic/Reykjavik</option>
								<option value="Atlantic/South_Georgia">
									Atlantic/South Georgia</option>
								<option value="Atlantic/Stanley">
									Atlantic/Stanley</option>

								<option value="Atlantic/St_Helena">
									Atlantic/St Helena</option>
								<option value="Canada/Atlantic">
									Canada/Atlantic</option>
								<option value="Canada/Central">
									Canada/Central</option>

								<option value="Canada/Eastern">
									Canada/Eastern</option>
								<option value="Canada/Mountain">
									Canada/Mountain</option>
								<option value="Canada/Newfoundland">
									Canada/Newfoundland</option>
								<option value="Canada/Pacific">
									Canada/Pacific</option>


								<option value="Europe/Amsterdam">
									Europe/Amsterdam</option>
								<option value="Europe/Andorra">
									Europe/Andorra</option>
								<option value="Europe/Athens"> Europe/Athens</option>
								<option value="Europe/Belgrade">
									Europe/Belgrade</option>
								<option value="Europe/Berlin"> Europe/Berlin</option>
								<option value="Europe/Bratislava">
									Europe/Bratislava</option>
								<option value="Europe/Brussels">
									Europe/Brussels</option>
								<option value="Europe/Budapest">
									Europe/Budapest</option>
								<option value="Europe/Busingen">
									Europe/Busingen</option>
								<option value="Europe/Bucharest">
									Europe/Bucharest</option>
								<option value="Europe/Copenhagen">
									Europe/Copenhagen</option>
								<option value="Europe/Chisinau">
									Europe/Chisinau</option>
								<option value="Europe/Dublin"> Europe/Dublin</option>
								<option value="Europe/Guernsey">
									Europe/Guernsey</option>
								<option value="Europe/Gibraltar">
									Europe/Gibraltar</option>
								<option value="Europe/Helsinki">
									Europe/Helsinki</option>

								<option value="Europe/Isle_of_Man">
									Europe/Isle of Man</option>
								<option value="Europe/Istanbul">
									Europe/Istanbul</option>
								<option value="Europe/Jersey"> Europe/Jersey</option>
								<option value="Europe/Kaliningrad">
									Europe/Kaliningrad</option>
								<option value="Europe/Kiev"> Europe/Kiev</option>
								<option value="Europe/Lisbon"> Europe/Lisbon</option>
								<option value="Europe/London"> Europe/London</option>
								<option value="Europe/Ljubljana">
									Europe/Ljubljana</option>
								<option value="Europe/Luxembourg">
									Europe/Luxembourg</option>
								<option value="Europe/Madrid"> Europe/Madrid</option>
								<option value="Europe/Malta"> Europe/Malta</option>
								<option value="Europe/Monaco"> Europe/Monaco</option>
								<option value="Europe/Mariehamn">
									Europe/Mariehamn</option>
								<option value="Europe/Minsk"> Europe/Minsk</option>
								<option value="Europe/Moscow"> Europe/Moscow</option>
								<option value="Europe/Oslo"> Europe/Oslo</option>
								<option value="Europe/Paris"> Europe/Paris</option>
								<option value="Europe/Podgorica">
									Europe/Podgorica</option>
								<option value="Europe/Prague"> Europe/Prague</option>

								<option value="Europe/Rome"> Europe/Rome</option>
								<option value="Europe/Riga"> Europe/Riga</option>
								<option value="Europe/San_Marino"> Europe/San
									Marino</option>
								<option value="Europe/Sarajevo">
									Europe/Sarajevo</option>
								<option value="Europe/Skopje"> Europe/Skopje</option>
								<option value="Europe/Stockholm">
									Europe/Stockholm</option>
								<option value="Europe/Simferopol">
									Europe/Simferopol</option>
								<option value="Europe/Sofia"> Europe/Sofia</option>
								<option value="Europe/Samara"> Europe/Samara</option>

								<option value="Europe/Tirane"> Europe/Tirane</option>
								<option value="Europe/Tallinn">
									Europe/Tallinn</option>
								<option value="Europe/Uzhgorod">
									Europe/Uzhgorod</option>

								<option value="Europe/Vaduz"> Europe/Vaduz</option>
								<option value="Europe/Vatican">
									Europe/Vatican</option>
								<option value="Europe/Vienna"> Europe/Vienna</option>
								<option value="Europe/Vilnius">
									Europe/Vilnius</option>
								<option value="Europe/Volgograd">
									Europe/Volgograd</option>
								<option value="Europe/Warsaw"> Europe/Warsaw</option>
								<option value="Europe/Zaporozhye">
									Europe/Zaporozhye</option>
								<option value="Europe/Zagreb"> Europe/Zagreb</option>
								<option value="Europe/Zurich"> Europe/Zurich</option>
								<option value="Indian/Antananarivo">
									Indian/Antananarivo</option>
								<option value="Indian/Comoro"> Indian/Comoro</option>
								<option value="Indian/Chagos"> Indian/Chagos</option>
								<option value="Indian/Cocos"> Indian/Cocos</option>
								<option value="Indian/Christmas">
									Indian/Christmas</option>
								

								<option value="Indian/Kerguelen">
									Indian/Kerguelen</option>
								<option value="Indian/Mayotte">
									Indian/Mayotte</option>
								<option value="Indian/Mahe"> Indian/Mahe</option>
								<option value="Indian/Mauritius">
									Indian/Mauritius</option>
								<option value="Indian/Maldives">
									Indian/Maldives</option>
								<option value="Indian/Reunion">
									Indian/Reunion</option>


								<option value="Pacific/Auckland">
									Pacific/Auckland</option>
								<option value="Pacific/Apia"> Pacific/Apia</option>


								<option value="Pacific/Chuuk"> Pacific/Chuuk</option>
								<option value="Pacific/Chatham">
									Pacific/Chatham</option>
								<option value="Pacific/Easter">
									Pacific/Easter</option>
								<option value="Pacific/Efate"> Pacific/Efate</option>
								<option value="Pacific/Enderbury">
									Pacific/Enderbury</option>


								<option value="Pacific/Fiji"> Pacific/Fiji</option>
								<option value="Pacific/Funafuti">
									Pacific/Funafuti</option>
								<option value="Pacific/Fakaofo">
									Pacific/Fakaofo</option>

								<option value="Pacific/Galapagos">
									Pacific/Galapagos</option>
								<option value="Pacific/Gambier">
									Pacific/Gambier</option>
								<option value="Pacific/Guam"> Pacific/Guam</option>
								<option value="Pacific/Guadalcanal">
									Pacific/Guadalcanal</option>
								<option value="Pacific/Honolulu">
									Pacific/Honolulu</option>
								<option value="US/Hawaii"> US/Hawaii</option>
								<option value="Pacific/Johnston">
									Pacific/Johnston</option>
								<option value="Pacific/Kosrae">
									Pacific/Kosrae</option>
								<option value="Pacific/Kwajalein">
									Pacific/Kwajalein</option>
								<option value="Pacific/Kiritimati">
									Pacific/Kiritimati</option>




								<option value="Pacific/Marquesas">
									Pacific/Marquesas</option>
								<option value="Pacific/Midway">
									Pacific/Midway</option>
								<option value="Pacific/Majuro">
									Pacific/Majuro</option>
								<option value="Pacific/Niue"> Pacific/Niue</option>


								<option value="Pacific/Noumea">
									Pacific/Noumea</option>
								<option value="Pacific/Norfolk">
									Pacific/Norfolk</option>
								<option value="Pacific/Nauru"> Pacific/Nauru</option>

								<option value="Pacific/Pitcairn">
									Pacific/Pitcairn</option>
								<option value="Pacific/Pago_Pago">
									Pacific/Pago Pago</option>
								<option value="Pacific/Palau"> Pacific/Palau</option>
								<option value="Pacific/Port_Moresby">
									Pacific/Port Moresby</option>
								<option value="Pacific/Pohnpei">
									Pacific/Pohnpei</option>

								<option value="Pacific/Rarotonga">
									Pacific/Rarotonga</option>
								<option value="Pacific/Saipan">
									Pacific/Saipan</option>
								<option value="Pacific/Tahiti">
									Pacific/Tahiti</option>
								<option value="Pacific/Tarawa">
									Pacific/Tarawa</option>
								<option value="Pacific/Tongatapu">
									Pacific/Tongatapu</option>
								<option value="Pacific/Wake"> Pacific/Wake</option>
								<option value="Pacific/Wallis">
									Pacific/Wallis</option>
								<option value="US/Arizona"> US/Arizona</option>
								<option value="US/Pacific"> US/Pacific</option>
								<option value="US/Central"> US/Central</option>
								<option value="US/Alaska"> US/Alaska</option>
								<option value="US/Mountain"> US/Mountain</option>
								<option value="US/Eastern"> US/Eastern</option>


								<option value="GMT"> GMT</option>
								<option value="UTC"> UTC</option>

							</select>
						</div>
					</div>
            <div class="control-group" id="contact_report_day" style="display:none;">
				<label class="control-label">Day of Month</label>
				<div class="controls">
					<select name="activity_day" > 
                    <option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
					<option value="9">9</option>
					<option value="10">10</option>
					<option value="11">11</option>
					<option value="12">12</option>
					<option value="13">13</option>
					<option value="14">14</option>
					<option value="15">15</option>
					<option value="16">16</option>
					<option value="17">17</option>
					<option value="18">18</option>
					<option value="19">19</option>
					<option value="20">20</option>
					<option value="21">21</option>
					<option value="22">22</option>
					<option value="23">23</option>
					<option value="24">24</option>
					<option value="25">25</option>
					<option value="26">26</option>
					<option value="27">27</option>
					<option value="28">28</option>
					<option value="29">29</option>
					<option value="30">30</option>

				</select>
				</div>
			</div>
            <div class="control-group" id="contact_report_weekday" style="display:none;">
				<label class="control-label">Day</label>
				<div class="controls">
					<select name="activity_weekday"> 
						<option value="2">Monday</option>
					    <option value="3">Tuesday</option>
					    <option value="4">Wednesday</option>
						<option value="5">Thursday</option>
						<option value="6">Friday</option>
						<option value="7">Saturday</option>
                        <option value="1">Sunday</option>						
                   </select>
				</div>
			</div>	
			<div class="control-group" id="contact_report_time">
				<label class="control-label">Time</label>
				<div class="controls">
					 <input type="text" name="activity_time" class="report_time_timepicker input-small " id="activity_time"  placeholder="time" />
				</div>
			</div>	
			
			
			</div>			

			<input type="text" class="hide" name="report_type" value="Contact" /></input>
			{{#if id}} <input type="text" name="id" class="hide" value="{{id}}" />
			{{/if}}
			<div class="form-actions">
				<a href="#" type="submit" class="save btn btn-primary"
					id="filtersAdd">Save</a>
				 <a href="#contact-reports" class="btn ">Close</a>
			</div>
			</fieldset>
		</form>
	</div>
</div>
</script>

<Script id="custom-fields-options-template" type="text/html">

{{this.name}}
{{#each this}}
	<option value="custom_{{this.name}}">{{this.name}}</option>
{{/each}} 
</Script><script id="report-cohorts-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">                
             <div id="reportrange" class="pull-right" style="padding:4px 8px;box-shadow: 0 0px 2px rgba(0, 0, 0, .25), inset 0 -1px 0 rgba(0, 0, 0, .1);">
                <i class="icon-calendar icon-large"></i>
                <span id="range">{{date-range "today" "-180"}}</span>
              </div>
            <h1>Cohorts Reports</h1>
			<span id="reports-cohorts-tags"></span>
        </div>
    </div>
</div>

<div>	
	<!-- Growth Reports -->
	<div id="email-reports">	
		<div class="row"><div class="span12"><h2></h2></div>
			<div id="cohorts-chart" style="width:100%; height:500px;padding-top:50px;margin-left:25px;"></div>
		</div>
		<hr />
	</div>
	<!-- End of Growth Reports -->  

   </div>
</div>

</script><script id="report-funnel-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header" style="padding-bottom:40px!important">                
             <div id="reportrange" class="pull-right" style="padding:4px 8px;box-shadow: 0 0px 2px rgba(0, 0, 0, .25), inset 0 -1px 0 rgba(0, 0, 0, .1);">
                <i class="icon-calendar icon-large"></i>
                <span id="range">{{date-range "today" "-6"}}</span>
              </div>
		<div class='pull-right' style="padding:0px 8px 10px">
				<select name="frequency" id="frequency" class="required" style="width:100px">
					<option value="daily">Daily</option>
					<option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
			</div>
			<div class='pull-right' style="padding:0px 8px 10px">
				<select name="filter" id="filter" class="required">
					<option value="ALL">All</option>
                </select>
			</div>
		
            <h1>Funnel Reports</h1>

			<div class="ellipsis-multiline" style="padding-top: 5px;float: left;height:35px!important; width:40%!important;-webkit-line-clamp:2!important"> <span id="reports-funnel-tags"></span></div>
			<div id="plan-limit-error" class="pull-right" style="width:46%;display:none"></div>
		
    </div>
        </div>

</div>

<div>	
	<!-- Funnel Reports -->
	<div id="email-reports">	
		<div class="row"><div class="span12"><h2></h2></div>
			<div id="funnel-chart" style="width:100%; height:500px;padding-top:50px;margin-left:25px;"></div>
		</div>
		<hr />
	</div>
	<!-- End of Email Reports -->  

   </div>
</div>

</script><script id="report-growth-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header" style="padding-bottom:40px!important">                
             <div id="reportrange" class="pull-right" style="padding:4px 8px;box-shadow: 0 0px 2px rgba(0, 0, 0, .25), inset 0 -1px 0 rgba(0, 0, 0, .1);">
                <i class="icon-calendar icon-large"></i>
                <span id="range">{{date-range "today" "-6"}}</span>
              </div>
			<div class='pull-right' style="padding:0px 8px 10px">
				<select name="frequency" id="frequency" class="required" style="width:100px">
					<option value="daily">Daily</option>
					<option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
			</div>
			<div class='pull-right' style="padding:0px 8px 10px">
				<select name="filter" id="filter" class="required">
					<option value="ALL">All</option>
                </select>
			</div>
		
            <h1>Growth Reports</h1>

			<div class="ellipsis-multiline" style="padding-top: 5px;float: left;height:35px!important; width:40%!important;-webkit-line-clamp:2!important"> <span id="reports-growth-tags"></span></div>
			<div id="plan-limit-error" class="pull-right" style="width:46%;display:none"></div>
		
    </div>
        </div>

</div>

<div>	
	<!-- Growth Reports -->
	<div id="email-reports">	
		<div class="row"><div class="span12"><h2></h2></div>
			<div id="growth-chart" style="width:100%; height:500px;padding-top:50px;margin-left:25px;"></div>
		</div>
		<hr />
	</div>
	<!-- End of Growth Reports -->  

   </div>
</div>

</script><script id="report-ratio-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header" style="padding-bottom:40px!important">          
             <div id="reportrange" class="pull-right" style="padding:4px 8px;box-shadow: 0 0px 2px rgba(0, 0, 0, .25), inset 0 -1px 0 rgba(0, 0, 0, .1);">
                <i class="icon-calendar icon-large"></i>
                <span id="range">{{date-range "today" "-6"}}</span>
              </div>
			<div class='pull-right' style="padding:0px 8px 10px">
				<select name="frequency" id="frequency" class="required" style="width:100px">
					<option value="daily">Daily</option>
					<option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
			</div>
			<div class='pull-right' style="padding:0px 8px 10px">
				<select name="filter" id="filter" class="required">
					<option value="ALL">All</option>
                </select>
			</div>
            	<h1>Ratio Reports<small> - <span id="reports-ratio-tags"></span></small></h1>
				<div id="plan-limit-error" class="span12" style="float: right;padding-top: 20px;width: 0px;display:none"></div>
    </div>
        </div>

</div>

<div>	
	<!-- Growth Reports -->
	<div id="email-reports">	
		<div class="row"><div class="span12"><h2></h2></div>
			<div id="ratio-chart" style="width:100%; height:500px;padding-top:50px;margin-left:25px;"></div>
		</div>
		<hr />
	</div>
	<!-- End of Growth Reports -->  

   </div>
</div>

</script><script id="report-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Email Reports</h1>
            <a href="#report-add" class="btn right" id="addReport" style="top:-28px;position:relative"><span><i class="icon-plus-sign" /></span>  Add Report</a>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
		 <div id="slate">
         </div>
        {{#if this.length}}
        <table class="table table-bordered table-striped showCheckboxes" url="core/api/reports/bulk">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Duration</th>
					<th>Fields</th>
                </tr>
            </thead>
            <tbody id="report-model-list" route="report-edit/">
            </tbody>
        </table>
		{{/if}}
    </div>
    <div class="span3">
        <div class="well" id="addview">
            <h3>
                What are Email Reports?
            </h3>
            <br />
            <p>Customize your reports based on a variety of tags and filters and receive them periodically to constantly be in touch with your sales cycle and pipeline. Use the information to improve lead nurturing and customer retention strategies.
</p>
        </div>
    </div>
</div>
</script>

<script id="report-model-template" type="text/html">
	<td data="{{id}}" class="data" style="cursor:pointer"><a>{{name}}</a></td>
	<td>
    	{{ucfirst duration}}
	</td>
	<td><div style="width:17em;text-transform:capitalize;">{{#field_Element fields_set}}{{/field_Element}}</div></td>
	<td>
		<a href="#report-results/{{id}}" data={{id}} id="report-instant-results">Show Results</a> 			
	</td>
	<td>
	 	<a  data={{id}} id="reports-email-now" >Send Now</a>
	</td>
<br />
</script>


<script type="text/html" id="report-categories-template">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h2>Email</h2>
        </div>
	</div>
</div>

<div id="general" class="row-fluid">
<div class="span11">
<!-- Contact reports -->
<div class="span4" style="margin-left:0px;">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-user icon-4x"></i>
            </div>
            <b>Contact Reports</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;text-align:left"  rel="tooltip" title="{{description}}">
            Get periodic email reports with a list of new leads, conversions, or as per your custom criteria.
        </div>
        <!-- Add button -->
        <div class="text-left" style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary" href="#contact-reports">Go</a>
        </div>
    </div>
</div>


<!-- Activity reports -->

{{#hasMenuScope 'ACTIVITY'}}
<div class="span4" style="margin-left:0px;">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-cogs icon-4x"></i>
            </div>
            <b>Activity Reports</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;text-align:left"  rel="tooltip" title="{{description}}">
          	Get a periodic  email digest of various activities by users in Agile.
        </div>
        <!-- Add button -->
       
			{{#isAllowedInCurrentPlan "is_activity_reports_enabled"}}		
			{{#hasMenuScope 'ACTIVITY'}}
 <div class="text-left" style="/*margin: 40px auto;	width: 50%;*/ display:inline;" class="left">
            	<a class="btn btn-primary" href="#activity-reports">Go</a>
</div>
			{{else}}

			{{/hasMenuScope}}
			{{else}}
				<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
					<div class="btn btn-primary disabled" >Go</div>
				</div>
				 <div style="display:inline;float:right; max-width:135px" class="text-right" ><p><i>{{toSafeString message}}</i><p></div>
			{{/isAllowedInCurrentPlan}}
        
    </div>
</div>
{{/hasMenuScope}}
</div>
</div>

<div class="row">
    <div class="span12">
        <div class="page-header">
            <h2>Graphs</h2>
        </div>
	</div>
</div>

<div id="general" class="row-fluid">
<div class="span11">
<!-- Growth reports -->

<div class="span4" style="margin-left:0px;">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-bar-chart icon-4x"></i>
            </div>
            <b>Growth Graphs</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;text-align:left"  rel="tooltip" title="{{description}}">
          Visually see how your leads are growing over time. Compare various channels and gain insight.
        </div>
        <!-- Add button -->
        <div class="text-left" style="/*margin: 40px auto;	width: 50%;*/">
            		<a class="btn btn-primary" href="#report-charts/growth">Go</a>
        </div>
    </div>
</div>


<!-- Funnel reports -->
<div class="span4" style="margin-left:0px;">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-filter icon-4x"></i>
            </div>
            <b>Funnel Graphs</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;text-align:left"  rel="tooltip" title="{{description}}">
          See a funnel graph of how leads are passing through various stages in your sales cycle.
        </div>
        <!-- Add button -->
        <div class="text-left" style="/*margin: 40px auto;	width: 50%;*/">
			<a class="btn btn-primary"  href="#report-charts/funnel">Go</a>
        </div>
    </div>
</div>

<!-- cohorts reports -->
<div class="span4" style="margin-left:0px;">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-group icon-4x"></i>
            </div>
            <b>Cohorts Reports</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;text-align:left"  rel="tooltip" title="{{description}}">
            See what percentage of leads are you converting over time.
        </div>
        <!-- Add button -->
        <div class="text-left" style="/*margin: 40px auto;	width: 50%;*/">
			<a class="btn btn-primary"  href="#report-charts/cohorts">Go</a>
        </div>
    </div>
</div>
</div>
</div>


<div class="row">
    <div class="span12">
        <div class="page-header">
            <h2>Campaigns</h2>
        </div>
	</div>
</div>

<div id="general" class="row-fluid">
<div class="span11">


<!-- Performance Stats -->

<div class="span4" style="margin-left:0px;">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-dashboard icon-4x"></i>
            </div>
            <b>Campaign Stats</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;text-align:left"  rel="tooltip" title="{{description}}">
          	Find out how a campaign is performing over a time period.
        </div>

		
        <!-- Add button -->
        <div class="text-left" style="/*margin: 40px auto;	width: 50%;*/">
			
           		<a id="campaign_id" class="btn btn-primary" href="#">Go</a>
			
        </div>
    </div>
</div>

<!-- Comparison -->
<div class="span4" style="margin-left:0px;">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-bar-chart icon-4x"></i>
            </div>
            <b>Compare Campaigns</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;text-align:left"  rel="tooltip" title="{{description}}">
            See how your campaigns fare against each other.
        </div>
		
        <!-- Add button -->
        <div class="text-left" style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary" href="#campaign-stats" id="campaign-stats">Go</a>
        </div>
    </div>
</div>
</div>
</div>

{{#hasMenuScope 'ACTIVITY'}}
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h2>Activities</h2>
        </div>
	</div>
</div>

<div id="general" class="row-fluid">
<div class="span11">



<!-- User Activities -->

<div class="span4" style="margin-left:0px;">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-cogs icon-4x"></i>
            </div>
            <b>User Activities</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;text-align:left"  rel="tooltip" title="{{description}}">
          	See a chronological activity report of your CRM users.
        </div>
        <!-- Add button -->
        <div class="text-left" style="/*margin: 40px auto;	width: 50%;*/">
            

<div>
			{{#isAllowedInCurrentPlan "is_email_gateway_allowed"}}
				<a class="btn btn-primary" href="#activities">Go</a>
			{{else}}
				<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
					<a class="btn btn-primary _upgrade" id="activities-upgrade">Go</a> 
				</div>
				<div style="float: right; max-width: 135px; display: none;" class="text-right activities-upgrade"><p><i> {{toSafeString message}} </i></p></div>
	
			{{/isAllowedInCurrentPlan}}
</div>
        </div>
    </div>
</div>

<!-- Contact Activities -->

<!-- <div class="span4" style="margin-left:0px;">
    <div class="well" style="width:220px; height:200px; text-align: center;"> -->
        <!-- Icon and Title -->
       <!-- <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-cogs icon-4x"></i>
            </div>
            <b>Contact Activities</b>
        </div>
        <br />-->
        <!-- Description -->
       <!-- <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;text-align:left"  rel="tooltip">
          	See a chronological contact activity report of your CRM contacts.
        </div>-->
        <!-- Add button -->
        <!--<div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary" href="#contact-activities">Go</a>
        </div>-->
   <!-- </div>
</div>-->



</div>
</div>

{{/hasMenuScope}}
</script>
