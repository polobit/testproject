<script id="continue-company-template" type="text/html">
	<div class="container well span9">
		<div class="row">
			<form id="companyform" class="form-horizontal">
				<div id="content">
				<fieldset>
					<legend style="padding-left:25px">Company Continue Editing</legend>
					<br />
				</div>
				<div id="form" class="span5">
                   <div class="control-group">
					<label class="control-label"><b>Organization</b></label>
                <div class="controls">                     
               <input name="organization" type="text"
						id="organization" /></div></div>
                    <div class="control-group">
                   <label class="control-label"><b>Url</b></label><div class="controls">
                        <input name="url"
						type="text" id="url" /></div></div> <br />
					<b>Add Email</b>
					<!--  Email Container -->
					<div id="email_container" class="container">
						<!--  Add Email Template -->
						<div class="email multiple-template" style="display:none;">
							<input name="email" type="text" id="email" /> <select
								class="email-select" style="width:100px">
								<option></option>
								<option value="work">Work</option>
								<option value="home">Home</option>
							</select> <i class="multiple-remove icon-remove-circle"></i>
						</div>
						<!--  End of Email template -->
						<div style="padding-left:150px; margin-top:-20px;">
						<i class="icon-plus multiple-add"></i> <br />
						</div>
					</div>
					
					<br />
					<b>Add Phone</b>
					<!-- Phone Container -->
					<div id="addphone_container" class="container">
						<!-- Add phone template -->
						<div class="phone multiple-template" style="display:none;">
							<input type="text" name="phone" id="phone" /> <select
								class="phone-select" style="width:100px">
								<option></option>
								<option value="work">Work</option>
								<option value="home">Home</option>
								<option value="mobile">Mobile</option>
								<option value="main">Main</option>
								<option value="home fax">Home fax</option>
								<option value="work fax">Work fax</option>
								<option value="other">Other</option>
							</select> <i class="multiple-remove icon-remove-circle"></i>
						</div>
						<div style="padding-left:150px; margin-top:-20px;">
						<i class="icon-plus multiple-add"></i> 
						</div>
					</div>
					
					<br />
					<b>WebSite</b>
					<!-- website Container -->
					<div id="addwebsite_container" class="container">
						<!-- Add website template -->
						<div class="websites multiple-template" style="display:none;">
							<input type="text" name="website" id="website"
								style="width:105px" /> <select class="website-select"
								style="width:100px">
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
							</select> <select class="type-select" style="width:100px">
								<option></option>
								<option value="work">Work</option>
								<option value="home">Home</option>
							</select>&nbsp;<i class="multiple-remove icon-remove-circle"></i>
						</div>
						<!-- End of website template -->
						<div style="padding-left:150px; margin-top:-20px;">
						<i class="icon-plus multiple-add"></i> 
						</div>
					</div>

					<!-- End of phone template -->
					
					<br />
					<b>Add Address</b>
					<!-- Address Container -->
					<div id="address_container" class="container">
						<!--  Add Address template -->
						<div class="address multiple-template" style="display:none;">
							<input type="text" name="address1" id="address1"
								placeholder="address1" /> <select class="address-type"
								style="width:100px">
								<option></option>
								<option value="home">Home</option>
								<option value="postal">Postal</option>
								<option value="office">Office</option>
							</select>&nbsp;<i class="multiple-remove icon-remove-circle"></i><br/> <input
								type="text" name="city" id="city" placeholder="city" /> <br/> <input
								type="text" name="state" id="state" placeholder="state" /><br/>  <input
								type="text" name="zip" id="zip" placeholder="zip" /><br/>  <select
								class='styled' id="country" name="country">
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
<option value="CI">C�te d'Ivoire</option>
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
<option value="AX">�land Islands</option>

							</select>
							
						</div>
						<div style="padding-left:150px; margin-top:-20px;">
						<i class="icon-plus multiple-add"></i>
						</div>
					</div>
					<!--  End of Address template -->

					<div class="span12" style="margin-left:0px">
						 <br /> <br />
						<a href="#update" type="submit" class="save btn btn-primary" id="update">Update</a> <a
							href="#home" class="btn" id="close">close</a>
					</div>
				</fieldset>
			</form>
		</div>
		<!-- End of Modal views -->
	</div>
	</div>
