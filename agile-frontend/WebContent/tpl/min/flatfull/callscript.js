<script id="callscript-login-template" type="text/html">
<div>    
	<form  id="callscript_login_form" name="callscript_login_form" method="post">
    	<fieldset>
              <p class="no-rule-added m-t" style='display:none;'>                   
                   You have no script rules configured.
              </p>
              <p class="rule-added" style='display:none;'>
                   <span class="rule-count"> </span>  script rules configured.
              </p> 
<div>
			  <a href="#add-widget" class="btn btn-default btn-sm">Cancel</a>
              <a href="#callscript/add-rules" id="add_csrule" class="btn btn-sm btn-primary ml_5"><i class="icon-plus-sign"></i>Add Rule</a>
              <a href="#callscript/rules" id="show_csrules" class="btn btn-sm btn-primary ml_5" style="display:none;">Show Rule</a>			  
</div>              
		 </fieldset>
    </form>
</div>
</script>
<script id="callscript-table-template" type="text/html">
<div class="row">
    <div class="col-md-9 col-sm-9 col-xs-12">
<div class="panel panel-default">
    <div class="panel-heading">      
        <div class="pull-left m-t-xs">Call Script Rules</div>
        <div class="pull-right">
        <a href="#callscript/add-rules" class="btn btn-sm btn-default btn-addon" id="add_rule"><span><i class='icon-plus-sign'/></span>  Add Rule</a>
        </div>
        <div class="clearfix"></div>
    </div>
		
        {{#if this.length}}
        <div class="table-responsive">
         <table class="table table-striped agile-table">
            
            <thead>
                <tr>
                    <th style="width:42%">Name</th>
                    <th style="width:42%">Script</th>
                </tr>
            </thead>
            <tbody class="csr-sortable">
             {{#each this}}
               <tr data='{{@index}}' class='row-callscriptrule ui-state-default'>
                   <td class='data'><div class="table-resp">{{name}}</div></td>
                   <td class='data'><div class="teble-resp">{{displaytext}}</div></td>
                   <td class='data'>
                       <div class="callscriptrule-actions pull-right" style="visibility: hidden;">                           
                          <i class="c-p icon icon-edit edit-callscriptrule" data="{{rulecount}}" title="Edit Call Script Rule"></i>     
                          <i class="c-p icon icon-trash delete-callscriptrule" data="{{@index}}" title="Delete Call Script Rule"></i>
                          <i class="icon icon-move" data="{{@index}}" title="Drag-Drop Call Script Rule"></i>
                       </div>
                   </td>
               </tr> 
             {{/each}}
            </tbody>
        </table>
        </div>
    {{else}}
     <div id="slate">
			<div class="alert-info alert">
    			<div class="slate-content">
        				<div class="box-left pull-left m-r-md"><img alt="Clipboard" src="/img/clipboard.png"></div>
				        <div class="box-right pull-left">
                            <h4 class="m-t-none">You do not have any call script rules currently.</h4>
                            <div class="text">Call Script Rules are used to show you the script for the call base on predefined rules you have set.</div>
                            <a href="#callscript/add-rules" class="m-t-xs btn btn-default btn-sm blue btn-slate-action"><i class="icon-plus-sign"></i>  Add Rule</a>
				        </div>
						<div class="clearfix">
						</div>
                </div>
           </div>
        </div>
    {{/if}}
    </div> 
</div>

 <div class="col-md-3 col-sm-3 col-xs-12">
        
            <h4 class="m-t-none m-b-sm h4">
                What are Call Script Rules?
            </h4>
            
            <p>
                  The Call Script widget shows you a script when calling customers. 
                  You can have multiple call scripts for various types of customers. 
                  The script is shown when the Rule defined for it matches the contact currently opened. 
                  The rules are evaluated from top to bottom.
            </p>
       
 </div>   

</div>

</script>

<script id="callscript-rule-template" type="text/html">
<div class="panel panel-default">
	<div class="panel-heading">
		
			{{#if ruleindex}} 
            	Edit Call Script Rule
            {{else}}
            	<span class="addLable"><i class="icon-plus-sign"></i> Add Call Script Rule</span>
            {{/if}}
         
	</div>

	<div class="panel-body">
		<form id="callscriptruleForm" class="form-horizontal">
			<div name="rules" class="formsection chainedSelect">             
					 	
                <fieldset>                    
                    <input type="hidden" id="position" name="position" value="" />
                    <input type="hidden" id="rulecount" name="rulecount" value="" />

					<div class="control-group form-group">
						<label class="control-label col-sm-2">Name<span class="field_req">*</span></label>
						<div class="controls col-sm-8">
							<input type="text" id="name" name="name" class="required form-control" />
						</div>
					</div>

                    <div class="control-group form-group">
						<label class="control-label col-sm-2">Call Script<span class="field_req">*</span></label>
						<div class="controls col-sm-8">
                            <textarea id="displaytext" name="displaytext" rows="5" class="input required form-control"></textarea>							
						</div>
					</div>
                       
					<div class="control-group form-group" id="filter-settings">
						<label class="control-label col-sm-2">Condition</label>
						<div class="controls col-sm-8">
                            <div id="loading-img-for-table" style="display:none;"></div>
							<table class="chained-table m-b-sm bg-transparent">
								<tbody>
									<tr valign="top" class="chained controls" name="rules" style="padding-left:100px; ">
										<td>
											<div name="ruleType">
												<input type="text" class="hide form-control" name="temp" class="required"
													value="Contact"/>
											</div>
										</td>
										<td class="lhs-block span2">
											<div id="LHS" name="LHS">
												<select name="temp" class="lhs form-control" id="LHS">
													<optgroup label="Tag">
														<option value="tags" selected="selected">Tag</option>
														<option value="tags_time">Tag And Created Date</option>
													</optgroup>
													<optgroup label="Date">
														<option value="created_time">Created</option>														
													</optgroup>
 													<optgroup label="Properties">
														<!--<option value="first_name">First Name</option>-->
														<option value="email">Email Address</option>
														<option value="company">Company</option>
														<option value="title">Job Title</option>
														<option value="phone">Phone Number</option>
														<option value="lead_score">Score</option>
														<option value="owner_id">Owner</option>
													</optgroup>
												
													 <optgroup label="Custom Fields" id="custom-fields" class="hide">
													</optgroup>
												</select>
											</div>
										</td>
										<td class="codition-block span2">
											<div id="condition" name="CONDITION">
												<select name="temp" class="w-full form-control">
													<option value="EQUALS"
														class="first_name phone company title org_tag jobtitle email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
													<option value="EQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">is</option>
													<option value="NOTEQUALS" class="owner_id" related="RHS" url="core/api/users" parse_key="id" parse_value="name">isn't</option>
													<option value="NOTEQUALS"
														class="first_name company owner org_tag title email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
													
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
													<option value="EQUALS" class="tag org_tag">is</option>
													<option value="ANYOF" class="tag">is any of</option>
												</select>
											</div>
										</td>
										<td class="rhs-block span2 controls v-top">
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp"
													class="LAST required form-control" placeholder="Number of days"/>
												<input type="text" name="temp"
													class="EQUALS NOTEQUALS ANYOF required form-control"/>
												 
												<input type="text" name="temp" 
													class="MATCHES NOT_CONTAINS  required form-control"/>
												<input type="text" name="temp" 
													class="IS_GREATER_THAN IS_LESS_THAN number required form-control"/> 
													
                                                <input type="text" name="tag" 
													class="tags tags_time required m-n form-control"
													 /> 
                                                <input type="text" name="temp" class="email required form-control" />
												<input id="updated_date" type="text" name="updated_date" style="text-overflow:none; "
													class="ON AFTER BEFORE BETWEEN input required date form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="rhs-new-block controls span2 v-top">
											<div id="RHS-NEW" name="RHS_NEW">
												<input id="date_between" type="text" name="temp" data-date-format="mm/dd/yyyy"
													class="BETWEEN input date required form-control"  placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="nested-condition-block span2 v-top">
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
										<td class="controls span2 v-top">
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST required form-control"
													 placeholder="Number of days" /> 
												<input
													id="date_between" type="text" 
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy"/>
											</div>
										</td>
										<td class="controls span2 v-top">
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp"
													 class="BETWEEN input date required form-control"
													placeholder="MM/DD/YY" data-date-format="mm/dd/yyyy" />
											</div>
										</td>
									<td>
									<div class="m-f-sm">
										<i
											class="callscript-multiple-remove icon-remove-circle c-p"
											style="display: none;"></i></div></td>
									</tr>
								
								</tbody>
							</table>
								<a href="#" class="callscript-multiple-add text-l-none m-t-xs text-info"><i class="icon-plus"></i> Add</a>
						</div>
					</div>
			</div>

			{{#if id}} <input type="text" name="id" class="hide form-control" value={{id}}>
			{{/if}}
			<div class="form-actions">
				<div class="col-sm-offset-2">
                <a href="#callscript/rules" class="btn btn-sm btn-default redirect-to-showrules">Close</a>
                <a href="#add-widget" style="display:none;" class="btn btn-danger btn-sm redirect-to-addwidget">Close</a>
				<a href="#" class="btn btn-primary btn-sm" id="save_prefs">Save</a> 
				</div>
			</div>
			</fieldset>
		</form>
	</div>
	</div>
</script>

<script id="callscript-profile-template" type="text/html">
<div class="widget_content">
		<div class="row">
			{{#if_equals to.length "1"}}<div><input type="hidden" id="twilioio_contact_number" value="{{to.0.value}}"/>Call {{getCurrentContactProperty "first_name"}} {{getCurrentContactProperty "last_name"}} on {{to.0.value}}</div>
			{{else}}
			<div class="col-md-2 p-xs" valign="middle"><h4>To&nbsp;:</h4></div>
			<div class="col-md-10">
				<select name="number" id="twilioio_contact_number" class="required form-control col-md-10 w-full">
					{{#each to}}
						<option value="{{value}}">{{value}} 
							{{#if subtype}}({{subtype}}){{/if}}
						</option>
					{{/each}}
				</select>
			</div>
			{{/if_equals}}
		</div>
		<div class="row-fluid">
			<a href="#call" class="btn btn-sm btn-default pull-right" id="twilioio_call" style="display:none;"><i class="icon-phone"></i>Call</a>			
			<a href="#note" class="right contact-add-note m-xs" id="twilioio_note">Add Note</a>
		</div>
 	</div>	
</script>



