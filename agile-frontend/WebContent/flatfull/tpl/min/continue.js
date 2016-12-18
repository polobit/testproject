<script id="continue-company-template" type="text/html">
<div class="container well span8">
    <div class="row">
        <form id="continueCompanyForm" class="form-horizontal">
            <fieldset>
                <div id="content" style="padding-left:25px">
                    <legend>Company Continue Editing</legend>
                </div>
                <div class="control-group">
                    <label class="control-label">Organization</label>
                    <div class="controls">                     
                        <input name="name" type="text" class="required" id="company_name" value="{{getPropertyValue properties "name"}}"/>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Url</label>
                    <div class="controls">
                        <input name="url" placeholder="http://www." type="text" id="company_url" value="{{getPropertyValue properties "url"}}"/>
                    </div>
                </div>
				 {{show_custom_fields custom_fields properties}}
                <div class="control-group">
                    <label class="control-label">Add Email <span><a href="#" class="multiple-add"><i class="icon-plus"></i></a></span></label>
                    <div class="controls hide">
                        <div class="email multiple-template" data="email">
							<div style="display:inline-table; width:210px; ">
								<input type="text" id="email" class="email" name="email" placeholder="Email" />
							</div>
							<div style="display:inline-table; ">
                            	<select class="email-select" name="email-select" style="width:100px">
                                	<option></option>
                                	<option value="primary">Primary</option>
                                	<option value="alternate">Alternate</option>
                            	</select>
								&nbsp;
                            	<a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        	</div>
                        </div>
                    </div>
                    <div class="controls second">
                        <div class="email multiple-template" data="email">
                            <div style="display:inline-table; width:210px; ">
								<input type="text" id="email" class="email" name="email" placeholder="Email" />
							</div>
							<div style="display:inline-table; ">
                            	<select class="email-select" name="email-select" style="width:100px">
                                	<option></option>
                                	<option value="primary">Primary</option>
                                	<option value="alternate">Alternate</option>
                            	</select>
								&nbsp;
                            	<a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        	</div>
                        </div>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Add Phone <span><a href="#" class="multiple-add"><i class="icon-plus"></i></a></span></label>
                    <div class="controls hide">
                        <div class="phone multiple-template" data="phone">
                            <input type="text" id="phone" name="phone" placeholder="Phone number" />
                            <select class="phone-select" name="phone-select" style="width:100px">
                                <option></option>
                                <option value="primary">Primary</option>
                                <option value="alternate">Alternate</option>
                                <option value="fax">Fax</option>
                                <option value="other">Other</option>
                            </select>
                            <a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        </div>
                    </div>
                    <div class="controls second">
                        <div class="phone multiple-template" data="phone">
                            <input type="text" id="phone" name="phone" placeholder="Phone number" />
                            <select class="phone-select" name="phone-select" style="width:100px">
                               <option></option>
                                <option value="primary">Primary</option>
                                <option value="alternate">Alternate</option>
                                <option value="fax">Fax</option>
                                <option value="other">Other</option>
                            </select>
                            <a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        </div>
                    </div>
                </div>
                <!-- End of phone template -->
                <div class="control-group">
                    <label class="control-label">Website <span><a href="#" class="multiple-add"><i class="icon-plus"></i></a></span></label>
                    <div class="controls hide">
                        <div class="website multiple-template style=" display:none" data="website">
                            <input type="text" id="website" name="website" style="width:105px" placeholder="Website" /> 
                            <select class="website-select" name="website-select" style="width:100px">
                                <option></option>
                                <option value="URL">Website</option>
                                <option value="SKYPE">Skype</option>
                                <option value="TWITTER">Twitter</option>
                                <option value="LINKEDIN">LinkedIn</option>
                                <option value="FACEBOOK">Facebook</option>
                                <option value="XING">Xing</option>
                                <option value="FEED">Blog</option>
                                <option value="GOOGLE-PLUS">Google+</option>
                                <option value="FLICKR">Flickr</option>
                                <option value="GITHUB">GitHub</option>
                                <option value="YOUTUBE">YouTube</option>
                            </select>
                            &nbsp;<a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        </div>
                    </div>
                    <div class="controls second">
                        <div class="website multiple-template style=" display:none" data="website">
                            <input type="text" id="website" style="width:105px" name="website" placeholder="Website" /> 
                            <select class="website-select" name="website-select" style="width:100px">
                                <option></option>
                                <option value="URL">Website</option>
                                <option value="SKYPE">Skype</option>
                                <option value="TWITTER">Twitter</option>
                                <option value="LINKED_IN">LinkedIn</option>
                                <option value="FACEBOOK">Facebook</option>
                                <option value="XING">Xing</option>
                                <option value="FEED">Blog</option>
                                <option value="GOOGLE_PLUS">Google+</option>
                                <option value="FLICKR">Flickr</option>
                                <option value="GITHUB">GitHub</option>
                                <option value="YOUTUBE">YouTube</option>
                            </select>
                            &nbsp;<a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        </div>
                    </div>
                </div>
                <!-- End of website template -->
                <div class="control-group second">
                    <label class="control-label">Add Address</label>
                    <div class="controls">
                        <div class="address multiple-template" data="address">
                            <input type="text" name="address" id="address" placeholder="address" /> 
                            <select class="address-type" name="address-type" style="width:100px">
                                <option></option>
                                <option value="home">Home</option>
                                <option value="postal">Postal</option>
                                <option value="office">Office</option>
                            </select>
                            <br />
                            <input type="text" name="city" id="city" placeholder="city" /> <br />
                            <input type="text" name="state" id="state" placeholder="state" /> <br />
                            <input type="text" name="zip" id="zip" placeholder="zip" /><br /> 
                            <select class="styled" id="country" name="country">
                                <option value=""></option>
                                <option value="AF">Afghanistan</option>
                                <option value="AL">Albania</option>
                                <option value="DZ">Algeria</option>
                                <option value="AS">American Samoa</option>
                                <option value="AD">Andorra</option>
                                <option value="AO">Angola</option>
                                <option value="AI">Anguilla</option>
                                <option value="AQ">Antarctica</option>
                                <option value="AG">Antigua and Barbuda</option>
                                <option value="AR">Argentina</option>
                                <option value="AM">Armenia</option>
                                <option value="AW">Aruba</option>
                                <option value="AU">Australia</option>
                                <option value="AT">Austria</option>
                                <option value="AZ">Azerbaijan</option>
                                <option value="BS">Bahamas</option>
                                <option value="BH">Bahrain</option>
                                <option value="BD">Bangladesh</option>
                                <option value="BB">Barbados</option>
                                <option value="BY">Belarus</option>
                                <option value="BE">Belgium</option>
                                <option value="BZ">Belize</option>
                                <option value="BJ">Benin</option>
                                <option value="BM">Bermuda</option>
                                <option value="BT">Bhutan</option>
                                <option value="BO">Bolivia</option>
                                <option value="BA">Bosnia and Herzegovina</option>
                                <option value="BW">Botswana</option>
                                <option value="BV">Bouvet Island</option>
                                <option value="BR">Brazil</option>
                                <option value="IO">British Indian Ocean Territory</option>
                                <option value="VG">British Virgin Islands</option>
                                <option value="BN">Brunei</option>
                                <option value="BG">Bulgaria</option>
                                <option value="BF">Burkina Faso</option>
                                <option value="BI">Burundi</option>
                                <option value="KH">Cambodia</option>
                                <option value="CM">Cameroon</option>
                                <option value="CA">Canada</option>
                                <option value="CV">Cape Verde</option>
                                <option value="KY">Cayman Islands</option>
                                <option value="CF">Central African Republic</option>
                                <option value="TD">Chad</option>
                                <option value="CL">Chile</option>
                                <option value="CN">China</option>
                                <option value="CX">Christmas Island</option>
                                <option value="CC">Cocos Islands</option>
                                <option value="CO">Colombia</option>
                                <option value="KM">Comoros</option>
                                <option value="CG">Congo</option>
                                <option value="CK">Cook Islands</option>
                                <option value="CR">Costa Rica</option>
                                <option value="HR">Croatia</option>
                                <option value="CU">Cuba</option>
                                <option value="CY">Cyprus</option>
                                <option value="CZ">Czech Republic</option>
                                <option value="CI">C&#244;te d'Ivoire</option>
                                <option value="DK">Denmark</option>
                                <option value="DJ">Djibouti</option>
                                <option value="DM">Dominica</option>
                                <option value="DO">Dominican Republic</option>
                                <option value="EC">Ecuador</option>
                                <option value="EG">Egypt</option>
                                <option value="SV">El Salvador</option>
                                <option value="GQ">Equatorial Guinea</option>
                                <option value="ER">Eritrea</option>
                                <option value="EE">Estonia</option>
                                <option value="ET">Ethiopia</option>
                                <option value="FK">Falkland Islands</option>
                                <option value="FO">Faroe Islands</option>
                                <option value="FJ">Fiji</option>
                                <option value="FI">Finland</option>
                                <option value="FR">France</option>
                                <option value="GF">French Guiana</option>
                                <option value="PF">French Polynesia</option>
                                <option value="TF">French Southern Territories</option>
                                <option value="GA">Gabon</option>
                                <option value="GM">Gambia</option>
                                <option value="GE">Georgia</option>
                                <option value="DE">Germany</option>
                                <option value="GH">Ghana</option>
                                <option value="GI">Gibraltar</option>
                                <option value="GR">Greece</option>
                                <option value="GL">Greenland</option>
                                <option value="GD">Grenada</option>
                                <option value="GP">Guadeloupe</option>
                                <option value="GU">Guam</option>
                                <option value="GT">Guatemala</option>
                                <option value="GG">Guernsey</option>
                                <option value="GN">Guinea</option>
                                <option value="GW">Guinea-Bissau</option>
                                <option value="GY">Guyana</option>
                                <option value="HT">Haiti</option>
                                <option value="HM">Heard Island And McDonald Islands</option>
                                <option value="HN">Honduras</option>
                                <option value="HK">Hong Kong</option>
                                <option value="HU">Hungary</option>
                                <option value="IS">Iceland</option>
                                <option value="IN">India</option>
                                <option value="ID">Indonesia</option>
                                <option value="IR">Iran</option>
                                <option value="IQ">Iraq</option>
                                <option value="IE">Ireland</option>
                                <option value="IM">Isle Of Man</option>
                                <option value="IL">Israel</option>
                                <option value="IT">Italy</option>
                                <option value="JM">Jamaica</option>
                                <option value="JP">Japan</option>
                                <option value="JE">Jersey</option>
                                <option value="JO">Jordan</option>
                                <option value="KZ">Kazakhstan</option>
                                <option value="KE">Kenya</option>
                                <option value="KI">Kiribati</option>
                                <option value="KW">Kuwait</option>
                                <option value="KG">Kyrgyzstan</option>
                                <option value="LA">Laos</option>
                                <option value="LV">Latvia</option>
                                <option value="LB">Lebanon</option>
                                <option value="LS">Lesotho</option>
                                <option value="LR">Liberia</option>
                                <option value="LY">Libya</option>
                                <option value="LI">Liechtenstein</option>
                                <option value="LT">Lithuania</option>
                                <option value="LU">Luxembourg</option>
                                <option value="MO">Macao</option>
                                <option value="MK">Macedonia</option>
                                <option value="MG">Madagascar</option>
                                <option value="MW">Malawi</option>
                                <option value="MY">Malaysia</option>
                                <option value="MV">Maldives</option>
                                <option value="ML">Mali</option>
                                <option value="MT">Malta</option>
                                <option value="MH">Marshall Islands</option>
                                <option value="MQ">Martinique</option>
                                <option value="MR">Mauritania</option>
                                <option value="MU">Mauritius</option>
                                <option value="YT">Mayotte</option>
                                <option value="MX">Mexico</option>
                                <option value="FM">Micronesia</option>
                                <option value="MD">Moldova</option>
                                <option value="MC">Monaco</option>
                                <option value="MN">Mongolia</option>
                                <option value="ME">Montenegro</option>
                                <option value="MS">Montserrat</option>
                                <option value="MA">Morocco</option>
                                <option value="MZ">Mozambique</option>
                                <option value="MM">Myanmar</option>
                                <option value="NA">Namibia</option>
                                <option value="NR">Nauru</option>
                                <option value="NP">Nepal</option>
                                <option value="NL">Netherlands</option>
                                <option value="AN">Netherlands Antilles</option>
                                <option value="NC">New Caledonia</option>
                                <option value="NZ">New Zealand</option>
                                <option value="NI">Nicaragua</option>
                                <option value="NE">Niger</option>
                                <option value="NG">Nigeria</option>
                                <option value="NU">Niue</option>
                                <option value="NF">Norfolk Island</option>
                                <option value="KP">North Korea</option>
                                <option value="MP">Northern Mariana Islands</option>
                                <option value="NO">Norway</option>
                                <option value="OM">Oman</option>
                                <option value="PK">Pakistan</option>
                                <option value="PW">Palau</option>
                                <option value="PS">Palestine</option>
                                <option value="PA">Panama</option>
                                <option value="PG">Papua New Guinea</option>
                                <option value="PY">Paraguay</option>
                                <option value="PE">Peru</option>
                                <option value="PH">Philippines</option>
                                <option value="PN">Pitcairn</option>
                                <option value="PL">Poland</option>
                                <option value="PT">Portugal</option>
                                <option value="PR">Puerto Rico</option>
                                <option value="QA">Qatar</option>
                                <option value="RE">Reunion</option>
                                <option value="RO">Romania</option>
                                <option value="RU">Russia</option>
                                <option value="RW">Rwanda</option>
                                <option value="SH">Saint Helena</option>
                                <option value="KN">Saint Kitts And Nevis</option>
                                <option value="LC">Saint Lucia</option>
                                <option value="PM">Saint Pierre And Miquelon</option>
                                <option value="VC">Saint Vincent And The Grenadines</option>
                                <option value="WS">Samoa</option>
                                <option value="SM">San Marino</option>
                                <option value="ST">Sao Tome And Principe</option>
                                <option value="SA">Saudi Arabia</option>
                                <option value="SN">Senegal</option>
                                <option value="RS">Serbia</option>
                                <option value="CS">Serbia and Montenegro</option>
                                <option value="SC">Seychelles</option>
                                <option value="SL">Sierra Leone</option>
                                <option value="SG">Singapore</option>
                                <option value="SK">Slovakia</option>
                                <option value="SI">Slovenia</option>
                                <option value="SB">Solomon Islands</option>
                                <option value="SO">Somalia</option>
                                <option value="ZA">South Africa</option>
                                <option value="GS">South Georgia And The South Sandwich Islands</option>
                                <option value="KR">South Korea</option>
                                <option value="ES">Spain</option>
                                <option value="LK">Sri Lanka</option>
                                <option value="SD">Sudan</option>
                                <option value="SR">Suriname</option>
                                <option value="SJ">Svalbard And Jan Mayen</option>
                                <option value="SZ">Swaziland</option>
                                <option value="SE">Sweden</option>
                                <option value="CH">Switzerland</option>
                                <option value="SY">Syria</option>
                                <option value="TW">Taiwan</option>
                                <option value="TJ">Tajikistan</option>
                                <option value="TZ">Tanzania</option>
                                <option value="TH">Thailand</option>
                                <option value="CD">The Democratic Republic Of Congo</option>
                                <option value="TL">Timor-Leste</option>
                                <option value="TG">Togo</option>
                                <option value="TK">Tokelau</option>
                                <option value="TO">Tonga</option>
                                <option value="TT">Trinidad and Tobago</option>
                                <option value="TN">Tunisia</option>
                                <option value="TR">Turkey</option>
                                <option value="TM">Turkmenistan</option>
                                <option value="TC">Turks And Caicos Islands</option>
                                <option value="TV">Tuvalu</option>
                                <option value="VI">U.S. Virgin Islands</option>
                                <option value="UG">Uganda</option>
                                <option value="UA">Ukraine</option>
                                <option value="AE">United Arab Emirates</option>
                                <option value="GB">United Kingdom</option>
                                <option value="US">United States</option>
                                <option value="UM">United States Minor Outlying Islands</option>
                                <option value="UY">Uruguay</option>
                                <option value="UZ">Uzbekistan</option>
                                <option value="VU">Vanuatu</option>
                                <option value="VA">Vatican</option>
                                <option value="VE">Venezuela</option>
                                <option value="VN">Vietnam</option>
                                <option value="WF">Wallis And Futuna</option>
                                <option value="EH">Western Sahara</option>
                                <option value="YE">Yemen</option>
                                <option value="ZM">Zambia</option>
                                <option value="ZW">Zimbabwe</option>
                                <option value="AX">&#197;land Islands</option>
                            </select>
                        </div>
                    </div>
                </div>
                <input type="text" name="id" class="hide" value="{{id}}" />
                <input type="text" name="type" class="hide" value="COMPANY" />
                <div class="form-actions">
                    <a href="#" type="submit" class="save btn btn-primary" id="company-update">Update</a>
                    <a onclick="history.back();" class="btn">Close</a>
					<span class="form-action-error"></span>
                    <span class="save-status"></span>
                </div>
				<div class="span6  duplicate-email"></div>
            </fieldset>
        </form>
    </div>
    <!-- End of Modal views -->