</script><script id="continue-contact-template" type="text/html">

	<div class="container well span8">
		<div class="row">
			<form id="continueform" class="form-horizontal">
			  <fieldset>
				<div id="content" style="padding-left:25px">
						<legend>Continue Editing</legend>
				</div>
                	<div class="control-group">
                		<label class="control-label">Name</label>
						<div class="controls">
							<input name="fname" type="text" id="fname" placeholder="First name"
								   value="{{getPropertyValue properties "first_name"}}" />
							<input name="lname" type="text" id="lname" placeholder="Last name"
								   value="{{getPropertyValue properties "last_name"}}"/> 
						</div>
					</div>
                    
					<div class="control-group">
                    	<label class="control-label">Organization</label>
						<div class="controls">
							<input name="company" type="text" id="company" placeholder="Company"
								   value="{{getPropertyValue properties "company"}}"/>
						</div>
					</div> 

					<div class="control-group">
                    	<label class="control-label">Job Description</label>
						<div class="controls"> 
							<input name="title" type="text" id="title" placeholder="Job title"
								  class="required error error" value="{{getPropertyValue properties "title"}}"/>
						</div>
					</div>
                   
					<div class="control-group">
                    	<label class="control-label">Tag</label>
						<div class="controls">
							<input name="tags" type="text" id="tags-new-person" class="tags-typeahead" value="{{tags}}"/>
						</div>
					</div> 

					<div class="control-group">
						<label class="control-label">Add Email<span><i class="multiple-add icon-plus"></i></span></label>
					
					<div class="controls hide">
						<div class="email multiple-template" data="email">
							<input type="text" id="email" class="required" name="email" placeholder="Email"/>
							<select class="email-select" style="width:100px">
								<option></option>
								<option value="work">Work</option>
								<option value="home">Home</option>
							</select> <i class="multiple-remove icon-remove-circle"></i>
						</div>
					</div>	

					<div class="controls second">
							<div class="email multiple-template"  data="email">
								<input type="text" id="email" class="required" name="email" placeholder="Email"/>
								<select class="email-select" style="width:100px">
									<option></option>
									<option value="work">Work</option>
									<option value="home">Home</option>
								</select> <i class="multiple-remove icon-remove-circle"></i>
							</div>
						</div>
					</div>
					
					<div class="control-group">
						<label class="control-label">Add Phone<span><i class="multiple-add icon-plus"></i></span></label>
						<div class="controls hide">
							<div class="phone multiple-template" data="phone">
								<input type="text" id="phone" name="phone" class="required" placeholder="Phone number"/>
								<select class="phone-select" style="width:100px">
									<option></option>
									<option value="work">Work</option>
									<option value="home">Home</option>
									<option value="mobile">Mobile</option>
									<option value="main">Main</option>
									<option value="home fax">Home fax</option>
									<option value="work fax">Work fax</option>
									<option value="other">Other</option>
								</select> <i class="multiple-remove icon-remove-circle"></i>
							</div>
						</div>
					<div class="controls second">
							<div class="phone multiple-template" data="phone">
								<input type="text" id="phone" name="phone" class="required" placeholder="Phone number"/>
								<select class="phone-select" style="width:100px">
									<option></option>
									<option value="work">Work test</option>
									<option value="home">Home</option>
									<option value="mobile">Mobile</option>
									<option value="main">Main</option>
									<option value="home fax">Home fax</option>
									<option value="work fax">Work fax</option>
									<option value="other">Other</option>
								</select> <i class="multiple-remove icon-remove-circle"></i>
							</div>
						</div>
					</div>	
						<!-- End of phone template -->
					
					<div class="control-group">
						<label class="control-label">Website<span><i class="multiple-add icon-plus"></i></span></label>
					<div class="controls hide">
							<div class="website multiple-template style="display:none" data="website">
								<input type="text" id="website" class="required" name="website" style="width:105px" 
								       placeholder="Website" /> 
								<select	class="website-select" style="width:100px">
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
								&nbsp;<i class="multiple-remove icon-remove-circle"></i>
							</div>
						</div>
						<div class="controls second">
							<div class="website multiple-template style="display:none" data="website">
								<input type="text" id="website" style="width:105px" class="required" name="website" 
								       placeholder="Website" /> 
								<select	class="website-select" style="width:100px">
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
									&nbsp;<i class="multiple-remove icon-remove-circle"></i>
							</div>
						</div>
					</div>
						<!-- End of website template -->

					<div class="control-group second">
						<label class="control-label">Add Address<span><i class="multiple-add icon-plus"></i></span></label>
						<div class="controls">
							<div class="address multiple-template" style="display:none">
							    <input type="text" id="address"
								       placeholder="address" /> 
						        <select class="address-type" name="address-type" style="width:100px">
									<option></option>
									<option value="home">Home</option>
									<option value="postal">Postal</option>
									<option value="office">Office</option>
							 	</select>&nbsp;<i class="multiple-remove icon-remove-circle"></i><br/>
							  	<input type="text" name="city" id="city" placeholder="city" /> <br/>
							    <input type="text" name="state" id="state" placeholder="state" /> <br/>
							    <input type="text" name="zip" id="zip" placeholder="zip" /><br/> 
							    <select	class='styled' id="country" name="country">
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
									<option value="CI">C�te d'Ivoire</option>
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
									<option value="AX">�land Islands</option>
							  	</select>
							</div>
						</div>
					</div>
				<input type="text" name="id" class="hide" value={{id}} >
					<div class="form-actions">
						<a href="#" type="submit" class="save btn btn-primary" id="update">Update</a>
						<a href="#home" class="btn" id="close">close</a>
					</div>
			  </fieldset>	
			</form>
		</div>
		<!-- End of Modal views -->
	</div>
</script>