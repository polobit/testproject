<script id="filter-contacts-template" type="text/html">
<div class="span12">
	<div class="well">
		<form id="filterContactForm" class="form-horizontal">
			<div name="rules" class="formsection chainedSelect">
					 {{#if id}} 
                        <legend class="formheading"> Edit Contact Filter<span
						style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px; vertical-align: text-top" rel="popover"
							data-placement="bottom"
							data-content="Use filters to sort contacts with a specific criteria to find patterns. You can save your preferred filters and also have daily, weekly or monthly reports sent to you based on the filter."
							id="element" data-trigger="hover">
					</span></legend>
                        {{else}}
                        <legend class="formheading"><i class="icon-plus-sign"></i> Add Contact Filter<span
						style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px; vertical-align: text-top" rel="popover"
							data-placement="bottom"
							data-content="Use filters to sort contacts with a specific criteria to find patterns. You can save your preferred filters and also have daily, weekly or monthly reports sent to you based on the filter."
							id="element" data-trigger="hover">
					</span>
				</legend>
                        {{/if}}
				</legend>
				<fieldset>
					<div class="control-group">
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="required" />
						</div>
					</div>
					<div class="control-group">
						<label class="control-label">Type<span class="field_req">*</span></label>
						<div class="controls">
							<div id="contact_type_filter" name="contact_type_filter">
								<select name="contact_type" id="contact_type" >
									<option value="PERSON">Contact</option>
									<option value="COMPANY">Company</option>
								</select>
							</div>
						</div>
					</div>

					<div class="control-group" id="filter-settings">
						<label class="control-label">Condition</label>
						<div class="controls">
							<div id="contacts-filter-wrapper" style='{{#isContactType contact_type "PERSON"}}
						display:block
					{{else}}
						display:none
					{{/isContactType}}'>
							<div>Meet <i>All </i> of the following conditions</div>
							<table style="background-color: transparent;margin-bottom:5px" class="chained-table contact and_rules">
								<tbody>
									<tr valign="top" class="chained controls hide" name="rules" style="padding-left:100px; ">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required"
													value="Contact"/>
											</div>
										</td>
										<td class="lhs-block span2">
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
										<td class="codition-block span2">
											<div id="condition" name="CONDITION">
												<select name="temp" style="width: 100%;">
													<option value="EQUALS"
														class="first_name phone company title org_tag jobtitle email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
													<option value="EQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">is</option>
													<option value="NOTEQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">isn't</option>
													<option value="NOTEQUALS"
														class="first_name company owner org_tag title email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
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
										<td class="rhs-block span2 controls" style="vertical-align:top; " >
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp" style="width:92%"
													class="LAST NEXT required" placeholder="Number of days"/>
												<input type="text" name="temp" style="width:92%"
													class="EQUALS NOTEQUALS ANYOF CONTAINS NOT_CONTAINS required"/>
												 
												<input type="text" name="temp" 
													class="MATCHES  required"/>
												<input type="text" name="temp" style="width:92%"
													class="IS_GREATER_THAN IS_LESS_THAN number required"/> 
													
                                                <input type="text" name="tag" 
													class="tags tags_time required"
													style="margin: 0px;width:92%" /> 
                                                <input type="text" name="temp" class="email required" style="width:92%"/>
												<input type="text" name="temp" style="width:92%"
													class="BETWEEN_NUMBER number required"/>
												<input id="updated_date" type="text" name="updated_date" style="width:92%; text-overflow:none; "
													class="ON AFTER BEFORE BETWEEN input required date"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="rhs-new-block controls span2" style="vertical-align:top; " >
											<div id="RHS-NEW" name="RHS_NEW">
												<input type="text" name="temp" style="width:92%"
													class="BETWEEN_NUMBER number required"/>
												<input id="date_between" type="text" name="temp" data-date-format="mm/dd/yyyy"
													class="BETWEEN input date required" style="width: 92%" placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="nested-condition-block span2" style="vertical-align:top; " >
											<div id="nested_condition" name="nested_condition">
												<select name="temp"  style="width: 100%;">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is after</option>
													<option value="BEFORE" class="tags_time">is before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="LAST" class="tags_time">in last</option>
												</select>
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; " >
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required"
													style="width: 92%;" placeholder="Number of days" /> 
												<input
													id="date_between" type="text" style="width: 92%"
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; " >
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp"
													style="width: 92%;" class="BETWEEN input date required"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy" />
											</div>
										</td>
									<td>
									<div style="margin-left:10px">
										<i
											class="filter-contacts-multiple-remove icon-remove-circle"
											style="cursor:pointer;"></i></div></td>
									</tr>
								
								</tbody>
							</table>
								<a href="#" class="filter-contacts-multiple-add" style="text-decoration:none;margin-top:5px"><i class="icon-plus"></i> Add condition</a>
							<br/><br/><small>and</small><br/>
							<div>Meet  <i> Any </i> of the following conditions</div>
							<table style="background-color: transparent;margin-bottom:5px" class="chained-table contact or_rules">
								<tbody>
									<tr valign="top" class="chained controls hide" name="or_rules" style="padding-left:100px; ">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required"
													value="Contact"/>
											</div>
										</td>
										<td class="lhs-block span2">
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
										<td class="codition-block span2">
											<div id="condition" name="CONDITION">
												<select name="temp" style="width: 100%;">
													<option value="EQUALS"
														class="first_name phone company title org_tag jobtitle email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
													<option value="EQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">is</option>
													<option value="NOTEQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">isn't</option>
													<option value="NOTEQUALS"
														class="first_name company owner org_tag title email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
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
										<td class="rhs-block span2 controls" style="vertical-align:top; " >
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp" style="width:92%"
													class="LAST NEXT required" placeholder="Number of days"/>
												<input type="text" name="temp" style="width:92%"
													class="EQUALS NOTEQUALS ANYOF CONTAINS NOT_CONTAINS required"/>
												 
												<input type="text" name="temp" 
													class="MATCHES required"/>
												<input type="text" name="temp" style="width:92%"
													class="IS_GREATER_THAN IS_LESS_THAN number required"/> 
													
                                                <input type="text" name="tag" 
													class="tags tags_time required"
													style="margin: 0px;width:92%" /> 
                                                <input type="text" name="temp" class="email required" style="width:92%"/>
												<input type="text" name="temp" style="width:92%"
													class="BETWEEN_NUMBER number required"/>
												<input id="updated_date" type="text" name="updated_date" style="width:92%; text-overflow:none; "
													class="ON AFTER BEFORE BETWEEN input required date"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="rhs-new-block controls span2" style="vertical-align:top; " >
											<div id="RHS-NEW" name="RHS_NEW">
												<input id="date_between" type="text" name="temp" data-date-format="mm/dd/yyyy"
													class="BETWEEN input date required" style="width: 92%" placeholder="MM/DD/YY" />
												<input type="text" name="temp" style="width:92%"
													class="BETWEEN_NUMBER number required"/>
											</div>
										</td>
										<td class="nested-condition-block span2" style="vertical-align:top; " >
											<div id="nested_condition" name="nested_condition">
												<select name="temp"  style="width: 100%;">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is after</option>
													<option value="BEFORE" class="tags_time">is before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="LAST" class="tags_time">in last</option>
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; " >
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required"
													style="width: 92%;" placeholder="Number of days" /> 
												<input
													id="date_between" type="text" style="width: 92%"
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; " >
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp"
													style="width: 92%;" class="BETWEEN input date required"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy" />
											</div>
										</td>
									<td>
									<div style="margin-left:10px">
										<i
											class="filter-contacts-multiple-remove icon-remove-circle"
											style="cursor:pointer;"></i></div></td>
									</tr>
								
								</tbody>
							</table>
								<a href="#" class="filter-contacts-multiple-add-or-rules" style="text-decoration:none;margin-top:5px"><i class="icon-plus"></i> Add condition</a>
							</div>

							<div id="companies-filter-wrapper" style='{{#isContactType contact_type "PERSON"}}
						display:none;
					{{else}}
						display:block;
					{{/isContactType}}'>
							<div>Meet <i>All </i> of the following conditions</div>
							<table style="background-color: transparent;margin-bottom:5px" class="chained-table company and_rules">
								<tbody>
									<tr valign="top" class="chained controls hide" name="rules" style="padding-left:100px; ">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required"
													value="Contact"/>
											</div>
										</td>
										<td class="lhs-block span2">
											<div id="LHS" name="LHS">
												<select name="temp" class="lhs" id="LHS" style="width: 125px;">
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
										<td class="codition-block span2">
											<div id="condition" name="CONDITION">
												<select name="temp" style="width: 100%;">
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
										<td class="rhs-block span2 controls" style="vertical-align:top; " >
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp" style="width:92%"
													class="LAST NEXT required" placeholder="Number of days"/>
												<input type="text" name="temp" style="width:92%"
													class="EQUALS NOTEQUALS ANYOF required"/>
												 
												<input type="text" name="temp" 
													class="MATCHES  required"/>
												<input type="text" name="temp" style="width:92%"
													class="IS_GREATER_THAN IS_LESS_THAN number required"/> 
													
                                                <input type="text" name="tag" 
													class="tags tags_time required"
													style="margin: 0px;width:92%" /> 
                                                <input type="text" name="temp" class="email required" style="width:92%"/>
												<input id="updated_date" type="text" name="updated_date" style="width:92%; text-overflow:none; "
													class="ON AFTER BEFORE BETWEEN input required date"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="rhs-new-block controls span2" style="vertical-align:top; " >
											<div id="RHS-NEW" name="RHS_NEW">
												<input id="date_between" type="text" name="temp" data-date-format="mm/dd/yyyy"
													class="BETWEEN input date required" style="width: 92%" placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="nested-condition-block span2" style="vertical-align:top; " >
											<div id="nested_condition" name="nested_condition">
												<select name="temp"  style="width: 100%;">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is after</option>
													<option value="BEFORE" class="tags_time">is before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="LAST" class="tags_time">in last</option>
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; " >
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required"
													style="width: 92%;" placeholder="Number of days" /> 
												<input
													id="date_between" type="text" style="width: 92%"
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; " >
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp"
													style="width: 92%;" class="BETWEEN input date required"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy" />
											</div>
										</td>
									<td>
									<div style="margin-left:10px">
										<i
											class="filter-contacts-multiple-remove icon-remove-circle"
											style="cursor:pointer;"></i></div></td>
									</tr>
								
								</tbody>
							</table>
						<a href="#" class="filter-companies-multiple-add" style="text-decoration:none;margin-top:5px"><i class="icon-plus"></i> Add condition</a>
							<br/><br/><small>and</small><br/>
							<div>Meet  <i> Any </i> of the following conditions</div>
							<table style="background-color: transparent;margin-bottom:5px" class="chained-table company or_rules">
								<tbody>
									<tr valign="top" class="chained controls hide" name="or_rules" style="padding-left:100px; ">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required"
													value="Contact"/>
											</div>
										</td>
										<td class="lhs-block span2">
											<div id="LHS" name="LHS">
												<select name="temp" class="lhs" id="LHS" style="width: 125px;">
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
										<td class="codition-block span2">
											<div id="condition" name="CONDITION">
												<select name="temp" style="width: 100%;">
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
										<td class="rhs-block span2 controls" style="vertical-align:top; " >
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp" style="width:92%"
													class="LAST NEXT required" placeholder="Number of days"/>
												<input type="text" name="temp" style="width:92%"
													class="EQUALS NOTEQUALS ANYOF required"/>
												 
												<input type="text" name="temp" 
													class="MATCHES NOT_CONTAINS  required"/>
												<input type="text" name="temp" style="width:92%"
													class="IS_GREATER_THAN IS_LESS_THAN number required"/> 
													
                                                <input type="text" name="tag" 
													class="tags tags_time required"
													style="margin: 0px;width:92%" /> 
                                                <input type="text" name="temp" class="email required" style="width:92%"/>
												<input id="updated_date" type="text" name="updated_date" style="width:92%; text-overflow:none; "
													class="ON AFTER BEFORE BETWEEN input required date"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="rhs-new-block controls span2" style="vertical-align:top; " >
											<div id="RHS-NEW" name="RHS_NEW">
												<input id="date_between" type="text" name="temp" data-date-format="mm/dd/yyyy"
													class="BETWEEN input date required" style="width: 92%" placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="nested-condition-block span2" style="vertical-align:top; " >
											<div id="nested_condition" name="nested_condition">
												<select name="temp"  style="width: 100%;">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is after</option>
													<option value="BEFORE" class="tags_time">is before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="LAST" class="tags_time">in last</option>
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; " >
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required"
													style="width: 92%;" placeholder="Number of days" /> 
												<input
													id="date_between" type="text" style="width: 92%"
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="controls span2" style="vertical-align:top; " >
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp"
													style="width: 92%;" class="BETWEEN input date required"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy" />
											</div>
										</td>
									<td>
									<div style="margin-left:10px">
										<i
											class="filter-contacts-multiple-remove icon-remove-circle"
											style="cursor:pointer;"></i></div></td>
									</tr>
								
								</tbody>
							</table>
						<a href="#" class="filter-companies-multiple-add-or-rules" style="text-decoration:none;margin-top:5px"><i class="icon-plus"></i> Add condition</a>
						</div>
						</div>
					</div>
			</div>

			{{#if id}} <input type="text" name="id" class="hide" value={{id}}>
			{{/if}}
			<div class="form-actions">
				<a href="#" type="submit" class="save btn btn-primary"
					id="filtersAdd">Save</a> <a href="#contact-filters" class="btn ">Close</a>
			</div>
			</fieldset>
		</form>
	</div>
</div>
</script><script id="contact-filter-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Filters</h1>
            <a href="#contact-filter-add" class="btn right" id="addFilter" style='top:-28px;position:relative'><span><i class='icon-plus-sign'/></span>  Add Filter</a>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9"> 
		<div id="slate">
         </div>
        {{#if this.length}}
        <table class="table table-bordered showCheckboxes" url="core/api/filters/bulk" id="contact-filter-list">  
            <colgroup>
                <col width="0%">
                <col width="60%">
                <col width="40%">				
			</colgroup>             
            <thead>
                <tr>   
                    <th>Name</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id='contact-filter-model-list' route='contact-filter-edit/'>
            </tbody>
        </table>
		{{/if}}
    </div>
    <div class='span3'>
        <div class="well" id='addview'>
             <h3>
              What are Filters?
             </h3><br/>
            <p>Filters are used to sort contacts with a specific criteria to find patterns. You can save your preferred filters and also have daily, weekly or monthly reports sent to you based on the filter</p>
        </div>
    </div>
</div>
</script>

<script id="contact-filter-model-template" type="text/html">
<td data='{{id}}' class='data' style="cursor:pointer">
  <div style='height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:40em;overflow:hidden;'>
    {{name}} 
  </div>
</td>
<td style="color: #b2b0b1;"> 
  {{#if created_time}}
      <div style='height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:22em;overflow:hidden;'>
         Created <time class="created_time time-ago" value="{{created_time}}" datetime="{{epochToHumanDate "" created_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy" created_time}}</time> by {{filterOwner.name}}
      </div>
  {{/if}}
</td>
</script>