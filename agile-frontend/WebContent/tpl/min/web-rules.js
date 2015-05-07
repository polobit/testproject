<Script id="webrules-add-template" type="text/html">
<div class="row">
<div class="span9">
	<div class="well">
		<form id="reportsForm1" class="form-horizontal">
			<div name="rules" class="formsection chainedSelect">
				{{#if id}}
				<legend class="formheading">Edit Web Rule</legend>
				{{else}}
				<legend class="formheading">
					<i class="icon-plus-sign"></i> Add Web Rule
				</legend>
				{{/if}}
				<fieldset style="margin-left: -20px">
					<div class="control-group">
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="required" />
						</div>
					</div>
					{{#if id}}<input type="hidden" name="position" class="required" />{{/if}}
					<div class="control-group" id="report-settings">
						<label class="control-label">Condition</label>
						<div class="controls" >
							<table style="background-color: transparent"
								class="web-rule-contact-condition-table chained-table">
								<tbody>
									<tr class="chained controls" name="rules" style="padding-left: 100px">
										<td>
											<div name="ruleType">
												<input type="text" class="hide" name="temp" class="required"
													value="Contact" />
											</div>
										</td>
										<td class="lhs-block" style="vertical-align: top;">
											<div id="LHS" name="LHS">
												<select name="temp" class="lhs" id="LHS"
													style="width: 125px;">
													<optgroup label="Page conditions" id="page-conditions">
														<option value="page" selected="selected">Page URL</option>
														<option value="referrer">Referrer URL</option>
														<option value="visit">Frequency</option>
														<option value="device">Device</option>
														<option value="user_agent">User Agent</option>
													</optgroup>
													<optgroup label="Contact Data" id="page-conditions">
														<option value="tags">Tag</option>
														<option value="tags_time">Tag And Created Date</option>
														<option value="lead_score">Lead Score</option>
														<option value="created_time">Created</option>
														<option value="company">Company</option>
														<option value="title">Job Title</option>
														<option value="owner_id">Owner</option>
														<option value="visitor">Visitor Type</option>
													</optgroup>
													<optgroup label="Custom Fields" id="custom-fields"
														class="hide">
													</optgroup>
													<optgroup label="Geography" id="geography">
														<option value="country">Country</option>
													</optgroup>
													<optgroup label="Shopping Cart Conditions" id="cart-conditions">
														<option value="cart">Shopify</option>
													</optgroup>									
												</select>
											</div>
										</td>
										<td class="codition-block" style="vertical-align:top">
											<div id="condition" name="CONDITION">
												<select name="temp" style="width: 100%;">
													<option value="MATCHES" class="page referrer" placeholder="Enter URL">contains</option>
													<option value="NOT_CONTAINS" class="referrer page" placeholder="Enter URL">doesn't contain</option>
													<option value="EQUALS" class="referrer page" placeholder="Enter URL">is</option>
													<option value="NOTEQUALS" class="referrer page" placeholder="Enter URL">isn't</option>
													
													<option value="EQUALS"
														class="first_name phone  company title org_tag jobtitle email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
													<option value="EQUALS" class="owner_id" related="RHS"
														url="core/api/users" parse_key="id" parse_value="name">is</option>
													<option value="NOTEQUALS" class="owner_id" related="RHS"
														url="core/api/users" parse_key="id" parse_value="name">isn't</option>
													<option value="NOTEQUALS"
														class="first_name company owner org_tag title email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
												
													<option value="EQUALS" class="lead_score" placeholder="Enter Score">is</option>
													<option value="IS_GREATER_THAN" class="lead_score">greater than</option>
													<option value="IS_LESS_THAN" class="lead_score">less than</option>
	
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
													<option value="EQUALS" class="tag org_tag">is</option>
													<option value="ANYOF" class="tag">is any of</option>
													<option value="EVERYTIME" class="visit">Everytime</option>
													<option value="ONCE_PER_SESSION" class="visit">Once per session</option>	
													<option value="ONLY_ONCE" class="visit">Only once</option>
													<option value="ONCE_EVERY" class="visit">Once every</option>
													<option value="MAX_OF" class="visit">Maximum times to show</option>													

													<!-- device -->
													<option value="IS" class="device">is</option>
													<option value="IS_NOT" class="device">isn't</option>

													<!--visitor-->
													<option value="KNOWN" class="visitor">Existing Contact</option>
													<option value="UNKNOWN" class="visitor">Anonymous</option>	

													<!--country-->
													<option value="COUNTRY_IS" class="country">is</option>
													<option value="COUNTRY_IS_NOT" class="country">isn't</option>	
													
													<!--user agent-->
													<option class="user_agent" value="UA_IS">is</option>
													<option class="user_agent" value="UA_IS_NOT">isn't</option>
													<option class="user_agent" value="UA_CONTAINS">contains</option>
													<option class="user_agent" value="UA_NOT_CONTAINS">doesn't contain</option>
									
													<!-- shopify cart -->
													<option value="IS_EMPTY" class="cart">Cart is empty</option>
													<option value="IS_NOT_EMPTY" class="cart">Cart isn't empty</option>
													<option value="CONTAINS" class="cart" placeholder="Item name">Cart contains</option>
													<option value="IS_LESS_THAN" class="cart" placeholder="Cart value">Cart value less than</option>	
													<option value="IS_GREATER_THAN" class="cart" placeholder="Cart value">Cart value greater than</option>
												</select>
											</div>
										</td>
										<td class="rhs-block controls"
											style="vertical-align: top;">
											<div id="RHS" class="rhs" name="RHS">
												<input type="text" name="temp" 
													class="EQUALS NOTEQUALS ANYOF required MATCHES CONTAINS NOT_CONTAINS" /> <input
													type="text" name="temp" 
													class="LAST NEXT required" placeholder="Number of days" />
												<input type="text" name="tag"
													class=" tags tags_time required"
													style="margin: 0 0 0 0px; width: 92%" /> <input
													type="text" name="temp" class="email required"
													style="width: 92%" /> <input id="updated_date" type="text"
													name="updated_date" style="width: 92%"
													class="ON AFTER BEFORE BETWEEN input required date"
													placeholder="MM/DD/YY" />
													<input type="text" name="temp" style="width:92%"
													class="IS_GREATER_THAN IS_LESS_THAN number required" placeholder="Enter Score"/>
													<select>
														<option value="MOBILE" class="IS IS_NOT">Mobile</option>
													</select>
													<input type="text" style="width:92%" class="MAX_OF" placeholder="Times to show"></input>
													<input type="text" style="width:92%" class="ONCE_EVERY" placeholder="Minutes"></input>
													<select>
														<option class="COUNTRY_IS COUNTRY_IS_NOT" value="">Select Country</option>
                                						<option value="AF" class="COUNTRY_IS COUNTRY_IS_NOT">Afghanistan</option>
                                						<option value="AL" class="COUNTRY_IS COUNTRY_IS_NOT">Albania</option>
                                						<option value="DZ" class="COUNTRY_IS COUNTRY_IS_NOT">Algeria</option>
                                						<option value="AS" class="COUNTRY_IS COUNTRY_IS_NOT">American Samoa</option>
                                						<option value="AD" class="COUNTRY_IS COUNTRY_IS_NOT">Andorra</option>
                                						<option value="AO" class="COUNTRY_IS COUNTRY_IS_NOT">Angola</option>
                                						<option value="AI" class="COUNTRY_IS COUNTRY_IS_NOT">Anguilla</option>
                                						<option value="AQ" class="COUNTRY_IS COUNTRY_IS_NOT">Antarctica</option>
                                						<option value="AG" class="COUNTRY_IS COUNTRY_IS_NOT">Antigua and Barbuda</option>
                                						<option value="AR" class="COUNTRY_IS COUNTRY_IS_NOT">Argentina</option>
                                						<option value="AM" class="COUNTRY_IS COUNTRY_IS_NOT">Armenia</option>
                                						<option value="AW" class="COUNTRY_IS COUNTRY_IS_NOT">Aruba</option>
                                						<option value="AU" class="COUNTRY_IS COUNTRY_IS_NOT">Australia</option>
                               							<option value="AT" class="COUNTRY_IS COUNTRY_IS_NOT">Austria</option>
                                						<option value="AZ" class="COUNTRY_IS COUNTRY_IS_NOT">Azerbaijan</option>
                                						<option value="BS" class="COUNTRY_IS COUNTRY_IS_NOT">Bahamas</option>
                                						<option value="BH" class="COUNTRY_IS COUNTRY_IS_NOT">Bahrain</option>
                                						<option value="BD" class="COUNTRY_IS COUNTRY_IS_NOT">Bangladesh</option>
                                						<option value="BB" class="COUNTRY_IS COUNTRY_IS_NOT">Barbados</option>
                                						<option value="BY" class="COUNTRY_IS COUNTRY_IS_NOT">Belarus</option>
                                						<option value="BE" class="COUNTRY_IS COUNTRY_IS_NOT">Belgium</option>
                                						<option value="BZ" class="COUNTRY_IS COUNTRY_IS_NOT">Belize</option>
                                						<option value="BJ" class="COUNTRY_IS COUNTRY_IS_NOT">Benin</option>
                              							<option value="BM" class="COUNTRY_IS COUNTRY_IS_NOT">Bermuda</option>
                                						<option value="BT" class="COUNTRY_IS COUNTRY_IS_NOT">Bhutan</option>
                                						<option value="BO" class="COUNTRY_IS COUNTRY_IS_NOT">Bolivia</option>
                              							<option value="BA" class="COUNTRY_IS COUNTRY_IS_NOT">Bosnia and Herzegovina</option>
                                						<option value="BW" class="COUNTRY_IS COUNTRY_IS_NOT">Botswana</option>
                                						<option value="BV" class="COUNTRY_IS COUNTRY_IS_NOT">Bouvet Island</option>
                                						<option value="BR" class="COUNTRY_IS COUNTRY_IS_NOT">Brazil</option>
                                						<option value="IO" class="COUNTRY_IS COUNTRY_IS_NOT">British Indian Ocean Territory</option>
                                						<option value="VG" class="COUNTRY_IS COUNTRY_IS_NOT">British Virgin Islands</option>
                               							<option value="BN" class="COUNTRY_IS COUNTRY_IS_NOT">Brunei</option>
                                						<option value="BG" class="COUNTRY_IS COUNTRY_IS_NOT">Bulgaria</option>
                                						<option value="BF" class="COUNTRY_IS COUNTRY_IS_NOT">Burkina Faso</option>
                                						<option value="BI" class="COUNTRY_IS COUNTRY_IS_NOT">Burundi</option>
                               	 						<option value="KH" class="COUNTRY_IS COUNTRY_IS_NOT">Cambodia</option>
                                						<option value="CM" class="COUNTRY_IS COUNTRY_IS_NOT">Cameroon</option>
                                						<option value="CA" class="COUNTRY_IS COUNTRY_IS_NOT">Canada</option>
                                						<option value="CV" class="COUNTRY_IS COUNTRY_IS_NOT">Cape Verde</option>
                                						<option value="KY" class="COUNTRY_IS COUNTRY_IS_NOT">Cayman Islands</option>
                                						<option value="CF" class="COUNTRY_IS COUNTRY_IS_NOT">Central African Republic</option>
                                						<option value="TD" class="COUNTRY_IS COUNTRY_IS_NOT">Chad</option>
                                						<option value="CL" class="COUNTRY_IS COUNTRY_IS_NOT">Chile</option>
                               		 					<option value="CN" class="COUNTRY_IS COUNTRY_IS_NOT">China</option>
                                						<option value="CX" class="COUNTRY_IS COUNTRY_IS_NOT">Christmas Island</option>
                                						<option value="CC" class="COUNTRY_IS COUNTRY_IS_NOT">Cocos Islands</option>
                                						<option value="CO" class="COUNTRY_IS COUNTRY_IS_NOT">Colombia</option>
                                						<option value="KM" class="COUNTRY_IS COUNTRY_IS_NOT">Comoros</option>
                                						<option value="CG" class="COUNTRY_IS COUNTRY_IS_NOT">Congo</option>
                                						<option value="CK" class="COUNTRY_IS COUNTRY_IS_NOT">Cook Islands</option>
                                						<option value="CR" class="COUNTRY_IS COUNTRY_IS_NOT">Costa Rica</option>
                                						<option value="HR" class="COUNTRY_IS COUNTRY_IS_NOT">Croatia</option>
                                						<option value="CU" class="COUNTRY_IS COUNTRY_IS_NOT">Cuba</option>
                                						<option value="CY" class="COUNTRY_IS COUNTRY_IS_NOT">Cyprus</option>
                               	 						<option value="CZ" class="COUNTRY_IS COUNTRY_IS_NOT">Czech Republic</option>
                                						<option value="CI" class="COUNTRY_IS COUNTRY_IS_NOT">C&#244;te d'Ivoire</option>
                               	 						<option value="DK" class="COUNTRY_IS COUNTRY_IS_NOT">Denmark</option>
                                						<option value="DJ" class="COUNTRY_IS COUNTRY_IS_NOT">Djibouti</option>
                                						<option value="DM" class="COUNTRY_IS COUNTRY_IS_NOT">Dominica</option>
                                						<option value="DO" class="COUNTRY_IS COUNTRY_IS_NOT">Dominican Republic</option>
                                						<option value="EC" class="COUNTRY_IS COUNTRY_IS_NOT">Ecuador</option>
                                						<option value="EG" class="COUNTRY_IS COUNTRY_IS_NOT">Egypt</option>
                                						<option value="SV" class="COUNTRY_IS COUNTRY_IS_NOT">El Salvador</option>
                                						<option value="GQ" class="COUNTRY_IS COUNTRY_IS_NOT">Equatorial Guinea</option>
                                						<option value="ER" class="COUNTRY_IS COUNTRY_IS_NOT">Eritrea</option>
                                						<option value="EE" class="COUNTRY_IS COUNTRY_IS_NOT">Estonia</option>
                               	 						<option value="ET" class="COUNTRY_IS COUNTRY_IS_NOT">Ethiopia</option>
                                						<option value="FK" class="COUNTRY_IS COUNTRY_IS_NOT">Falkland Islands</option>
                                						<option value="FO" class="COUNTRY_IS COUNTRY_IS_NOT">Faroe Islands</option>
                                						<option value="FJ" class="COUNTRY_IS COUNTRY_IS_NOT">Fiji</option>
                                						<option value="FI" class="COUNTRY_IS COUNTRY_IS_NOT">Finland</option>
                                						<option value="FR" class="COUNTRY_IS COUNTRY_IS_NOT">France</option>
                                						<option value="GF" class="COUNTRY_IS COUNTRY_IS_NOT">French Guiana</option>
                                						<option value="PF" class="COUNTRY_IS COUNTRY_IS_NOT">French Polynesia</option>
                               							<option value="TF" class="COUNTRY_IS COUNTRY_IS_NOT">French Southern Territories</option>
                                						<option value="GA" class="COUNTRY_IS COUNTRY_IS_NOT">Gabon</option>
                                						<option value="GM" class="COUNTRY_IS COUNTRY_IS_NOT">Gambia</option>
                                						<option value="GE" class="COUNTRY_IS COUNTRY_IS_NOT">Georgia</option>
                                						<option value="DE" class="COUNTRY_IS COUNTRY_IS_NOT">Germany</option>
                                						<option value="GH" class="COUNTRY_IS COUNTRY_IS_NOT">Ghana</option>
                                						<option value="GI" class="COUNTRY_IS COUNTRY_IS_NOT">Gibraltar</option>
                                						<option value="GR" class="COUNTRY_IS COUNTRY_IS_NOT">Greece</option>
                                						<option value="GL" class="COUNTRY_IS COUNTRY_IS_NOT">Greenland</option>
                                						<option value="GD" class="COUNTRY_IS COUNTRY_IS_NOT">Grenada</option>
                                						<option value="GP" class="COUNTRY_IS COUNTRY_IS_NOT">Guadeloupe</option>
                                						<option value="GU" class="COUNTRY_IS COUNTRY_IS_NOT">Guam</option>
                                						<option value="GT" class="COUNTRY_IS COUNTRY_IS_NOT">Guatemala</option>
                                						<option value="GG" class="COUNTRY_IS COUNTRY_IS_NOT">Guernsey</option>
                                						<option value="GN" class="COUNTRY_IS COUNTRY_IS_NOT">Guinea</option>
                                						<option value="GW" class="COUNTRY_IS COUNTRY_IS_NOT">Guinea-Bissau</option>
                                						<option value="GY" class="COUNTRY_IS COUNTRY_IS_NOT">Guyana</option>
                                						<option value="HT" class="COUNTRY_IS COUNTRY_IS_NOT">Haiti</option>
                                						<option value="HM" class="COUNTRY_IS COUNTRY_IS_NOT">Heard Island And McDonald Islands</option>
                                						<option value="HN" class="COUNTRY_IS COUNTRY_IS_NOT">Honduras</option>
                                						<option value="HK" class="COUNTRY_IS COUNTRY_IS_NOT">Hong Kong</option>
                                						<option value="HU" class="COUNTRY_IS COUNTRY_IS_NOT">Hungary</option>
                                						<option value="IS" class="COUNTRY_IS COUNTRY_IS_NOT">Iceland</option>
                               	 						<option value="IN" class="COUNTRY_IS COUNTRY_IS_NOT">India</option>
                                						<option value="ID" class="COUNTRY_IS COUNTRY_IS_NOT">Indonesia</option>
                                						<option value="IR" class="COUNTRY_IS COUNTRY_IS_NOT">Iran</option>
                                						<option value="IQ" class="COUNTRY_IS COUNTRY_IS_NOT">Iraq</option>
                                						<option value="IE" class="COUNTRY_IS COUNTRY_IS_NOT">Ireland</option>
                                						<option value="IM" class="COUNTRY_IS COUNTRY_IS_NOT">Isle Of Man</option>
                                						<option value="IL" class="COUNTRY_IS COUNTRY_IS_NOT">Israel</option>
                                						<option value="IT" class="COUNTRY_IS COUNTRY_IS_NOT">Italy</option>
                                						<option value="JM" class="COUNTRY_IS COUNTRY_IS_NOT">Jamaica</option>
                               							<option value="JP" class="COUNTRY_IS COUNTRY_IS_NOT">Japan</option>
                                						<option value="JE" class="COUNTRY_IS COUNTRY_IS_NOT">Jersey</option>
                                						<option value="JO" class="COUNTRY_IS COUNTRY_IS_NOT">Jordan</option>
                                						<option value="KZ" class="COUNTRY_IS COUNTRY_IS_NOT">Kazakhstan</option>
                                						<option value="KE" class="COUNTRY_IS COUNTRY_IS_NOT">Kenya</option>
                                						<option value="KI" class="COUNTRY_IS COUNTRY_IS_NOT">Kiribati</option>
                                						<option value="KW" class="COUNTRY_IS COUNTRY_IS_NOT">Kuwait</option>
                                						<option value="KG" class="COUNTRY_IS COUNTRY_IS_NOT">Kyrgyzstan</option>
                                						<option value="LA" class="COUNTRY_IS COUNTRY_IS_NOT">Laos</option>
                                						<option value="LV" class="COUNTRY_IS COUNTRY_IS_NOT">Latvia</option>
                                						<option value="LB" class="COUNTRY_IS COUNTRY_IS_NOT">Lebanon</option>
                                						<option value="LS" class="COUNTRY_IS COUNTRY_IS_NOT">Lesotho</option>
                                						<option value="LR" class="COUNTRY_IS COUNTRY_IS_NOT">Liberia</option>
                                						<option value="LY" class="COUNTRY_IS COUNTRY_IS_NOT">Libya</option>
                                						<option value="LI" class="COUNTRY_IS COUNTRY_IS_NOT">Liechtenstein</option>
                                						<option value="LT" class="COUNTRY_IS COUNTRY_IS_NOT">Lithuania</option>
                                						<option value="LU" class="COUNTRY_IS COUNTRY_IS_NOT">Luxembourg</option>
                                						<option value="MO" class="COUNTRY_IS COUNTRY_IS_NOT">Macao</option>
                                						<option value="MK" class="COUNTRY_IS COUNTRY_IS_NOT">Macedonia</option>
                                						<option value="MG" class="COUNTRY_IS COUNTRY_IS_NOT">Madagascar</option>
                                						<option value="MW" class="COUNTRY_IS COUNTRY_IS_NOT">Malawi</option>
                                						<option value="MY" class="COUNTRY_IS COUNTRY_IS_NOT">Malaysia</option>
                                						<option value="MV" class="COUNTRY_IS COUNTRY_IS_NOT">Maldives</option>
                                						<option value="ML" class="COUNTRY_IS COUNTRY_IS_NOT">Mali</option>
                                						<option value="MT" class="COUNTRY_IS COUNTRY_IS_NOT">Malta</option>
                                						<option value="MH" class="COUNTRY_IS COUNTRY_IS_NOT">Marshall Islands</option>
                                						<option value="MQ" class="COUNTRY_IS COUNTRY_IS_NOT">Martinique</option>
                                						<option value="MR" class="COUNTRY_IS COUNTRY_IS_NOT">Mauritania</option>
                                						<option value="MU" class="COUNTRY_IS COUNTRY_IS_NOT">Mauritius</option>
                                						<option value="YT" class="COUNTRY_IS COUNTRY_IS_NOT">Mayotte</option>
                                						<option value="MX" class="COUNTRY_IS COUNTRY_IS_NOT">Mexico</option>
                                						<option value="FM" class="COUNTRY_IS COUNTRY_IS_NOT">Micronesia</option>
                                						<option value="MD" class="COUNTRY_IS COUNTRY_IS_NOT">Moldova</option>
                                						<option value="MC" class="COUNTRY_IS COUNTRY_IS_NOT">Monaco</option>
                                						<option value="MN" class="COUNTRY_IS COUNTRY_IS_NOT">Mongolia</option>
                                						<option value="ME" class="COUNTRY_IS COUNTRY_IS_NOT">Montenegro</option>
                                						<option value="MS" class="COUNTRY_IS COUNTRY_IS_NOT">Montserrat</option>
                                						<option value="MA" class="COUNTRY_IS COUNTRY_IS_NOT">Morocco</option>
                                						<option value="MZ" class="COUNTRY_IS COUNTRY_IS_NOT">Mozambique</option>
                                						<option value="MM" class="COUNTRY_IS COUNTRY_IS_NOT">Myanmar</option>
                                						<option value="NA" class="COUNTRY_IS COUNTRY_IS_NOT">Namibia</option>
                               							<option value="NR" class="COUNTRY_IS COUNTRY_IS_NOT">Nauru</option>
                                						<option value="NP" class="COUNTRY_IS COUNTRY_IS_NOT">Nepal</option>
                                						<option value="NL" class="COUNTRY_IS COUNTRY_IS_NOT">Netherlands</option>
                                						<option value="AN" class="COUNTRY_IS COUNTRY_IS_NOT">Netherlands Antilles</option>
                                						<option value="NC" class="COUNTRY_IS COUNTRY_IS_NOT">New Caledonia</option>
                                						<option value="NZ" class="COUNTRY_IS COUNTRY_IS_NOT">New Zealand</option>
                                						<option value="NI" class="COUNTRY_IS COUNTRY_IS_NOT">Nicaragua</option>
                                						<option value="NE" class="COUNTRY_IS COUNTRY_IS_NOT">Niger</option>
                                						<option value="NG" class="COUNTRY_IS COUNTRY_IS_NOT">Nigeria</option>
                              							<option value="NU" class="COUNTRY_IS COUNTRY_IS_NOT">Niue</option>
                                						<option value="NF" class="COUNTRY_IS COUNTRY_IS_NOT">Norfolk Island</option>
                                						<option value="KP" class="COUNTRY_IS COUNTRY_IS_NOT">North Korea</option>
                                						<option value="MP" class="COUNTRY_IS COUNTRY_IS_NOT">Northern Mariana Islands</option>
                                						<option value="NO" class="COUNTRY_IS COUNTRY_IS_NOT">Norway</option>
                                						<option value="OM" class="COUNTRY_IS COUNTRY_IS_NOT">Oman</option>
                                						<option value="PK" class="COUNTRY_IS COUNTRY_IS_NOT">Pakistan</option>
                                						<option value="PW" class="COUNTRY_IS COUNTRY_IS_NOT">Palau</option>
                                						<option value="PS" class="COUNTRY_IS COUNTRY_IS_NOT">Palestine</option>
                                						<option value="PA" class="COUNTRY_IS COUNTRY_IS_NOT">Panama</option>
                                						<option value="PG" class="COUNTRY_IS COUNTRY_IS_NOT">Papua New Guinea</option>
                                						<option value="PY" class="COUNTRY_IS COUNTRY_IS_NOT">Paraguay</option>
                                						<option value="PE" class="COUNTRY_IS COUNTRY_IS_NOT">Peru</option>
                                						<option value="PH" class="COUNTRY_IS COUNTRY_IS_NOT">Philippines</option>
                                						<option value="PN" class="COUNTRY_IS COUNTRY_IS_NOT">Pitcairn</option>
                                						<option value="PL" class="COUNTRY_IS COUNTRY_IS_NOT">Poland</option>
                                						<option value="PT" class="COUNTRY_IS COUNTRY_IS_NOT">Portugal</option>
                                						<option value="PR" class="COUNTRY_IS COUNTRY_IS_NOT">Puerto Rico</option>
                                						<option value="QA" class="COUNTRY_IS COUNTRY_IS_NOT">Qatar</option>
                                						<option value="RE" class="COUNTRY_IS COUNTRY_IS_NOT">Reunion</option>
                                						<option value="RO" class="COUNTRY_IS COUNTRY_IS_NOT">Romania</option>
                                						<option value="RU" class="COUNTRY_IS COUNTRY_IS_NOT">Russia</option>
                                						<option value="RW" class="COUNTRY_IS COUNTRY_IS_NOT">Rwanda</option>
                                						<option value="SH" class="COUNTRY_IS COUNTRY_IS_NOT">Saint Helena</option>
                                						<option value="KN" class="COUNTRY_IS COUNTRY_IS_NOT">Saint Kitts And Nevis</option>
                                						<option value="LC" class="COUNTRY_IS COUNTRY_IS_NOT">Saint Lucia</option>
                                						<option value="PM" class="COUNTRY_IS COUNTRY_IS_NOT">Saint Pierre And Miquelon</option>
                                						<option value="VC" class="COUNTRY_IS COUNTRY_IS_NOT">Saint Vincent And The Grenadines</option>
                                						<option value="WS" class="COUNTRY_IS COUNTRY_IS_NOT">Samoa</option>
                                						<option value="SM" class="COUNTRY_IS COUNTRY_IS_NOT">San Marino</option>
                                						<option value="ST" class="COUNTRY_IS COUNTRY_IS_NOT">Sao Tome And Principe</option>
                               							<option value="SA" class="COUNTRY_IS COUNTRY_IS_NOT">Saudi Arabia</option>
                                						<option value="SN" class="COUNTRY_IS COUNTRY_IS_NOT">Senegal</option>
                                						<option value="RS" class="COUNTRY_IS COUNTRY_IS_NOT">Serbia</option>
                                						<option value="CS" class="COUNTRY_IS COUNTRY_IS_NOT">Serbia and Montenegro</option>
                                						<option value="SC" class="COUNTRY_IS COUNTRY_IS_NOT">Seychelles</option>
                                						<option value="SL" class="COUNTRY_IS COUNTRY_IS_NOT">Sierra Leone</option>
                                						<option value="SG" class="COUNTRY_IS COUNTRY_IS_NOT">Singapore</option>
                                						<option value="SK" class="COUNTRY_IS COUNTRY_IS_NOT">Slovakia</option>
                                						<option value="SI" class="COUNTRY_IS COUNTRY_IS_NOT">Slovenia</option>
                                						<option value="SB" class="COUNTRY_IS COUNTRY_IS_NOT">Solomon Islands</option>
                                						<option value="SO" class="COUNTRY_IS COUNTRY_IS_NOT">Somalia</option>
                                						<option value="ZA" class="COUNTRY_IS COUNTRY_IS_NOT">South Africa</option>
                                						<option value="GS" class="COUNTRY_IS COUNTRY_IS_NOT">South Georgia And The South Sandwich Islands</option>
                                						<option value="KR" class="COUNTRY_IS COUNTRY_IS_NOT">South Korea</option>
                                						<option value="ES" class="COUNTRY_IS COUNTRY_IS_NOT">Spain</option>
                                						<option value="LK" class="COUNTRY_IS COUNTRY_IS_NOT">Sri Lanka</option>
                                						<option value="SD" class="COUNTRY_IS COUNTRY_IS_NOT">Sudan</option>
                                						<option value="SR" class="COUNTRY_IS COUNTRY_IS_NOT">Suriname</option>
                                						<option value="SJ" class="COUNTRY_IS COUNTRY_IS_NOT">Svalbard And Jan Mayen</option>
                                						<option value="SZ" class="COUNTRY_IS COUNTRY_IS_NOT">Swaziland</option>
                                						<option value="SE" class="COUNTRY_IS COUNTRY_IS_NOT">Sweden</option>
                                						<option value="CH" class="COUNTRY_IS COUNTRY_IS_NOT">Switzerland</option>
                                						<option value="SY" class="COUNTRY_IS COUNTRY_IS_NOT">Syria</option>
                                						<option value="TW" class="COUNTRY_IS COUNTRY_IS_NOT">Taiwan</option>
                                						<option value="TJ" class="COUNTRY_IS COUNTRY_IS_NOT">Tajikistan</option>
                                						<option value="TZ" class="COUNTRY_IS COUNTRY_IS_NOT">Tanzania</option>
                                						<option value="TH" class="COUNTRY_IS COUNTRY_IS_NOT">Thailand</option>
                                						<option value="CD" class="COUNTRY_IS COUNTRY_IS_NOT">The Democratic Republic Of Congo</option>
                                						<option value="TL" class="COUNTRY_IS COUNTRY_IS_NOT">Timor-Leste</option>
                                						<option value="TG" class="COUNTRY_IS COUNTRY_IS_NOT">Togo</option>
                                						<option value="TK" class="COUNTRY_IS COUNTRY_IS_NOT">Tokelau</option>
                                						<option value="TO" class="COUNTRY_IS COUNTRY_IS_NOT">Tonga</option>
                                						<option value="TT" class="COUNTRY_IS COUNTRY_IS_NOT">Trinidad and Tobago</option>
                                						<option value="TN" class="COUNTRY_IS COUNTRY_IS_NOT">Tunisia</option>
                               	 						<option value="TR" class="COUNTRY_IS COUNTRY_IS_NOT">Turkey</option>
                                						<option value="TM" class="COUNTRY_IS COUNTRY_IS_NOT">Turkmenistan</option>
                                						<option value="TC" class="COUNTRY_IS COUNTRY_IS_NOT">Turks And Caicos Islands</option>
                                						<option value="TV" class="COUNTRY_IS COUNTRY_IS_NOT">Tuvalu</option>
                                						<option value="VI" class="COUNTRY_IS COUNTRY_IS_NOT">U.S. Virgin Islands</option>
                                						<option value="UG" class="COUNTRY_IS COUNTRY_IS_NOT">Uganda</option>
                                						<option value="UA" class="COUNTRY_IS COUNTRY_IS_NOT">Ukraine</option>
                                						<option value="AE" class="COUNTRY_IS COUNTRY_IS_NOT">United Arab Emirates</option>
                                						<option value="GB" class="COUNTRY_IS COUNTRY_IS_NOT">United Kingdom</option>
                                						<option value="US" class="COUNTRY_IS COUNTRY_IS_NOT">United States</option>
                                						<option value="UM" class="COUNTRY_IS COUNTRY_IS_NOT">United States Minor Outlying Islands</option>
                                						<option value="UY" class="COUNTRY_IS COUNTRY_IS_NOT">Uruguay</option>
                                						<option value="UZ" class="COUNTRY_IS COUNTRY_IS_NOT">Uzbekistan</option>
                                						<option value="VU" class="COUNTRY_IS COUNTRY_IS_NOT">Vanuatu</option>
                                						<option value="VA" class="COUNTRY_IS COUNTRY_IS_NOT">Vatican</option>
                                						<option value="VE" class="COUNTRY_IS COUNTRY_IS_NOT">Venezuela</option>
                                						<option value="VN" class="COUNTRY_IS COUNTRY_IS_NOT">Vietnam</option>
                                						<option value="WF" class="COUNTRY_IS COUNTRY_IS_NOT">Wallis And Futuna</option>
                                						<option value="EH" class="COUNTRY_IS COUNTRY_IS_NOT">Western Sahara</option>
                                						<option value="YE" class="COUNTRY_IS COUNTRY_IS_NOT">Yemen</option>
                                						<option value="ZM" class="COUNTRY_IS COUNTRY_IS_NOT">Zambia</option>
                               							<option value="ZW" class="COUNTRY_IS COUNTRY_IS_NOT">Zimbabwe</option>
                                						<option value="AX" class="COUNTRY_IS COUNTRY_IS_NOT">&#197;land Islands</option>
													</select>
													<input type="text" class="UA_IS UA_IS_NOT UA_CONTAINS UA_NOT_CONTAINS" placeholder="Enter User Agent"></input>
											</div>
										</td>
										<td class="controls"
											style="vertical-align: top; max-width: 120px;">
											<div id="RHS-NEW" name="RHS_NEW">
												<input id="date_between" type="text" name="temp"
													style="width: 92%" class="BETWEEN input date required"
													placeholder="MM/DD/YY" />
											</div>
										</td>
										<td style="vertical-align: top;">
											<div id="nested_condition" name="nested_condition">
												<select name="temp" style="width: 100%;">
													<option value="EQUALS" class="tags_time">on</option>
													<option value="AFTER" class="tags_time">is after</option>
													<option value="BEFORE" class="tags_time">is before</option>
													<option value="BETWEEN" class="tags_time">is
														between</option>
													<option value="NEXT" class="tags_time">is within
														next</option>
													<option value="LAST" class="tags_time">in last</option>
												</select>
											</div>
										</td>
										<td class="controls" style="vertical-align: top;">
											<div id="nested_lhs" name="nested_lhs">
												<input type="text" name="temp" class="LAST NEXT required"
													style="width: 92%" placeholder="Number of days" /> <input
													id="date_between" type="text" style="width: 92%"
													name="temp"
													class="BETWEEN EQUALS AFTER BEFORE input date required"
													placeholder="MM/DD/YY" />
											</div>
										</td>
										<td class="controls " style="vertical-align: top;">
											<div id="nested_rhs" name="nested_rhs">
												<input id="date_between" type="text" name="temp"
													style="width: 92%" class="BETWEEN input date required"
													placeholder="MM/DD/YY" />
											</div>
										</td>

										<td style="vertical-align: top;"><div style="width:50px">
											<i
											class="filter-contacts-multiple-remove icon-remove-circle"
											style="display: none; cursor: pointer;"></i>
											<i
											class="filter-contacts-web-rule-multiple-add icon-plus"
											style="display: inline-block; margin-right: 10px;margin-left:5px; cursor: pointer;"></i><div></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
			</div>
			<div class="control-group" style="margin-left: -19px;padding-top:20px">
						<label class="control-label">Action</label>
						<div class="controls">
								<div class="webrule-actions chained-table"> 
							<div class="alert" style="margin-bottom: 5%;border-color:#DDD; background-color:#E5E5E5">
							<table style="background-color: transparent; width:100%"
								class="reports-condition-table actions" >
								<tbody class="chained"  name="actions">
									<tr>
										<td class="lhs-block" style="vertical-align: top;">
										<div id="action" name="action">
											<select class="required" >
											 <optgroup label="Popup">
												<option value="MODAL_POPUP" class="POPUP">Modal Popup</option>
												<option value="CORNER_NOTY" class="POPUP">Noty Message</option>
											</optgroup>
											<optgroup label="Campaign">
												<option value="ASSIGN_CAMPAIGN" class="campaign" 
													related="WEB_RULE_RHS" url="core/api/workflows"
													parse_key="id" parse_value="name">Add To Campaign</option>
												<option value="UNSUBSCRIBE_CAMPAIGN" class="campaign" 
													related="WEB_RULE_RHS" url="core/api/workflows"
													parse_key="id" parse_value="name">Remove From Campaign</option>
											</optgroup>
											<optgroup label="Tags">
												<option value="ADD_TAG" class="campaign" 
													related="WEB_RULE_RHS">Add Tag</option>
												<option value="REMOVE_TAG"
													related="WEB_RULE_RHS">Remove Tag</option>
											</optgroup>
											<optgroup label="Score">
												<option value="ADD_SCORE"
													related="WEB_RULE_RHS">Add Score</option>
												<option value="SUBTRACT_SCORE" class="campaign" 
													related="WEB_RULE_RHS">Substract Score</option>
											</optgroup>
											<optgroup label="Execute code">
												<option value="JAVA_SCRIPT">Java Script</option>
											</opt>
											</select>
										</div>
										</td>
											<td style="vertical-align: top;"><div style="width:50px"><i
											class="webrule-multiple-remove icon-remove-circle"
											style="display: none; cursor: pointer;"></i></div></td>
									</tr>
									<tr>	
										<td class="controls"
											style="vertical-align: top;">
											<div name="RHS" id="WEB_RULE_RHS" class="exclude-dynamic-option-css" style="margin-top:3px;max-width:45% !important">
												</select>
												<input type="number" name="temp" class="ADD_SCORE required number" placeholder="Enter score to add"></input>
												<input type="number" name="temp" class="SUBTRACT_SCORE required number" placeholder="Enter score to substract"></input>
												<input type="number" name="temp" class="required number" placeholder="Enter score to substract"></input>
												<input type="text" name="tags-action" class="REMOVE_TAG ADD_TAG tags required" placeholder="Enter tag"></input>
											</div>
										</td>
									</tr>
									<tr>
										<td class="controls"
											style="vertical-align: top; ">
											<div name="position" id="possition" style="margin-top:3px">
												<select class="required">
													<option value="RIGHT_BOTTOM" class="CORNER_NOTY">Right Bottom</option>
													<option value="RIGHT_TOP" class="CORNER_NOTY">Right Top</option>
													<option value="LEFT_BOTTOM" class="CORNER_NOTY">Left Bottom</option>
													<option value="LEFT_TOP" class="CORNER_NOTY">Left Top</option>
													<option value="BOTTOM" class="CORNER_NOTY">Bottom</option>
													<option value="TOP" class="CORNER_NOTY">Top</option>
												</select>
											</div>
											</div>
										</td>
									</tr>
									<tr>
										<td class="controls"
											style="vertical-align: top;">
												<div id="noty-message" name="popup_text"  style="padding-top:10px">
 													<a href='#' id="tiny_mce_webrules_link" style="float:right;display:none">(Select a template / Edit in HTML editor)</a>
													<textarea  cols="" name="webrule-information-field" class="information confirmation CORNER_NOTY span5 required" rows="10" placeholder="Paste HTML context" style="width:100%"></textarea>
													<textarea  cols="" name="webrule-custom-html" id="tinyMCEhtml_email" class="custom_html required MODAL_POPUP" rows="10" placeholder="Paste HTML context" style="width:100%"></textarea>
<textarea  cols="60" name="webrule-javascript" class="code  JAVA_SCRIPT span5 required" rows="10" placeholder="">function agile_js_code_exec() {
    // Copy your code here



}()</textarea>
									<input type="text" name="temp-title" style="width: 92%" class="FORM input required" placeholder="Form id">
													<div style="float:right;display:none" class="web-rule-preview"><a href="#">Preview</a></div> 
												</div>

										</td>
									</tr>
									<tr>
										<td class="controls" style="vertical-align: top;">
											<div name="position" id="possition">
												<div class="pull-left" style="padding-top:10px"><span style="color:#474444">Where to show</span></div></br></br>
												<select class="required" style="margin-top:-2px;margin-left:50px">
													<option value="CENTER" class="MODAL_POPUP">Center</option>
													<option value="RIGHT_BOTTOM" class="MODAL_POPUP">Right Bottom</option>
													<option value="LEFT_BOTTOM" class="MODAL_POPUP">Left Bottom</option>
												</select>
											</div>
										</td>
									</tr>
									<tr>
										<td class="controls"
											style="vertical-align: top;">
											<div name="delay" id="delay">
												<div class="pull-left" style="padding-top:10px"><span style="color:#474444">When to show</span></div></br></br>
												<select class="required" style="margin-top:-2px;margin-left:50px">
														<option value="IMMEDIATE" class="MODAL_POPUP FORM CORNER_NOTY">Immediately</option>
														<option value="AFTER_SECS" class="MODAL_POPUP FORM CORNER_NOTY">After certain time</option>
														<option value="FIRST_SCROLL" class="MODAL_POPUP FORM CORNER_NOTY">On starting scroll</option>
														<option value="END_OF_PAGE" class="MODAL_POPUP FORM CORNER_NOTY">On reaching end of page</option>
														<option value="EXIT" class="MODAL_POPUP FORM CORNER_NOTY">About to exit page</option> 
												</select>
											</div>
										
											</div>
										</td>
									</tr>
									<tr>
										<td class="controls"
											style="vertical-align: top; ">
											<div name="timer" id="timer" style="margin-top:3px;margin-left:50px">
												<input type="number" class="AFTER_SECS" placeholder="Enter Seconds"></input>
											</div>
											</div>
										</td>
									</tr>
									
								</tbody>
								</table>
								</div>


</div>

<div class="pull-right" style="margin-top:-4%"><a href="#" class="web-rule-multiple-add" width="12%">Add Action</a></div>
							</div>
						<div style="width:65%; margin: 0 auto;">&nbsp;<span>Disable</span><input name="disabled" type="checkbox" style="float:left;">
						</div>
					</div>
			{{#if id}} <input type="text" name="id" class="hide" value="{{id}}" />
			{{/if}}
			<div class="form-actions">
				<a href="#" type="submit" class="save btn btn-primary">Save</a> <a
					href="#web-rules" class="btn ">Close</a>
			</div>
			</fieldset>
		</form>
	</div>
</div>

    <div class="span3">
        <div class="well">
            <h3>
                How to define a Web Rule?
            </h3>
            <br />
            
				<p>1. Give it a name</p>

				<p>2. Define one or more conditions to be satisfied</p>

				<p>3. Define one or more actions to be performed - show a popup, run campaign etc</p>

				<p>Need more help? Please check the <a href="https://github.com/agilecrm/agile-popups#usage" target="_blank"> detailed documentation.</a></p> 
        </div>
    </div>
</div>
</script>

<Script id="custom-fields-options-template" type="text/html">

{{this.name}}
{{#each this}}
	<option value="custom_{{this.name}}">{{this.name}}</option>
{{/each}} 
</Script><script id="webrule-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Web Rules</h1>
            <a href="#webrules-add" class="btn right" id="addWebrule" style="top:-28px;position:relative"><span><i class="icon-plus-sign" /></span>  Add Web Rule</a>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
        {{#if this.length}}
		{{add_tag "Web Rules"}}
        <table class="table table-bordered table-striped showCheckboxes agile-ellipsis-dynamic no-sorting" url="core/api/webrule/bulk">
			<col width="30px"><col width="35%"><col width="50%"><col width="10%"><col width="5%">
            <thead>
                <tr>
                    <th>Name</th>
					<th>Action</th>
					<th></th>
					<th></th>
                </tr>
            </thead>
            <tbody class="webrule-sortable" id="webrule-model-list" route="webrule-edit/" style="margin:190px 0px;">
            </tbody>
        </table>
		{{else}}
			<div class="slate">
   				<div class="slate-content">
					<div class="box-left">
 	           			<img alt="Clipboard" src="/img/clipboard.png">
					</div>
					<div class="box-right">
            			<h3>Engage visitors on website</h3>
            			<div class="text">Define web rules and enagage your website visitors with smart popups, or perform automatic actions when contacts do (or don't do) something in your application or website. Checkout the <a href="https://github.com/agilecrm/agile-popups">documentation</a></div>
            			<a href="#webrules-add" class="btn blue btn-slate-action"><i class="icon-plus-sign"></i>  Add Web Rule</a><br/><br/>
						<p>For Web Rules to work, please copy and paste the code below on your web pages before the <code style="color:black;">&lt;/body&gt;</code> tag.</p>
						<div id="whitelist-disabled"><!--<a class="right btn" id="api_track_webrules_code_icon" style="margin:5px 10px 0px 0px;cursor:pointer;"><i class="icon-copy"></i></a>-->
<pre class="prettyprint" id="api_track_webrules_code">
&lt;script type="text/javascript" src="https://{{getCurrentDomain}}.agilecrm.com/stats/min/agile-min.js"&gt; 
&lt;/script&gt;
&lt;script type="text/javascript" &gt;
 _agile.set_account('{{js_api_key}}', '{{getCurrentDomain}}');
 _agile.track_page_view();
 _agile_execute_web_rules();
&lt;/script&gt;
</pre>
						</div>
						<div id="whitelist-enabled" class="hide"><!--<a class="right btn" id="api_track_webrules_code_icon" style="margin:5px 10px 0px 0px;cursor:pointer;"><i class="icon-copy"></i></a>-->
<pre class="prettyprint" id="api_track_webrules_code">
&lt;script type="text/javascript" src="https://{{getCurrentDomain}}.agilecrm.com/stats/min/agile-min.js"&gt;
&lt;/script&gt;
&lt;script type="text/javascript" &gt;
 _agile.set_account('{{js_api_key}}', '{{getCurrentDomain}}');
 _agile_set_whitelist('{{getBase64Domain}}');
 _agile.track_page_view();
 _agile_execute_web_rules();
&lt;/script&gt;
</pre>
						</div>
					</div>
    			</div>
			</div>
		{{/if}}
    </div>
    <div class="span3">
        <div class="well">
            <h3>
                Setup Tracking Code
            </h3><br />
			<div>To start using Web Rules, please setup our <a href="#analytics-code/analytics">tracking code</a>.</div>
            <br />

			<p>

<a href="https://www.youtube.com/watch?v=XGouq0B_7G8" target="_blank">
<img src="../../img/web-rule-info.png">
</a>
</p>

			<br/>
            <h3>
                What are Web Rules?
            </h3>
            <br />
            <p>
Web rules allow you to perform certain actions when people visit your website - like showing a popup or increase score. </br></br>
For example, when visitors are about to leave your website, show them a sign-up popup. When contacts in Agile visit a specific product page, send them an email asking if they need a demo.</p>
</p>
<img src="/img/web-rules/web-grabbers-demo.png"></img>
<div style="padding-top:10px"><center><a href="https://github.com/agilecrm/agile-popups" target="_blank">Get Started</a></center></div>
        </div>
    </div>
</div>
</script>
<script id="webrule-model-template" type="text/html">
<td  data="{{id}}" class="data" style="cursor:pointer">
<div style="height:auto;text-overflow:ellipsis;white-space:nowrap;max-width:95%;overflow:hidden;">
	{{name}}
</div>
</td>
<td>
{{#actionTemplate actions}}{{/actionTemplate}}
</td>
<td>
<div style="width: 60px;text-align: center;">
{{#if disabled}} 
	<label class="label label-important" style="margin-bottom: 0px!important;">Disabled</label>
{{/if}}
</div>
</td>
<td>
<div style="display:none;"><i class="icon-move"></i></div>
</td>

</script>