<script id="filter-contacts-template" type="text/html">
<div class="bg-light lter b-b wrapper-md">
 {{#if id}} 
                        <h3  class="formheading h3 font-thin m-n"> Edit Contact Filter<span
						style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px;" rel="popover"
							data-placement="bottom"
							data-content="Use filters to sort contacts with a specific criteria to find patterns. You can save your preferred filters and also have daily, weekly or monthly reports sent to you based on the filter."
							id="element" data-trigger="hover">
					</span></h3>
                        {{else}}
                        <h3 class="formheading h3 font-thin m-n"><i class="icon-plus-sign"></i> Add Contact Filter<span
						style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px;" rel="popover"
							data-placement="bottom"
							data-content="Use filters to sort contacts with a specific criteria to find patterns. You can save your preferred filters and also have daily, weekly or monthly reports sent to you based on the filter."
							id="element" data-trigger="hover">
					</span>
				</h3>
                        {{/if}}
				


</div>
<div class="wrapper-md">
<div class="row">
<div class="col-md-12">
	
		<form id="filterContactForm" class="form-horizontal">
			<div name="rules" class="formsection chainedSelect">
					
				<fieldset>
					<div class="control-group form-group">
						<label class="control-label col-sm-2">Name<span class="field_req">*</span></label>
						<div class="controls col-sm-8">
							<input type="text" name="name" class="required form-control" />
						</div>
					</div>
					<div class="control-group form-group">
						<label class="control-label col-sm-2">Type<span class="field_req">*</span></label>
						<div class="controls col-sm-8">
							<div id="contact_type_filter" name="contact_type_filter">
								<select name="contact_type" id="contact_type" class="form-control">
									<option value="PERSON">Contact</option>
									<option value="COMPANY">Company</option>
								</select>
							</div>
						</div>
					</div>
					<div class="control-group form-group" id="filter-settings">
						<label class="control-label col-sm-2">Condition</label>
						<div class="controls col-sm-8">
							<div id="contacts-filter-wrapper" style='{{#isContactType contact_type "PERSON"}}
						display:block
					{{else}}
						display:none
					{{/isContactType}}'>
							<div>Meet <i>All </i> of the following conditions</div>
							<table class="bg-transparent m-b-xs chained-table contact and_rules">
								<tbody>
									<tr valign="top" class="chained controls hide" name="rules">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required form-control"
													value="Contact"/>
											</div>
										</td>
										<td class="lhs-block">
											<div id="LHS" name="LHS">
												<select name="temp" class="lhs form-control" id="LHS">
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
														<option value="last_name">Last Name</option>
														<option value="email">Email Address</option>
														<option value="company">Company</option>
														<option value="title">Job Title</option>
														<option value="phone">Phone Number</option>
														<option value="lead_score">Score</option>
														<option value="owner_id">Owner</option>
														<option value="address">Address</option>
													</optgroup>
													<optgroup label="Activities">
														<option value="campaign_status">Campaign Status</option>
													</optgroup>
													 <optgroup label="Custom Fields" id="custom-fields" class="hide">
													</optgroup>
												</select>
											</div>
										</td>
										<td class="codition-block">
											<div id="condition" name="CONDITION">
												<select name="temp" class="form-control">
													<option value="EQUALS"
														class="first_name last_name phone company title org_tag jobtitle email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
													<option value="EQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">is</option>
													<option value="NOTEQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">isn't</option>
													<option value="NOTEQUALS"
														class="first_name last_name company owner org_tag title email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
													<option value="EQUALS" class="tags tags_time">is</option>
													<option value="NOTEQUALS" class="tags">isn't</option>
													<option value="EQUALS" class="lead_score">equals</option>
													<option value="BETWEEN_NUMBER" class="lead_score">between</option>
													<option value="IS_GREATER_THAN" class="lead_score">greater than</option>
													<option value="IS_LESS_THAN" class="lead_score">less than</option>
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
													<option value="NOT_ADDED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Never Added</option>
													<option value="ACTIVE" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Active</option>
													<option value="DONE" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Completed</option>
													<option value="REMOVED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Removed</option>
													<option value="BOUNCED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Bounced</option>
													<option value="UNSUBSCRIBED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Unsubscribed</option>
													<option value="SPAM_REPORTED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Reported Spam</option>
												</select>
											</div>
										</td>
										<td class="rhs-block  controls v-top">
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp"
													class="LAST NEXT required form-control" placeholder="Number of days"/>
												<input type="text" name="temp" 
													class="EQUALS NOTEQUALS ANYOF CONTAINS NOT_CONTAINS required form-control"/>
												<input type="text" name="temp" 
													class="MATCHES form-control  required"/>
												<input type="text" name="temp"
													class="IS_GREATER_THAN IS_LESS_THAN number form-control required"/> 
                                                <input type="text" name="tag" 
													class="tags tags_time required form-control m-n" /> 
                                                <input type="text" name="temp" class="email required form-control"/>
												<input type="text" name="temp" 
													class="BETWEEN_NUMBER number required form-control"/>
												<input id="updated_date" type="text" name="updated_date"
													class="ON AFTER BEFORE BETWEEN input required date form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="rhs-new-block controls v-top">
											<div id="RHS-NEW" name="RHS_NEW">
												<input type="text" name="temp"
													class="BETWEEN_NUMBER number required form-control"/>
												<input id="date_between" type="text" name="temp" data-date-format="mm/dd/yyyy"
													class="BETWEEN input date required form-control" placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="nested-condition-block v-top" >
											<div id="nested_condition" name="nested_condition">
												<select name="temp" class="form-control">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is after</option>
													<option value="BEFORE" class="tags_time">is before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="LAST" class="tags_time">in last</option>
												</select>
											</div>
										</td>
										<td class="controls v-top" >
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required form-control" placeholder="Number of days" /> 
												<input
													id="date_between" type="text" 
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="controls v-top" >
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp"
													style="width: 92%;" class="BETWEEN input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy" />
											</div>
										</td>
									<td>
									<div class="m-l-sm">
										<i
											class="filter-contacts-multiple-remove icon-remove-circle c-p"
											></i></div></td>
									</tr>
								
								</tbody>
							</table>
								<a href="#" class="filter-contacts-multiple-add text-l-none m-t-xs text-info"><i class="icon-plus"></i> Add condition</a>
							<br/><br/><small>and</small><br/>
							<div>Meet  <i> Any </i> of the following conditions</div>
							<table class="bg-transparent m-b-xs chained-table contact or_rules">
								<tbody>
									<tr valign="top" class="chained controls hide" name="or_rules">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required form-control"
													value="Contact"/>
											</div>
										</td>
										<td class="lhs-block">
											<div id="LHS" name="LHS">
												<select name="temp" class="lhs form-control" id="LHS" >
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
														<option value="last_name">Last Name</option>
														<option value="email">Email Address</option>
														<option value="company">Company</option>
														<option value="title">Job Title</option>
														<option value="phone">Phone Number</option>
														<option value="lead_score">Score</option>
														<option value="owner_id">Owner</option>
														<option value="address">Address</option>
													</optgroup>
													<optgroup label="Activities">
														<option value="campaign_status">Campaign Status</option>
													</optgroup>
													 <optgroup label="Custom Fields" id="custom-fields" class="hide">
													</optgroup>
												</select>
											</div>
										</td>
										<td class="codition-block">
											<div id="condition" name="CONDITION">
												<select name="temp" class="w-full form-control">
													<option value="EQUALS"
														class="first_name last_name phone company title org_tag jobtitle email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
													<option value="EQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">is</option>
													<option value="NOTEQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">isn't</option>
													<option value="NOTEQUALS"
														class="first_name last_name company owner org_tag title email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
													<option value="EQUALS" class="tags tags_time">is</option>
													<option value="NOTEQUALS" class="tags">isn't</option>
													<option value="BETWEEN_NUMBER" class="lead_score">between</option>
													<option value="IS_GREATER_THAN" class="lead_score">greater than</option>
													<option value="IS_LESS_THAN" class="lead_score">less than</option>
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
													<option value="NOT_ADDED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Never Added</option>
													<option value="ACTIVE" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Active</option>
													<option value="DONE" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Completed</option>
													<option value="REMOVED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Removed</option>
													<option value="BOUNCED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Bounced</option>
													<option value="UNSUBSCRIBED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Unsubscribed</option>
													<option value="SPAM_REPORTED" class="campaign_status" related="RHS" url="core/api/workflows" parse_key="id" parse_value="name">Reported Spam</option>
												</select>
											</div>
										</td>
										<td class="rhs-block v-top controls">
											<div id="RHS" class="rhs" name="RHS">

												<input type="text" name="temp"
													class="LAST NEXT required form-control" placeholder="Number of days"/>
												<input type="text" name="temp"
													class="EQUALS NOTEQUALS ANYOF CONTAINS NOT_CONTAINS required form-control"/>
												 
												<input type="text" name="temp" 
													class="MATCHES required form-control"/>
												<input type="text" name="temp"
													class="IS_GREATER_THAN IS_LESS_THAN number required form-control"/> 
													
                                                <input type="text" name="tag" 
													class="tags tags_time required form-control" /> 
                                                <input type="text" name="temp" class="email required form-control"/>
												<input type="text" name="temp"
													class="BETWEEN_NUMBER number required form-control"/>
												<input id="updated_date" type="text" name="updated_date" style="text-overflow:none; "
													class="ON AFTER BEFORE BETWEEN input required date form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="rhs-new-block controls v-top">
											<div id="RHS-NEW" name="RHS_NEW">
												<input id="date_between" type="text" name="temp" data-date-format="mm/dd/yyyy"
													class="BETWEEN input date required form-control"  placeholder="MM/DD/YY" />
												<input type="text" name="temp"
													class="BETWEEN_NUMBER number required form-control"/>
											</div>
										</td>
										<td class="nested-condition-block v-top" >
											<div id="nested_condition" name="nested_condition">
												<select name="temp" class="form-control w-full">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is after</option>
													<option value="BEFORE" class="tags_time">is before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="LAST" class="tags_time">in last</option>
											</div>
										</td>
										<td class="controls v-top">
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required form-control" placeholder="Number of days" /> 
												<input
													id="date_between" type="text" 
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="controls v-top">
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp"  class="BETWEEN input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy" />
											</div>
										</td>
									<td>
									<div  class="m-l-sm">
										<i
											class="filter-contacts-multiple-remove icon-remove-circle c-p"
											></i></div></td>
									</tr>
								
								</tbody>
							</table>
								<a href="#" class="filter-contacts-multiple-add-or-rules text-l-none m-t-xs text-info"><i class="icon-plus"></i> Add condition</a>
							</div>

							<div id="companies-filter-wrapper" style='{{#isContactType contact_type "PERSON"}}
						display:none;
					{{else}}
						display:block;
					{{/isContactType}}'>
							<div>Meet <i>All </i> of the following conditions</div>
							<table class="chained-table company and_rules m-b-xs bg-transparent">
								<tbody>
									<tr valign="top" class="chained controls hide" name="rules">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required form-control"
													value="Contact"/>
											</div>
										</td>
										<td class="lhs-block">
											<div id="LHS" name="LHS">
												<select name="temp" class="lhs form-control" id="LHS">
													<optgroup label="Date">
														<option value="created_time">Created</option>
														<option value="updated_time">Updated</option>
													</optgroup>
 													<optgroup label="Properties">
														<option value="email">Email Address</option>
														<option value="owner_id">Owner</option>
														<option value="name">Name</option>
														<option value="url">Url</option>
													</optgroup>
												
													 <optgroup label="Custom Fields" id="custom-fields" class="hide">
													</optgroup>
												</select>
											</div>
										</td>
										<td class="codition-block">
											<div id="condition" name="CONDITION">
												<select name="temp"  class="w-full form-control">
													<option value="EQUALS"
														class="name phone company title org_tag jobtitle email url phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
													<option value="EQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">is</option>
													<option value="NOTEQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">isn't</option>
													<option value="NOTEQUALS"
														class="name company owner org_tag title email url phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
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
												</select>
											</div>
										</td>
										<td class="rhs-block  controls v-top">
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp" 
													class="LAST NEXT required form-control" placeholder="Number of days"/>
												<input type="text" name="temp" 
													class="EQUALS NOTEQUALS ANYOF required form-control"/>
												 
												<input type="text" name="temp" 
													class="MATCHES  required form-control"/>
												<input type="text" name="temp"
													class="IS_GREATER_THAN IS_LESS_THAN number required form-control"/> 
													
                                                <input type="text" name="tag" 
													class="tags tags_time required form-control m-n" /> 
                                                <input type="text" name="temp" class="email required form-control"/>
												<input id="updated_date" type="text" name="updated_date" 
													class="ON AFTER BEFORE BETWEEN input required date form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="rhs-new-block controls v-top" >
											<div id="RHS-NEW" name="RHS_NEW">
												<input id="date_between" type="text" name="temp" data-date-format="mm/dd/yyyy"
													class="BETWEEN input date required form-control"  placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="nested-condition-block v-top">
											<div id="nested_condition" name="nested_condition">
												<select name="temp" class="form-control w-full">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is after</option>
													<option value="BEFORE" class="tags_time">is before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="LAST" class="tags_time">in last</option>
											</div>
										</td>
										<td class="controls v-top" >
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required form-control" placeholder="Number of days" /> 
												<input
													id="date_between" type="text"
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="controls v-top" >
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp" class="BETWEEN input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy" />
											</div>
										</td>
									<td>
									<div class="m-l-sm">
										<i
											class="filter-contacts-multiple-remove icon-remove-circle c-p"
											></i></div></td>
									</tr>
								
								</tbody>
							</table>
						<a href="#" class="filter-companies-multiple-add text-l-none m-t-xs text-info"><i class="icon-plus"></i> Add condition</a>
							<br/><br/><small>and</small><br/>
							<div>Meet  <i> Any </i> of the following conditions</div>
							<table class="bg-transparent m-b-xs chained-table company or_rules">
								<tbody>
									<tr valign="top" class="chained controls hide" name="or_rules">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required form-control"
													value="Contact"/>
											</div>
										</td>
										<td class="lhs-block">
											<div id="LHS" name="LHS">
												<select name="temp" class="lhs form-control" id="LHS">
													<optgroup label="Date">
														<option value="created_time">Created</option>
														<option value="updated_time">Updated</option>
													</optgroup>
 													<optgroup label="Properties">
														<option value="email">Email Address</option>
														<option value="owner_id">Owner</option>
														<option value="name">Name</option>
														<option value="url">Url</option>
													</optgroup>
												
													 <optgroup label="Custom Fields" id="custom-fields" class="hide">
													</optgroup>
												</select>
											</div>
										</td>
										<td class="codition-block">
											<div id="condition" name="CONDITION">
												<select name="temp" class="form-control">
													<option value="EQUALS"
														class="name phone company title org_tag jobtitle email url phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
													<option value="EQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">is</option>
													<option value="NOTEQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">isn't</option>
													<option value="NOTEQUALS"
														class="name company owner org_tag title email url phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
													<option value="EQUALS" class="tags tags_time">is</option>
													<option value="NOTEQUALS" class="tags">isn't</option>

													<option value="IS_GREATER_THAN" class="lead_score">greater than</option>
													<option value="IS_LESS_THAN" class="lead_score">less than</option>
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
												</select>
											</div>
										</td>
										<td class="rhs-block v-top controls">
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp" 
													class="LAST NEXT required form-control" placeholder="Number of days"/>
												<input type="text" name="temp" 
													class="EQUALS NOTEQUALS ANYOF required form-control"/>
												 
												<input type="text" name="temp" 
													class="MATCHES NOT_CONTAINS form-control required"/>
												<input type="text" name="temp" 
													class="IS_GREATER_THAN IS_LESS_THAN number required form-control"/> 
													
                                                <input type="text" name="tag" 
													class="tags tags_time required m-n form-control" /> 
                                                <input type="text" name="temp" class="email required form-control"/>
												<input id="updated_date" type="text" name="updated_date"
													class="ON AFTER BEFORE BETWEEN input required date form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="rhs-new-block controls v-top">
											<div id="RHS-NEW" name="RHS_NEW">
												<input id="date_between" type="text" name="temp" data-date-format="mm/dd/yyyy"
													class="BETWEEN input date required form-control"  placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="nested-condition-block v-top">
											<div id="nested_condition" name="nested_condition">
												<select name="temp" class="w-full form-control">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is after</option>
													<option value="BEFORE" class="tags_time">is before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="LAST" class="tags_time">in last</option>
											</div>
										</td>
										<td class="controls v-top">
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required form-control" placeholder="Number of days" /> 
												<input
													id="date_between" type="text" 
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="controls v-top">
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp" class="BETWEEN input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy" />
											</div>
										</td>
									<td>
									<div style="margin-left:10px">
										<i
											class="filter-contacts-multiple-remove icon-remove-circle c-p"></i></div></td>
									</tr>
								
								</tbody>
							</table>
						<a href="#" class="filter-companies-multiple-add-or-rules text-l-none m-t-xs text-info"><i class="icon-plus"></i> Add condition</a>
						</div>
						</div>
					</div>
			</div>

			{{#if id}} <input type="text" name="id" class="hide form-control" value={{id}}>
			{{/if}}
<div class="line line-lg b-b"></div>
<div class="row">
			<div class="form-actions col-sm-offset-2 col-sm-10">
				<a href="#contact-filters" class="btn btn-sm btn-danger">Close</a>
				<a href="#" type="submit" class="save btn btn-sm btn-primary" id="filtersAdd">Save</a> 
			</div>
</div>
			</fieldset>
		</form>
	
</div>
</div>
</div>
</script><script id="contact-filter-collection-template" type="text/html">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-md-12">
        
            <h3 class="pull-left font-thin h3">Filters</h3>
            <a href="#contact-filter-add" class="btn btn-sm btn-default right" id="addFilter"><span><i class='icon-plus-sign'/></span>  Add Filter</a>
            <div class="clearfix"></div>
           
        </div>
</div>
</div>
<div class="wrapper-md">
<div class="row">
    <div class="col-md-9"> 
		<div id="slate">
         </div>
        {{#if this.length}}
<div class="table-responsive">
        <table class="table table-bordered showCheckboxes agile-table panel" url="core/api/filters/bulk" id="contact-filter-list">  
            <thead>
                <tr>   
                    <th style="width:50%">Name</th>
                    <th style="width:50%"></th>
                </tr>
            </thead>
            <tbody id='contact-filter-model-list' route='contact-filter-edit/'>
            </tbody>
        </table>
</div>
		{{/if}}
    </div>
    <div class='col-md-3'>
        <div class="wrapper" id='addview'>
             <h4 class="m-t-none m-b-sm">
              What are Filters?
             </h4>
            <p>Filters are used to sort contacts with a specific criteria to find patterns. You can save your preferred filters and also have daily, weekly or monthly reports sent to you based on the filter</p>
        </div>
    </div>
</div>
</div>
</script>

<script id="contact-filter-model-template" type="text/html">
	<td data='{{id}}' class='data c-p'>
  <div>
    {{name}} 
  </div>
</td>
<td> 
  {{#if created_time}}
      <div>
         Created <i class="fa fa-clock-o m-r-xs text-muted"></i><time class="created_time time-ago border-highlight text-muted" value="{{created_time}}" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy" created_time}}</time> by {{filterOwner.name}}
      </div>
  {{/if}}
</td>
</script>