</div>
</script>
<script id="continue-contact-template" type="text/html">
<div class="row">
    <div class="container well span8">
        <form id="continueform" class="form-horizontal">
            <fieldset>
                <legend>Continue Editing</legend>
                <div class="control-group">
                    <label class="control-label">Name <span class="field_req">*</span></label>
                    <div class="controls">
                        <input name="fname" type="text" class="required" id="fname" placeholder="First name"
                        value="{{getPropertyValue properties "first_name"}}" />
					</div>
				</div>
				<div class="control-group">
					<div class="controls" style="margin-top: -10px">	
                        <input name="lname" type="text" id="lname" placeholder="Last name"
                        value="{{getPropertyValue properties "last_name"}}"/> 
                    </div>
                </div>

				<div class="control-group" id='company_source_person_modal'>
	                    <label class="control-label">Company</label>
	                    <div class="controls">
							<div class="pull-left" style="display:inline-block;">
								<ul name="contact_company_id" class="contacts tagsinput tags">
								{{#if contact_company_id}}
									<li class="tag"  style="display: inline-block;" data="{{contact_company_id}}">
										<a href="#contact/{{contact_company_id}}">{{getPropertyValue properties "company"}}</a><a class="close" id="remove_tag">&times</a>
									</li>
								{{/if}}
								</ul>
							</div>
	                        <input name="company" type="text" id="contact_company" placeholder="Company Name"/>
	                    </div>
	                </div>

                <div class="control-group">
                    <label class="control-label">Job Description</label>
                    <div class="controls"> 
                        <input name="title" type="text" id="job_title" placeholder="Job title"
                        value="{{getPropertyValue properties "title"}}"/>
                    </div>
                </div>
                <div class="control-group" id="tags_source_continue_contact">
                    <label class="control-label">Tag</label>
                    <div class="controls">
                        <div class="pull-left">
                            <ul name="tags" class="tagsinput tags">
                                {{#each tags}}
                                <li class="tag" style="display: inline-block;" data="{{this}}">{{this}}<a class="close" id="remove_tag">&times</a></li>
                                {{/each}}
                            </ul>
                        </div>
                        <input name="tags" type="text" id="tags-new-person" class="tags-typeahead" />
                    </div>
                </div>
				<div class="control-group invalid-tags-person" style="display:none;">
					<label class="control-label"></label>
					<div style="color:red;">Tag name should start with an alphabet and can not contain special characters other than underscore and space.</div>
				</div>
                {{show_custom_fields custom_fields properties}}
                <legend></legend>
                <p></p>
                <div class="control-group">
                    <label class="control-label">Add Email <span><a href="#" class="multiple-add"><i class="icon-plus"></i></a></span></label>
                    <div class="controls hide">
                        <div class="email multiple-template" data="email">
                            <div style="display:inline-table; width:210px; ">
								<input type="text" class="email" name="email" placeholder="Email" />
							</div>
							<div style="display:inline-table; ">
                            	<select class="email-select" style="width:100px">
                                	<option></option>
                                	<option value="work">Work</option>
                                	<option value="home">Personal</option>
                            	</select>
								&nbsp;
                            	<a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        	</div>
						</div>
                    </div>
                    <div class="controls second">
                        <div class="email multiple-template" data="email">
							<div style="display:inline-table; width:210px; ">
                            	<input type="text" class="email" name="email" placeholder="Email" />
							</div>
							<div style="display:inline-table; ">
                            	<select class="email-select" style="width:100px">
                                	<option></option>
                                	<option value="work">Work</option>
                                	<option value="home">Home</option>
                            	</select>
                            	&nbsp;
								<a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        	</div>
						</div>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Add Phone <span><a href="#" class="multiple-add"><i class="icon-plus"></i></a></span></label>
                    <div class="controls hide">
                        <div class="phone multiple-template" data="phone">
                            <div style="display:inline-table; ">
								<input type="text" id="phone" name="phone" placeholder="Phone number" />
                            </div>
							<select class="phone-select" style="width:100px">
                                <option></option>
                                <option value="work">Work</option>
                                <option value="home">Home</option>
                                <option value="mobile">Mobile</option>
                                <option value="main">Main</option>
                                <option value="home fax">Home fax</option>
                                <option value="work fax">Work fax</option>
                                <option value="other">Other</option>
                            </select>
							&nbsp;
                            <a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        </div>
                    </div>
                    <div class="controls second">
                        <div class="phone multiple-template" data="phone">
                            <div style="display:inline-table; ">
								<input type="text" id="phone" name="phone" placeholder="Phone number" />
                            </div>
							<select class="phone-select" style="width:100px">
                                <option></option>
                                <option value="work">Work</option>
                                <option value="home">Home</option>
                                <option value="mobile">Mobile</option>
                                <option value="main">Main</option>
                                <option value="home fax">Home fax</option>
                                <option value="work fax">Work fax</option>
                                <option value="other">Other</option>
                            </select>
                            &nbsp;<a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        </div>
                    </div>
                </div>
                <!-- End of phone template -->
                <div class="control-group">
                    <label class="control-label">Website <span><a href="#" class="multiple-add"><i class="icon-plus"></i></a></span></label>
                    <div class="controls hide">
                        <div class="website multiple-template style=" display:none" data="website">
                            <input type="text" id="website" name="website" style="width:105px" placeholder="Website" /> 
                            <select class="website-select" style="width:100px">
                                <option></option>
                                <option value="URL">Website</option>
                                <option value="SKYPE">Skype</option>
                                <option value="TWITTER">Twitter</option>
                                <option value="LINKEDIN">LinkedIn</option>
                                <option value="FACEBOOK">Facebook</option>
                                <option value="XING">Xing</option>
                                <option value="FEED">Blog</option>
                                <option value="GOOGLE-PLUS">Google+</option>
                                <option value="FLICKR">Flickr</option>
                                <option value="GITHUB">GitHub</option>
                                <option value="YOUTUBE">YouTube</option>
                            </select>
                            &nbsp;<a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        </div>
                    </div>
                    <div class="controls second">
                        <div class="website multiple-template style=" display:none" data="website">
                            <input type="text" id="website" style="width:105px" name="website" placeholder="Website" /> 
                            <select class="website-select" style="width:100px">
                                <option></option>
                                <option value="URL">Website</option>
                                <option value="SKYPE">Skype</option>
                                <option value="TWITTER">Twitter</option>
                                <option value="LINKEDIN">LinkedIn</option>
                                <option value="FACEBOOK">Facebook</option>
                                <option value="XING">Xing</option>
                                <option value="FEED">Blog</option>
                                <option value="GOOGLE_PLUS">Google+</option>
                                <option value="FLICKR">Flickr</option>
                                <option value="GITHUB">GitHub</option>
                                <option value="YOUTUBE">YouTube</option>
                            </select>
                            &nbsp;<a href="#" class="multiple-remove"><i class="icon-remove-circle"></i></a>
                        </div>
                    </div>
                </div>
                <!-- End of website template -->
                <legend></legend>
                <p></p>
                <div class="control-group second">
                    <label class="control-label">Add Address</label>
                    <div class="controls">
                        <div class="address multiple-template" data="address">
                            <input type="text" id="address" name="address" placeholder="address" /> 
                            <select class="address-type" name="address-type" style="width:100px">
                                <option></option>
                                <option value="home">Home</option>
                                <option value="postal">Postal</option>
                                <option value="office">Office</option>
                            </select>
                            <br />
                            <input type="text" name="city" id="city" placeholder="city" /> <br />
                            <input type="text" name="state" id="state" placeholder="state" /> <br />
                            <input type="text" name="zip" id="zip" placeholder="zip" /><br /> 
                            <select class="styled" id="country" name="country">
                                <option value=""></option>
                                <option value="AF">Afghanistan</option>
                                <option value="AL">Albania</option>
                                <option value="DZ">Algeria</option>
                                <option value="AS">American Samoa</option>
                                <option value="AD">Andorra</option>
                                <option value="AO">Angola</option>
                                <option value="AI">Anguilla</option>
                                <option value="AQ">Antarctica</option>
                                <option value="AG">Antigua and Barbuda</option>
                                <option value="AR">Argentina</option>
                                <option value="AM">Armenia</option>
                                <option value="AW">Aruba</option>
                                <option value="AU">Australia</option>
                                <option value="AT">Austria</option>
                                <option value="AZ">Azerbaijan</option>
                                <option value="BS">Bahamas</option>
                                <option value="BH">Bahrain</option>
                                <option value="BD">Bangladesh</option>
                                <option value="BB">Barbados</option>
                                <option value="BY">Belarus</option>
                                <option value="BE">Belgium</option>
                                <option value="BZ">Belize</option>
                                <option value="BJ">Benin</option>
                                <option value="BM">Bermuda</option>
                                <option value="BT">Bhutan</option>
                                <option value="BO">Bolivia</option>
                                <option value="BA">Bosnia and Herzegovina</option>
                                <option value="BW">Botswana</option>
                                <option value="BV">Bouvet Island</option>
                                <option value="BR">Brazil</option>
                                <option value="IO">British Indian Ocean Territory</option>
                                <option value="VG">British Virgin Islands</option>
                                <option value="BN">Brunei</option>
                                <option value="BG">Bulgaria</option>
                                <option value="BF">Burkina Faso</option>
                                <option value="BI">Burundi</option>
                                <option value="KH">Cambodia</option>
                                <option value="CM">Cameroon</option>
                                <option value="CA">Canada</option>
                                <option value="CV">Cape Verde</option>
                                <option value="KY">Cayman Islands</option>
                                <option value="CF">Central African Republic</option>
                                <option value="TD">Chad</option>
                                <option value="CL">Chile</option>
                                <option value="CN">China</option>
                                <option value="CX">Christmas Island</option>
                                <option value="CC">Cocos Islands</option>
                                <option value="CO">Colombia</option>
                                <option value="KM">Comoros</option>
                                <option value="CG">Congo</option>
                                <option value="CK">Cook Islands</option>
                                <option value="CR">Costa Rica</option>
                                <option value="HR">Croatia</option>
                                <option value="CU">Cuba</option>
                                <option value="CY">Cyprus</option>
                                <option value="CZ">Czech Republic</option>
                                <option value="CI">C&#244;te d'Ivoire</option>
                                <option value="DK">Denmark</option>
                                <option value="DJ">Djibouti</option>
                                <option value="DM">Dominica</option>
                                <option value="DO">Dominican Republic</option>
                                <option value="EC">Ecuador</option>
                                <option value="EG">Egypt</option>
                                <option value="SV">El Salvador</option>
                                <option value="GQ">Equatorial Guinea</option>
                                <option value="ER">Eritrea</option>
                                <option value="EE">Estonia</option>
                                <option value="ET">Ethiopia</option>
                                <option value="FK">Falkland Islands</option>
                                <option value="FO">Faroe Islands</option>
                                <option value="FJ">Fiji</option>
                                <option value="FI">Finland</option>
                                <option value="FR">France</option>
                                <option value="GF">French Guiana</option>
                                <option value="PF">French Polynesia</option>
                                <option value="TF">French Southern Territories</option>
                                <option value="GA">Gabon</option>
                                <option value="GM">Gambia</option>
                                <option value="GE">Georgia</option>
                                <option value="DE">Germany</option>
                                <option value="GH">Ghana</option>
                                <option value="GI">Gibraltar</option>
                                <option value="GR">Greece</option>
                                <option value="GL">Greenland</option>
                                <option value="GD">Grenada</option>
                                <option value="GP">Guadeloupe</option>
                                <option value="GU">Guam</option>
                                <option value="GT">Guatemala</option>
                                <option value="GG">Guernsey</option>
                                <option value="GN">Guinea</option>
                                <option value="GW">Guinea-Bissau</option>
                                <option value="GY">Guyana</option>
                                <option value="HT">Haiti</option>
                                <option value="HM">Heard Island And McDonald Islands</option>
                                <option value="HN">Honduras</option>
                                <option value="HK">Hong Kong</option>
                                <option value="HU">Hungary</option>
                                <option value="IS">Iceland</option>
                                <option value="IN">India</option>
                                <option value="ID">Indonesia</option>
                                <option value="IR">Iran</option>
                                <option value="IQ">Iraq</option>
                                <option value="IE">Ireland</option>
                                <option value="IM">Isle Of Man</option>
                                <option value="IL">Israel</option>
                                <option value="IT">Italy</option>
                                <option value="JM">Jamaica</option>
                                <option value="JP">Japan</option>
                                <option value="JE">Jersey</option>
                                <option value="JO">Jordan</option>
                                <option value="KZ">Kazakhstan</option>
                                <option value="KE">Kenya</option>
                                <option value="KI">Kiribati</option>
                                <option value="KW">Kuwait</option>
                                <option value="KG">Kyrgyzstan</option>
                                <option value="LA">Laos</option>
                                <option value="LV">Latvia</option>
                                <option value="LB">Lebanon</option>
                                <option value="LS">Lesotho</option>
                                <option value="LR">Liberia</option>
                                <option value="LY">Libya</option>
                                <option value="LI">Liechtenstein</option>
                                <option value="LT">Lithuania</option>
                                <option value="LU">Luxembourg</option>
                                <option value="MO">Macao</option>
                                <option value="MK">Macedonia</option>
                                <option value="MG">Madagascar</option>
                                <option value="MW">Malawi</option>
                                <option value="MY">Malaysia</option>
                                <option value="MV">Maldives</option>
                                <option value="ML">Mali</option>
                                <option value="MT">Malta</option>
                                <option value="MH">Marshall Islands</option>
                                <option value="MQ">Martinique</option>
                                <option value="MR">Mauritania</option>
                                <option value="MU">Mauritius</option>
                                <option value="YT">Mayotte</option>
                                <option value="MX">Mexico</option>
                                <option value="FM">Micronesia</option>
                                <option value="MD">Moldova</option>
                                <option value="MC">Monaco</option>
                                <option value="MN">Mongolia</option>
                                <option value="ME">Montenegro</option>
                                <option value="MS">Montserrat</option>
                                <option value="MA">Morocco</option>
                                <option value="MZ">Mozambique</option>
                                <option value="MM">Myanmar</option>
                                <option value="NA">Namibia</option>
                                <option value="NR">Nauru</option>
                                <option value="NP">Nepal</option>
                                <option value="NL">Netherlands</option>
                                <option value="AN">Netherlands Antilles</option>
                                <option value="NC">New Caledonia</option>
                                <option value="NZ">New Zealand</option>
                                <option value="NI">Nicaragua</option>
                                <option value="NE">Niger</option>
                                <option value="NG">Nigeria</option>
                                <option value="NU">Niue</option>
                                <option value="NF">Norfolk Island</option>
                                <option value="KP">North Korea</option>
                                <option value="MP">Northern Mariana Islands</option>
                                <option value="NO">Norway</option>
                                <option value="OM">Oman</option>
                                <option value="PK">Pakistan</option>
                                <option value="PW">Palau</option>
                                <option value="PS">Palestine</option>
                                <option value="PA">Panama</option>
                                <option value="PG">Papua New Guinea</option>
                                <option value="PY">Paraguay</option>
                                <option value="PE">Peru</option>
                                <option value="PH">Philippines</option>
                                <option value="PN">Pitcairn</option>
                                <option value="PL">Poland</option>
                                <option value="PT">Portugal</option>
                                <option value="PR">Puerto Rico</option>
                                <option value="QA">Qatar</option>
                                <option value="RE">Reunion</option>
                                <option value="RO">Romania</option>
                                <option value="RU">Russia</option>
                                <option value="RW">Rwanda</option>
                                <option value="SH">Saint Helena</option>
                                <option value="KN">Saint Kitts And Nevis</option>
                                <option value="LC">Saint Lucia</option>
                                <option value="PM">Saint Pierre And Miquelon</option>
                                <option value="VC">Saint Vincent And The Grenadines</option>
                                <option value="WS">Samoa</option>
                                <option value="SM">San Marino</option>
                                <option value="ST">Sao Tome And Principe</option>
                                <option value="SA">Saudi Arabia</option>
                                <option value="SN">Senegal</option>
                                <option value="RS">Serbia</option>
                                <option value="CS">Serbia and Montenegro</option>
                                <option value="SC">Seychelles</option>
                                <option value="SL">Sierra Leone</option>
                                <option value="SG">Singapore</option>
                                <option value="SK">Slovakia</option>
                                <option value="SI">Slovenia</option>
                                <option value="SB">Solomon Islands</option>
                                <option value="SO">Somalia</option>
                                <option value="ZA">South Africa</option>
                                <option value="GS">South Georgia And The South Sandwich Islands</option>
                                <option value="KR">South Korea</option>
                                <option value="ES">Spain</option>
                                <option value="LK">Sri Lanka</option>
                                <option value="SD">Sudan</option>
                                <option value="SR">Suriname</option>
                                <option value="SJ">Svalbard And Jan Mayen</option>
                                <option value="SZ">Swaziland</option>
                                <option value="SE">Sweden</option>
                                <option value="CH">Switzerland</option>
                                <option value="SY">Syria</option>
                                <option value="TW">Taiwan</option>
                                <option value="TJ">Tajikistan</option>
                                <option value="TZ">Tanzania</option>
                                <option value="TH">Thailand</option>
                                <option value="CD">The Democratic Republic Of Congo</option>
                                <option value="TL">Timor-Leste</option>
                                <option value="TG">Togo</option>
                                <option value="TK">Tokelau</option>
                                <option value="TO">Tonga</option>
                                <option value="TT">Trinidad and Tobago</option>
                                <option value="TN">Tunisia</option>
                                <option value="TR">Turkey</option>
                                <option value="TM">Turkmenistan</option>
                                <option value="TC">Turks And Caicos Islands</option>
                                <option value="TV">Tuvalu</option>
                                <option value="VI">U.S. Virgin Islands</option>
                                <option value="UG">Uganda</option>
                                <option value="UA">Ukraine</option>
                                <option value="AE">United Arab Emirates</option>
                                <option value="GB">United Kingdom</option>
                                <option value="US">United States</option>
                                <option value="UM">United States Minor Outlying Islands</option>
                                <option value="UY">Uruguay</option>
                                <option value="UZ">Uzbekistan</option>
                                <option value="VU">Vanuatu</option>
                                <option value="VA">Vatican</option>
                                <option value="VE">Venezuela</option>
                                <option value="VN">Vietnam</option>
                                <option value="WF">Wallis And Futuna</option>
                                <option value="EH">Western Sahara</option>
                                <option value="YE">Yemen</option>
                                <option value="ZM">Zambia</option>
                                <option value="ZW">Zimbabwe</option>
                                <option value="AX">&#197;land Islands</option>
                            </select>
                        </div>
                    </div>
                </div>
                <input type="text" name="id" class="hide" value="{{id}}" />
                <input type="text" name="created_time" class="hide" value="{{created_time}}" />

                <input type="text" name="image" id="image" class="hide" value="{{getPropertyValue properties "image"}}" />             
				
                <div class="form-actions">
	
                    <a href="#" type="submit" class="save btn btn-primary" id="update">Update</a>
                    <a href="#home" class="btn" id="close">Close</a>
					<span class="form-action-error"></span>
                    <span class="save-status"></span>
                </div>
				<div class="span6  duplicate-email"></div>
            </fieldset>
        </form>
    </div>
    <!-- End of Modal views -->
</div>
</script>